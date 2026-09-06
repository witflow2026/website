/**
 * witflow 威特流 · Official Website Interaction Script
 * Features: Dark/Light Mode, Spotlight Effects, Modal Dialogs, Clipboard Copy & Toast Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSoundSystem();
  initSpotlightEffect();
  initModalSystem();
  initClipboardActions();
  initScrollAnimations();
  initMobileDrawer();
  initFilterTabs();
  initFaqAccordion();
  initQuickForm();
  initScrollSpy();
  initBackToTop();
  initQrImageFallback();
  initShowcaseModal();
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
   9. Quick Connect / Collaboration Form (shadcn/ui Inspired + Draft Auto-save)
   -------------------------------------------------------------------------- */
function initQuickForm() {
  const form = document.getElementById('quick-contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit-btn');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const messageInput = document.getElementById('sender-message');
  const draftBadge = document.getElementById('form-draft-badge');

  // Restore draft from localStorage
  const DRAFT_KEY = 'witflow_contact_draft';
  try {
    const savedDraft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    if (savedDraft.name || savedDraft.email || savedDraft.message) {
      if (nameInput && savedDraft.name) nameInput.value = savedDraft.name;
      if (emailInput && savedDraft.email) emailInput.value = savedDraft.email;
      if (messageInput && savedDraft.message) messageInput.value = savedDraft.message;
      if (draftBadge) draftBadge.classList.remove('hidden');
    }
  } catch (e) {}

  // Auto-save draft on input
  function saveDraft() {
    const draft = {
      name: nameInput ? nameInput.value : '',
      email: emailInput ? emailInput.value : '',
      message: messageInput ? messageInput.value : ''
    };
    if (draft.name || draft.email || draft.message) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      if (draftBadge) draftBadge.classList.remove('hidden');
    } else {
      localStorage.removeItem(DRAFT_KEY);
      if (draftBadge) draftBadge.classList.add('hidden');
    }
  }

  [nameInput, emailInput, messageInput].forEach(inp => {
    if (inp) inp.addEventListener('input', saveDraft);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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

      // Clear draft & form fields
      localStorage.removeItem(DRAFT_KEY);
      form.reset();
      if (draftBadge) draftBadge.classList.add('hidden');

      // Reset submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }, 650);
  });
}

/* --------------------------------------------------------------------------
   10. Web Audio API Micro-Sound System (Linear / Raycast Inspired)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isSoundEnabled = false;

function playTick(freq = 620, duration = 0.015) {
  if (!isSoundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Graceful fallback
  }
}

function initSoundSystem() {
  const soundBtn = document.getElementById('sound-toggle');
  if (!soundBtn) return;

  const onIcon = soundBtn.querySelector('.sound-on-icon');
  const offIcon = soundBtn.querySelector('.sound-off-icon');

  // Default to off (respect user preferences), read localStorage
  isSoundEnabled = localStorage.getItem('witflow_sound') === 'true';
  updateSoundIcons();

  function updateSoundIcons() {
    if (isSoundEnabled) {
      if (onIcon) onIcon.classList.remove('hidden');
      if (offIcon) offIcon.classList.add('hidden');
    } else {
      if (onIcon) onIcon.classList.add('hidden');
      if (offIcon) offIcon.classList.remove('hidden');
    }
  }

  soundBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('witflow_sound', isSoundEnabled ? 'true' : 'false');
    updateSoundIcons();
    if (isSoundEnabled) {
      playTick(720, 0.025);
      showToast('交互微音效已开启 🔊 (Linear 极客微触感)');
    } else {
      showToast('交互微音效已静音 🔇');
    }
  });

  // Attach sound trigger to interactive elements
  document.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle, .filter-tab, .faq-trigger, .card-detail-btn, .copy-email-btn, .copy-sub-btn, #back-to-top')) {
      playTick(580, 0.012);
    }
  });
}

/* --------------------------------------------------------------------------
   11. ScrollSpy & Dynamic Navbar Scrolled State
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const navbar = document.getElementById('navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const drawerLinks = document.querySelectorAll('.mobile-drawer .drawer-link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // 1. Scrolled header dock compression
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // 2. Active section detection
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      drawerLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   12. Back to Top Floating Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 380) {
      backBtn.classList.remove('hidden');
    } else {
      backBtn.classList.add('hidden');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   13. WeChat Real QR Code Automatic Fallback Check
   -------------------------------------------------------------------------- */
function initQrImageFallback() {
  const realQr = document.getElementById('real-wechat-qr');
  const svgQr = document.getElementById('svg-wechat-qr');
  if (!realQr || !svgQr) return;

  realQr.onload = () => {
    realQr.classList.remove('hidden');
    svgQr.classList.add('hidden');
  };

  realQr.onerror = () => {
    realQr.classList.add('hidden');
    svgQr.classList.remove('hidden');
  };
}

/* --------------------------------------------------------------------------
   14. Showcase Quick Reader / Architecture Modal
   -------------------------------------------------------------------------- */
function initShowcaseModal() {
  const modal = document.getElementById('showcase-modal');
  if (!modal) return;

  const detailButtons = document.querySelectorAll('.card-detail-btn');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalSummary = document.getElementById('modal-summary');
  const modalTopology = document.getElementById('modal-topology');
  const modalTakeaways = document.getElementById('modal-takeaways');

  const caseData = {
    'case-1': {
      category: '效率工作流',
      title: '单兵作战系统：创作者如何借助自动化解放 80% 重复操作？',
      summary: '从分散的灵感收集到排版分发，通过自研批处理脚本与标准工作流模板构建闭环。',
      topology: [
        { num: 'Step 01', name: '全网高纯输入', desc: 'RSS 聚合源过滤与剪藏标签自动打标' },
        { num: 'Step 02', name: '结构化脚本处理', desc: 'Python/Shell 批处理提取图文核心逻辑' },
        { num: 'Step 03', name: '一键飞轮分发', desc: '按平台调性生成多版本排版并存入草稿箱' }
      ],
      takeaways: [
        '系统大于意志力：把重复执行超过 3 次的机械动作全部写成脚本固化。',
        '解耦核心认知与平台格式：同一条核心洞察，衍生为深度长文、速读卡片与快评。',
        '自动化流水线让单兵创作者达到小型专业工作室的内容交付密实度。'
      ]
    },
    'case-2': {
      category: '矩阵运营',
      title: '跨平台内容架构：同一核心主张在多生态的协同飞轮',
      summary: '剖析如何在 X、公众号、小红书与即刻实现差异化定位，让深度沉淀与轻量传播互为支撑。',
      topology: [
        { num: 'Step 01', name: '即刻 / X 发酵', desc: '短动态收集反馈与真实讨论摩擦点' },
        { num: 'Step 02', name: '公众号深度复盘', desc: '展开万字方法论与系统逻辑深度推演' },
        { num: 'Step 03', name: '小红书视觉切片', desc: '提炼高信息密度视觉卡片实现泛公域破圈' }
      ],
      takeaways: [
        '不搞机械搬运：各平台用户心智完全不同，重塑标题与呈现方式而非复制粘贴。',
        '长文负责建立不可替代的专业认知，短内容负责保持全网高频触达。',
        '全平台引流沉淀至官方网站与私域渠道，构建长期独立数字资产。'
      ]
    },
    'case-3': {
      category: '独立工程',
      title: '用轻量化工具解决真实问题：我的自媒体定制脚本实践',
      summary: '分享从零编写的批处理与发布脚本，如何消除跨平台日常摩擦，构建平滑无阻的内容流转闭环。',
      topology: [
        { num: 'Step 01', name: '痛点精准定位', desc: '记录每日最耗费精力却无创造价值的动作' },
        { num: 'Step 02', name: '轻量脚本构建', desc: '采用极简代码驱动，避免引入冗余庞大依赖' },
        { num: 'Step 03', name: '本地开箱即用', desc: '沉淀为 CLI 命令行或快捷指令一键执行' }
      ],
      takeaways: [
        '优先解决真实卡点：不要为了造轮子而写代码，一切以节省创作者时间为第一标准。',
        '保持代码极简和可维护性：简单的自动化胜过复杂的黑盒框架。',
        '坚持逐步开源分享：让工具在社区同行反馈中持续进化与迭代。'
      ]
    },
    'case-4': {
      category: '效率工作流',
      title: '信息降噪艺术：如何为创作者搭建高纯度输入与输出漏斗？',
      summary: '从 RSS 订阅源精简到自动化标签分拣，建立个人知识资产库，把注意力留给真正重要的创造。',
      topology: [
        { num: 'Step 01', name: '信息源白名单化', desc: '无情取关低信噪比账号，精选硬核输入源' },
        { num: 'Step 02', name: '中间层降噪过滤', desc: '自动化规则初筛，归并同质化热点' },
        { num: 'Step 03', name: '知识资产持久化', desc: '结构化 Markdown 存档至本地工作区' }
      ],
      takeaways: [
        '输入的质量决定输出的上限：远离信息流算法投喂，重回主动订阅。',
        '建立第二大脑：所有灵感与好想法在闪现的 60 秒内通过快捷指令存入库中。',
        '以输出倒逼输入：只收集能够被当前工作流或内容计划调用的高纯度资料。'
      ]
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const caseId = btn.getAttribute('data-case');
      const data = caseData[caseId];
      if (!data) return;

      if (modalCategory) modalCategory.textContent = data.category;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSummary) modalSummary.textContent = data.summary;

      if (modalTopology) {
        modalTopology.innerHTML = data.topology.map(step => `
          <div class="topo-step">
            <div class="topo-num">${step.num}</div>
            <div class="topo-name">${step.name}</div>
            <div class="topo-desc">${step.desc}</div>
          </div>
        `).join('');
      }

      if (modalTakeaways) {
        modalTakeaways.innerHTML = data.takeaways.map(t => `
          <li>${t}</li>
        `).join('');
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });
}


