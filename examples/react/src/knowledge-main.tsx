import React from 'react'
import ReactDOM from 'react-dom/client'
import '@atlas-eids/react/styles.css'
import '../../shared/knowledge-workspace.css'
import KnowledgeBaseApp from './KnowledgeBaseApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KnowledgeBaseApp />
  </React.StrictMode>,
)
