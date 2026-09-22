/**
 * CSO RECRUITMENT — sticky stage with a scroll-triggered card spread.
 *
 * Same track+sticky pin as about-scroll.js: a tall track "spends" scroll
 * distance while the stage stays pinned, and a 0..1 progress value is
 * derived from getBoundingClientRect() every frame (no wheel hijacking,
 * no preventDefault, no scroll lock).
 *
 * Unlike the old build, card position is NOT driven by scroll progress
 * anymore. Progress is only used for two things:
 *   1. The heading (+ card opacity) entrance fade, exactly as before,
 *      over the first HEADING_END slice of the pin.
 *   2. Resetting the cards to their resting "stacked" (progress <= 0) or
 *      "spread" (progress >= 1) state whenever the pin's boundaries are
 *      crossed, so re-entering the section always starts from the state
 *      that matches which edge you approached it from.
 *
 * While the stage is actively pinned (0 < progress < 1), card position is
 * a small state machine — stacked / spreading / spread / stacking — and
 * the ONLY thing that drives a transition between them is the *direction*
 * of the next scroll movement, not how far the user has scrolled. Once a
 * transition starts it runs to completion on its own via a CSS
 * transition (~500ms, ease-out), ignoring further triggers until it
 * settles, so a single wheel notch is enough to fire the full spread/
 * gather and there is no "stuck halfway" state.
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

  // Initial gathered state — expressed as a ratio of card width/height so
  // the same overlap "feel" holds across the responsive card sizes.
  var INITIAL_X_RATIO = [-0.22, -0.112, 0, 0.112, 0.22];
  var INITIAL_ROTATE = [-3, -1.5, 0, 1.5, 3];
  var INITIAL_SCALE = 0.92;
  var INITIAL_OPACITY = 0.4;

  // Final spread state (unchanged from the previous build — only the path
  // to get here changed, not the destination). X is a step multiplier
  // resolved against a container-width-aware pixel step (STEP_*) instead
  // of a fixed pixel value, per the responsive requirement.
  var FINAL_X_UNITS = [-2, -1, 0, 1, 2];
  var FINAL_Y_RATIO = [0.054, 0, -0.027, 0, 0.054];
  var FINAL_ROTATE = [-7, -3, 0, 3, 7];
  var FINAL_ROTATE_COMPACT = [-9, -4, 0, 4, 9];
  var FINAL_SCALE = [1, 1, 1.02, 1, 1];
  var Z_INDEX = [1, 2, 5, 3, 1];

  var HEADING_END = 0.12;
  // Reserves the tail of the track's scrollable distance as a genuine
  // pinned hold: progress reaches 1 before the sticky stage physically
  // reaches its unstick point, so the finished spread sits still on
  // screen for a beat instead of sliding straight into the next section.
  var HOLD_FRACTION = 0.14;
  var COMPACT_BREAKPOINT = 767;
  var STEP_DIVISOR = 4.4;
  var STEP_MIN = 40;
  var STEP_MAX = 260;

  var SPREAD_DURATION_MS = 500;
  var SPREAD_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
  var STAGGER_MS = [40, 20, 0, 20, 40];
  var TRIGGER_PX = 1;

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
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
      // Two independent transitions on purpose: `transform` is the
      // trigger-driven spread/gather (500ms, staggered per card);
      // `opacity` is the unrelated continuous scroll-entrance fade
      // (short, no stagger) — kept exactly as fast/snappy as before.
      card.style.transitionProperty = "transform, opacity";
      card.style.transitionTimingFunction = SPREAD_EASING + ", ease-out";

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
    var transitionMs = prefersReducedMotion ? 0 : SPREAD_DURATION_MS;
    var OPACITY_DURATION_MS = prefersReducedMotion ? 0 : 250;

    cardEls.forEach(function (el, i) {
      el.style.transitionDuration = transitionMs + "ms, " + OPACITY_DURATION_MS + "ms";
      el.style.transitionDelay =
        (prefersReducedMotion ? 0 : STAGGER_MS[i]) + "ms, 0ms";
    });

    // -- Transform targets for the two resting states -----------------
    var stackedTransforms = [];
    var spreadTransforms = [];

    function computeTransforms() {
      var stageWidth = cardsStage.clientWidth || 1;
      var cardWidth = cardEls[0].offsetWidth || 250;
      var cardHeight = cardEls[0].offsetHeight || 370;
      var available = Math.max(0, stageWidth - cardWidth);
      var stepPx = clamp(available / STEP_DIVISOR, STEP_MIN, STEP_MAX);
      var finalRotate = window.innerWidth <= COMPACT_BREAKPOINT
        ? FINAL_ROTATE_COMPACT
        : FINAL_ROTATE;

      stackedTransforms = [];
      spreadTransforms = [];
      for (var i = 0; i < cardEls.length; i++) {
        var initialX = INITIAL_X_RATIO[i] * cardWidth;
        stackedTransforms.push(
          "translate(-50%, -50%) translate(" + initialX.toFixed(2) + "px, 0px) " +
          "rotate(" + INITIAL_ROTATE[i] + "deg) scale(" + INITIAL_SCALE + ")"
        );

        var finalX = FINAL_X_UNITS[i] * stepPx;
        var finalY = FINAL_Y_RATIO[i] * cardHeight;
        spreadTransforms.push(
          "translate(-50%, -50%) translate(" + finalX.toFixed(2) + "px, " + finalY.toFixed(2) + "px) " +
          "rotate(" + finalRotate[i] + "deg) scale(" + FINAL_SCALE[i] + ")"
        );
      }
    }

    function applyTransform(state) {
      var targets = state === "spread" ? spreadTransforms : stackedTransforms;
      for (var i = 0; i < cardEls.length; i++) {
        cardEls[i].style.transform = targets[i];
      }
    }

    // Instantly jumps to a resting state with no visible animation —
    // used only for boundary resets (entering/leaving the pin) and
    // resize, never for the user-facing spread/gather itself.
    function snapTo(state) {
      cardEls.forEach(function (el) {
        el.style.transitionDuration = "0s, 0s";
      });
      applyTransform(state);
      // Force a reflow so the next duration change isn't batched with
      // this one (otherwise the browser may skip straight to it).
      void cardsStage.offsetHeight;
      cardEls.forEach(function (el) {
        el.style.transitionDuration = transitionMs + "ms, " + OPACITY_DURATION_MS + "ms";
      });
    }

    // -- Entrance fade (heading + card opacity), continuous with scroll,
    //    exactly as before — untouched by the spread/gather trigger. ---
    function applyEntranceFrame(progress) {
      var headingT = clamp(progress / HEADING_END, 0, 1);
      heading.style.opacity = headingT;
      heading.style.transform = "translateY(" + (1 - headingT) * 16 + "px)";

      var cardOpacity = lerp(INITIAL_OPACITY, 1, headingT);
      for (var i = 0; i < cardEls.length; i++) {
        cardEls[i].style.opacity = cardOpacity;
      }
    }

    function computeProgress() {
      var stageHeight = stage.offsetHeight;
      var scrollRange = track.offsetHeight - stageHeight;
      if (scrollRange <= 0) return 1;

      var effectiveRange = scrollRange * (1 - HOLD_FRACTION);
      if (effectiveRange <= 0) effectiveRange = scrollRange;

      var rectTop = track.getBoundingClientRect().top;
      var p = (getHeaderHeight() - rectTop) / effectiveRange;
      return clamp(p, 0, 1);
    }

    // -- Trigger state machine -----------------------------------------
    // "stacked" / "spread" are resting states a trigger can fire from.
    // "spreading" / "stacking" are transient — new triggers are ignored
    // until the in-flight transition finishes, so a rapid run of wheel
    // events can't restart or jitter the animation mid-flight.
    var cardState = "stacked";
    var transitionTimer = null;
    var lastScrollY = window.scrollY;
    var wasActive = false;

    function startTransition(target) {
      window.clearTimeout(transitionTimer);
      cardState = target === "spread" ? "spreading" : "stacking";
      applyTransform(target);
      var settleDelay = transitionMs + STAGGER_MS[0] + 40; // longest stagger + a small margin
      transitionTimer = window.setTimeout(function () {
        cardState = target;
      }, settleDelay);
    }

    function resetToBoundary(state) {
      window.clearTimeout(transitionTimer);
      cardState = state;
      snapTo(state);
    }

    function onScroll() {
      var progress = computeProgress();
      var active = progress > 0 && progress < 1;

      applyEntranceFrame(progress);

      if (progress <= 0 && cardState !== "stacked") {
        resetToBoundary("stacked");
      } else if (progress >= 1 && cardState !== "spread") {
        resetToBoundary("spread");
      }

      var scrollY = window.scrollY;
      if (active) {
        if (!wasActive) {
          // Just became pinned — establish a fresh baseline so arriving
          // at the section (which is itself a downward scroll) doesn't
          // immediately count as the spread trigger. The user must see
          // the stack first, then scroll again to fire it.
          lastScrollY = scrollY;
        } else {
          var deltaY = scrollY - lastScrollY;
          lastScrollY = scrollY;
          if (deltaY > TRIGGER_PX && cardState === "stacked") {
            startTransition("spread");
          } else if (deltaY < -TRIGGER_PX && cardState === "spread") {
            startTransition("stacked");
          }
        }
      } else {
        lastScrollY = scrollY;
      }
      wasActive = active;
    }

    var scrollTicking = false;
    function onScrollThrottled() {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        scrollTicking = false;
        onScroll();
      });
    }

    function onResize() {
      computeTransforms();
      if (cardState === "stacked" || cardState === "spread") {
        snapTo(cardState);
      }
      onScroll();
    }

    window.addEventListener("scroll", onScrollThrottled, { passive: true });
    window.addEventListener("resize", onResize);

    // Initial paint: land directly on whichever state matches wherever
    // the page happens to be scrolled to (deep link / mid-scroll reload)
    // instead of always starting gathered.
    computeTransforms();
    var initialProgress = computeProgress();
    cardState = initialProgress >= 1 ? "spread" : "stacked";
    snapTo(cardState);
    applyEntranceFrame(initialProgress);
    wasActive = initialProgress > 0 && initialProgress < 1;
    lastScrollY = window.scrollY;
  }

  document.addEventListener("DOMContentLoaded", initCsoScrollSpread);
})();
