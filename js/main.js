(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * Data — one card per manufacturer/partner company, grouped from the
   * product source material (public/product-source/). `href` is kept as
   * null on purpose: there are no detail pages yet, but the field lets a
   * future page be wired in without touching the render logic.
   * ------------------------------------------------------------------ */
  var productPartners = [
    {
      id: "woosam-medical",
      company: "우삼의료기(주)",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/woosam.webp",
      imageFit: "contain",
      products: ["GIPS123", "NEW YOGIPS", "POCKET YOGIPS"],
      href: null
    },
    {
      id: "miraemedical",
      company: "미래메디칼",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/miraemedical.webp",
      imageFit: "cover",
      products: ["GIPSHOE Splint"],
      href: null
    },
    {
      id: "emtech",
      company: "이엠텍",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/qplint.webp",
      imageFit: "contain",
      products: ["Qplint"],
      href: null
    },
    {
      id: "drfrog",
      company: "Dr.FROG",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/drfrog.webp",
      imageFit: "contain",
      products: ["Dr.FROG 손가락 보조기"],
      href: null
    },
    {
      id: "rtbio",
      company: "알티바이오",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/rtbio.webp",
      imageFit: "cover",
      products: ["RESPLINT", "RESPLINT CYLINDER", "RECOTAP PLUS", "RT NEO"],
      href: null
    },
    {
      id: "baros-medical",
      company: "바로스메디칼",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/barosmedical.webp",
      imageFit: "contain",
      products: ["BAROWELLFIT"],
      href: null
    },
    {
      id: "donghae-medical",
      company: "동해메디칼(주)",
      category: "MEDICAL DEVICE PARTNER",
      image: "images/products/donghae-medical.webp",
      imageFit: "contain",
      products: ["TONG CAST"],
      href: null
    },
    {
      id: "litepharmtech",
      company: "(주)라이트팜텍",
      category: "PHARMACEUTICAL PARTNER",
      image: "images/products/litepharmtech.webp",
      imageFit: "cover",
      products: ["카틸란(Cartilan)"],
      href: null
    },
    {
      id: "pharmaresearch",
      company: "파마리서치",
      category: "PHARMACEUTICAL PARTNER",
      image: "images/products/pharmaresearch.webp",
      imageFit: "cover",
      products: ["콘쥬란(Conjuran)"],
      href: null
    },
    {
      id: "dongkook-pharm",
      company: "동국제약",
      category: "PHARMACEUTICAL PARTNER",
      image: "images/products/dongkook.webp",
      imageFit: "contain",
      products: ["아테본(Ateborn)", "히야론퍼스트(Hyaron First)"],
      href: null
    }
  ];

  var csoItems = [
    {
      title: "CSO 파트너 모집",
      desc: "개인 또는 팀 단위의 영업 파트너",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: "의료 영업 경험",
      desc: "의료기기 및 의약품 영업 경험자 우대",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8.3 13 14l-3-3-4.7 4.7"/></svg>'
    },
    {
      title: "파트너 수익",
      desc: "협의를 통한 지속 가능한 수익 구조",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94Z"/></svg>'
    },
    {
      title: "장기 협력",
      desc: "함께 성장하는 파트너십 지향",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    }
  ];

  var supportItems = [
    {
      title: "제품 관련 정보 전달",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>'
    },
    {
      title: "전문적인 제품 교육",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>'
    },
    {
      title: "거래처 동행 및 현장 지원 가능",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: "지속적인 커뮤니케이션",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11a9 9 0 0 1 18 0v4a2 2 0 0 1-2 2h-1v-6h3"/><path d="M3 15v-4a9 9 0 0 1 1-4"/><path d="M21 15a2 2 0 0 1-2 2h-1"/><path d="M7 21h4"/><path d="M3 11h1v6H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z"/></svg>'
    }
  ];

  var whyPoints = [
    "안정적인 제품 공급",
    "전문적인 영업 지원",
    "지속적인 교육 및 제품 정보 제공",
    "장기적인 성장 파트너십"
  ];

  var checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  /* ------------------------------------------------------------------
   * Renderers
   * ------------------------------------------------------------------ */
  function renderProducts() {
    var grid = document.getElementById("productGrid");
    if (!grid) return;

    productPartners.forEach(function (partner, index) {
      var card = document.createElement("article");
      card.className = "product-card reveal";
      card.setAttribute("data-partner", partner.id);

      var media = document.createElement("div");
      media.className = "product-media product-media-" + partner.imageFit;

      var img = document.createElement("img");
      img.src = partner.image;
      img.alt = partner.company + " 대표 제품 이미지";
      img.loading = index < 3 ? "eager" : "lazy";
      media.appendChild(img);

      var body = document.createElement("div");
      body.className = "product-body";
      body.innerHTML =
        '<span class="product-category">' + partner.category + '</span>' +
        '<h3 class="product-company">' + partner.company + '</h3>' +
        '<p class="product-list">' + partner.products.join(" · ") + '</p>';

      card.appendChild(media);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderCso() {
    var grid = document.getElementById("csoGrid");
    if (!grid) return;

    csoItems.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "cso-card reveal";
      card.innerHTML =
        '<div class="cso-icon">' + item.icon + '</div>' +
        '<h3 class="cso-title">' + item.title + '</h3>' +
        '<p class="cso-desc">' + item.desc + '</p>';
      grid.appendChild(card);
    });
  }

  function renderSupport() {
    var grid = document.getElementById("supportGrid");
    if (!grid) return;

    supportItems.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "support-card reveal";
      card.innerHTML =
        '<div class="support-icon">' + item.icon + '</div>' +
        '<h3 class="support-title">' + item.title + '</h3>';
      grid.appendChild(card);
    });
  }

  function renderWhy() {
    var wrap = document.getElementById("whyPills");
    if (!wrap) return;

    whyPoints.forEach(function (text) {
      var pill = document.createElement("span");
      pill.className = "why-pill reveal";
      pill.innerHTML =
        '<span class="pill-check">' + checkIcon + '</span>' + text;
      wrap.appendChild(pill);
    });
  }

  /* ------------------------------------------------------------------
   * Header: sticky shadow + active section highlight
   * ------------------------------------------------------------------ */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initActiveNav() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("section[id]")
    );
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll(".nav-link")
    );
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ------------------------------------------------------------------
   * Mobile menu
   * ------------------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.getElementById("menuToggle");
    var nav = document.getElementById("mobileNav");
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function openMenu() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) closeMenu(); else openMenu();
    });

    nav.querySelectorAll(".mobile-nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ------------------------------------------------------------------
   * Scroll reveal
   * ------------------------------------------------------------------ */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, (i % 4) * 70);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
   * Map link — builds a Naver Map search URL from the address
   * ------------------------------------------------------------------ */
  function initMapLink() {
    var link = document.getElementById("mapLink");
    if (!link) return;
    var address = "경기도 안산시 상록수로 128 올림포스보노피아";
    link.href = "https://map.naver.com/p/search/" + encodeURIComponent(address);
  }

  /* ------------------------------------------------------------------
   * Footer placeholder links (no page yet) — prevent jump-to-top
   * ------------------------------------------------------------------ */
  function initStaticLinks() {
    document.querySelectorAll('.footer-static-link').forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    renderCso();
    renderSupport();
    renderWhy();
    initHeaderScroll();
    initActiveNav();
    initMobileMenu();
    initReveal();
    initMapLink();
    initStaticLinks();
  });
})();
