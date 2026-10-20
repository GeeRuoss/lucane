const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
const setInert=value=>{document.querySelector('main').inert=value;document.querySelector('footer').inert=value;const walker=document.querySelector('.lucane-walker');if(walker)walker.inert=value;};
const closeMenu=()=>{setInert(false);mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');};
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;setInert(open);menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)mobileNav.querySelector('a').focus();});
mobileNav?.addEventListener('click',e=>{const link=e.target.closest('a');if(link){closeMenu();const dest=new URL(link.href);if(dest.pathname===location.pathname&&dest.hash){const target=document.querySelector(dest.hash);if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!mobileNav.hidden){closeMenu();menuButton.focus();}hideBubble();}if(e.key==='Tab'&&!mobileNav.hidden){const links=[menuButton,...mobileNav.querySelectorAll('a')];const first=links[0],last=links.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
matchMedia('(min-width:768px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const bubble=document.querySelector('.contact-bubble');function hideBubble(){if(bubble)bubble.hidden=true;try{sessionStorage.setItem('lucane-contact-seen','1');}catch{}}
bubble?.querySelector('button').addEventListener('click',hideBubble);let shown=false;try{shown=sessionStorage.getItem('lucane-contact-seen')==='1';}catch{}
const offerContact=()=>{if(shown||!bubble)return;if(document.hidden||document.body.classList.contains('menu-open')||document.body.classList.contains('field-active')){setTimeout(offerContact,2500);return;}bubble.hidden=false;shown=true;try{sessionStorage.setItem('lucane-contact-seen','1');}catch{}};setTimeout(offerContact,5000);
document.addEventListener('focusin',e=>{document.body.classList.toggle('field-active',e.target.matches('input,textarea,select'));});document.addEventListener('focusout',()=>{setTimeout(()=>document.body.classList.toggle('field-active',document.activeElement?.matches('input,textarea,select')),0);});

const opening=document.querySelector('.orbital-hero');if(opening)new IntersectionObserver(([entry])=>document.body.classList.toggle('hero-visible',entry.isIntersecting)).observe(opening);

const beetleButton=document.querySelector('.lucane-beetle');
beetleButton?.addEventListener('click',()=>beetleButton.setAttribute('aria-expanded',String(beetleButton.getAttribute('aria-expanded')!=='true')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')beetleButton?.setAttribute('aria-expanded','false');});
document.addEventListener('click',e=>{if(!e.target.closest('.lucane-walker'))beetleButton?.setAttribute('aria-expanded','false');});
