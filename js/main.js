/* =========================================================
   CREA MEDICAL - Main Script
   ========================================================= */

(function(){
  'use strict';

  // ====== 1. Current year ======
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // ====== 2. Header scroll behavior ======
  var header = document.getElementById('header');
  var lastY = 0;
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(y > 40){
      header.classList.add('is-scrolled');
      header.style.boxShadow = '0 4px 20px rgba(11,61,145,.06)';
    } else {
      header.classList.remove('is-scrolled');
      header.style.boxShadow = 'none';
    }
    lastY = y;
  }, { passive: true });

  // ====== 3. Mobile navigation toggle ======
  var navToggle = document.getElementById('navToggle');
  var gnav = document.querySelector('.gnav');
  if(navToggle && gnav){
    navToggle.addEventListener('click', function(){
      gnav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
    // Close on link click
    gnav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        gnav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // ====== 4. Smooth scroll with header offset ======
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(href.length < 2) return;
      var target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 70;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ====== 5. Scroll reveal animation ======
  var revealEls = document.querySelectorAll(
    '.section-head, .vision__grid, .service-card, .synergy, ' +
    '.partners__group, .company__table, .access__grid, .contact__phone, .contact__form'
  );
  revealEls.forEach(function(el){ el.classList.add('reveal'); });

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // ====== 6. Contact form submit (demo) ======
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // Basic HTML5 validation
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      // ※ 実運用時はサーバーまたはフォーム送信サービスへPOSTしてください
      // 例: fetch('/api/contact', { method:'POST', body: new FormData(form) })
      success.hidden = false;
      form.style.opacity = '.5';
      form.style.pointerEvents = 'none';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ====== 7. Trust bar - marquee effect on hover pause ======
  // (現状はシンプル表示。アニメーション化したい場合はCSSのkeyframesを追加)

})();
