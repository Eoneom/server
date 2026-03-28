import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(__dirname, '..')
const distRoot = path.join(serverRoot, 'dist')
const nestedSrc = path.join(distRoot, 'apps', 'server', 'src')

if (!fs.existsSync(nestedSrc)) {
  console.error('flatten-dist: expected', nestedSrc)
  process.exit(1)
}

const tmp = path.join(serverRoot, 'dist.__tmp__')
fs.rmSync(tmp, { recursive: true, force: true })
fs.renameSync(nestedSrc, tmp)
fs.rmSync(distRoot, { recursive: true, force: true })
fs.renameSync(tmp, distRoot)
