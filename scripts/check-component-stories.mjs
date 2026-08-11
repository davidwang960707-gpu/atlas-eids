import { readFile } from 'node:fs/promises'

const api = JSON.parse(await readFile(new URL('../docs/component-api.json', import.meta.url), 'utf8'))
const expected = api.map((component) => component.name).filter((name) => name !== 'AtlasProvider')
const react = await readFile(new URL('../apps/storybook/stories/ComponentCatalog.stories.tsx', import.meta.url), 'utf8')
const vue = await readFile(new URL('../apps/storybook-vue/stories/ComponentCatalog.stories.ts', import.meta.url), 'utf8')

for (const name of expected) {
  if (!react.includes(`matrix('${name}'`)) throw new Error(`React Story state matrix missing: ${name}`)
  if (!vue.includes(`make('${name}'`)) throw new Error(`Vue Story state matrix missing: ${name}`)
}

const interactive = ['Button', 'Input', 'Checkbox', 'Switch']
for (const story of interactive) {
  if (!new RegExp(`export const ${story}:[\\s\\S]*?play:`, 'm').test(react)) {
    throw new Error(`React interaction Story missing: ${story}`)
  }
  if (!vue.includes(`${story}.play =`)) throw new Error(`Vue interaction Story missing: ${story}`)
}

console.log(`Component Story matrix verified: ${expected.length} React + ${expected.length} Vue components`)
