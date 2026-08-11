import type { AtlasTheme } from './contracts.js'

export interface AtlasThemeController {
  getTheme(): AtlasTheme
  setTheme(theme: AtlasTheme): void
  subscribe(listener: (theme: AtlasTheme) => void): () => void
}

export function createThemeController(initialTheme: AtlasTheme = 'auto'): AtlasThemeController {
  let theme = initialTheme
  const listeners = new Set<(value: AtlasTheme) => void>()

  return {
    getTheme: () => theme,
    setTheme(nextTheme) {
      if (theme === nextTheme) return
      theme = nextTheme
      listeners.forEach((listener) => listener(theme))
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

export interface AtlasEventMap {
  [event: string]: unknown
}

export function createEventBus<Events extends AtlasEventMap>() {
  const listeners = new Map<keyof Events, Set<(payload: Events[keyof Events]) => void>>()

  return {
    on<Key extends keyof Events>(event: Key, listener: (payload: Events[Key]) => void) {
      const group = listeners.get(event) ?? new Set()
      group.add(listener as (payload: Events[keyof Events]) => void)
      listeners.set(event, group)
      return () => group.delete(listener as (payload: Events[keyof Events]) => void)
    },
    emit<Key extends keyof Events>(event: Key, payload: Events[Key]) {
      listeners.get(event)?.forEach((listener) => listener(payload))
    }
  }
}

export function resolveTheme(theme: AtlasTheme, prefersDark: boolean): Exclude<AtlasTheme, 'auto'> {
  return theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme
}
