/**
 * witflow 威特流 · Official Website Interaction Script
 * Features: Dark/Light Mode, Spotlight Effects, Modal Dialogs, Clipboard Copy & Toast Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSpotlightEffect();
  initModalSystem();
  initClipboardActions();
  initScrollAnimations();
  initMobileDrawer();
  initFilterTabs();
  initFaqAccordion();
  initQuickForm();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Natural Warm vs. Dark Slate)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved preference or default to light
  const savedTheme = localStorage.getItem('witflow_theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('witflow_theme', newTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Aceternity UI / Magic UI Inspired Spotlight Effect
   -------------------------------------------------------------------------- */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   3. Modal System (WeChat QR Dialog)
   -------------------------------------------------------------------------- */
function initModalSystem() {
  const openButtons = document.querySelectorAll('.show-qr-btn');
  const modals = document.querySelectorAll('.modal-overlay');

  openButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target') || 'wechat-modal';
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  modals.forEach(modal => {
    // Close on backdrop click
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    // Close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          closeModal(modal);
        }
      });
    }
  });

  function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   Shared Toast Notification System (shadcn/ui style)
   -------------------------------------------------------------------------- */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const toastMsg = toast.querySelector('.toast-msg');
  if (toastMsg) toastMsg.textContent = message;

  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3200);
}

/* --------------------------------------------------------------------------
   4. Clipboard Actions
   -------------------------------------------------------------------------- */
function initClipboardActions() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyWechatBtn = document.getElementById('copy-wechat-btn');

  function copyText(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('复制失败，请手动复制：' + text);
    }
    document.body.removeChild(tempInput);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'contact@witflow.com';
      copyText(email, `商务邮箱 ${email} 已复制到剪贴板！`);
      
      const copyBtnText = document.getElementById('copy-btn-text');
      if (copyBtnText) {
        const originText = copyBtnText.textContent;
        copyBtnText.textContent = '已复制邮箱！';
        setTimeout(() => {
          copyBtnText.textContent = originText;
        }, 2500);
      }
    });
  }

  if (copyWechatBtn) {
    copyWechatBtn.addEventListener('click', () => {
      const wechatId = copyWechatBtn.getAttribute('data-copy') || 'witflow_official';
      copyText(wechatId, `微信号 ${wechatId} 已复制！`);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Smooth Scroll Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.bento-card, .flow-step, .matrix-card, .showcase-card, .faq-item');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   6. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (!menuBtn || !drawer) return;

  const openIcon = menuBtn.querySelector('.menu-open-icon');
  const closeIcon = menuBtn.querySelector('.menu-close-icon');
  const drawerLinks = drawer.querySelectorAll('.drawer-link');

  function setDrawerOpen(isOpen) {
    if (isOpen) {
      drawer.classList.remove('hidden');
      if (openIcon) openIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
    } else {
      drawer.classList.add('hidden');
      if (openIcon) openIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyHidden = drawer.classList.contains('hidden');
    setDrawerOpen(isCurrentlyHidden);
  });

  // Auto-close when clicking any drawer navigation link
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      setDrawerOpen(false);
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!drawer.classList.contains('hidden')) {
      if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
        setDrawerOpen(false);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
      setDrawerOpen(false);
    }
  });
}

/* --------------------------------------------------------------------------
   7. Showcase Filter Tabs (Magic UI & shadcn style)
   -------------------------------------------------------------------------- */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.showcase-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');

      // Update active tab button style
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter showcase cards with smooth transition
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('filtered-out');
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. FAQ Accordion (shadcn/ui Inspired)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close other open FAQ items for focused single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isAlreadyActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Quick Connect / Collaboration Form (shadcn/ui Inspired)
   -------------------------------------------------------------------------- */
function initQuickForm() {
  const form = document.getElementById('quick-contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit-btn');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const messageInput = document.getElementById('sender-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('请完整填写留言信息');
      return;
    }

    // Button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <span>正在提交...</span>
      `;
    }

    setTimeout(() => {
      // Feedback toast
      showToast(`感谢你的留言，${name}！合作意向已成功送达，我们会尽快回复你。`);

      // Reset form fields
      form.reset();

      // Reset submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }, 650);
  });
}

