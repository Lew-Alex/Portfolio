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
    chrome: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
  }))

// 1. fresh visitor, OS set to dark
{
  const p = await b.newPage()
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await p.goto('http://localhost:4180/', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1200))
  const s = await read(p)
  console.log(`  1. fresh visitor, OS dark:      bg=${s.bg}  data-theme=${s.attr}  stored=${s.stored}`)
  console.log(`     -> white by default: ${s.bg.includes('248, 247, 244') ? 'YES' : 'NO'}`)
  await p.close()
}

// 2. a returning visitor who previously chose dark (the old behaviour stored it)
{
  const p = await b.newPage()
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await p.goto('http://localhost:4180/', { waitUntil: 'domcontentloaded' })
  await p.evaluate(() => window.localStorage.setItem('theme', 'dark'))
  await p.reload({ waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1200))
  const s = await read(p)
  console.log(`\n  2. stored "dark" from before:   bg=${s.bg}  data-theme=${s.attr}  stored=${s.stored}`)
  console.log(`     -> still opens white: ${s.bg.includes('248, 247, 244') ? 'YES' : 'NO'}   stale key cleared: ${s.stored === '(none)' ? 'YES' : 'NO'}`)
  await p.close()
}

// 3. the toggle still works, and does not persist
{
  const p = await b.newPage()
  await p.goto('http://localhost:4180/', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 1200))
  const before = await read(p)
  const btn = await p.$('button[aria-label*="mode"]')
  await btn.click()
  await new Promise((r) => setTimeout(r, 500))
  const dark = await read(p)
  await btn.click()
  await new Promise((r) => setTimeout(r, 500))
  const back = await read(p)
  console.log(`\n  3. toggle: ${before.bg} [${before.attr}] -> ${dark.bg} [${dark.attr}, chrome=${dark.chrome}] -> ${back.bg} [${back.attr}]`)
  console.log(`     -> dark works: ${dark.attr === 'dark' ? 'YES' : 'NO'}   returns to white: ${back.bg.includes('248, 247, 244') ? 'YES' : 'NO'}   not persisted: ${dark.stored === '(none)' ? 'YES' : 'NO'}`)
  await p.close()
}

await b.close()
