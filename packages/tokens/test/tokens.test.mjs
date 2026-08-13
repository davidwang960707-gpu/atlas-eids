import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('source follows the DTCG 2025.10 four-layer contract', async () => {
  const tokens = JSON.parse(await readFile(new URL('../dist/tokens.json', import.meta.url), 'utf8'))
  assert.equal(tokens.$schema, 'https://www.designtokens.org/schemas/2025.10/format.json')
  assert.deepEqual(tokens.$extensions['com.atlas.meta'].layers, ['global', 'semantic', 'component', 'state'])
  for (const layer of ['global', 'semantic', 'component', 'state']) assert.ok(tokens[layer])

  const inspect = (node, inheritedType, path = []) => {
    const type = node?.$type ?? inheritedType
    if (node && typeof node === 'object' && '$value' in node) {
      assert.ok(type, `${path.join('.')} is missing $type`)
      return
    }
    for (const [name, value] of Object.entries(node ?? {})) {
      if (name.startsWith('$')) continue
      assert.equal(name.includes('.'), false, `${[...path, name].join('.')} uses a dotted group name`)
      inspect(value, type, [...path, name])
    }
  }
  inspect(tokens)
})

test('generated compatibility exports preserve semantic token names', async () => {
  const { atlasTokens, atlasTokenDocument } = await import('../dist/index.js')
  assert.equal(atlasTokenDocument.$extensions['com.atlas.meta'].format, 'DTCG 2025.10')
  assert.equal(atlasTokens.global['color.brand.primary'], '#7B61FF')
  assert.equal(atlasTokens.themes.light['color.action.primary'], '#4F46E5')
  assert.ok(atlasTokens.themes.dark['color.bg.surface'])
  assert.equal(atlasTokens.global['table.rowHeight.default'], '42px')
  assert.equal(atlasTokens.global['font.size.headingSm'], '16px')
  assert.equal(atlasTokens.global['font.size.headingLg'], '20px')
  assert.equal(atlasTokens.global['line.height.heading'], '1.35')
  assert.equal(atlasTokens.themes.light['color.status.successSoft'], '#E8F7F0')
})

test('generated CSS exposes the complete typography and spacing contract', async () => {
  const css = await readFile(new URL('../dist/tokens.css', import.meta.url), 'utf8')
  assert.match(css, /--atlas-font-size-heading-sm: 16px/)
  assert.match(css, /--atlas-font-size-heading-lg: 20px/)
  assert.match(css, /--atlas-line-height-heading: 1\.35/)
  assert.match(css, /--atlas-space-6: 24px/)
  assert.match(css, /--atlas-component-table-row-height: 42px/)
  assert.match(css, /--atlas-state-focus-minimum-target: 32px/)
  assert.match(css, /prefers-reduced-motion: reduce/)
})

test('legacy aliases point at generated semantic variables', async () => {
  const compatibility = await readFile(new URL('../dist/compatibility.css', import.meta.url), 'utf8')
  assert.match(compatibility, /--atlas-violet: var\(--atlas-color-brand-primary\)/)
  assert.match(compatibility, /--radius-md: var\(--atlas-radius-panel\)/)
  assert.doesNotMatch(compatibility, /#[0-9A-F]{3,8}/i)
})

test('Figma handoff preserves four collections, modes and aliases', async () => {
  const handoff = JSON.parse(await readFile(new URL('../dist/figma-variables.json', import.meta.url), 'utf8'))
  assert.equal(handoff.sourceFormat, 'DTCG 2025.10')
  assert.deepEqual(handoff.collections.map((collection) => collection.name), ['Global', 'Semantic', 'Component', 'State'])
  assert.deepEqual(handoff.collections.find((collection) => collection.name === 'Semantic').modes, ['Light', 'Dark'])
  const semanticSurface = handoff.collections.find((collection) => collection.name === 'Semantic').variables.find((variable) => variable.name === 'color/bg/surface')
  assert.deepEqual(semanticSurface.values.Light, { $alias: 'Global/color/neutral/0' })
  assert.equal(semanticSurface.resolvedValues.Light, '#FFFFFF')
  assert.ok(handoff.collections.every((collection) => collection.variables.every((variable) => variable.codeSyntax.CSS.startsWith('--atlas-'))))
})
