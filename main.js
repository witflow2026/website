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
  initMobileMenu();
  initCounterAnimation();
  initScrollProgress();
  initScrollSpy();
  initFaqAccordion();
  initBackToTop();
  initInquirySimulator();
  initToolsPage();
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
   4. Clipboard Actions & Toast Notification
   -------------------------------------------------------------------------- */
function initClipboardActions() {
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyWechatBtn = document.getElementById('copy-wechat-btn');
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = message;

    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

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
      const email = copyEmailBtn.getAttribute('data-email') || 'contact@witflow.trade';
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
      const wechatId = copyWechatBtn.getAttribute('data-copy') || 'wit_flow';
      copyText(wechatId, `微信号 ${wechatId} 已复制！`);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Smooth Scroll Animations (IntersectionObserver with Stagger & Reduced Motion)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // UX Rule #55: Respect user's motion preference (WCAG 2.1 AAA)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allCards = document.querySelectorAll('.bento-card, .flow-step, .matrix-card, .showcase-card');

  if (prefersReducedMotion) {
    allCards.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const containerSelectors = ['.bento-grid', '.pipeline-flow', '.matrix-grid', '.showcase-grid'];
  const processedElements = new Set();

  const containerObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.bento-card, .flow-step, .matrix-card, .showcase-card');
        items.forEach((item, index) => {
          const delayMs = index * 75; // Stagger 75ms delay per item
          item.style.transitionDelay = `${delayMs}ms`;
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';

          // Clean up transition-delay after reveal completes so hover micro-interactions stay snappy
          setTimeout(() => {
            item.style.transitionDelay = '';
          }, 600 + delayMs);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  containerSelectors.forEach(selector => {
    const container = document.querySelector(selector);
    if (container) {
      const items = container.querySelectorAll('.bento-card, .flow-step, .matrix-card, .showcase-card');
      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(22px)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        processedElements.add(item);
      });
      containerObserver.observe(container);
    }
  });

  // Fallback observer for any standalone animated elements outside standard grid containers
  const standaloneObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  allCards.forEach(el => {
    if (!processedElements.has(el)) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      standaloneObserver.observe(el);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Mobile Menu Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  if (!menuBtn || !drawer) return;

  function toggleMenu(forceClose = false) {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    const shouldClose = forceClose || isExpanded;

    if (shouldClose) {
      drawer.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any link/button inside drawer
  const drawerLinks = drawer.querySelectorAll('a, button');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(true);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(true);
    }
  });

  // Auto-close if resized to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggleMenu(true);
    }
  });
}

/* --------------------------------------------------------------------------
   7. Animated Counter (Dictionary #44 Animated Counter with Ease-Out)
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statsRibbon = document.querySelector('.stats-ribbon');
  const counterElements = document.querySelectorAll('.stat-num[data-target]');
  if (!statsRibbon || counterElements.length === 0) return;

  if (prefersReducedMotion) {
    // Leave the fallback target text in place
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counterElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          const duration = 1200; // 1.2s ease-out duration
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula: 1 - (1 - t)^3 (Type #1 Easing: Ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(easeOut * target);

            el.textContent = currentVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25
  });

  observer.observe(statsRibbon);
}

/* --------------------------------------------------------------------------
   8. Reading Progress Indicator (Dictionary #28 Progress Indicator)
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const percent = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
    progressBar.style.width = percent + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

/* --------------------------------------------------------------------------
   9. ScrollSpy Navigation Highlighting (Dictionary #54 Focus)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]');
  const sectionIds = ['hero', 'bento', 'pipeline', 'matrix', 'showcase', 'faq', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (navLinks.length === 0 || sections.length === 0) return;

  function setActiveLink(currentId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -55% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Handle boundary edge cases: top of page and bottom of page
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollY <= 60) {
      setActiveLink('hero');
    } else if (docHeight - scrollY <= 80) {
      setActiveLink('contact');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   10. FAQ Accordion (Dictionary #37 Accordion + #48 Icon Morphing)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other accordion items for clean focus
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   11. Back to Top Floating Button (Dictionary #09 Scale in + #52 Feedback)
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  const toggleThreshold = 400;

  function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > toggleThreshold) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   12. Interactive Inquiry Reasoning Simulator (Live Demo Console)
   -------------------------------------------------------------------------- */
function initInquirySimulator() {
  const tabs = document.querySelectorAll('.sim-tab');
  const panel = document.querySelector('.sim-panel');
  const inputText = document.getElementById('sim-input-text');
  const reasoningText = document.getElementById('sim-reasoning-text');
  const actionText = document.getElementById('sim-action-text');

  if (!tabs.length || !panel || !inputText || !reasoningText || !actionText) return;

  const caseData = {
    price: {
      input: '"Target price is $85/unit, or we go to supplier B. Need prompt reply."',
      reasoning: '检测到典型锚定施压。分析采购背景：核心产线替换成本高，B 供应商实际公差无法稳定达到 Ra 0.4 标准。',
      action: '<strong>坚守基础单价 $96</strong>，将价格战置换为交期与质量保障：置换为「首批 5k 件 15 天绿色通道交付 + 材质双重质保承诺」，以供应链确定性瓦解低价筹码。'
    },
    long: {
      input: '"Attached is 38-page technical specification. Quote for 100,000 units with complete tolerance test report."',
      reasoning: '穿透技术规格暗礁：第 14 页隐藏欧美特殊涂层盐雾测试 1000h 要求，常规工艺易导致批量召回；第 22 页公差公约数与国标不同。',
      action: '<strong>提前标定 3 处隐蔽公差公约数</strong>，输出《双语技术澄清清单》：以超预期专业度锁定技术总监信任，将盲目压价转化为不可替代的技术壁垒。'
    },
    oa: {
      input: '"We require OA 90 days after B/L date for trial order, otherwise contract cannot be approved by CFO."',
      reasoning: '财务穿透：OA 90 天现金流风险极高。但客户属于欧美上市公司，有公开信用评级，CFO 核心诉求是年报账面流动性，而非故意赖账。',
      action: '<strong>拒绝纯无抵押远期结汇</strong>，拆解为结构化金融组合：置换为「30% 预付 + 70% 中信保买方信保额度下 60 天承兑」，既满足客户授信审计，又实现风险可控回款。'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const caseKey = tab.getAttribute('data-case');
      if (!caseKey || !caseData[caseKey] || tab.classList.contains('active')) return;

      // Update tab active state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Subtle switch animation
      panel.classList.add('switching');

      setTimeout(() => {
        const data = caseData[caseKey];
        inputText.textContent = data.input;
        reasoningText.textContent = data.reasoning;
        // 安全赋值：action 文本中仅含 <strong> 加粗标记，来源为本地硬编码数据
        // 若将来接入 URL 参数或 API，必须改为 DOM 构建或严格转义
        actionText.innerHTML = data.action;
        panel.classList.remove('switching');
      }, 150);
    });
  });
}

/* --------------------------------------------------------------------------
   13. Multi-page: Tools Page Filtering & Prompt Copying (/tools.html)
   -------------------------------------------------------------------------- */
function initToolsPage() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toolCards = document.querySelectorAll('.tool-card');
  const copyPromptBtns = document.querySelectorAll('.copy-prompt-btn');

  if (filterBtns.length && toolCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        toolCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  if (copyPromptBtns.length) {
    copyPromptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.tool-card');
        if (!card) return;
        const promptBox = card.querySelector('.prompt-preview-box');
        if (!promptBox) return;
        const text = promptBox.innerText || promptBox.textContent;

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text.trim()).then(() => {
            triggerPromptToast('Prompt 已成功复制到剪贴板！');
          }).catch(() => {
            fallbackPromptCopy(text.trim());
          });
        } else {
          fallbackPromptCopy(text.trim());
        }
      });
    });
  }

  function triggerPromptToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
  }

  function fallbackPromptCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      triggerPromptToast('Prompt 已成功复制到剪贴板！');
    } catch (e) {
      triggerPromptToast('复制失败，请手动选取复制');
    }
    document.body.removeChild(tempInput);
  }
}




