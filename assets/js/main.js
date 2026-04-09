/* Extracted from index.html inline scripts */

/* toggleDrop — global (used by inline onclick in sidebar) */
function toggleDrop(btn) {
  var body = btn && btn.nextElementSibling;
  if (!body) return;
  var isOpen = body.classList.contains('open');

  // Close all other open dropdowns instantly (no transition) so the layout
  // settles immediately — this prevents the sidebar from jumping mid-scroll
  document.querySelectorAll('.snav-dropdown.open').forEach(function(el) {
    if (el !== body) {
      el.style.transition = 'none';
      el.classList.remove('open');
      var prev = el.previousElementSibling;
      if (prev) prev.classList.remove('open');
      // Re-enable transition on next frame so future opens animate normally
      requestAnimationFrame(function() { el.style.transition = ''; });
    }
  });

  body.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);

  // When opening: now that the layout is stable, smoothly centre the button
  if (!isOpen) {
    var sidebarEl = document.querySelector('.gm-sidebar');
    if (sidebarEl && btn) {
      var btnRect = btn.getBoundingClientRect();
      var navRect = sidebarEl.getBoundingClientRect();
      var targetTop = sidebarEl.scrollTop + (btnRect.top - navRect.top) - (sidebarEl.clientHeight / 2) + (btn.offsetHeight / 2);
      sidebarEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    }
  }
}

/* toggleRoleDrop — for nested role sub-dropdowns inside User Roles */
function toggleRoleDrop(btn) {
  var body = btn && btn.nextElementSibling;
  if (!body) return;
  var isOpen = body.classList.contains('open');
  // Close other sibling sub-dropdowns only (not the parent)
  var parentDrop = btn.closest('.snav-dropdown');
  if (parentDrop) {
    parentDrop.querySelectorAll('.snav-sub-dropdown.open').forEach(function(el) {
      if (el !== body) {
        el.classList.remove('open');
        var prev = el.previousElementSibling;
        if (prev) prev.classList.remove('open');
      }
    });
  }
  body.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

(function () {
  'use strict';

  // NOTE: scroll offset is computed dynamically in getNavOffset()

  function initWizard() {
    var firstSlide = document.getElementById('wslide-0');
    if (!firstSlide) return;

    var TOTAL = 15;
    var current = 0;
    // Flag: suppress scrollIntoView during the initial render on page load
    var _wizardInitializing = true;

    function renderDots(activeIdx) {
      for (var i = 0; i < TOTAL; i++) {
        var el = document.getElementById('wdots-' + i);
        if (!el) continue;
        el.innerHTML = '';
        for (var d = 0; d < TOTAL; d++) {
          var s = document.createElement('span');
          if (d === activeIdx) s.classList.add('active');
          (function (idx, dot) {
            dot.addEventListener('click', function () {
              window.wizardGoTo(idx);
            });
          })(d, s);
          el.appendChild(s);
        }
      }
    }

    window.wizardGoTo = function (idx) {
      if (idx < 0 || idx >= TOTAL) return;
      // Hide all slides
      document.querySelectorAll('.wizard-slide').forEach(function (s) {
        s.classList.remove('active');
      });
      // Update stepper: mark completed/active
      var steps = document.querySelectorAll('.wstep');
      steps.forEach(function (step, i) {
        step.classList.remove('active', 'completed');
        if (i < idx) step.classList.add('completed');
        else if (i === idx) step.classList.add('active');
      });
      // Show target slide
      var slide = document.getElementById('wslide-' + idx);
      if (slide) slide.classList.add('active');
      current = idx;
      renderDots(idx);
      // Scroll active step into view in stepper — but NOT during initial page load
      if (!_wizardInitializing && steps[idx]) {
        steps[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    };

    renderDots(0);
    window.wizardGoTo(current);
    // Allow scrollIntoView for user-triggered navigation after init completes
    _wizardInitializing = false;
  }

  function initUI() {
    function getNavOffset() {
      var nav = document.getElementById('gm-navbar');
      var h = nav ? nav.offsetHeight : 60;
      // Extra breathing room so section titles aren't tight to the navbar
      return h + 20;
    }

    /* Progress bar */
    var pgbar = document.getElementById('progress-bar');
    function updateProgress() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (pgbar) pgbar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
    }

    /* Navbar scroll */
    var navbar = document.getElementById('gm-navbar');
    window.addEventListener(
      'scroll',
      function () {
        updateProgress();
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
        var btt = document.getElementById('back-to-top');
        if (btt) btt.classList.toggle('visible', window.scrollY > 300);
        // Throttle scroll spy — fires max once per 150ms to prevent sidebar jumping
        if (!_spyThrottle) {
          _spyThrottle = setTimeout(function () {
            _spyThrottle = null;
            updateScrollSpy();
          }, 150);
        }
      },
      { passive: true }
    );
    updateProgress();

    /* Back to top */
    var btt = document.getElementById('back-to-top');
    if (btt) btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* Mobile sidebar */
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('mob-overlay');
    var mobBtn = document.getElementById('mob-toggle');
    function openSidebar() { if (sidebar) sidebar.classList.add('open'); if (overlay) overlay.classList.add('show'); }
    function closeSidebar() { if (sidebar) sidebar.classList.remove('open'); if (overlay) overlay.classList.remove('show'); }
    if (mobBtn) mobBtn.addEventListener('click', function () { sidebar && sidebar.classList.contains('open') ? closeSidebar() : openSidebar(); });
    if (overlay) overlay.addEventListener('click', closeSidebar);
    window.addEventListener('resize', function () {
      // Prevent sidebar/overlay from getting stuck when switching breakpoints
      if (window.innerWidth > 992) closeSidebar();
    }, { passive: true });

    /* Smooth scroll */
    var _scrolling = false;      // true while page is animating to a target
    var _scrollTimer = null;     // timeout to release _scrolling flag
    var _lastScrollY = window.scrollY; // track last known scrollY to detect scroll-end

    // Detect when page scroll truly stops using requestAnimationFrame
    // and only then release the _scrolling flag
    function waitForScrollEnd(callback) {
      var lastY = window.scrollY;
      var stableCount = 0;
      function check() {
        var y = window.scrollY;
        if (y === lastY) {
          stableCount++;
          if (stableCount >= 3) { callback(); return; } // stable for 3 frames = done
        } else {
          stableCount = 0;
          lastY = y;
        }
        requestAnimationFrame(check);
      }
      requestAnimationFrame(check);
    }

    // Smoothly scroll the sidebar so the target link is centred in the sidebar viewport
    function scrollSidebarToLink(linkEl) {
      var sidebarEl = document.querySelector('.gm-sidebar');
      if (!sidebarEl || !linkEl) return;
      var lRect = linkEl.getBoundingClientRect();
      var nRect = sidebarEl.getBoundingClientRect();
      var targetTop = sidebarEl.scrollTop + lRect.top - nRect.top - sidebarEl.clientHeight / 2 + linkEl.offsetHeight / 2;
      sidebarEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    }

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var id = href.slice(1);
      var el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        var navOffset = getNavOffset();

        // If navigating to SetupWizard, reset wizard to step 0 first
        if (id === 'SetupWizard' && window.wizardGoTo) {
          window.wizardGoTo(0);
        }

        // Lock: suppress scroll-spy sidebar scrolling until page scroll finishes
        _scrolling = true;
        clearTimeout(_scrollTimer);
        // Safety fallback — release after 2.5s even if rAF never fires
        _scrollTimer = setTimeout(function () { _scrolling = false; }, 2500);

        // Calculate scroll target
        var top = 0; var node = el;
        while (node && node !== document.body) { top += node.offsetTop; node = node.offsetParent; }
        top = Math.max(0, top - navOffset);

        // Scroll the page
        window.scrollTo({ top: top, behavior: 'smooth' });

        // Only scroll the sidebar when the clicked link is inside the sidebar itself
        // (not for header nav buttons — those must never move the sidebar)
        var sidebarEl = document.querySelector('.gm-sidebar');
        if (sidebarEl && sidebarEl.contains(a)) {
          scrollSidebarToLink(a);
        }

        // Once page scroll fully stops → release lock and do one final sidebar sync
        waitForScrollEnd(function () {
          clearTimeout(_scrollTimer);
          _scrolling = false;
          // Find the now-active link and sync sidebar to it
          updateScrollSpy();
        });

        if (window.innerWidth <= 992) closeSidebar();
        var dropBody = a.closest('.snav-dropdown');
        if (dropBody && !dropBody.classList.contains('open')) {
          var toggle = dropBody.previousElementSibling;
          if (toggle) toggleDrop(toggle);
        }
        var subDropBody = a.closest('.snav-sub-dropdown');
        if (subDropBody && !subDropBody.classList.contains('open')) {
          var subToggle = subDropBody.previousElementSibling;
          if (subToggle) toggleRoleDrop(subToggle);
        }
      }
    });

    /* Scroll Spy — throttled, fires max once per 150ms */
    var navLinks = [];
    var spySections = [];
    document.querySelectorAll('.gm-sidebar a[href^="#"], .snav-dropdown a[href^="#"], .snav-sub-dropdown a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) { navLinks.push(a); spySections.push({ el: el, link: a }); }
    });

    var _spyThrottle = null;

    function updateScrollSpy() {
      var scrollY = window.scrollY + getNavOffset() + 10;
      var current = null;
      var ordered = spySections
        .map(function (s) {
          return { el: s.el, link: s.link, top: s.el.getBoundingClientRect().top + window.pageYOffset };
        })
        .sort(function (a, b) { return a.top - b.top; });

      for (var i = 0; i < ordered.length; i++) {
        var elTop = ordered[i].top;
        var nextTop = i + 1 < ordered.length ? ordered[i + 1].top : Infinity;
        if (elTop <= scrollY && scrollY < nextTop) {
          current = ordered[i];
          break;
        }
      }
      if (!current && ordered.length) {
        if (scrollY < ordered[0].top) current = null;
        else current = ordered[ordered.length - 1];
      }

      navLinks.forEach(function (l) { l.classList.remove('active'); });
      if (!current) return;
    current.link.classList.add('active');

      // Auto-open parent dropdown if active link is inside one
      if (!_scrolling) {
        var parentDrop = current.link.closest('.snav-dropdown');
        if (parentDrop && !parentDrop.classList.contains('open')) {
          var dropBtn = parentDrop.previousElementSibling;
          if (dropBtn) toggleDrop(dropBtn);
        }
        var parentSubDrop = current.link.closest('.snav-sub-dropdown');
        if (parentSubDrop && !parentSubDrop.classList.contains('open')) {
          var subBtn = parentSubDrop.previousElementSibling;
          if (subBtn) toggleRoleDrop(subBtn);
        }
        scrollSidebarToLink(current.link);
      }
    }

    var sidebarNav = document.querySelector('.gm-sidebar');
    if (sidebarNav) {
      sidebarNav.addEventListener('scroll', function () {
        sidebarNav._userScrolling = true;
        clearTimeout(sidebarNav._scrollTimer);
        sidebarNav._scrollTimer = setTimeout(function () { sidebarNav._userScrolling = false; }, 600);
      }, { passive: true });
    }
    updateScrollSpy();

    /* Sidebar search */
    var searchInput = document.getElementById('searchDocs');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var q = this.value.toLowerCase().trim();
        var groups = document.querySelectorAll('.snav-group');
        groups.forEach(function (grp) {
          var links = grp.querySelectorAll('a');
          var anyVisible = false;
          links.forEach(function (a) {
            var match = !q || a.textContent.toLowerCase().includes(q);
            a.style.display = match ? '' : 'none';
            if (match) anyVisible = true;
            // If a match lives inside a dropdown, open it so user can see it
            if (q && match) {
              var dd = a.closest('.snav-dropdown');
              if (dd && !dd.classList.contains('open')) {
                var btn = dd.previousElementSibling;
                if (btn && btn.classList.contains('snav-dropdown-btn')) toggleDrop(btn);
              }
              var subdd = a.closest('.snav-sub-dropdown');
              if (subdd && !subdd.classList.contains('open')) {
                var subbtn = subdd.previousElementSibling;
                if (subbtn && subbtn.classList.contains('snav-role-btn')) toggleRoleDrop(subbtn);
              }
            }
          });
          grp.style.display = anyVisible ? '' : 'none';
        });
      });
    }

    /* Stat counter */
    var counted = false;
    function animateCounters() {
      if (counted) return;
      var nums = document.querySelectorAll('[data-count]');
      if (!nums.length) return;
      var hero = document.querySelector('.gm-hero');
      if (hero && hero.getBoundingClientRect().top > window.innerHeight) return;
      counted = true;
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'));
        var current = 0;
        var step = Math.ceil(target / 40);
        var timer = setInterval(function () {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = current;
        }, 30);
      });
    }
    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    /* Lightbox */
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lb-img');
    var lbClose = document.getElementById('lb-close');
    document.addEventListener('click', function (e) {
      var img = e.target.closest('.gm-content img, .content-area img');
      if (img && lb && lbImg && !e.target.closest('#lightbox')) {
        lbImg.src = img.src;
        lb.classList.add('open');
      }
    });
    if (lbClose) lbClose.addEventListener('click', function () { lb && lb.classList.remove('open'); });
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb) lb.classList.remove('open'); });

    /* FAQ toggles */
    document.addEventListener('click', function (e) {
      var head = e.target.closest('.faq-header');
      if (!head) return;
      var body = head.nextElementSibling;
      if (!body) return;
      var isOpen = body.classList.contains('open');
      body.classList.toggle('open', !isOpen);
      head.classList.toggle('open', !isOpen);
    });

    /* Custom accordion (c-acc) toggles */
    document.addEventListener('click', function (e) {
      var head = e.target.closest('.c-acc-head');
      if (!head) return;
      var acc = head.closest('.c-acc');
      if (!acc) return;
      var isOpen = acc.classList.contains('open');
      acc.classList.toggle('open', !isOpen);
    });

    /* Copy code buttons */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.copy-btn-code');
      if (!btn) return;
      var wrap = btn.closest('.code-block-wrap');
      var pre = wrap ? wrap.querySelector('pre') : null;
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent).then(function () {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = orig; }, 1800);
      }).catch(function () { });
    });

    /* Copy buttons inside .copy-wrap blocks */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.copy-btn');
      if (!btn) return;
      var wrap = btn.closest('.copy-wrap');
      var pre = wrap ? wrap.querySelector('pre') : null;
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent).then(function () {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = orig; }, 1800);
      }).catch(function () { });
    });

    /* Navbar active links */
    document.querySelectorAll('.gm-nav-links a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        document.querySelectorAll('.gm-nav-links a').forEach(function (l) { l.classList.remove('active'); });
        this.classList.add('active');
      });
    });

    /* Auto image captions (title + description) */
   
  
  }

  function init() {
    initWizard();
    initUI();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

