(() => {
  const data = window.ATLAS_DOCS_DATA;
  if (!data) return;

  const navigation = document.getElementById('docsNavigation');
  const article = document.getElementById('docsArticle');
  const toc = document.getElementById('docsToc');
  const pagination = document.getElementById('docsPagination');
  const sidebar = document.getElementById('docsSidebar');
  const menuButton = document.getElementById('menuButton');
  const searchDialog = document.getElementById('searchDialog');
  const searchInput = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  const toast = document.getElementById('docsToast');
  let toastTimer;
  let activeComponent = 'AtlasButton';

  const allRoutes = [
    ...data.documents.map((document) => ({ id: document.id, title: document.title, group: document.group })),
    { id: 'components/api', title: '组件 API', group: '设计系统' }
  ];

  function currentRoute() {
    return location.hash.replace(/^#\/?/, '').split('?')[0] || 'getting-started';
  }

  function runtimeHref(kind) {
    const local = ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
    if (kind === 'templates') return local ? 'http://127.0.0.1:4176/#/workbench' : 'templates/#/workbench';
    return local ? 'http://127.0.0.1:6006/' : 'storybook/react/';
  }

  document.querySelectorAll('[data-runtime]').forEach((link) => {
    link.href = runtimeHref(link.dataset.runtime);
  });

  function renderNavigation() {
    navigation.innerHTML = data.groups.map((group) => {
      const routes = allRoutes.filter((route) => route.group === group);
      return `<section class="docs-nav-group"><strong>${group}</strong>${routes.map((route) => `<a href="#/${route.id}" data-route="${route.id}">${route.title}</a>`).join('')}</section>`;
    }).join('');
    document.getElementById('docsVersion').textContent = `Atlas EIDS ${data.version}`;
  }

  function markActiveRoute(route) {
    navigation.querySelectorAll('[data-route]').forEach((link) => link.classList.toggle('active', link.dataset.route === route));
  }

  function copyText(value) {
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = value;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    };
    const work = navigator.clipboard?.writeText(value) ?? Promise.resolve(fallback());
    Promise.resolve(work).catch(fallback).finally(() => showToast('代码已复制'));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  function enhanceCodeBlocks() {
    article.querySelectorAll('pre').forEach((pre) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.textContent = '复制';
      button.addEventListener('click', () => copyText(pre.querySelector('code')?.textContent ?? pre.textContent));
      pre.appendChild(button);
    });
    article.querySelectorAll('table').forEach((table) => table.setAttribute('tabindex', '0'));
  }

  function renderToc(headings) {
    toc.innerHTML = headings.length ? headings.map((heading) => `<a href="#${heading.id}" data-heading="${heading.id}" data-level="${heading.level}">${heading.label}</a>`).join('') : '<span class="search-empty">暂无小节</span>';
  }

  function observeHeadings() {
    const headings = article.querySelectorAll('h2[id], h3[id], h4[id]');
    if (!headings.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      toc.querySelectorAll('[data-heading]').forEach((link) => link.classList.toggle('active', link.dataset.heading === visible.target.id));
    }, { rootMargin: '-110px 0px -72% 0px' });
    headings.forEach((heading) => observer.observe(heading));
  }

  function renderPagination(route) {
    const index = allRoutes.findIndex((item) => item.id === route);
    const previous = allRoutes[index - 1];
    const next = allRoutes[index + 1];
    pagination.innerHTML = `${previous ? `<a href="#/${previous.id}"><span>上一篇</span><strong>${previous.title}</strong></a>` : '<span></span>'}${next ? `<a href="#/${next.id}"><span>下一篇</span><strong>${next.title}</strong></a>` : ''}`;
  }

  function renderDocument(route) {
    const documentData = data.documents.find((document) => document.id === route) ?? data.documents[0];
    article.innerHTML = `<div class="doc-eyebrow">${documentData.group} / Atlas EIDS Docs</div>${documentData.html}`;
    renderToc(documentData.headings);
    enhanceCodeBlocks();
    observeHeadings();
    renderPagination(documentData.id);
    document.title = `${documentData.title} · Atlas EIDS Docs`;
    markActiveRoute(documentData.id);
  }

  function filteredComponents(query) {
    const needle = query.trim().toLowerCase();
    return data.components.filter((component) => {
      const props = component.props.map((prop) => `${prop.name} ${prop.type} ${prop.description}`).join(' ');
      return !needle || `${component.name} ${component.category} ${component.summary} ${props}`.toLowerCase().includes(needle);
    });
  }

  function apiDetail(component) {
    if (!component) return '<div class="api-empty">没有匹配的组件 API</div>';
    return `<div class="api-detail-head"><div><h2>${component.name}</h2><p>${component.summary}</p></div><div class="api-frameworks">${component.frameworks.map((framework) => `<span>${framework}</span>`).join('')}</div></div><div class="api-props"><table><thead><tr><th>Prop</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>${component.props.map((prop) => `<tr><td><code>${prop.name}</code></td><td><code>${prop.type}</code></td><td><code>${prop.defaultValue}</code></td><td>${prop.description}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function updateApiResults(query = '') {
    const components = filteredComponents(query);
    if (!components.some((component) => component.name === activeComponent)) activeComponent = components[0]?.name ?? '';
    const list = article.querySelector('.api-list');
    const detail = article.querySelector('.api-detail');
    list.innerHTML = components.length ? components.map((component) => `<button type="button" class="${component.name === activeComponent ? 'active' : ''}" data-component="${component.name}"><strong>${component.name}</strong><small>${component.category}</small></button>`).join('') : '<div class="api-empty">没有匹配组件</div>';
    detail.innerHTML = apiDetail(components.find((component) => component.name === activeComponent));
    detail.querySelectorAll('table, .api-props').forEach((region) => region.setAttribute('tabindex', '0'));
    list.querySelectorAll('[data-component]').forEach((button) => button.addEventListener('click', () => {
      activeComponent = button.dataset.component;
      updateApiResults(article.querySelector('#apiSearch').value);
    }));
  }

  function renderComponentApi() {
    const uiComponentCount = data.components.filter((component) => component.name !== 'AtlasProvider').length;
    article.innerHTML = `<div class="doc-eyebrow">设计系统 / Component API</div><h1>组件 API</h1><p class="api-intro">统一检索 React 与 Vue 3 的 ${uiComponentCount} 个 UI 组件及 AtlasProvider。当前 API 处于 Beta，发布 npm packages 前以仓库源码和本页生成数据为准。</p><div class="api-toolbar"><input id="apiSearch" type="search" placeholder="搜索组件、Prop 或类型" autocomplete="off"></div><section class="api-layout" aria-label="组件 API 浏览器"><div class="api-list"></div><article class="api-detail"></article></section>`;
    const input = article.querySelector('#apiSearch');
    input.addEventListener('input', () => updateApiResults(input.value));
    updateApiResults();
    renderToc([]);
    renderPagination('components/api');
    document.title = '组件 API · Atlas EIDS Docs';
    markActiveRoute('components/api');
  }

  function renderRoute() {
    const route = currentRoute();
    if (route === 'components/api') renderComponentApi();
    else renderDocument(route);
    sidebar.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.getElementById('docsMain').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function excerpt(text, query) {
    const normalized = text.replace(/\s+/g, ' ');
    const position = normalized.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, position - 55);
    return `${start > 0 ? '...' : ''}${normalized.slice(start, start + 150)}${normalized.length > start + 150 ? '...' : ''}`;
  }

  function renderSearchResults(query) {
    const needle = query.trim();
    if (!needle) {
      searchResults.innerHTML = '<div class="search-empty">输入关键词开始检索</div>';
      return;
    }
    const documentMatches = data.documents.filter((document) => `${document.title} ${document.searchText}`.toLowerCase().includes(needle.toLowerCase())).slice(0, 7).map((document) => ({ type: '文档', title: document.title, description: excerpt(document.searchText, needle), route: document.id }));
    const componentMatches = filteredComponents(needle).slice(0, 7).map((component) => ({ type: '组件 API', title: component.name, description: `${component.category} · ${component.summary}`, route: 'components/api', component: component.name }));
    const matches = [...componentMatches, ...documentMatches];
    searchResults.innerHTML = matches.length ? matches.map((match) => `<button class="search-result" type="button" data-search-route="${match.route}" data-search-component="${match.component ?? ''}"><span>${match.type}</span><strong>${match.title}</strong><small>${match.description}</small></button>`).join('') : '<div class="search-empty">没有找到匹配内容</div>';
    searchResults.querySelectorAll('[data-search-route]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.searchComponent) activeComponent = button.dataset.searchComponent;
      location.hash = `#/${button.dataset.searchRoute}`;
      searchDialog.close();
    }));
  }

  function openSearch() {
    if (!searchDialog.open) searchDialog.showModal();
    searchInput.value = '';
    renderSearchResults('');
    requestAnimationFrame(() => searchInput.focus());
  }

  document.getElementById('searchTrigger').addEventListener('click', openSearch);
  document.getElementById('searchClose').addEventListener('click', () => searchDialog.close());
  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  searchDialog.addEventListener('click', (event) => { if (event.target === searchDialog) searchDialog.close(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !searchDialog.open && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      openSearch();
    }
  });

  menuButton.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  const themeButton = document.getElementById('themeButton');
  const themeKey = 'atlas-eids-docs-theme';
  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    themeButton.textContent = next === 'dark' ? '浅色' : '深色';
    themeButton.setAttribute('aria-pressed', String(next === 'dark'));
  }
  applyTheme(localStorage.getItem(themeKey) || 'light');
  themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeKey, next);
    applyTheme(next);
  });

  window.addEventListener('hashchange', renderRoute);
  renderNavigation();
  renderRoute();
})();
