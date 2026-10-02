const menuButton = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
}

menuButton.addEventListener('click', () => {
  const willOpen = mobileNav.hidden;
  mobileNav.hidden = !willOpen;
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? '关闭导航菜单' : '打开导航菜单');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

// All three cases are illustrative text written for this page, not customer records.
const cases = [
  {
    input: '“Target price is $85/unit, or we go to supplier B.”',
    check: '确认目标价、数量、规格和另一供应商报价是否有可比依据。',
    action: '列出可调整的交期、批量和付款条件，核实内部可行性后再回信。'
  },
  {
    input: '“Attached is a 40-page specification. Please confirm all clauses by Friday.”',
    check: '先提取技术参数、测试要求、交货和违约条款；标记无法直接确认的项目。',
    action: '整理澄清清单，交由技术和商务负责人核对后再做正式承诺。'
  },
  {
    input: '“Our standard is Net 120. Otherwise we cannot proceed.”',
    check: '核查买方信用、付款起算点、信保条件和企业现金流承受能力。',
    action: '先请财务和风控评估，再讨论预付款、信用工具或费用分担等选项。'
  }
];
const tabs = [...document.querySelectorAll('.demo-tab')];
const panel = document.getElementById('case-panel');

function showCase(index, focus = false) {
  const entry = cases[index];
  document.getElementById('case-input').textContent = entry.input;
  document.getElementById('case-check').textContent = entry.check;
  document.getElementById('case-action').textContent = entry.action;
  tabs.forEach((tab, tabIndex) => {
    tab.setAttribute('aria-selected', String(tabIndex === index));
    tab.tabIndex = tabIndex === index ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[index].id);
  if (focus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showCase(index));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    showCase(next, true);
  });
});

const modal = document.getElementById('wechat-modal');
const modalClose = modal.querySelector('.modal-close');
let previousFocus = null;

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  document.getElementById('copy-status').textContent = '';
  if (previousFocus) previousFocus.focus();
}

document.querySelectorAll('.qr-trigger').forEach(button => button.addEventListener('click', () => {
  previousFocus = button;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalClose.focus();
}));
modal.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!modal.hidden) closeModal();
    else if (!mobileNav.hidden) closeMenu();
  }
  if (event.key !== 'Tab' || modal.hidden) return;
  const focusables = [...modal.querySelectorAll('button')];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

document.getElementById('copy-wechat').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('wit_flow');
    status.textContent = '微信号已复制';
  } catch {
    status.textContent = '复制失败，请手动复制：wit_flow';
  }
});
