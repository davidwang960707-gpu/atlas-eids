/**
 * Atlas EIDS - Orb Interactive Demo
 * Handles Orb state switching and animation speed control
 */

(function() {
  'use strict';

  let currentOrbState = 'idle';
  let animationSpeedMultiplier = 1;

  /**
   * Initialize Orb demo controls
   */
  function initOrbDemo() {
    setupStateButtons();
    setupSpeedSlider();
    showToast('页面加载完成');
  }

  /**
   * Set up Orb state buttons
   */
  function setupStateButtons() {
    const buttons = document.querySelectorAll('.control-btn[data-state]');

    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const newState = this.getAttribute('data-state');
        setOrbState(newState);

        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  /**
   * Set up animation speed slider
   */
  function setupSpeedSlider() {
    const slider = document.getElementById('animSpeed');
    const valueDisplay = document.getElementById('speedValue');

    if (!slider || !valueDisplay) return;

    slider.addEventListener('input', function() {
      const speed = parseFloat(this.value);
      animationSpeedMultiplier = speed;
      valueDisplay.textContent = speed + 'x';
      updateAnimationSpeed(speed);
    });
  }

  /**
   * Change Orb state
   */
  function setOrbState(state) {
    const validStates = ['idle', 'thinking', 'running', 'error'];
    if (!validStates.includes(state)) return;

    currentOrbState = state;

    // Update all orb wrappers in the showcase
    const orbWrappers = document.querySelectorAll('#orbShowcase .orb-wrapper');
    orbWrappers.forEach(wrapper => {
      // Remove all state classes
      wrapper.classList.remove('state-idle', 'state-thinking', 'state-running', 'state-error');
      // Add new state class
      wrapper.classList.add(`state-${state}`);
    });

    showToast(`Orb 状态: ${getOrbStateLabel(state)}`);
  }

  /**
   * Get Chinese label for Orb state
   */
  function getOrbStateLabel(state) {
    const labels = {
      'idle': '待机',
      'thinking': '思考',
      'running': '运行',
      'error': '错误'
    };
    return labels[state] || state;
  }

  /**
   * Update animation speed based on slider value
   */
  function updateAnimationSpeed(speed) {
    // Calculate new duration for animations
    const baseDurations = {
      breathe: 4000,
      spin: 20000,
      pulseGlow: 2000,
      shake: 500,
      blink: 1000,
      pulse: 2000,
      pulseRing: 2000
    };

    // Update CSS custom property for animation speed
    document.documentElement.style.setProperty('--anim-speed-multiplier', speed.toString());

    // Apply speed to all animated elements
    const animatedElements = document.querySelectorAll('.orb, .orb-ring, .status-dot, .input-cursor');
    animatedElements.forEach(el => {
      el.style.animationDuration = '';
      const computedStyle = window.getComputedStyle(el);
      const currentDuration = computedStyle.animationDuration;

      if (currentDuration && currentDuration !== '0s') {
        const durationMs = parseDuration(currentDuration);
        const newDuration = durationMs / speed;
        el.style.animationDuration = newDuration + 'ms';
      }
    });
  }

  /**
   * Parse CSS duration string to milliseconds
   */
  function parseDuration(durationStr) {
    if (durationStr.endsWith('s')) {
      return parseFloat(durationStr) * 1000;
    } else if (durationStr.endsWith('ms')) {
      return parseFloat(durationStr);
    }
    return 0;
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrbDemo);
  } else {
    initOrbDemo();
  }

  // Export API
  window.OrbDemo = {
    setState: setOrbState,
    getState: () => currentOrbState,
    setSpeed: (speed) => {
      animationSpeedMultiplier = speed;
      updateAnimationSpeed(speed);
    }
  };

})();
