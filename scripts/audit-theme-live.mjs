import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
})

const read = (p) =>
  p.evaluate(() => ({
    bg: getComputedStyle(document.body).backgroundColor,
    attr: document.documentElement.dataset.theme || '(unset)',
    stored: window.localStorage.getItem('theme') || '(none)',
  }))

const cases = []
for (const [label, seed, osDark] of [
  ['fresh visitor, OS dark', null, true],
  ['returning visitor with stored dark', 'dark', true],
  ['fresh visitor, OS light', null, false],
]) {
  const p = await b.newPage()
  if (osDark) await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await p.goto('https://alexlewandowski.ca/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  if (seed) {
    await p.evaluate((v) => window.localStorage.setItem('theme', v), seed)
    await p.reload({ waitUntil: 'domcontentloaded' })
  }
  await new Promise((r) => setTimeout(r, 2000))
  const s = await read(p)
  const white = s.bg.includes('248, 247, 244')
  cases.push(white)
  console.log(`  ${label.padEnd(34)} bg=${s.bg}  data-theme=${s.attr}  stored=${s.stored}  -> ${white ? 'WHITE' : 'NOT WHITE'}`)
  await p.close()
}
console.log(`\n  live site opens white in all cases: ${cases.every(Boolean) ? 'YES' : 'NO'}`)
await b.close()
