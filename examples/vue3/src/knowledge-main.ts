import { createApp } from 'vue'
import { AtlasEIDS } from '@atlas-eids/vue'
import '@atlas-eids/vue/styles.css'
import '../../shared/knowledge-workspace.css'
import KnowledgeBaseApp from './KnowledgeBaseApp.vue'

createApp(KnowledgeBaseApp).use(AtlasEIDS).mount('#app')
