import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(__dirname, '..')
const distRoot = path.join(clientRoot, 'dist')
const nestedSrc = path.join(distRoot, 'client', 'src')

if (!fs.existsSync(nestedSrc)) {
  console.error('flatten-dist: expected', nestedSrc)
  process.exit(1)
}

const tmp = path.join(clientRoot, 'dist.__tmp__')
fs.rmSync(tmp, { recursive: true, force: true })
fs.renameSync(nestedSrc, tmp)
fs.rmSync(distRoot, { recursive: true, force: true })
fs.renameSync(tmp, distRoot)
