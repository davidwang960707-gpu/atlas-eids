(() => {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  const links = local ? {
    templates: 'http://127.0.0.1:4176/#/workbench',
    'storybook-react': 'http://127.0.0.1:6006/',
    'storybook-vue': 'http://127.0.0.1:6007/',
    react: 'http://127.0.0.1:4174/',
    vue: 'http://127.0.0.1:4175/'
  } : {
    templates: 'templates/#/workbench',
    'storybook-react': 'storybook/react/',
    'storybook-vue': 'storybook/vue/',
    react: 'examples/react/',
    vue: 'examples/vue3/'
  };

  document.querySelectorAll('[data-runtime-link]').forEach((anchor) => {
    const href = links[anchor.dataset.runtimeLink];
    if (href) anchor.href = href;
  });
})();
