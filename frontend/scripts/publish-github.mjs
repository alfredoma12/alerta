import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDir = path.resolve(__dirname, '..')
const repoRoot = path.resolve(frontendDir, '..')
const docsDir = path.join(repoRoot, 'docs')

const rootTargets = ['index.html', 'assets', 'favicon.svg', 'icons.svg']

for (const target of rootTargets) {
  const fullPath = path.join(repoRoot, target)
  if (existsSync(fullPath)) {
    rmSync(fullPath, { recursive: true, force: true })
  }
}

if (!existsSync(docsDir)) {
  throw new Error('No existe la carpeta docs. Ejecuta primero el build de Vite.')
}

for (const entry of readdirSync(docsDir)) {
  const source = path.join(docsDir, entry)
  const destination = path.join(repoRoot, entry)
  cpSync(source, destination, { recursive: true })
}

const noJekyllPath = path.join(repoRoot, '.nojekyll')
if (!existsSync(noJekyllPath)) {
  writeFileSync(noJekyllPath, '')
}

console.log('GitHub Pages publish files copied to repository root.')
