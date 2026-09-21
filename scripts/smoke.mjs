/* Smoke test: renders every route in headless Chrome and checks the things a
 * build cannot tell you about: console errors, horizontal overflow, that the
 * display font actually applied, and that each page has real content.
 *
 *   npm run build && npx vite preview --port 4180 &
 *   node scripts/smoke.mjs            # add --shots to write screenshots to /tmp
 */
import puppeteer from 'puppeteer-core'

const BASE = process.env.SMOKE_URL || 'http://localhost:4180'
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SHOTS = process.argv.includes('--shots')

// Preflight: a missing preview server should say so, not throw a CDP stack trace.
try {
  const res = await fetch(BASE, { method: 'GET' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
} catch (err) {
  console.error(
    `\nCannot reach ${BASE} (${err.message}).\n` +
      `Start the preview server first, then re-run:\n` +
      `  npm run build && npx vite preview --port 4180 &\n  node scripts/smoke.mjs\n`,
  )
  process.exit(2)
}

const ROUTES = [
  { path: '/', expect: ['Alex Lewandowski', 'Projects', 'Experience'] },
  { path: '/projects/wro-robot', expect: ['WRO Robot', 'Built with', 'PiThons', 'Recognition', 'Photos and video'] },
  { path: '/projects/differential-swerve-drive', expect: ['Swerve', 'Design'] },
  { path: '/projects/robotic-hand', expect: ['Robotic Hand', 'Firmware'] },
  { path: '/projects/sailing-compass', expect: ['Sailing Electronic Compass'] },
  { path: '/experience/high-stakes', expect: ['High Stakes', 'Recognition'] },
  { path: '/does-not-exist', expect: ['exist'] },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})

let failures = 0

for (const vp of VIEWPORTS) {
  const page = await browser.newPage()
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 })

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle2', timeout: 45000 })
    // let reveal animations settle
    await new Promise((r) => setTimeout(r, 350))

    const report = await page.evaluate((expected) => {
      const doc = document.documentElement
      const body = document.body
      const h1 = document.querySelector('h1')
      // innerText is uppercased by CSS text-transform on mono labels, so match loosely
      const text = body.innerText.toLowerCase()
      const missing = expected.filter((e) => !text.includes(e.toLowerCase()))

      // Any element wider than the viewport causes a sideways scroll
      const overflowing = []
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.right > doc.clientWidth + 1.5) {
          overflowing.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`)
        }
      })

      return {
        title: document.title,
        h1: h1?.innerText?.trim() || null,
        h1Font: h1 ? getComputedStyle(h1).fontFamily : null,
        h1Size: h1 ? getComputedStyle(h1).fontSize : null,
        bodyFont: getComputedStyle(body).fontFamily,
        bg: getComputedStyle(body).backgroundColor,
        ink: getComputedStyle(body).color,
        docOverflow: doc.scrollWidth > doc.clientWidth + 1,
        overflowing: [...new Set(overflowing)].slice(0, 5),
        blocks: document.querySelectorAll('.block').length,
        stats: document.querySelectorAll('.stat').length,
        figures: document.querySelectorAll('.figure').length,
        navLinks: document.querySelectorAll('.nav-link').length,
        missing,
        textLength: text.length,
      }
    }, route.expect)

    const problems = []
    if (report.missing.length) problems.push(`missing text: ${report.missing.join(', ')}`)
    if (report.docOverflow) problems.push(`page scrolls sideways (${report.overflowing.join(', ')})`)
    if (!report.blocks && route.path.includes('/projects/') && !route.path.includes('sailing'))
      problems.push('no numbered sections rendered')
    if (problems.length) failures++

    const tag = `${vp.name.padEnd(7)} ${route.path}`
    console.log(
      `${problems.length ? 'FAIL' : ' ok '}  ${tag.padEnd(46)} h1="${report.h1}" ` +
        `blocks=${report.blocks} stats=${report.stats} figs=${report.figures} chars=${report.textLength}`,
    )
    if (vp.name === 'desktop') {
      console.log(
        `        fonts: h1=${report.h1Size} ${report.h1Font.split(',')[0]} | body=${report.bodyFont.split(',')[0]}` +
          ` | bg=${report.bg} ink=${report.ink}`,
      )
    }
    problems.forEach((p) => console.log(`        -> ${p}`))

    if (SHOTS) {
      const name = route.path === '/' ? 'home' : route.path.replace(/\//g, '_').replace(/^_/, '')
      await page.screenshot({
        path: `/tmp/portfolio-shots/${vp.name}-${name}.png`,
        fullPage: vp.name === 'desktop',
      })
    }
  }

  if (errors.length) {
    failures++
    console.log(`FAIL  console errors @ ${vp.name}:`)
    errors.slice(0, 6).forEach((e) => console.log(`        ${e}`))
  }
  await page.close()
}

// In-page links must actually move the page, including a repeat click on the
// same target: a router <Link to="/#x"> silently no-ops when the URL already
// ends in #x, which is how the hero and nav buttons died.
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE, { waitUntil: 'networkidle2' })

  const clickAndMeasure = async (label, selector, expectId) => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await new Promise((r) => setTimeout(r, 150))
    await page.click(selector)
    await new Promise((r) => setTimeout(r, 1000))
    const state = await page.evaluate((id) => {
      const el = document.getElementById(id)
      return {
        y: Math.round(window.scrollY),
        top: el ? Math.round(el.getBoundingClientRect().top) : null,
        vh: window.innerHeight,
      }
    }, expectId)
    // A section is "reached" when it is actually in view. The last section on the
    // page can never sit at the top, because the document runs out of scroll.
    const ok = state.y > 100 && state.top !== null && state.top > -80 && state.top < state.vh
    if (!ok) failures++
    console.log(
      `${ok ? ' ok ' : 'FAIL'}  link ${label.padEnd(26)} scrollY=${state.y} #${expectId}.top=${state.top}`,
    )
  }

  await clickAndMeasure('hero: View projects', '.hero-actions a:nth-of-type(1)', 'projects')
  await clickAndMeasure('hero: repeat same target', '.hero-actions a:nth-of-type(1)', 'projects')
  await clickAndMeasure('hero: Get in touch', '.hero-actions a:nth-of-type(2)', 'contact')
  await clickAndMeasure('nav: About', '.nav-links a:nth-of-type(1)', 'about')
  await clickAndMeasure('nav: Projects', '.nav-links a:nth-of-type(3)', 'projects')
  await page.close()
}

// Theme: the page must open WHITE even when the OS prefers dark, and the
// toggle must override it and stick.
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await page.goto(BASE, { waitUntil: 'networkidle2' })
  // fresh visitor: no stored choice
  await page.evaluate(() => window.localStorage.removeItem('theme'))
  await page.reload({ waitUntil: 'networkidle2' })

  const themeCheck = await page.evaluate(async () => {
    const read = () => ({
      bg: getComputedStyle(document.body).backgroundColor,
      attr: document.documentElement.dataset.theme || '(unset)',
      stored: window.localStorage.getItem('theme') || '(none)',
      chrome: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
      systemDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    })
    const before = read()
    const btn = [...document.querySelectorAll('button')].find((b) =>
      (b.getAttribute('aria-label') || '').includes('mode'),
    )
    if (!btn) return { found: false, before }
    btn.click()
    await new Promise((r) => setTimeout(r, 400))
    const after = read()
    btn.click()
    await new Promise((r) => setTimeout(r, 400))
    return { found: true, before, after, afterSecondClick: read() }
  })

  const before = themeCheck.before
  const after = themeCheck.after || {}
  const problems = []
  if (!themeCheck.found) problems.push('theme toggle button not found')
  if (before.attr !== '(unset)') problems.push(`fresh visitor should have no data-theme (got ${before.attr})`)
  if (!before.bg.includes('248, 247, 244')) problems.push(`default should be white, got ${before.bg}`)
  if (after.attr !== 'dark') problems.push(`toggle did not set data-theme=dark (got ${after.attr})`)
  if (after.bg === before.bg) problems.push('background did not change on toggle')
  if (after.chrome !== '#0c0e11') problems.push(`theme-color meta not updated for dark (got ${after.chrome})`)
  if (themeCheck.afterSecondClick?.attr !== 'light')
    problems.push(`second toggle did not return to light (got ${themeCheck.afterSecondClick?.attr})`)
  problems.forEach((p) => {
    failures++
    console.log(`FAIL  theme: ${p}`)
  })

  console.log(
    `\ntheme (OS prefers dark, fresh visitor): ${before.bg} [data-theme=${before.attr}, chrome=${before.chrome}]` +
      ` -> toggled: ${after.bg} [${after.attr}, chrome=${after.chrome}]` +
      ` -> toggled back: ${themeCheck.afterSecondClick?.attr}`,
  )
  await page.close()
}

await browser.close()
console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed')
process.exit(failures ? 1 : 0)
