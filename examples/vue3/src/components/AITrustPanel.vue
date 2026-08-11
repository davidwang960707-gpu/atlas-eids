<template>
  <section class="ai-trust-panel" aria-label="AI 执行与治理">
    <header>
      <div><span>Execution Governance</span><h3>AI 执行与治理</h3></div>
      <strong :class="['trust-state', decision]">{{ stateLabel }}</strong>
    </header>
    <div class="trust-grid">
      <div class="execution-plan">
        <h4>执行计划</h4>
        <article class="done"><b>1</b><div><strong>读取上下文</strong><p>已完成权限与数据范围校验。</p></div><em>完成</em></article>
        <article class="running"><b>2</b><div><strong>调用分析工具</strong><p>正在整理结构化结果与引用。</p></div><em>运行中</em></article>
        <article><b>3</b><div><strong>等待人工确认</strong><p>高影响操作不会自动执行。</p></div><em>待开始</em></article>
      </div>
      <div class="trust-evidence">
        <h4>证据与风险</h4>
        <div class="tool-call"><span>Tool Call</span><strong>workspace.search</strong><small>3 个来源，均具备读取权限</small></div>
        <div class="risk-note"><strong>低风险</strong><p>结果只生成预览，不会写入业务数据。</p></div>
        <div class="review-actions"><button type="button" @click="decision = 'rejected'">拒绝</button><button type="button" class="primary" @click="decision = 'accepted'">接受结果</button></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const decision = ref<'pending' | 'accepted' | 'rejected'>('pending');
const stateLabel = computed(() => decision.value === 'pending' ? '等待确认' : decision.value === 'accepted' ? '已接受' : '已拒绝');
</script>

<style src="../../../shared/ai-trust-panel.css"></style>
