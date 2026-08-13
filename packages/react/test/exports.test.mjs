import assert from 'node:assert/strict'
import test from 'node:test'
import * as components from '../dist/index.js'

test('React package exports 66 enterprise and AI UI components', () => {
  const names = ['AtlasButton', 'AtlasInput', 'AtlasForm', 'AtlasSelect', 'AtlasCombobox', 'AtlasTextarea', 'AtlasCheckbox', 'AtlasRadioGroup', 'AtlasSwitch', 'AtlasDateInput', 'AtlasDateRange', 'AtlasUpload', 'AtlasSearchInput', 'AtlasCard', 'AtlasTabs', 'AtlasSegmentedControl', 'AtlasBreadcrumb', 'AtlasPagination', 'AtlasSteps', 'AtlasTable', 'AtlasDataGrid', 'AtlasTree', 'AtlasMenu', 'AtlasTag', 'AtlasObjectCell', 'AtlasStatusTag', 'AtlasRowActions', 'AtlasTableToolbar', 'AtlasDataTable', 'AtlasPageHeader', 'AtlasPanel', 'AtlasAppLayout', 'AtlasBadge', 'AtlasAvatar', 'AtlasStatistic', 'AtlasProgress', 'AtlasAlert', 'AtlasNotification', 'AtlasNotificationCenter', 'AtlasTooltip', 'AtlasEmpty', 'AtlasSkeleton', 'AtlasDialog', 'AtlasDrawer', 'AtlasDropdown', 'AtlasOrb', 'AtlasAIComposer', 'AtlasExecutionPlan', 'AtlasAIConversation', 'AtlasAIMessageBubble', 'AtlasAIStreamingText', 'AtlasAIPrompts', 'AtlasAIAttachmentList', 'AtlasAIConversationHistory', 'AtlasAIFeedback', 'AtlasMCPServerPicker', 'AtlasCitationList', 'AtlasKnowledgeSourcePicker', 'AtlasRetrievalTrace', 'AtlasToolCallCard', 'AtlasAIArtifactRenderer', 'AtlasAIStructuredInput', 'AtlasAIProvenance', 'AtlasGenUIRenderer', 'AtlasMCPToolPanel', 'AtlasCrossPageAgent']
  assert.equal(names.length, 66)
  for (const name of names) {
    assert.equal(typeof components[name], 'function')
  }
})
