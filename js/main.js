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
      image: "public/우삼의료기.png",
      imageFit: "contain",
      products: ["GIPS123", "NEW YOGIPS", "POCKET YOGIPS"],
      href: null
    },
    {
      id: "miraemedical",
      company: "미래메디칼",
      category: "MEDICAL DEVICE PARTNER",
      image: "public/미레메디칼.png",
      imageFit: "contain",
      products: ["GIPSHOE Splint"],
      href: null
    },
    {
      id: "emtech",
      company: "이엠텍",
      category: "MEDICAL DEVICE PARTNER",
      image: "public/이엠텍.png",
      imageFit: "contain",
      products: ["Qplint"],
      href: null
    },
    {
      id: "drfrog",
      company: "Dr.FROG",
      category: "MEDICAL DEVICE PARTNER",
      image: "public/닥터프로그.png",
      imageFit: "contain",
      products: ["Dr.FROG 손가락 보조기"],
      href: null
    },
    {
      id: "rtbio",
      company: "알티바이오",
      category: "MEDICAL DEVICE PARTNER",
      image: "public/알티바이오.png",
      imageFit: "contain",
      products: ["RESPLINT", "RESPLINT CYLINDER", "RECOTAP PLUS", "RT NEO"],
      href: null
    },
    {
      id: "baros-medical",
      company: "바로스메디칼",
      category: "MEDICAL DEVICE PARTNER",
      image: "public/바로스메디칼.png",
      imageFit: "contain",
      products: ["BAROWELLFIT"],
      href: null
    },
    {
      id: "donghae-medical",
      company: "동해메디칼(주)",
      category: "MEDICAL DEVICE PARTNER",
      image: "public/동해메디칼.png",
      imageFit: "contain",
      products: ["TONG CAST"],
      href: null
    },
    {
      id: "litepharmtech",
      company: "(주)라이트팜텍",
      category: "PHARMACEUTICAL PARTNER",
      image: "public/라이트팜텍.png",
      imageFit: "contain",
      products: ["카틸란(Cartilan)"],
      href: null
    },
    {
      id: "pharmaresearch",
      company: "파마리서치",
      category: "PHARMACEUTICAL PARTNER",
      image: "public/파마리서치.png",
      imageFit: "contain",
      products: ["콘쥬란(Conjuran)"],
      href: null
    },
    {
      id: "dongkook-pharm",
      company: "동국제약",
      category: "PHARMACEUTICAL PARTNER",
      image: "public/동국제약.png",
      imageFit: "contain",
      products: ["아테본(Ateborn)", "히야론퍼스트(Hyaron First)"],
      href: null
    }
  ];

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
    initHeaderScroll();
    initActiveNav();
    initMobileMenu();
    initReveal();
    initMapLink();
    initStaticLinks();
  });
})();
