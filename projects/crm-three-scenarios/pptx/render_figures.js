// Rasterise every inline SVG figure of the HTML deck to PNG (2x) so pandoc can embed it.
// Usage: node render_figures.js <deck.html> <out-dir>   -> writes slideNN-figK.png + manifest.json
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('path'); const fs = require('fs');
const deck = path.resolve(process.argv[2]); const out = path.resolve(process.argv[3]);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await page.goto('file://' + deck); await page.waitForTimeout(500);
  const n = await page.evaluate(() => document.querySelectorAll('.slide').length);
  const manifest = [];
  const cur = () => page.evaluate(() => [...document.querySelectorAll('.slide')].findIndex(e => e.classList.contains('visible') || e.classList.contains('active')));
  for (let i = 0; i < n; i++) {
    // advance until slide i is current, then exhaust its animations (press until the index would change)
    for (let g = 0; g < 100 && (await cur()) < i; g++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40); }
    for (let g = 0; g < 60; g++) {
      const before = await cur();
      const done = await page.evaluate(() => { const s = document.querySelectorAll('.slide')[0]; return !!window.__exhausted; });
      // peek: count hidden animatables; if none, stop pressing
      const hidden = await page.evaluate((i) => [...document.querySelectorAll('.slide')[i].querySelectorAll('.a')].filter(e => !e.classList.contains('animate-in') && getComputedStyle(e).opacity === '0').length, i);
      if (!hidden) break;
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(60);
      if ((await cur()) !== before) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(80); break; }
    }
    await page.waitForTimeout(700); // let transitions settle
    const boxes = await page.evaluate((i) => {
      const s = document.querySelectorAll('.slide')[i];
      return [...s.querySelectorAll('svg')].map((svg, k) => { const b = svg.getBoundingClientRect(); const t = svg.querySelector('title'); return { k, w: b.width, h: b.height, title: t ? t.textContent.trim() : '' }; });
    }, i);
    let k = 0;
    for (const b of boxes) {
      if (b.w < 200 || b.h < 80) continue; // skip icons
      const handle = (await page.$$(`.slide:nth-of-type(${i + 1}) svg`))[b.k] || (await page.evaluateHandle((i, k) => document.querySelectorAll('.slide')[i].querySelectorAll('svg')[k], i, b.k)).asElement();
      k++;
      const file = `slide${String(i + 1).padStart(2, '0')}-fig${k}.png`;
      await handle.screenshot({ path: path.join(out, file), omitBackground: false });
      manifest.push({ slide: i + 1, fig: k, svgIndex: b.k, file, title: b.title, width: Math.round(b.w), height: Math.round(b.h) });
    }
  }
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
  console.log(`rendered ${manifest.length} figures from ${n} slides into ${out}`);
  for (const m of manifest) console.log(`  slide ${m.slide} fig ${m.fig}: ${m.width}x${m.height} "${m.title.slice(0, 70)}" -> ${m.file}`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
