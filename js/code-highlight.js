/**
 * Atlas EIDS - Code Highlight & Copy
 * Handles code tab switching and copy-to-clipboard functionality
 */

(function() {
  'use strict';

  /**
   * Initialize code features
   */
  function initCodeFeatures() {
    setupCodeTabs();
    setupCopyButtons();
    setupColorCards();
  }

  /**
   * Set up code language tabs
   */
  function setupCodeTabs() {
    const codeSections = document.querySelectorAll('.code-section');

    codeSections.forEach(section => {
      const tabs = section.querySelectorAll('.code-tab');
      const codeBlocks = section.querySelectorAll('.code-block');

      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const lang = this.getAttribute('data-lang');

          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          // Show corresponding code block
          codeBlocks.forEach(block => {
            if (block.getAttribute('data-code') === lang) {
              block.style.display = 'block';
            } else {
              block.style.display = 'none';
            }
          });
        });
      });
    });
  }

  /**
   * Set up copy buttons for code blocks
   */
  function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.code-copy');

    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const codeBlock = this.closest('.code-block');
        if (!codeBlock) return;

        const codeElement = codeBlock.querySelector('code');
        if (!codeElement) return;

        const codeText = codeElement.textContent;

        // Copy to clipboard
        navigator.clipboard.writeText(codeText).then(() => {
          // Show copied state
          button.textContent = '已复制!';
          button.classList.add('copied');

          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = '复制';
            button.classList.remove('copied');
          }, 2000);

          showToast('代码已复制到剪贴板');
        }).catch(err => {
          console.error('Failed to copy:', err);
          showToast('复制失败，请手动复制');
        });
      });
    });
  }

  /**
   * Set up color card click-to-copy
   */
  function setupColorCards() {
    const colorCards = document.querySelectorAll('.color-card[data-color]');

    colorCards.forEach(card => {
      card.addEventListener('click', function() {
        const color = this.getAttribute('data-color');
        if (!color) return;

        // Copy to clipboard
        navigator.clipboard.writeText(color).then(() => {
          showToast(`色值 ${color} 已复制`);
        }).catch(err => {
          console.error('Failed to copy:', err);
          showToast('复制失败');
        });
      });
    });
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

  /**
   * Simple syntax highlighting (optional enhancement)
   * Adds basic color coding to code blocks
   */
  function applySyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('.code-block code');

    codeBlocks.forEach(block => {
      let html = block.innerHTML;

      // Highlight keywords
      const keywords = ['import', 'from', 'const', 'let', 'var', 'function', 'return', 'export', 'default', 'interface', 'type', 'withDefaults', 'defineProps'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
      });

      // Highlight strings
      html = html.replace(/(['"`])(.*?)\1/g, '<span class="string">$1$2$1</span>');

      // Highlight comments
      html = html.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');

      block.innerHTML = html;
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCodeFeatures();
      applySyntaxHighlighting();
    });
  } else {
    initCodeFeatures();
    applySyntaxHighlighting();
  }

  // Export API
  window.CodeHighlight = {
    init: initCodeFeatures,
    copyCode: (code) => {
      navigator.clipboard.writeText(code || '');
    }
  };

})();
