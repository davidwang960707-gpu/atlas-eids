import { useState } from 'react'
import { AtlasAIComposer, AtlasAvatar, AtlasButton, AtlasOrb, AtlasTag } from '@atlas-eids/react'
import { Copy, FileText, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react'
import { PageHeader } from '../components/Page'

interface Message { id: number; role: 'user' | 'assistant'; content: string }

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'user', content: '分析本月华东区收入变化，给出最值得关注的两个原因。' },
    { id: 2, role: 'assistant', content: '本月华东区确认收入同比增长 21.6%，主要由设备服务续约和重点客户扩容拉动。需要关注的是：续约贡献集中在 5 家客户，以及两个大型项目的回款周期正在延长。' }
  ])
  const [busy, setBusy] = useState(false)
  const submit = (value: string) => {
    setMessages((items) => [...items, { id: Date.now(), role: 'user', content: value }])
    setBusy(true)
    window.setTimeout(() => { setMessages((items) => [...items, { id: Date.now() + 1, role: 'assistant', content: '我已结合经营数据和客户活动记录完成分析。建议优先复核高贡献客户的续约健康度，并为回款延迟项目建立专项跟进。' }]); setBusy(false) }, 700)
  }
  return <>
    <PageHeader eyebrow="AI 原生" title="AI 对话页" description="对话、来源、工具和反馈围绕同一任务保持上下文连续。" primary="新建会话" onPrimary={() => setMessages([])} />
    <div className="chat-layout">
      <aside className="conversation-list"><AtlasButton intent="primary">新建会话</AtlasButton><nav><h2>今天</h2><button className="active">华东区收入分析<small>2 条消息</small></button><button>知识库异常排查<small>6 条消息</small></button><h2>最近 7 天</h2><button>客户续约风险<small>12 条消息</small></button><button>产品周报摘要<small>4 条消息</small></button></nav></aside>
      <section className="chat-main"><header><div><AtlasOrb size={42} state={busy ? 'thinking' : 'idle'} showRing={false}/><span><strong>Atlas Analyst</strong><small>{busy ? '正在分析上下文' : '已连接经营数据与客户系统'}</small></span></div><AtlasTag intent="success">可信来源 3</AtlasTag></header><div className="message-stream" aria-live="polite">{messages.length === 0 && <div className="chat-welcome"><AtlasOrb size={92} state="idle"/><h2>今天想分析什么？</h2><p>可以询问经营指标、客户变化或上传文件。</p></div>}{messages.map((message) => message.role === 'user' ? <article className="message user" key={message.id}><AtlasAvatar name="王六"/><p>{message.content}</p></article> : <article className="message assistant" key={message.id}><AtlasOrb size={32} showRing={false}/><div><p>{message.content}</p><section className="source-block"><header><FileText size={15}/><strong>引用来源</strong></header><a href="#source">华东区经营月报 · 第 3 页</a><a href="#source">客户续约健康度 · 2026-08</a></section><footer><button aria-label="复制回答"><Copy size={14}/></button><button aria-label="有帮助"><ThumbsUp size={14}/></button><button aria-label="没有帮助"><ThumbsDown size={14}/></button><button aria-label="重新生成"><RotateCcw size={14}/></button></footer></div></article>)}{busy && <article className="message assistant thinking"><AtlasOrb size={32} state="thinking" showRing={false}/><p><span/><span/><span/></p></article>}</div><div className="chat-composer"><AtlasAIComposer busy={busy} contexts={['华东区经营数据', '客户活动记录']} suggestions={['生成可执行清单', '展开收入结构', '检查回款风险']} onSubmit={submit}/><small>AI 生成内容可能存在偏差，关键决策请核对引用来源。</small></div></section>
    </div>
  </>
}
