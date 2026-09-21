import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:4180'

const ROUTES = [
  '/',
  '/projects/wro-robot',
  '/projects/differential-swerve-drive',
  '/projects/robotic-hand',
  '/projects/sailing-compass',
  '/experience/high-stakes',
  '/experience/push-back',
  '/experience/over-under',
  '/does-not-exist',
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--hide-scrollbars'] })

const summary = []
for (const route of ROUTES) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  const consoleErrors = []
  const failed = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 140))
  })
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 140)))
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url().split('/').pop()}`)
  })

  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1200))
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 70))
    }
  })
  await new Promise((r) => setTimeout(r, 1500))

  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')]
    const links = [...document.querySelectorAll('a')].map((a) => ({ href: a.getAttribute('href'), text: a.innerText.trim() }))
    const emptyBlocks = [...document.querySelectorAll('.block')]
      .filter((b) => b.innerText.trim().length < 40)
      .map((b) => b.querySelector('.block-title')?.innerText || '(untitled)')
    return {
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
      words: document.body.innerText.trim().split(/\s+/).length,
      imgs: imgs.length,
      imgsNoAlt: imgs.filter((i) => !i.getAttribute('alt')).length,
      brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
      videos: document.querySelectorAll('video').length,
      sections: document.querySelectorAll('.block').length,
      emptyBlocks,
      emptyCaptions: [...document.querySelectorAll('figcaption')].filter((f) => !f.innerText.trim()).length,
      links: links.filter((l) => l.href && !l.href.startsWith('#')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  summary.push({ route, ...info, consoleErrors, failed })
  await page.close()
}

for (const s of summary) {
  console.log(`\n=== ${s.route} ===`)
  console.log(`  title: ${JSON.stringify(s.title)}`)
  console.log(`  h1: ${JSON.stringify(s.h1)}   words: ${s.words}   sections: ${s.sections}`)
  console.log(`  media: ${s.imgs} images (${s.imgsNoAlt} without alt), ${s.videos} videos`)
  console.log(`  broken images: ${s.brokenImgs.length ? JSON.stringify(s.brokenImgs) : 'none'}`)
  console.log(`  empty captions: ${s.emptyCaptions}   overflow: ${s.overflow}`)
  if (s.emptyBlocks.length) console.log(`  thin/empty sections: ${JSON.stringify(s.emptyBlocks)}`)
  if (s.failed.length) console.log(`  FAILED REQUESTS: ${JSON.stringify(s.failed)}`)
  if (s.consoleErrors.length) console.log(`  CONSOLE ERRORS: ${JSON.stringify(s.consoleErrors.slice(0, 4))}`)
  const ext = s.links.filter((l) => l.href.startsWith('http'))
  if (ext.length) console.log(`  external links: ${ext.map((l) => l.href).join(', ')}`)
}

console.log('\n=== summary of problems ===')
const probs = summary.flatMap((s) => [
  ...(s.consoleErrors.length ? [`${s.route}: ${s.consoleErrors.length} console errors`] : []),
  ...(s.failed.length ? [`${s.route}: ${s.failed.length} failed requests`] : []),
  ...(s.brokenImgs.length ? [`${s.route}: ${s.brokenImgs.length} broken images`] : []),
  ...(s.overflow > 0 ? [`${s.route}: horizontal overflow ${s.overflow}px`] : []),
  ...(s.emptyBlocks.length ? [`${s.route}: ${s.emptyBlocks.length} thin sections`] : []),
])
console.log(probs.length ? probs.map((p) => '  ' + p).join('\n') : '  none')

await browser.close()
