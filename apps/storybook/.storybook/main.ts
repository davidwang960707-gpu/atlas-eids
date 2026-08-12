import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: true },
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  features: { sidebarOnboardingChecklist: false, menuOnboardingChecklist: false }
}

export default config
