/**
 * Atlas EIDS - Theme Switcher
 * Handles dark/light theme toggling with localStorage persistence
 */

(function() {
  'use strict';

  const THEME_KEY = 'atlas-eids-theme';
  let currentTheme = 'dark';

  /**
   * Initialize theme based on saved preference or system preference
   */
  function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme) {
      currentTheme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(currentTheme);
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);

    // Update toggle button
    updateToggleButton();
  }

  /**
   * Update the theme toggle button appearance
   */
  function updateToggleButton() {
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    if (!toggleBtn || !themeIcon || !themeText) return;

    if (currentTheme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark';
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  /**
   * Get current theme
   */
  function getCurrentTheme() {
    return currentTheme;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();

      // Set up toggle button click handler
      const toggleBtn = document.getElementById('themeToggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    });
  } else {
    initTheme();

    // Set up toggle button click handler
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Export API
  window.ThemeSwitcher = {
    init: initTheme,
    toggle: toggleTheme,
    get: getCurrentTheme,
    set: applyTheme
  };

})();
