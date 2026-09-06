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
  initCountUp();
  initGithubLiveStatus();
  initCalculator();
  initCommandPalette();
  initReadingProgressBar();
  initInteractiveCanvas();
  initTerminalDemo();
  initPosterGenerator();
  initMarkdownExporter();
  initServiceWorker();
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
      ],
      article: `
        <h4>一、信息过载时代的认知赤字</h4>
        <p>当今绝大多数创作者的时间并不是被创造消耗的，而是被无止境的低质信息噪音蚕食。面对各算法平台千篇一律的热点分发，创作者如果不主动构建防御漏斗，极易陷入认知疲惫。</p>
        <div class="article-callout">
          <strong>威特流黄金法则：</strong>如果一个信息源在 14 天内没有为你贡献过哪怕一条高价值构想，立即取关或移出常驻列表。
        </div>
        <h4>二、搭建高纯度输入漏斗的三步法则</h4>
        <p>1. <strong>无算法主动订阅</strong>：重回 RSS 与官方高质量 Newsletter，严格按专业度筛选不超过 20 个高信噪比源。</p>
        <p>2. <strong>快捷闪念剪藏</strong>：配置快捷键（如 Raycast / Alfred 脚本），在阅读到闪光点时 3 秒内将其提取至 Inbox 本地文件夹，打上时间与核心关键词标签。</p>
        <p>3. <strong>周度归档与复盘</strong>：每周日定时运行批处理程序，将 Inbox 笔记整合到主题索引库，完成从外部信息到个人知识资产的飞跃。</p>
      `
    }
  };

  // Add deep dive article texts for case 1, 2, 3
  caseData['case-1'].article = `
    <h4>一、单兵作战的核心痛点：机械重复消耗心力</h4>
    <p>很多独立创作者之所以感到精疲力竭，是因为大量时间被消耗在格式转换、图片重命名、多平台分发排版等重复机械动作上。这些动作毫无创造性，却占据了 80% 的工作时长。</p>
    <div class="article-callout">
      <strong>系统大于意志力：</strong>人脑是用来思考的，不是用来充当剪贴板与搬运工的。把任何重复操作超过 3 次的动作固化为工程流水线。
    </div>
    <h4>二、witflow 自动化流水线的设计理念</h4>
    <p>我们采用“单点输入、流水线加工、矩阵式交付”的工程模型：</p>
    <p>1. <strong>统一内容源（Single Source of Truth）</strong>：以纯纯的 Markdown 作为唯一母稿源。</p>
    <p>2. <strong>自动化批处理加工</strong>：自研轻量脚本，自动将母稿按不同平台规范裁剪为长文排版、卡片图文与即时简评。</p>
    <p>3. <strong>一键跨平台注入</strong>：借力 API 与自动化工具，实现几秒钟内完成各平台草稿箱就绪。</p>
  `;

  caseData['case-2'].article = `
    <h4>一、拒绝简单机械搬运的“同质化陷阱”</h4>
    <p>很多自媒体矩阵之所以反响平平，是因为在不同生态中只是机械地粘贴同一段文字。X 的用户追求极速观点交锋，公众号读者渴望严谨深度的方法论，小红书用户注重即时视觉抓力，即刻创作者更青睐未经雕琢的真实思考碎片。</p>
    <div class="article-callout">
      <strong>飞轮理念：</strong>同一核心命题，按平台文化“量身剪裁”，让各平台互为支点，形成互相引流与共振的内容飞轮。
    </div>
    <h4>二、跨生态协同的四维坐标</h4>
    <p>1. <strong>X (Twitter)</strong>：作为灵感实验田，快速抛出核心论点，收集真实反馈与辩题。</p>
    <p>2. <strong>微信公众号</strong>：把经受住考验的思考拓展为万字深度研报，沉淀为坚不可摧的行业信任基石。</p>
    <p>3. <strong>小红书</strong>：提炼为极简设计卡片，实现高效视觉触达与公域泛传播破圈。</p>
  `;

  caseData['case-3'].article = `
    <h4>一、为什么创作者应该编写属于自己的轻量脚本？</h4>
    <p>市面上有很多大而全的 SaaS 软件，但它们往往伴随着繁琐的注册、昂贵的订阅费以及无法定制的黑盒逻辑。事实上，几行几十行的 Python 或 Shell 脚本，往往就能完美消除日常最大的卡点。</p>
    <div class="article-callout">
      <strong>极简工程主义：</strong>最可靠的代码是行数最少的代码。零多余依赖，在本地命令行或快捷键中一键触发。
    </div>
    <h4>二、开源与持续复利</h4>
    <p>经过实战打磨的自动化工具，会逐步在 GitHub 仓库开源发布。通过开源共享，工具能够接受各方同行的实测检验，并在反馈中不断优化进化。</p>
  `;

  // Reader View Mode Tabs
  const tabBtnTopo = document.getElementById('tab-btn-topo');
  const tabBtnArticle = document.getElementById('tab-btn-article');
  const panelTopo = document.getElementById('modal-panel-topo');
  const panelArticle = document.getElementById('modal-panel-article');
  const articleBody = document.getElementById('modal-article-body');

  if (tabBtnTopo && tabBtnArticle && panelTopo && panelArticle) {
    tabBtnTopo.addEventListener('click', () => {
      tabBtnTopo.classList.add('active');
      tabBtnArticle.classList.remove('active');
      panelTopo.classList.remove('hidden');
      panelArticle.classList.add('hidden');
    });

    tabBtnArticle.addEventListener('click', () => {
      tabBtnArticle.classList.add('active');
      tabBtnTopo.classList.remove('active');
      panelArticle.classList.remove('hidden');
      panelTopo.classList.add('hidden');
    });
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const caseId = btn.getAttribute('data-case');
      const data = caseData[caseId];
      if (!data) return;

      if (modalCategory) modalCategory.textContent = data.category;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSummary) modalSummary.textContent = data.summary;

      // Reset to topology tab default
      if (tabBtnTopo && tabBtnArticle && panelTopo && panelArticle) {
        tabBtnTopo.classList.add('active');
        tabBtnArticle.classList.remove('active');
        panelTopo.classList.remove('hidden');
        panelArticle.classList.add('hidden');
      }

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

      if (articleBody && data.article) {
        articleBody.innerHTML = data.article;
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* --------------------------------------------------------------------------
   15. Number Count-up Ticker Animation (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initCountUp() {
  const statsRibbon = document.getElementById('stats-ribbon');
  if (!statsRibbon) return;

  const statNums = statsRibbon.querySelectorAll('.stat-num[data-count-target]');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        obs.unobserve(entry.target);

        statNums.forEach(el => {
          const target = parseInt(el.getAttribute('data-count-target'), 10);
          const prefix = el.getAttribute('data-count-prefix') || '';
          const suffix = el.getAttribute('data-count-suffix') || '';
          const duration = 1400; // ms
          const startTime = performance.now();

          function updateNumber(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            el.textContent = `${prefix}${current}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              el.textContent = `${prefix}${target}${suffix}`;
            }
          }

          requestAnimationFrame(updateNumber);
        });
      }
    });
  }, {
    threshold: 0.25
  });

  observer.observe(statsRibbon);
}

/* --------------------------------------------------------------------------
   16. GitHub Live Status Auto Fetcher
   -------------------------------------------------------------------------- */
function initGithubLiveStatus() {
  const commitStatusEl = document.getElementById('github-commit-status');
  const liveBadgeEl = document.getElementById('github-live-badge');
  if (!commitStatusEl) return;

  // Try fetching latest public commit info from GitHub API
  fetch('https://api.github.com/repos/wkn001/website/commits?per_page=1')
    .then(res => {
      if (!res.ok) throw new Error('API limit or not found');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const commitDate = new Date(data[0].commit.committer.date);
        const now = new Date();
        const diffHours = Math.floor((now - commitDate) / (1000 * 60 * 60));
        
        let timeText = '刚刚推送';
        if (diffHours >= 24) {
          const diffDays = Math.floor(diffHours / 24);
          timeText = `${diffDays} 天前更新`;
        } else if (diffHours > 0) {
          timeText = `${diffHours} 小时前更新`;
        } else {
          timeText = '刚刚活跃提交';
        }

        commitStatusEl.textContent = `最新提交: ${timeText}`;
        if (liveBadgeEl) liveBadgeEl.textContent = '实时同步中';
      } else {
        commitStatusEl.textContent = '仓库代码活跃就绪';
      }
    })
    .catch(() => {
      // Graceful fallback without errors
      commitStatusEl.textContent = '代码持续维护更新中';
    });
}

/* --------------------------------------------------------------------------
   17. Interactive Workflow ROI Calculator
   -------------------------------------------------------------------------- */
function initCalculator() {
  const piecesSlider = document.getElementById('calc-pieces-slider');
  const timeSlider = document.getElementById('calc-time-slider');
  const piecesDisplay = document.getElementById('calc-pieces-display');
  const timeDisplay = document.getElementById('calc-time-display');
  const savedHoursEl = document.getElementById('calc-saved-hours');
  const daysTextEl = document.getElementById('calc-days-text');
  const applyBtn = document.getElementById('calc-apply-cta');

  if (!piecesSlider || !timeSlider) return;

  function recalculate() {
    const pieces = parseInt(piecesSlider.value, 10);
    const time = parseInt(timeSlider.value, 10);

    if (piecesDisplay) piecesDisplay.textContent = `${pieces} 篇 / 周`;
    if (timeDisplay) timeDisplay.textContent = `${time} 分钟 / 篇`;

    // 75% mechanical reduction formula: pieces * time * 0.75 * 52 / 60
    const annualHours = Math.round((pieces * time * 0.75 * 52) / 60);
    const annualDays = (annualHours / 8).toFixed(1);

    if (savedHoursEl) savedHoursEl.textContent = annualHours;
    if (daysTextEl) {
      daysTextEl.innerHTML = `相当于每年凭空多出 <strong>${annualDays} 个完整工作日</strong>`;
    }
  }

  [piecesSlider, timeSlider].forEach(slider => {
    slider.addEventListener('input', () => {
      recalculate();
      if (typeof playTick === 'function') playTick(680, 0.008);
    });
  });

  recalculate();

  // CTA button auto-fill to contact form
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const pieces = piecesSlider.value;
      const time = timeSlider.value;
      const annualHours = Math.round((pieces * time * 0.75 * 52) / 60);

      const contactSection = document.getElementById('contact');
      const messageInput = document.getElementById('sender-message');

      if (messageInput) {
        messageInput.value = `你好！我对每周产出约 ${pieces} 篇、年预计省时约 ${annualHours} 小时的自动化工作流方案很感兴趣，希望与威特流开展合作与工具流交流。`;
        // Trigger auto-save
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (messageInput) messageInput.focus();
        }, 600);
      }

      showToast('已为你自动带入计算方案并定位至留言区！');
    });
  }
}

/* --------------------------------------------------------------------------
   18. Command Palette (Raycast / Linear style Ctrl+K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const paletteModal = document.getElementById('cmd-palette-modal');
  const triggerBtn = document.getElementById('cmd-palette-btn');
  const searchInput = document.getElementById('cmd-palette-input');
  const items = document.querySelectorAll('#cmd-results .cmd-item');

  if (!paletteModal) return;

  function openPalette() {
    paletteModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    filterItems('');
    if (typeof playTick === 'function') playTick(700, 0.02);
  }

  function closePalette() {
    paletteModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openPalette);
  }

  // Global shortcut Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteModal.classList.contains('hidden')) {
        openPalette();
      } else {
        closePalette();
      }
    }
  });

  // Filter items in real time
  function filterItems(query) {
    const q = query.trim().toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.classList.remove('hidden-by-filter');
      } else {
        item.classList.add('hidden-by-filter');
      }
    });

    // Select first visible
    const firstVisible = Array.from(items).find(el => !el.classList.contains('hidden-by-filter'));
    items.forEach(i => i.classList.remove('selected'));
    if (firstVisible) firstVisible.classList.add('selected');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterItems(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      const visibleItems = Array.from(items).filter(el => !el.classList.contains('hidden-by-filter'));
      if (!visibleItems.length) return;

      const currentIndex = visibleItems.findIndex(el => el.classList.contains('selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % visibleItems.length;
        visibleItems.forEach(i => i.classList.remove('selected'));
        visibleItems[nextIndex].classList.add('selected');
        visibleItems[nextIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        visibleItems.forEach(i => i.classList.remove('selected'));
        visibleItems[prevIndex].classList.add('selected');
        visibleItems[prevIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = visibleItems[currentIndex >= 0 ? currentIndex : 0];
        if (selected) executeAction(selected);
      }
    });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      executeAction(item);
    });
  });

  function executeAction(item) {
    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');

    closePalette();

    if (action === 'nav' && target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'open-poster') {
      const openPosterBtn = document.getElementById('open-poster-btn');
      if (openPosterBtn) openPosterBtn.click();
    } else if (action === 'toggle-theme') {
      const themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) themeBtn.click();
    } else if (action === 'toggle-sound') {
      const soundBtn = document.getElementById('sound-toggle');
      if (soundBtn) soundBtn.click();
    } else if (action === 'copy-email') {
      const copyBtn = document.getElementById('copy-email-btn');
      if (copyBtn) copyBtn.click();
    } else if (action === 'open-wechat') {
      const wechatModal = document.getElementById('wechat-modal');
      if (wechatModal) {
        wechatModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }
  }
}

/* --------------------------------------------------------------------------
   19. Top Reading Progress Bar
   -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   20. Interactive Hero Ambient Canvas (Particle & Grid Glow)
   -------------------------------------------------------------------------- */
function initInteractiveCanvas() {
  const canvas = document.getElementById('hero-ambient-canvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: -1000, y: -1000, active: false, targetRadius: 0, currentRadius: 0 };
  let isVisible = true;
  let animId = null;

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animId) {
      loop();
    }
  }, { threshold: 0.05 });
  observer.observe(heroSection);

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
    mouse.targetRadius = 140;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.targetRadius = 0;
  });

  const gridSpacing = 28;

  function loop() {
    if (!isVisible) {
      animId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    mouse.currentRadius += (mouse.targetRadius - mouse.currentRadius) * 0.12;

    if (mouse.currentRadius > 1) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      const startX = Math.max(0, Math.floor((mouse.x - mouse.currentRadius) / gridSpacing) * gridSpacing);
      const endX = Math.min(width, Math.ceil((mouse.x + mouse.currentRadius) / gridSpacing) * gridSpacing);
      const startY = Math.max(0, Math.floor((mouse.y - mouse.currentRadius) / gridSpacing) * gridSpacing);
      const endY = Math.min(height, Math.ceil((mouse.y + mouse.currentRadius) / gridSpacing) * gridSpacing);

      for (let x = startX; x <= endX; x += gridSpacing) {
        for (let y = startY; y <= endY; y += gridSpacing) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.currentRadius) {
            const intensity = 1 - (dist / mouse.currentRadius);
            const alpha = intensity * (isDark ? 0.75 : 0.45);
            const radius = 1.2 + intensity * 2.2;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark 
              ? `rgba(52, 211, 153, ${alpha})` 
              : `rgba(26, 56, 43, ${alpha})`;
            ctx.fill();

            if (dist < 70) {
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(x, y);
              ctx.strokeStyle = isDark
                ? `rgba(251, 191, 36, ${(1 - dist / 70) * 0.18})`
                : `rgba(198, 146, 72, ${(1 - dist / 70) * 0.15})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }
    }

    animId = requestAnimationFrame(loop);
  }

  loop();
}

/* --------------------------------------------------------------------------
   21. Interactive CLI Terminal Simulator (Pipeline Engine Demo)
   -------------------------------------------------------------------------- */
function initTerminalDemo() {
  const terminalScreen = document.getElementById('terminal-screen');
  const terminalOutput = document.getElementById('terminal-output');
  const activeCmdSpan = document.getElementById('term-active-cmd');
  const termButtons = document.querySelectorAll('.term-btn');
  if (!terminalScreen || !terminalOutput || !activeCmdSpan) return;

  let isTyping = false;

  const commands = {
    'build': {
      cmd: 'witflow build --all',
      logs: [
        { type: 'muted', text: '[00:00:01] ⚙ 正在载入单一母稿源: content/articles/2026-workflow.md' },
        { type: 'info', text: '[00:00:01] ✓ Markdown AST 解析完成: 2,840 字符, 4 个系统拓扑块, 3 张高清信息图' },
        { type: 'step', text: '[00:00:02] 📦 跨生态矩阵编译管线运行中:' },
        { type: 'bullet', text: '  → 微信公众号: 生成自适应排版 HTML 与代码着色高亮主题' },
        { type: 'bullet', text: '  → X / Twitter: 智能提炼 1 篇观点钩子 + 5 篇串联 Thread 视觉切片' },
        { type: 'bullet', text: '  → 小红书: 自动生成 6 张 3:4 比例高信噪比纯净视觉卡片' },
        { type: 'bullet', text: '  → 即刻 (Jike): 提取闪念思考短动态并附带官方站永久归档' },
        { type: 'success', text: '[00:00:02] ⚡ 构建成功！用时 348ms。4 大生态草稿已全部就绪。' }
      ]
    },
    'optimize': {
      cmd: 'witflow optimize --images',
      logs: [
        { type: 'muted', text: '[00:00:01] 🖼 扫描本地工作区媒体资源: 找到 18 张图片文件' },
        { type: 'info', text: '[00:00:01] ⚙ 转换为下一代现代格式 WebP / AVIF 并执行无损感知压缩...' },
        { type: 'success', text: '[00:00:02] ✓ 资源总体积骤降: 24.6MB → 2.8MB (空间节省 -88.6%)' },
        { type: 'step', text: '[00:00:02] ☁ 多区域 CDN 边缘节点已完成自动同步分发' },
        { type: 'success', text: '[00:00:02] 🚀 图床流水线优化完毕，耗时 482ms！' }
      ]
    },
    'status': {
      cmd: 'witflow status --pipeline',
      logs: [
        { type: 'info', text: '[00:00:01] 📊 witflow 内容流水线全生态健康度检查:' },
        { type: 'step', text: '  ● 单一母稿源 (Markdown Obsidian): ONLINE [实时监听]' },
        { type: 'step', text: '  ● 本地批处理引擎 (Python 3.12 / Node.js): READY [就绪]' },
        { type: 'step', text: '  ● 全局快捷触发 (Raycast Custom Extension): ACTIVE [活跃]' },
        { type: 'step', text: '  ● 云端自动化构建 (GitHub Actions CI/CD): GREEN [正常]' },
        { type: 'success', text: '  ● 6 大社媒矩阵分发端点: 100% 畅通可用 [零阻塞]' }
      ]
    }
  };

  function typeAndExecute(cmdKey) {
    if (isTyping) return;

    if (cmdKey === 'clear') {
      terminalOutput.innerHTML = '';
      activeCmdSpan.textContent = '';
      if (typeof playTick === 'function') playTick(750, 0.02);
      return;
    }

    const target = commands[cmdKey];
    if (!target) return;

    isTyping = true;
    activeCmdSpan.textContent = '';
    const cmdText = target.cmd;
    let charIdx = 0;

    const timer = setInterval(() => {
      activeCmdSpan.textContent += cmdText[charIdx];
      if (typeof playTick === 'function') playTick(620, 0.01);
      charIdx++;

      if (charIdx >= cmdText.length) {
        clearInterval(timer);
        setTimeout(() => {
          runLogs(cmdText, target.logs);
          activeCmdSpan.textContent = '';
          isTyping = false;
        }, 180);
      }
    }, 28);
  }

  function runLogs(cmdText, logs) {
    const promptLine = document.createElement('div');
    promptLine.className = 'term-log-line';
    promptLine.innerHTML = `<span class="term-prompt">witflow@macbook ~ %</span> <span style="color:#FFF;font-weight:600;">${cmdText}</span>`;
    terminalOutput.appendChild(promptLine);

    logs.forEach((log, index) => {
      setTimeout(() => {
        const logLine = document.createElement('div');
        logLine.className = `term-log-line term-log-${log.type}`;
        logLine.textContent = log.text;
        terminalOutput.appendChild(logLine);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
        if (typeof playTick === 'function') playTick(540 + index * 30, 0.012);
      }, (index + 1) * 75);
    });
  }

  termButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmdKey = btn.getAttribute('data-cmd');
      typeAndExecute(cmdKey);
    });
  });
}

/* --------------------------------------------------------------------------
   22. Shareable Canvas Poster Generator
   -------------------------------------------------------------------------- */
function initPosterGenerator() {
  const modal = document.getElementById('poster-modal');
  const triggerBtn = document.getElementById('open-poster-btn');
  const canvas = document.getElementById('poster-canvas');
  const copyBtn = document.getElementById('copy-poster-btn');
  const downloadBtn = document.getElementById('download-poster-btn');
  const quotePills = document.querySelectorAll('#quote-pills-list .quote-pill');

  if (!modal || !canvas) return;

  const quotes = [
    {
      theme: "01 流水线哲学",
      body: "把任何重复执行超过3次的机械动作，全部固化为工程流水线。人脑是用来思考与创造的，不是用来充当剪贴板与搬运工的。",
      tag: "内容工程主义"
    },
    {
      theme: "02 人脑不当搬运工",
      body: "系统的力量永远大于意志力。单兵作战的最高境界，不是比别人工作得更辛苦，而是拥有一套为你7×24小时流转的自动化闭环。",
      tag: "系统飞轮思维"
    },
    {
      theme: "03 系统大于意志力",
      body: "拒绝同质化的粗暴搬运。以 Markdown 为单一真理源，按平台心智量身剪裁，让深度长文与视觉卡片在全网形成互为共振的飞轮。",
      tag: "全网矩阵协同"
    }
  ];

  let currentQuoteIndex = 0;
  const logoImage = new Image();
  logoImage.src = 'assets/logo.png';

  function renderPoster() {
    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 750;
    canvas.width = width;
    canvas.height = height;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (isDark) {
      bgGrad.addColorStop(0, '#101412');
      bgGrad.addColorStop(0.5, '#0B0D0C');
      bgGrad.addColorStop(1, '#080A09');
    } else {
      bgGrad.addColorStop(0, '#FAF7F0');
      bgGrad.addColorStop(0.5, '#F4EFE6');
      bgGrad.addColorStop(1, '#EAE3D5');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle border
    ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.25)' : 'rgba(26, 56, 43, 0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Decorative inner corner marks
    ctx.strokeStyle = isDark ? '#34D399' : '#C69248';
    ctx.lineWidth = 3;
    const cornerSize = 14;
    ctx.beginPath(); ctx.moveTo(22, 22 + cornerSize); ctx.lineTo(22, 22); ctx.lineTo(22 + cornerSize, 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - 22 - cornerSize, 22); ctx.lineTo(width - 22, 22); ctx.lineTo(width - 22, 22 + cornerSize); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22, height - 22 - cornerSize); ctx.lineTo(22, height - 22); ctx.lineTo(22 + cornerSize, height - 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - 22 - cornerSize, height - 22); ctx.lineTo(width - 22, height - 22); ctx.lineTo(width - 22, height - 22 - cornerSize); ctx.stroke();

    // 2. Header Brand Mark
    if (logoImage.complete && logoImage.naturalWidth > 0) {
      ctx.drawImage(logoImage, 42, 46, 42, 42);
    } else {
      ctx.fillStyle = isDark ? '#34D399' : '#1A382B';
      ctx.beginPath();
      ctx.arc(63, 67, 21, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = isDark ? '#F4F6F5' : '#1A1918';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('witflow 威特流', 98, 65);

    ctx.fillStyle = isDark ? '#9CA3AF' : '#6B6864';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Wit in, Flow out. · 内容流水线工程实践', 98, 85);

    // Header Divider Line
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(42, 110);
    ctx.lineTo(width - 42, 110);
    ctx.stroke();

    // 3. Category Tag Badge
    const quote = quotes[currentQuoteIndex];
    ctx.fillStyle = isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(26, 56, 43, 0.08)';
    ctx.beginPath();
    ctx.roundRect(42, 140, 120, 28, 14);
    ctx.fill();

    ctx.fillStyle = isDark ? '#34D399' : '#1A382B';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`● ${quote.tag}`, 54, 158);

    // 4. Large Quotation Mark
    ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.15)' : 'rgba(198, 146, 72, 0.18)';
    ctx.font = 'bold 88px serif';
    ctx.fillText('“', 40, 240);

    // 5. Quote Body Text with automatic wrapping
    ctx.fillStyle = isDark ? '#FFFFFF' : '#1A1918';
    ctx.font = 'bold 23px "Noto Serif SC", serif';
    const maxWidth = width - 88;
    const lineHeight = 42;
    const words = quote.body;
    let line = '';
    let y = 260;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 44, y);
        line = words[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 44, y);

    // 6. Signature
    y += 50;
    ctx.fillStyle = isDark ? '#FBBF24' : '#C69248';
    ctx.font = 'italic bold 15px sans-serif';
    ctx.fillText('—— 摘自《witflow 威特流 · 自动化创作者手记》', 44, y);

    // 7. Footer metadata bar
    const footerY = height - 60;
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.moveTo(42, footerY - 20);
    ctx.lineTo(width - 42, footerY - 20);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#6B7280' : '#99958F';
    ctx.font = '12px "Plus Jakarta Sans", monospace';
    ctx.fillText('2026.09 · GITHUB: wkn001/website', 44, footerY + 5);

    ctx.fillStyle = isDark ? '#34D399' : '#1A382B';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('witflow.com · 全网矩阵', width - 180, footerY + 5);
  }

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderPoster();
    if (typeof playTick === 'function') playTick(680, 0.02);
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openModal);
  }

  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  quotePills.forEach(pill => {
    pill.addEventListener('click', () => {
      quotePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentQuoteIndex = parseInt(pill.getAttribute('data-quote'), 10) || 0;
      renderPoster();
      if (typeof playTick === 'function') playTick(720, 0.015);
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        canvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            showToast('海报图片已复制到剪贴板！可直接粘贴至微信或小红书 🖼️');
          } else {
            downloadPoster();
            showToast('已为你自动下载海报图片至本地！');
          }
        });
      } catch (err) {
        downloadPoster();
        showToast('已为你自动下载海报图片至本地！');
      }
    });
  }

  function downloadPoster() {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `witflow-quote-poster-${currentQuoteIndex + 1}.png`;
    link.href = dataUrl;
    link.click();
    showToast('海报高清 PNG 图片已成功保存至本地！');
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadPoster);
  }
}

/* --------------------------------------------------------------------------
   23. Markdown Case Exporter (Obsidian / Notion Ready)
   -------------------------------------------------------------------------- */
function initMarkdownExporter() {
  const copyMdBtn = document.getElementById('modal-copy-md-btn');
  if (!copyMdBtn) return;

  copyMdBtn.addEventListener('click', () => {
    const modalTitle = document.getElementById('modal-title')?.textContent || '案例母稿';
    const modalCategory = document.getElementById('modal-category')?.textContent || '效率工作流';
    const modalSummary = document.getElementById('modal-summary')?.textContent || '';
    const topologySteps = document.querySelectorAll('#modal-topology .topology-step');
    const takeaways = document.querySelectorAll('#modal-takeaways li');
    const articleContent = document.getElementById('modal-article-body')?.innerText || '';

    let md = `---
title: "${modalTitle}"
category: "${modalCategory}"
date: 2026-09
author: "witflow 威特流"
tags: ["内容工程", "自动化工作流", "自媒体矩阵"]
---

# ${modalTitle}

> 摘要：${modalSummary}
> 归档：[witflow 威特流官方主页](https://wkn001.github.io/website/)

---

## 🧩 系统流转拓扑（System Pipeline）

`;

    topologySteps.forEach((step, idx) => {
      const name = step.querySelector('.step-name')?.textContent || `Step ${idx + 1}`;
      const desc = step.querySelector('.step-desc')?.textContent || '';
      md += `${idx + 1}. **${name}**：${desc}\n`;
    });

    md += `\n## 💡 核心实操沉淀与复用经验\n\n`;
    takeaways.forEach(item => {
      md += `- ${item.textContent}\n`;
    });

    if (articleContent) {
      md += `\n## 📖 深度长文研读母稿\n\n${articleContent}\n`;
    }

    copyText(md, `已复制《${modalTitle.substring(0, 16)}...》完整 Markdown 母稿！可直接粘贴至 Obsidian / Notion。`);
  });
}

/* --------------------------------------------------------------------------
   24. PWA Service Worker Registration
   -------------------------------------------------------------------------- */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}



