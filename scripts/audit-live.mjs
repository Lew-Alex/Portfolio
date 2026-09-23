import puppeteer from 'puppeteer-core'
import { readdirSync } from 'node:fs'

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
})

// what the local build produced, to prove the live site is this build
const localJs = readdirSync('dist/assets').filter((f) => f.endsWith('.js'))
console.log(`  local build assets: ${JSON.stringify(localJs)}`)

const check = async (url, expectH1, label) => {
  const p = await b.newPage()
  await p.setViewport({ width: 1440, height: 1000 })
  const errs = []
  const failed = []
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)))
  p.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url().split('/').slice(-1)[0]}`))
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2500))
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
  })
  await new Promise((r) => setTimeout(r, 1500))
  const o = await p.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
    url: location.href,
    title: document.title,
    broken: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
    months: [...document.querySelectorAll('.timeline-when')].map((e) => e.innerText.trim()),
    words: document.body.innerText.trim().split(/\s+/).length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))
  const ok = o.h1.some((h) => h.includes(expectH1))
  console.log(`\n  ${label}: ${url}`)
  console.log(`    h1=${JSON.stringify(o.h1)}  expected contains ${JSON.stringify(expectH1)} -> ${ok ? 'OK' : 'FAIL'}`)
  console.log(`    landed on: ${o.url}`)
  console.log(`    words=${o.words}  broken images=${o.broken}  overflow=${o.overflow}`)
  if (o.months.length) console.log(`    timeline months: ${JSON.stringify(o.months)}`)
  if (failed.length) console.log(`    failed requests: ${JSON.stringify([...new Set(failed)].slice(0, 6))}`)
  if (errs.length) console.log(`    console errors: ${JSON.stringify(errs.slice(0, 3))}`)
  await p.close()
  return ok
}

const results = []
results.push(await check('https://alexlewandowski.ca/projects/wro-robot', 'WRO Robot', 'deep link, direct load'))
results.push(await check('https://alexlewandowski.ca/experience/high-stakes', 'High Stakes', 'deep link, direct load'))
results.push(await check('https://alexlewandowski.ca/does-not-exist', "doesn't exist", 'unknown path (404 page)'))

// refresh in place: does the router survive a reload on a deep path?
const p = await b.newPage()
await p.goto('https://alexlewandowski.ca/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2000))
await p.goto('https://alexlewandowski.ca/projects/robotic-hand', { waitUntil: 'domcontentloaded', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2000))
await p.reload({ waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 2500))
const after = await p.evaluate(() => ({ h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()), url: location.href }))
console.log(`\n  reload on a deep path: h1=${JSON.stringify(after.h1)}  url=${after.url}`)
await p.close()

console.log(`\n  deep links render correctly: ${results.every(Boolean) ? 'all three OK' : 'SOME FAILED'}`)
await b.close()
