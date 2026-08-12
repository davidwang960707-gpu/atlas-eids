const host = '127.0.0.1'

export const testPorts = {
  portal: process.env.ATLAS_EIDS_TEST_PORTAL_PORT ?? '4273',
  react: process.env.ATLAS_EIDS_TEST_REACT_PORT ?? '4274',
  vue: process.env.ATLAS_EIDS_TEST_VUE_PORT ?? '4275',
  templates: process.env.ATLAS_EIDS_TEST_TEMPLATES_PORT ?? '4276'
} as const

export const testUrls = {
  portal: `http://${host}:${testPorts.portal}`,
  react: `http://${host}:${testPorts.react}`,
  vue: `http://${host}:${testPorts.vue}`,
  templates: `http://${host}:${testPorts.templates}`
} as const
