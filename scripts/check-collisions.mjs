import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:4180'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--hide-scrollbars'] })
const page = await browser.newPage()

// --- 1. does the gallery reserve its boxes before media loads? ---
let blockMedia = true
await page.setRequestInterception(true)
page.on('request', (req) => {
  const u = req.url()
  if (blockMedia && /\.(jpe?g|png|mp4)$/i.test(u)) req.abort()
  else req.continue()
})
await page.setViewport({ width: 1440, height: 1000 })
await page.goto(`${BASE}/projects/differential-swerve-drive`, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 1200))

const withMediaBlocked = await page.evaluate(() => {
  const g = document.querySelector('.gallery')
  const frames = [...g.querySelectorAll('.figure-img')].map((f) => {
    const r = f.getBoundingClientRect()
    const m = f.querySelector('img, video')
    return {
      file: m.getAttribute('src').split('/').pop(),
      frame: `${Math.round(r.width)}x${Math.round(r.height)}`,
      attrs: `${m.getAttribute('width')}x${m.getAttribute('height')}`,
    }
  })
  return {
    frames,
    collapsed: frames.filter((f) => parseInt(f.frame.split('x')[1], 10) < 20).length,
    columns: getComputedStyle(g).columnCount,
  }
})

console.log('=== swerve gallery with media BLOCKED (does it reserve space?) ===')
console.log(`   columns=${withMediaBlocked.columns}  collapsed frames (<20px tall)=${withMediaBlocked.collapsed}`)
withMediaBlocked.frames.forEach((f) => console.log(`     ${f.file.padEnd(16)} frame=${f.frame.padEnd(10)} width/height attrs=${f.attrs}`))

blockMedia = false
// warm the page again so the media actually loads this time

// --- 2. after loading, does each frame match its file's real ratio? ---
await page.goto(`${BASE}/projects/differential-swerve-drive`, { waitUntil: 'domcontentloaded' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 110))
  }
  window.scrollTo(0, 0)
})
await new Promise((r) => setTimeout(r, 2000))

const loaded = await page.evaluate(() => {
  const g = document.querySelector('.gallery')
  return [...g.querySelectorAll('.figure-img')].map((f) => {
    const m = f.querySelector('img, video')
    const fr = f.getBoundingClientRect()
    const mr = m.getBoundingClientRect()
    const natural = m.tagName === 'IMG' && m.naturalWidth ? m.naturalWidth / m.naturalHeight : null
    return {
      file: m.getAttribute('src').split('/').pop(),
      frame: `${Math.round(fr.width)}x${Math.round(fr.height)}`,
      shownRatio: (mr.width / mr.height).toFixed(3),
      naturalRatio: natural ? natural.toFixed(3) : 'video',
    }
  })
})
console.log('\n=== after load: frame vs real media ratio ===')
loaded.forEach((l) => console.log(`     ${l.file.padEnd(16)} frame=${l.frame.padEnd(10)} shown=${l.shownRatio}  natural=${l.naturalRatio}`))

// --- 3. the stats plate must be opaque, so no page grid runs behind it ---
const plate = await page.evaluate(() => {
  const s = document.querySelector('.stats')
  const c = s ? getComputedStyle(s) : null
  const cell = document.querySelector('.stat-value')
  const r = cell?.getBoundingClientRect()
  const before = getComputedStyle(document.body, '::before')
  const step = parseFloat(before.backgroundSize) || 0
  const lines = []
  for (let x = step; x < document.documentElement.clientWidth; x += step) lines.push(x)
  const nearest = r ? Math.min(...lines.map((g) => Math.abs(g - r.right))) : null
  return {
    statsBackground: c?.backgroundColor,
    statsTransparent: c?.backgroundColor === 'rgba(0, 0, 0, 0)',
    valueNearestGridLine: nearest !== null ? Math.round(nearest) : null,
    specGridBackground: getComputedStyle(document.querySelector('.spec-grid')).backgroundColor,
  }
})
console.log('\n=== stats plate ===')
console.log(`   .stats background=${plate.statsBackground}  transparent=${plate.statsTransparent}`)
console.log(`   .spec-grid background=${plate.specGridBackground}`)

// --- 4. text-on-text overlaps on both pages ---
for (const route of ['/projects/differential-swerve-drive', '/projects/robotic-hand']) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 900))
  const overlaps = await page.evaluate(() => {
    const els = [...document.querySelectorAll('h1,h2,h3,h4,p,li,dd,dt,span,a,figcaption,strong')].filter(
      (el) => el.childElementCount === 0 && el.innerText && el.innerText.trim(),
    )
    const out = []
    for (let i = 0; i < els.length; i++) {
      for (let j = i + 1; j < els.length; j++) {
        const a = els[i]
        const b = els[j]
        if (a.contains(b) || b.contains(a)) continue
        const ra = a.getBoundingClientRect()
        const rb = b.getBoundingClientRect()
        const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
        const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
        if (ox > 1 && oy > 1) out.push(`"${a.innerText.slice(0, 30)}" x "${b.innerText.slice(0, 30)}"`)
      }
    }
    return out
  })
  console.log(`   ${route}: text-on-text overlaps = ${overlaps.length ? overlaps.join(', ') : 'none'}`)
}

await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 })
await page.goto(`${BASE}/projects/differential-swerve-drive`, { waitUntil: 'domcontentloaded' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 110))
  }
  document.querySelectorAll('.block').forEach((b) => {
    if (b.querySelector('.gallery')) b.scrollIntoView({ block: 'start' })
  })
  window.scrollBy(0, -120)
})
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: '/tmp/portfolio-shots/swerve-gallery.png', clip: { x: 60, y: 110, width: 1330, height: 990 } })

await page.goto(`${BASE}/projects/robotic-hand`, { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 1200))
await page.evaluate(() => {
  document.querySelector('.stats')?.scrollIntoView({ block: 'center' })
})
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: '/tmp/portfolio-shots/hand-stats.png', clip: { x: 60, y: 240, width: 1330, height: 560 } })

await browser.close()
