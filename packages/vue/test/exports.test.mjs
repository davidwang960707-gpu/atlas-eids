import assert from 'node:assert/strict'
import test from 'node:test'
import * as components from '../dist/index.js'

test('Vue package exports 31 enterprise and AI UI components', () => {
  const names = ['AtlasButton', 'AtlasInput', 'AtlasSelect', 'AtlasTextarea', 'AtlasCheckbox', 'AtlasRadioGroup', 'AtlasSwitch', 'AtlasDateInput', 'AtlasSearchInput', 'AtlasCard', 'AtlasTabs', 'AtlasSegmentedControl', 'AtlasBreadcrumb', 'AtlasPagination', 'AtlasSteps', 'AtlasTable', 'AtlasTag', 'AtlasBadge', 'AtlasAvatar', 'AtlasStatistic', 'AtlasProgress', 'AtlasAlert', 'AtlasTooltip', 'AtlasEmpty', 'AtlasSkeleton', 'AtlasDialog', 'AtlasDrawer', 'AtlasDropdown', 'AtlasOrb', 'AtlasAIComposer', 'AtlasExecutionPlan']
  assert.equal(names.length, 31)
  for (const name of names) {
    assert.equal(typeof components[name], 'object')
  }
})
