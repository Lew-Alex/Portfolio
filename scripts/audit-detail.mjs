import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
})

// 1. the sections the crawl called "thin": what is actually inside them?
for (const [route, wanted] of [
  ['/experience/push-back', ['CAD', 'Video']],
  ['/experience/over-under', ['Photos']],
]) {
  const p = await b.newPage()
  await p.setViewport({ width: 1440, height: 1000 })
  await p.goto('http://localhost:4180' + route, { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1000))
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
  })
  await new Promise((r) => setTimeout(r, 1200))
  const out = await p.evaluate((wanted) => {
    const blocks = [...document.querySelectorAll('.block')]
    return blocks
      .filter((bl) => wanted.includes(bl.querySelector('.block-title')?.innerText))
      .map((bl) => {
        const r = bl.getBoundingClientRect()
        const media = bl.querySelectorAll('img, video').length
        const loaded = [...bl.querySelectorAll('img')].filter((i) => i.naturalWidth > 0).length
        const figs = bl.querySelectorAll('figure').length
        return {
          title: bl.querySelector('.block-title').innerText,
          height: Math.round(r.height),
          text: bl.innerText.replace(/\s+/g, ' ').trim().slice(0, 90),
          media,
          imagesLoaded: loaded,
          figures: figs,
        }
      })
  }, wanted)
  console.log(`\n  ${route}`)
  out.forEach((o) =>
    console.log(`    "${o.title}"  height=${o.height}px  media=${o.media} (loaded ${o.imagesLoaded})  figures=${o.figures}\n      text: ${JSON.stringify(o.text)}`),
  )
  await p.close()
}

// 2. the home page "Now" row, with profile.now = null
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 1000 })
await p.goto('http://localhost:4180/', { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 1200))
const now = await p.evaluate(() => {
  const rows = [...document.querySelectorAll('.meta-line, .facts, .hero-facts, dl, .fact')]
  const txt = document.body.innerText
  const idx = txt.indexOf('Now')
  return {
    hasNowLabel: idx >= 0,
    around: idx >= 0 ? txt.slice(idx, idx + 80).replace(/\n/g, ' | ') : null,
    rowsChecked: rows.length,
  }
})
console.log(`\n  home page "Now" row: label present=${now.hasNowLabel}  -> ${JSON.stringify(now.around)}`)

// 3. any placeholder-ish text rendered anywhere?
const ph = await p.evaluate(() => {
  const t = document.body.innerText
  return ['TODO', 'Lorem', 'TBD', 'Coming soon', 'Placeholder', 'undefined', 'null', '[object']
    .filter((w) => t.includes(w))
})
console.log(`  placeholder strings on the home page: ${ph.length ? JSON.stringify(ph) : 'none'}`)
await p.close()

await b.close()
