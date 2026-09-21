import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox', '--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 })
await p.goto('http://localhost:4180/experience/high-stakes', { waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 1000))
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)) } })
await new Promise((r) => setTimeout(r, 1500))
const o = await p.evaluate(() => {
  const groups = [...document.querySelectorAll('.timeline-group')].map((g) => ({
    when: g.querySelector('.timeline-when').innerText.trim(),
    n: g.querySelectorAll('.timeline-item').length,
  }))
  const jan = [...document.querySelectorAll('.timeline-group')].find((g) => g.querySelector('.timeline-when').innerText.trim().toUpperCase().startsWith('JAN'))
  return {
    groups,
    total: document.querySelectorAll('.timeline-item').length,
    janItems: [...jan.querySelectorAll('.timeline-item')].map((it) => {
      const m = it.querySelector('img, video')
      return {
        file: m.getAttribute('src').split('/').pop(),
        ok: m.tagName === 'IMG' ? m.naturalWidth > 0 : true,
        caption: it.querySelector('.timeline-caption')?.innerText.trim() ?? '<none>',
      }
    }),
    broken: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
    requests404: performance.getEntriesByType('resource').filter((r) => r.name.includes('/images/high-stakes/hs-2')).map((r) => r.name.split('/').pop()),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }
})
console.log('  month / items: ' + o.groups.map((g) => `${g.when.split(' ')[0]} ${g.n}`).join(' | '))
console.log(`  timeline items total: ${o.total}`)
console.log(`  JAN 2025 (${o.janItems.length} items):`)
o.janItems.forEach((i) => console.log(`    ${i.file.padEnd(16)} loaded=${i.ok}  caption=${JSON.stringify(i.caption)}`))
console.log(`  any request for hs-20/21/22: ${JSON.stringify(o.requests404)}`)
console.log(`  broken images=${o.broken}  overflow=${o.overflow}`)
await b.close()
