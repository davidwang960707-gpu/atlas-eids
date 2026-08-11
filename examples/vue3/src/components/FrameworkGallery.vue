<template>
  <section class="content-section framework-gallery" id="frameworks">
    <div class="section-heading">
      <div><span class="section-kicker">Application Frameworks</span><h2>七种系统骨架，七个真实工作区</h2></div>
      <p>选择框架后可以切换导航、筛选任务、选择记录、切换租户或操作画布。</p>
    </div>

    <div class="framework-tabs" role="tablist" aria-label="应用框架">
      <button v-for="item in frameworks" :key="item.id" type="button" role="tab" :aria-selected="activeId === item.id" :class="{ active: activeId === item.id }" @click="activeId = item.id">{{ item.name }}</button>
    </div>

    <div :class="['framework-preview', `layout-${activeId}`]">
      <div class="preview-productbar">
        <div class="preview-brand-mark"></div><strong>Atlas Workspace</strong>
        <div class="preview-product-links"><button v-for="item in productItems" :key="item" type="button" :class="{ active: activeProduct === item }" @click="activeProduct = item">{{ item }}</button></div>
        <button v-if="activeId === 'tenant'" class="preview-tenant" type="button" @click="switchTenant">{{ tenants[tenantIndex] }} <span>⌄</span></button>
        <div class="preview-global-actions"><button type="button" aria-label="搜索" @click="flash('已打开全局搜索')">⌕</button><button type="button" aria-label="通知" @click="flash('当前没有未读通知')">·</button><span class="preview-avatar">WL</span></div>
      </div>

      <aside class="preview-sidebar">
        <div class="preview-sidebar-title">Workspace</div>
        <button v-for="(item, index) in navItems" :key="item" type="button" :class="{ 'is-active': activeNav === item }" @click="activeNav = item"><i>{{ ['⌂', '□', '⌁', '◷'][index] }}</i>{{ item }}</button>
        <div class="preview-sidebar-agent"><span></span><div><strong>Atlas Core</strong><small>在线 · 3 个任务</small></div></div>
      </aside>

      <div class="preview-main">
        <div class="preview-toolbar">
          <div><span>Workspace / {{ activeProduct }}</span><strong>{{ active.name }}框架</strong><small>{{ active.structure }}</small></div>
          <div class="preview-toolbar-actions"><label><span>⌕</span><input v-model="query" placeholder="搜索任务"></label><button type="button" @click="flash('示例任务已创建')">新建任务</button></div>
        </div>

        <div v-if="activeId === 'tabs'" class="preview-page-tabs"><button v-for="item in pageTabs" :key="item" type="button" :class="{ active: activePageTab === item }" @click="activePageTab = item">{{ item }}<span>{{ item === '任务详情' ? '×' : '' }}</span></button></div>

        <div v-if="activeId === 'canvas'" class="preview-canvas-shell">
          <div class="preview-canvas-tools"><button type="button" @click="flash('已撤销上一步')">↶</button><button type="button" @click="flash('已重做')">↷</button><span>72%</span><button type="button" @click="flash('画布已居中')">⌖</button></div>
          <div class="preview-canvas-workspace"><div class="preview-node"><span>Input</span><strong>接收业务数据</strong><small>Schema validated</small></div><i></i><div class="preview-node strong"><span>Agent</span><strong>分析并生成结论</strong><small>Atlas Reasoner</small></div><i></i><div class="preview-node"><span>Human</span><strong>人工确认</strong><small>Required</small></div></div>
        </div>

        <div v-else-if="activeId === 'workbench'" class="preview-workbench">
          <div class="preview-apps"><header><strong>常用应用</strong><button type="button" @click="flash('已打开全部应用')">全部应用</button></header><div><button v-for="(item, index) in ['AI 协作', '任务中心', '数据分析', '知识库']" :key="item" type="button" @click="flash(`已打开${item}`)"><i>{{ index + 1 }}</i><span>{{ item }}</span></button></div></div>
          <div class="preview-todos"><header><strong>我的待办</strong><span>6 项</span></header><button v-for="task in tasks.slice(0, 3)" :key="task.id" type="button" :class="{ active: selectedTask === task.id }" @click="selectedTask = task.id"><i></i><span><strong>{{ task.name }}</strong><small>{{ task.agent }}</small></span><em>{{ task.time }}</em></button></div>
          <div class="preview-workbench-metric"><span>本周完成率</span><strong>96.4%</strong><div><i></i></div><small>较上周提升 4.8%</small></div>
        </div>

        <div v-else class="preview-dashboard">
          <div class="preview-metrics"><article><small>运行任务</small><strong>1,284</strong><em>+12.4%</em></article><article><small>待确认</small><strong>18</strong><em>高优先级 4 项</em></article><article><small>平均耗时</small><strong>2m 16s</strong><em>-18s</em></article><article><small>成功率</small><strong>98.6%</strong><em>目标 97%</em></article></div>
          <div class="preview-chart"><header><div><small>最近 7 天</small><strong>智能任务运行趋势</strong></div><button type="button" @click="flash('图表已导出')">导出</button></header><div class="preview-chart-canvas"><span></span><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="任务运行趋势"><path d="M0 150 C60 144 88 98 145 114 C205 130 228 72 292 84 C350 96 376 42 438 58 C498 74 548 30 600 20" /><path d="M0 165 C76 154 104 148 160 153 C220 160 256 125 310 136 C374 148 412 108 468 121 C524 133 562 102 600 108" /></svg><div><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div></div></div>
          <div class="preview-queue"><header><strong>任务队列</strong><span>{{ filteredTasks.length }} 项</span></header><div class="preview-table-head"><span>任务</span><span>负责人</span><span>状态</span><span>更新时间</span></div><button v-for="task in filteredTasks" :key="task.id" type="button" :class="{ selected: selectedTask === task.id }" @click="selectedTask = task.id"><span><b>{{ task.name }}</b><small>{{ task.id }}</small></span><span>{{ task.agent }}</span><em :class="`state-${task.state}`">{{ task.state }}</em><time>{{ task.time }}</time></button></div>
        </div>
        <div :class="['preview-notice', { show: notice }]" role="status">{{ notice }}</div>
      </div>
    </div>

    <div class="framework-meta"><strong>{{ active.name }}框架</strong><span>{{ active.structure }}</span><span>适用：{{ active.use }}</span><b>可交互 Demo</b></div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const frameworks = [
  { id: 'sidebar', name: '左侧导航', structure: '菜单 + 工具栏 + 内容区', use: 'ERP、CRM 与后台管理系统' },
  { id: 'top', name: '顶部导航', structure: '一级导航 + 内容区', use: '门户与轻量业务系统' },
  { id: 'mixed', name: '混合导航', structure: '产品导航 + 业务菜单', use: '大型平台与多产品系统' },
  { id: 'workbench', name: '工作台', structure: '应用入口 + 待办 + 指标', use: 'OA、协同办公与员工门户' },
  { id: 'tabs', name: '多标签页', structure: '导航 + 页面标签 + 内容', use: 'ERP 与高频多任务场景' },
  { id: 'canvas', name: '全屏工作区', structure: '精简导航 + 工具栏 + 画布', use: '设计器、编排器与大屏' },
  { id: 'tenant', name: '多租户', structure: '租户切换 + 系统导航', use: 'SaaS 管理平台' }
];

const tasks = [
  { id: 'AT-1048', name: '内容质量检查', agent: 'Atlas Review', state: '运行中', time: '刚刚' },
  { id: 'AT-1047', name: '知识索引更新', agent: 'Knowledge Agent', state: '待确认', time: '4 分钟前' },
  { id: 'AT-1046', name: '数据异常识别', agent: 'Insight Agent', state: '已完成', time: '12 分钟前' },
  { id: 'AT-1045', name: '周报摘要生成', agent: 'Writing Agent', state: '已完成', time: '28 分钟前' }
];

const navItems = ['概览', '任务中心', '智能分析', '运行记录'];
const productItems = ['工作台', '任务', '分析'];
const pageTabs = ['工作台', '任务详情', '分析报告'];
const tenants = ['North Region', 'Global Studio', 'Sandbox Team'];
const activeId = ref('sidebar');
const activeNav = ref('概览');
const activeProduct = ref('工作台');
const activePageTab = ref('任务详情');
const tenantIndex = ref(0);
const selectedTask = ref('AT-1048');
const query = ref('');
const notice = ref('');
let noticeTimer: number | undefined;

const active = computed(() => frameworks.find((item) => item.id === activeId.value) ?? frameworks[0]);
const filteredTasks = computed(() => tasks.filter((task) => `${task.id}${task.name}${task.agent}`.toLowerCase().includes(query.value.toLowerCase())));

function flash(message: string) {
  notice.value = message;
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => { notice.value = ''; }, 1800);
}

function switchTenant() {
  tenantIndex.value = (tenantIndex.value + 1) % tenants.length;
  flash('租户上下文已切换');
}
</script>

<style src="../../../shared/framework-gallery.css"></style>
