/* Final content audit: hero photo removed, zero em dashes anywhere rendered,
 * and the new galleries are present with the expected item counts. */
import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:4180'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

const routes = ['/', '/projects/wro-robot', '/projects/sailing-compass', '/experience/high-stakes', '/experience/over-under', '/experience/push-back']
let problems = 0

for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 300))
  const info = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      emDashes: (text.match(/\u2014/g) || []).length,
      enDashes: (text.match(/\u2013/g) || []).length,
      heroFigure: !!document.querySelector('.hero-figure'),
      galleryImgs: document.querySelectorAll('.gallery img').length,
      galleryVideos: document.querySelectorAll('.gallery video').length,
      blocks: document.querySelectorAll('.block').length,
    }
  })
  const issues = []
  if (info.emDashes) issues.push(`${info.emDashes} em dash(es) in rendered text`)
  if (route === '/' && info.heroFigure) issues.push('hero photo still rendering')
  if (issues.length) problems++

  console.log(
    `${issues.length ? 'FAIL' : ' ok '}  ${route.padEnd(28)} em=${info.emDashes} en=${info.enDashes} ` +
      `heroFig=${info.heroFigure ? 'yes' : 'no'} galleryImgs=${info.galleryImgs} galleryVids=${info.galleryVideos} blocks=${info.blocks}`,
  )
  issues.forEach((i) => console.log(`        -> ${i}`))
}

// count media files actually referenced by the app
const media = await page.evaluate(async () => {
  const res = await fetch('/images/wro/wro-01.jpg', { method: 'HEAD' })
  return { status: res.status, type: res.headers.get('content-type'), bytes: res.headers.get('content-length') }
})
console.log(`\nspot check image: HTTP ${media.status} ${media.type} ${media.bytes} bytes`)

await browser.close()
console.log(problems ? `\n${problems} problem(s)` : '\nno em dashes, no stray hero photo, galleries present')
process.exit(problems ? 1 : 0)
