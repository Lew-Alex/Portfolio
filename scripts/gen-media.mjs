/* Generates src/data/media.js from whatever is on disk in public/.
 *
 *   node scripts/gen-media.mjs
 *
 * Re-run it after dropping more files into public/images/<project>/ so the
 * site picks them up. Captions are deliberately absent: the generator cannot
 * see the photos, so add `caption: '…'` by hand where it matters.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(here, '..', 'public')

// Intrinsic size per file, so the markup can carry width/height and the browser
// reserves the right box before the file loads. Without it a gallery row
// collapses to a couple of pixels and then jumps as each image arrives.
//
// Orientation matters: a phone photo can be stored landscape and displayed
// portrait, because browsers apply the EXIF rotation tag. ffprobe/sips report
// the stored dimensions, so a rotated file would reserve the wrong box. Read the
// tag and swap w/h for the quarter turns.
function jpegOrientation(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return 1
  let off = 2
  while (off + 4 < buf.length) {
    if (buf[off] !== 0xff) break
    const marker = buf[off + 1]
    const len = buf.readUInt16BE(off + 2)
    if (marker === 0xe1 && buf.toString('latin1', off + 4, off + 10) === 'Exif\0\0') {
      const tiff = off + 10
      const little = buf.toString('latin1', tiff, tiff + 2) === 'II'
      const read16 = (p) => (little ? buf.readUInt16LE(p) : buf.readUInt16BE(p))
      const read32 = (p) => (little ? buf.readUInt32LE(p) : buf.readUInt32BE(p))
      if (read16(tiff + 2) !== 0x002a) return 1
      const ifd = tiff + read32(tiff + 4)
      const count = read16(ifd)
      for (let i = 0; i < count; i++) {
        const entry = ifd + 2 + i * 12
        if (read16(entry) === 0x0112) return read16(entry + 8)
      }
      return 1
    }
    if (marker === 0xda || marker === 0xd9) break
    off += 2 + len
  }
  return 1
}

function dims(abs) {
  try {
    const out = execFileSync(
      'ffprobe',
      [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height:stream_side_data=rotation',
        '-of', 'default=nw=1',
        abs,
      ],
      { encoding: 'utf8' },
    )
    const get = (k) => {
      const m = out.match(new RegExp(`^${k}=(-?\\d+)$`, 'm'))
      return m ? parseInt(m[1], 10) : null
    }
    let w = get('width')
    let h = get('height')
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null

    // video rotation metadata
    const rot = get('rotation')
    if (rot !== null && Math.abs(rot) % 180 === 90) [w, h] = [h, w]

    // JPEG EXIF orientation
    if (abs.toLowerCase().endsWith('.jpg') || abs.toLowerCase().endsWith('.jpeg')) {
      const fd = readFileSync(abs, { flag: 'r' })
      const head = fd.subarray(0, Math.min(fd.length, 131072))
      const o = jpegOrientation(head)
      if (o >= 5 && o <= 8) [w, h] = [h, w]
    }
    return { w, h }
  } catch {
    return null
  }
}

function sizeAttrs(abs) {
  const d = dims(abs)
  return d ? `, w: ${d.w}, h: ${d.h}` : ''
}

const IMAGE_GROUPS = [
  ['wroPhotos', 'images/wro', /^wro-\d+\.jpg$/],
  ['wroCad', 'images/wro/cad', /\.jpg$/],
  ['highStakesPhotos', 'images/high-stakes', /^hs-\d+\.jpg$/],
  ['highStakesCad', 'images/high-stakes/cad', /\.jpg$/],
  ['overUnderPhotos', 'images/over-under', /^ou-\d+\.jpg$/],
  ['pushBackPhotos', 'images/push-back', /^pb-\d+\.jpg$/],
  ['pushBackCad', 'images/push-back/cad', /\.jpg$/],
]

const VIDEO_GROUPS = [
  ['wroVideos', ['wro-robot-2', 'wro-robot-5', 'wro-robot-1']],
  ['highStakesVideos', ['high-stakes-3', 'high-stakes-4']],
  ['overUnderVideos', ['over-under-2']],
  ['pushBackVideos', ['push-back-3', 'push-back-5']],
]

// Captions for individual clips. Kept here rather than in portfolio.js so a clip
// and its description live in one place: the manifest is regenerated from these
// lists, so anything hand-added to src/data/media.js is lost on the next run.
const VIDEO_CAPTIONS = {
  'wro-robot-1': 'Navigating the RoboMission course',
}

const lines = [
  '// GENERATED FILE: run `node scripts/gen-media.mjs` to rebuild.',
  '// Source: ~/Downloads/Website Media, resized and transcoded for the web.',
  '//',
  '// TODO(Alex): these carry no captions because the generator cannot see the',
  "// photos. Add `caption: 'What is happening here'` to any item below and it",
  '// renders under the image. Captions are what make the galleries read like',
  '// documentation.',
  '',
]
const counts = {}

for (const [name, dir, pattern] of IMAGE_GROUPS) {
  const abs = join(PUBLIC, dir)
  const files = existsSync(abs)
    ? readdirSync(abs)
        .filter((f) => pattern.test(f))
        .sort()
    : []
  counts[name] = files.length
  lines.push(`export const ${name} = [`)
  for (const f of files) {
    lines.push(`  { type: 'image', src: '/${dir}/${f}'${sizeAttrs(join(abs, f))} },`)
  }
  lines.push(']', '')
}

for (const [name, basenames] of VIDEO_GROUPS) {
  const files = basenames.filter((b) => existsSync(join(PUBLIC, 'videos', `${b}.mp4`)))
  counts[name] = files.length
  lines.push(`export const ${name} = [`)
  for (const b of files) {
    const cap = VIDEO_CAPTIONS[b]
    const caption = cap ? `, caption: ${JSON.stringify(cap)}` : ''
    lines.push(`  { type: 'video', src: '/videos/${b}.mp4'${sizeAttrs(join(PUBLIC, 'videos', `${b}.mp4`))}${caption} },`)
  }
  lines.push(']', '')
}

writeFileSync(join(here, '..', 'src', 'data', 'media.js'), lines.join('\n'))
console.log('wrote src/data/media.js')
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(20)} ${v} items`)
