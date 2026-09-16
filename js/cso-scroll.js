/**
 * CSO RECRUITMENT — pinned scroll card spread.
 *
 * Same track+sticky pattern as about-scroll.js: a tall track "spends"
 * scroll distance while the stage stays pinned, and progress is derived
 * from getBoundingClientRect() every frame (no wheel hijacking). Five
 * cards start overlapped near center and fan outward as scroll progress
 * moves through 0.25–0.75; before/after that window they hold their
 * gathered/spread state. A light lerp smooths per-frame movement so the
 * fan settles quickly instead of snapping.
 */
(function () {
  "use strict";

  var csoCards = [
    { id: "product-information", title: "제품 정보 제공", image: null },
    { id: "product-education", title: "전문 제품 교육", image: null },
    { id: "sales-accompaniment", title: "거래처 동행 지원", image: null },
    { id: "cso-partnership", title: "CSO 파트너 협력", image: null },
    { id: "growth-support", title: "지속적인 성장 지원", image: null }
  ];

  var INITIAL_X = [-55, -28, 0, 28, 55];
  var INITIAL_ROTATE = [-3, -1.5, 0, 1.5, 3];
  var INITIAL_SCALE = 0.92;
  var INITIAL_OPACITY = 0.4;

  var FINAL_STEP_UNITS = [-2, -1, 0, 1, 2]; // multiplied by a responsive px step
  var FINAL_Y = [20, 0, -10, 0, 20];
  var FINAL_ROTATE = [-7, -3, 0, 3, 7];
  var FINAL_SCALE = [1, 1, 1.02, 1, 1];
  var Z_INDEX = [1, 2, 5, 3, 1];

  var HEADING_END = 0.12;
  var SPREAD_START = 0.25;
  var SPREAD_END = 0.75;
  var LERP_FACTOR = 0.18;
  var SETTLE_EPSILON = 0.0008;

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function renderCards(stage) {
    var frag = document.createDocumentFragment();
    var elements = csoCards.map(function (data, i) {
      var card = document.createElement("div");
      card.className = "cso-card";
      card.setAttribute("data-cso-card", data.id);
      card.style.zIndex = Z_INDEX[i];

      var media = document.createElement("div");
      media.className = "cso-card-media";
      var content = document.createElement("div");
      content.className = "cso-card-content";

      card.appendChild(media);
      card.appendChild(content);
      frag.appendChild(card);
      return card;
    });
    stage.appendChild(frag);
    return elements;
  }

  function getHeaderHeight() {
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-height");
    return parseFloat(raw) || 0;
  }

  function initCsoScrollSpread() {
    var track = document.querySelector(".cso-scroll-track");
    var stage = document.querySelector(".cso-sticky-stage");
    var cardsStage = document.getElementById("csoCardsStage");
    var heading = document.querySelector(".cso-heading");
    if (!track || !stage || !cardsStage || !heading) return;

    var cardEls = renderCards(cardsStage);

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function applyFrame(spreadT, headingT) {
      heading.style.opacity = headingT;
      heading.style.transform = "translateY(" + (1 - headingT) * 16 + "px)";

      var stageWidth = cardsStage.clientWidth || 1;
      var cardWidth = cardEls[0].offsetWidth || 250;
      var available = Math.min(stageWidth, 1400) - cardWidth;
      var stepPx = clamp(available / 4.6, 90, 260);

      for (var i = 0; i < cardEls.length; i++) {
        var x = lerp(INITIAL_X[i], FINAL_STEP_UNITS[i] * stepPx, spreadT);
        var y = lerp(0, FINAL_Y[i], spreadT);
        var rotate = lerp(INITIAL_ROTATE[i], FINAL_ROTATE[i], spreadT);
        var scale = lerp(INITIAL_SCALE, FINAL_SCALE[i], spreadT);
        var opacity = lerp(INITIAL_OPACITY, 1, spreadT);

        cardEls[i].style.transform =
          "translate(-50%, -50%) translate(" + x + "px, " + y + "px) " +
          "rotate(" + rotate + "deg) scale(" + scale + ")";
        cardEls[i].style.opacity = opacity;
      }
    }

    if (prefersReducedMotion) {
      applyFrame(1, 1);
      return;
    }

    var targetSpread = 0;
    var targetHeading = 0;
    var smoothSpread = 0;
    var smoothHeading = 0;
    var rafRunning = false;
    var scrollTicking = false;

    function computeTargets() {
      var stageHeight = stage.offsetHeight;
      var scrollRange = track.offsetHeight - stageHeight;
      if (scrollRange <= 0) {
        targetSpread = 1;
        targetHeading = 1;
        return;
      }

      var rectTop = track.getBoundingClientRect().top;
      var progress = (getHeaderHeight() - rectTop) / scrollRange;
      progress = clamp(progress, 0, 1);

      targetHeading = clamp(progress / HEADING_END, 0, 1);
      var rawSpread = clamp(
        (progress - SPREAD_START) / (SPREAD_END - SPREAD_START),
        0,
        1
      );
      targetSpread = easeInOutCubic(rawSpread);
    }

    function tick() {
      smoothSpread = lerp(smoothSpread, targetSpread, LERP_FACTOR);
      smoothHeading = lerp(smoothHeading, targetHeading, LERP_FACTOR);
      applyFrame(smoothSpread, smoothHeading);

      var settled =
        Math.abs(smoothSpread - targetSpread) < SETTLE_EPSILON &&
        Math.abs(smoothHeading - targetHeading) < SETTLE_EPSILON;

      if (settled) {
        smoothSpread = targetSpread;
        smoothHeading = targetHeading;
        applyFrame(smoothSpread, smoothHeading);
        rafRunning = false;
        return;
      }
      window.requestAnimationFrame(tick);
    }

    function ensureRafRunning() {
      if (rafRunning) return;
      rafRunning = true;
      window.requestAnimationFrame(tick);
    }

    function onScroll() {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        scrollTicking = false;
        computeTargets();
        ensureRafRunning();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    computeTargets();
    smoothSpread = targetSpread;
    smoothHeading = targetHeading;
    applyFrame(smoothSpread, smoothHeading);
  }

  document.addEventListener("DOMContentLoaded", initCsoScrollSpread);
})();
