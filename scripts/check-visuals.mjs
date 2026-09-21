import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 })

// Both themes are still reachable via the stored choice (the OS preference is
// ignored by design), so drive them through localStorage.
const probe = async (scheme) => {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
  await page.goto('http://localhost:4180/', { waitUntil: 'networkidle2' })
  await page.evaluate((t) => {
    if (t === 'dark') window.localStorage.setItem('theme', 'dark')
    else window.localStorage.removeItem('theme')
  }, scheme)
  await page.reload({ waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 400))
  const info = await page.evaluate(() => {
    const about = document.getElementById('about')
    const before = getComputedStyle(about, '::before')
    const portrait = document.querySelector('.hero-portrait img')
    const contactTitle = document.querySelector('.contact-title')
    const contactMail = document.querySelector('.contact-mail')
    return {
      aboutBg: before.backgroundImage.replace(/^url\("?/, '').replace(/"?\)$/, '').split('/').pop(),
      aboutBgOpacity: before.opacity,
      portraitLoaded: portrait ? portrait.naturalWidth > 0 : false,
      portraitWidth: portrait ? Math.round(portrait.getBoundingClientRect().width) : null,
      contactTitlePx: contactTitle ? getComputedStyle(contactTitle).fontSize : null,
      h2Px: getComputedStyle(document.querySelector('#contact .section-title')).fontSize,
      contactMailPx: contactMail ? getComputedStyle(contactMail).fontSize : null,
    }
  })
  console.log(`${scheme.padEnd(6)} about-bg=${info.aboutBg} @${info.aboutBgOpacity}  portrait=${info.portraitWidth}px loaded=${info.portraitLoaded}  contactTitle=${info.contactTitlePx} (section h2 ${info.h2Px})  email=${info.contactMailPx}`)
  return info
}

await probe('light')
await probe('dark')

// Hero content report: catches "did the paragraph actually go away" without
// needing eyes on the render.
const hero = await page.evaluate(() => {
  const root = document.querySelector('.hero')
  return {
    images: root.querySelectorAll('img').length,
    portraits: root.querySelectorAll('.hero-portrait').length,
    paragraphs: root.querySelectorAll('.hero-body p').length,
    buttons: [...root.querySelectorAll('.hero-actions a, .hero-actions button')].map((a) =>
      a.textContent.trim(),
    ),
    specRows: [...root.querySelectorAll('.spec-row dt')].map((d) => d.textContent.trim()),
    hasIntroCopy: root.innerText.includes('I build robots'),
    heading: root.querySelector('h1')?.innerText,
  }
})
console.log(
  `\nhero: images=${hero.images} portrait=${hero.portraits} introParagraphs=${hero.paragraphs}` +
    ` introCopyPresent=${hero.hasIntroCopy}`,
)
console.log(`      h1="${hero.heading}" buttons=[${hero.buttons.join(', ')}] specRows=[${hero.specRows.join(', ')}]`)

// Exact rendered copy for the sections being edited, so removals are verifiable
// rather than assumed.
const copy = await page.evaluate(() => {
  const clean = (sel) =>
    (document.querySelector(sel)?.innerText || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  return {
    hero: clean('.hero'),
    contact: clean('#contact'),
    about: clean('#about'),
    projects: clean('#projects').slice(0, 3),
  }
})
console.log('\nhero copy:')
copy.hero.forEach((l) => console.log(`   ${l}`))
console.log('contact copy:')
copy.contact.forEach((l) => console.log(`   ${l}`))
console.log('about copy (first 6 lines):')
copy.about.slice(0, 6).forEach((l) => console.log(`   ${l}`))
console.log('projects section head:')
copy.projects.forEach((l) => console.log(`   ${l}`))

// Media report: one main image per project page, no carousels there, and the
// moved clip showing up in the right season.
const mediaRoutes = [
  '/projects/wro-robot',
  '/projects/differential-swerve-drive',
  '/projects/robotic-hand',
  '/projects/sailing-compass',
  '/experience/push-back',
  '/experience/over-under',
  '/experience/high-stakes',
]
console.log('\nmedia per route:')
for (const route of mediaRoutes) {
  await page.goto(`http://localhost:4180${route}`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 300))
  const m = await page.evaluate(() => ({
    carousels: document.querySelectorAll('.media-carousel').length,
    // the main image now lives in the hero band (was .detail-hero before)
    heroImgs: document.querySelectorAll('.hero-band img, .detail-hero img').length,
    galleries: document.querySelectorAll('.gallery').length,
    figures: document.querySelectorAll('.gallery img').length,
    // videos live in galleries, the highlight carousel, and single-video blocks
    videos: document.querySelectorAll('.gallery video, .media-carousel video, .block-video video').length,
  }))
  console.log(
    `   ${route.padEnd(34)} carousel=${m.carousels} mainImg=${m.heroImgs} galleries=${m.galleries} photos=${m.figures} videos=${m.videos}`,
  )
}
// Header spacing: the gap between the lead line and the fact row, and how many
// rules sit in it. One rule (the row's own top border) is intentional; the bug
// was a second border plus an empty actions row.
console.log('\nheader spacing:')
for (const route of ['/experience/push-back', '/projects/wro-robot', '/projects/robotic-hand']) {
  await page.goto(`http://localhost:4180${route}`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 300))
  const s = await page.evaluate(() => {
    const lead = document.querySelector('.detail-lead')
    const row = document.querySelector('.meta-line')
    const head = document.querySelector('.detail-head')
    const actions = [...document.querySelectorAll('.detail-actions')]
    return {
      gap:
        lead && row
          ? Math.round(row.getBoundingClientRect().top - lead.getBoundingClientRect().bottom)
          : null,
      headBorderBottom: head ? getComputedStyle(head).borderBottomWidth : null,
      rowBorderTop: row ? getComputedStyle(row).borderTopWidth : null,
      actions: actions.length,
      emptyActions: actions.filter((a) => a.children.length === 0).length,
      headHeight: Math.round(head.getBoundingClientRect().height),
    }
  })
  console.log(
    `   ${route.padEnd(24)} leadToRow=${s.gap}px  rules: head-bottom=${s.headBorderBottom} row-top=${s.rowBorderTop}` +
      `  actionRows=${s.actions} emptyRows=${s.emptyActions}  headHeight=${s.headHeight}px`,
  )
}

// Hero band: image hung left of the text column, recognitions set large on the
// right. Both the offset and the type size are asserted so neither can regress
// silently.
console.log('\nhero band:')
for (const route of ['/experience/push-back', '/experience/high-stakes', '/projects/wro-robot']) {
  await page.goto(`http://localhost:4180${route}`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 300))
  const band = await page.evaluate(() => {
    const el = document.querySelector('.hero-band')
    if (!el) return { present: false }
    const wrap = document.querySelector('.detail .wrap')
    const pad = parseFloat(getComputedStyle(wrap).paddingLeft)
    const wrapBox = wrap.getBoundingClientRect()
    const colLeft = Math.round(wrapBox.left + pad)
    const colRight = Math.round(wrapBox.right - pad)
    const img = el.querySelector('img')
    const title = el.querySelector('.award-title')
    return {
      present: true,
      paired: !el.classList.contains('hero-band--solo'),
      imgHangsLeft: img ? Math.round(colLeft - img.getBoundingClientRect().left) : null,
      bandRightFlush: Math.round(el.getBoundingClientRect().right) - colRight,
      awards: el.querySelectorAll('.award').length,
      awardTitlePx: title ? Math.round(parseFloat(getComputedStyle(title).fontSize) * 10) / 10 : null,
    }
  })
  console.log(
    `   ${route.padEnd(26)} paired=${band.paired} imageHangsLeft=${band.imgHangsLeft}px` +
      ` bandRightVsColumn=${band.bandRightFlush}px awards=${band.awards} awardTitle=${band.awardTitlePx}px`,
  )
}

// The fact row and the tech row must render as exactly one line at every width,
// scrolling sideways rather than wrapping.
console.log('\none-line rows (visual line count / sideways scroll):')
for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  await page.setViewport({ width: vp.width, height: vp.height })
  await page.goto('http://localhost:4180/projects/wro-robot', { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 350))
  const rows = await page.evaluate(() => {
    const measure = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const cs = getComputedStyle(el)
      const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2
      // subtract padding: the box is taller than the text by design, so counting
      // raw height would report padding as extra lines
      const textH =
        el.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      return {
        lines: Math.round(textH / lineH),
        scrolls: el.scrollWidth - el.clientWidth,
      }
    }
    return {
      meta: measure('.meta-line'),
      tech: measure('.tech-line'),
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })
  console.log(
    `   ${vp.name.padEnd(8)} ${String(vp.width).padStart(4)}px  meta=${rows.meta?.lines} line(s), +${rows.meta?.scrolls}px` +
      `  tech=${rows.tech?.lines} line(s), +${rows.tech?.scrolls}px  pageOverflow=${rows.pageOverflow}px`,
  )
}
await page.setViewport({ width: 1440, height: 1100 })

await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
await page.goto('http://localhost:4180/', { waitUntil: 'networkidle2' })
await page.screenshot({ path: '/tmp/portfolio-shots/focus-hero.png' })
await page.evaluate(() => document.getElementById('about').scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 400))
await page.screenshot({ path: '/tmp/portfolio-shots/focus-about.png' })
await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 400))
await page.screenshot({ path: '/tmp/portfolio-shots/focus-projects.png' })
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }))
await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: '/tmp/portfolio-shots/focus-contact.png' })

await browser.close()
console.log('\nwrote focus-hero / focus-about / focus-projects / focus-contact')
