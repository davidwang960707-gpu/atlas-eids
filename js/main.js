/**
 * Atlas EIDS - Main Script
 * General utilities and initialization
 */

(function() {
  'use strict';

  /**
   * Smooth scroll for navigation links
   */
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Navbar scroll effect
   */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }

      lastScrollY = currentScrollY;
    });
  }

  /**
   * Intersection Observer for fade-in animations
   */
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('fade-in-section');
      observer.observe(section);
    });
  }

  /**
   * Reusable tabs for component showcase sections
   */
  function initSectionTabs() {
    document.querySelectorAll('.tabbed-showcase').forEach(showcase => {
      const buttons = showcase.querySelectorAll('[data-tab-target]');
      const panels = showcase.querySelectorAll('[data-tab-panel]');

      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const target = button.getAttribute('data-tab-target');
          if (!target) return;

          buttons.forEach(tab => {
            const isActive = tab === button;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
          });

          panels.forEach(panel => {
            panel.classList.toggle('active', panel.getAttribute('data-tab-panel') === target);
          });
        });
      });
    });
  }

  /**
   * Initialize all features
   */
  function init() {
    initSmoothScroll();
    initNavbarScroll();
    initScrollAnimations();
    initSectionTabs();

    console.log('Atlas EIDS Design System initialized');
  }

  /**
   * Copy code to clipboard
   */
  window.copyCode = function(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const code = element.textContent;

    navigator.clipboard.writeText(code).then(() => {
      // Show toast notification
      showToast('代码已复制到剪贴板');
    }).catch(err => {
      console.error('Failed to copy:', err);
      showToast('复制失败，请手动复制');
    });
  };

  /**
   * Show toast notification
   */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  /**
   * Custom Select Dropdown
   */
  window.toggleSelect = function(trigger) {
    const select = trigger.closest('.custom-select');
    const isOpen = select.classList.contains('open');
    
    // Close all other selects first
    document.querySelectorAll('.custom-select.open').forEach(s => {
      if (s !== select) s.classList.remove('open');
    });
    
    // Toggle current select
    select.classList.toggle('open');
  };

  window.selectOption = function(option) {
    const select = option.closest('.custom-select');
    const dropdown = select.querySelector('.select-dropdown');
    const trigger = select.querySelector('.select-trigger');
    const placeholder = trigger.querySelector('.select-placeholder');
    const textSpan = trigger.querySelector('.select-text');
    
    // Update selected state
    dropdown.querySelectorAll('.select-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
    
    // Update trigger text
    const value = option.getAttribute('data-value');
    const label = option.textContent;
    
    select.setAttribute('data-value', value);
    
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    if (textSpan) {
      textSpan.textContent = label;
    } else if (placeholder) {
      placeholder.textContent = label;
      placeholder.style.display = '';
    }
    
    // Close dropdown
    select.classList.remove('open');
    
    // Trigger change event
    select.dispatchEvent(new CustomEvent('change', { 
      detail: { value, label } 
    }));
  };

  window.toggleMultiSelect = function(option) {
    const select = option.closest('.custom-select');
    const tagList = select.closest('.multi-select-tags')?.querySelector('.tag-list');
    if (!tagList) return;
    
    option.classList.toggle('selected');
    
    const value = option.getAttribute('data-value');
    const label = option.textContent;
    const isSelected = option.classList.contains('selected');
    
    if (isSelected) {
      // Add tag
      const tag = document.createElement('span');
      tag.className = 'tag-item';
      tag.innerHTML = `
        ${label}
        <button class="tag-remove" onclick="removeTag(this)" title="移除">×</button>
      `;
      tagList.appendChild(tag);
    } else {
      // Remove tag
      const tags = Array.from(tagList.querySelectorAll('.tag-item'));
      const tagToRemove = tags.find(tag => {
        const text = tag.childNodes[0]?.textContent.trim();
        return text === label;
      });
      if (tagToRemove) tagToRemove.remove();
    }
  };

  window.removeTag = function(button) {
    const tag = button.closest('.tag-item');
    const label = tag.childNodes[0]?.textContent.trim();
    
    // Find and deselect corresponding option
    const select = button.closest('.multi-select-tags')?.querySelector('.custom-select');
    if (select) {
      const options = select.querySelectorAll('.select-option');
      options.forEach(opt => {
        if (opt.textContent.trim() === label) {
          opt.classList.remove('selected');
        }
      });
    }
    
    tag.remove();
  };

  /**
   * Chat Popup Functions
   */
  window.minimizeChatPopup = function() {
    const popup = document.querySelector('.chat-popup');
    if (popup) {
      const messages = popup.querySelector('.chat-messages');
      const input = popup.querySelector('.chat-input-area');
      if (messages && input) {
        const isMinimized = messages.style.display === 'none';
        messages.style.display = isMinimized ? 'flex' : 'none';
        input.style.display = isMinimized ? 'block' : 'none';
      }
    }
  };

  window.closeChatPopup = function() {
    const popup = document.querySelector('.chat-popup');
    if (popup) {
      popup.style.opacity = '0';
      popup.style.transform = 'translateY(20px)';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300);
    }
  };

  window.handleChatInput = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChatMessage();
    }
  };

  window.sendChatMessage = function() {
    const textarea = document.querySelector('.chat-input');
    if (!textarea || !textarea.value.trim()) return;
    
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;
    
    const message = textarea.value.trim();
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message-user';
    userMsg.style.cssText = 'display: flex; gap: 12px; align-items: flex-start; justify-content: flex-end;';
    userMsg.innerHTML = `
      <div class="message-bubble" style="background: var(--atlas-violet); border-radius: var(--radius-md); padding: 12px 16px; max-width: 80%;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: white;">${escapeHtml(message)}</p>
      </div>
      <div class="message-avatar" style="width: 28px; height: 28px; border-radius: 50%; background: var(--atlas-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    `;
    messagesContainer.appendChild(userMsg);
    
    // Clear input
    textarea.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate AI response after delay
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'message-ai';
      aiMsg.style.cssText = 'display: flex; gap: 12px; align-items: flex-start;';
      aiMsg.innerHTML = `
        <div class="message-avatar" style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--atlas-violet), var(--atlas-purple)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="message-bubble" style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 12px 16px; max-width: 80%;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: var(--text-primary);">收到！这是一个演示消息。在实际应用中，这里会显示 AI 的智能回复。</p>
        </div>
      `;
      messagesContainer.appendChild(aiMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  };

  /**
   * Magic Wand Functions
   */
  window.toggleMagicSuggestions = function(button) {
    const container = button.closest('.magic-input-container');
    const dropdown = container?.querySelector('.magic-dropdown');
    if (!dropdown) return;
    
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    
    // Close when clicking outside
    if (!isVisible) {
      const closeHandler = (e) => {
        if (!container.contains(e.target)) {
          dropdown.style.display = 'none';
          document.removeEventListener('click', closeHandler);
        }
      };
      setTimeout(() => {
        document.addEventListener('click', closeHandler);
      }, 0);
    }
  };

  window.showMagicMenu = function(button) {
    const container = button.closest('.magic-textarea-container');
    const menu = container?.querySelector('.magic-menu-popup');
    if (!menu) return;
    
    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      const closeHandler = (e) => {
        if (!container.contains(e.target)) {
          menu.style.display = 'none';
          document.removeEventListener('click', closeHandler);
        }
      };
      setTimeout(() => {
        document.addEventListener('click', closeHandler);
      }, 0);
    }
  };

  window.showMagicTooltip = function(element) {
    const demo = element.closest('.inline-magic-demo');
    const tooltip = demo?.querySelector('.magic-tooltip');
    if (tooltip) {
      tooltip.style.display = 'block';
    }
  };

  window.hideMagicTooltip = function(element) {
    const demo = element.closest('.inline-magic-demo');
    const tooltip = demo?.querySelector('.magic-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  /**
   * Utility: Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export API
  window.AtlasEIDS = {
    version: '1.0.0',
    init,
    copyCode: window.copyCode,
    showToast
  };

})();
