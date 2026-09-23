import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
})
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 })
await p.goto('https://alexlewandowski.ca/experience/high-stakes', { waitUntil: 'domcontentloaded', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2000))
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 700) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 90))
  }
})
await new Promise((r) => setTimeout(r, 2500))

const o = await p.evaluate(() => ({
  groups: [...document.querySelectorAll('.timeline-group')].map((g) => ({
    when: g.querySelector('.timeline-when').innerText.trim(),
    note: g.querySelector('.timeline-note')?.innerText.trim() ?? null,
    items: [...g.querySelectorAll('.timeline-item')].map((it) => {
      const m = it.querySelector('img, video')
      return {
        file: m.getAttribute('src').split('/').pop(),
        loaded: m.tagName === 'IMG' ? m.naturalWidth > 0 : m.readyState >= 1,
        caption: it.querySelector('.timeline-caption')?.innerText.trim() ?? '',
      }
    }),
  })),
  broken: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
}))
console.log('  LIVE alexlewandowski.ca/experience/high-stakes')
o.groups.forEach((g) => {
  console.log(`\n  ${g.when}${g.note ? `   [note: "${g.note}"]` : ''}`)
  g.items.forEach((i) => console.log(`    ${i.file.padEnd(20)} loaded=${i.loaded}  ${JSON.stringify(i.caption)}`))
})
console.log(`\n  groups=${o.groups.length}  broken images=${o.broken}`)
await p.screenshot({ path: '/tmp/portfolio-shots/live-timeline.png', clip: { x: 60, y: 100, width: 1330, height: 820 } })
await b.close()
