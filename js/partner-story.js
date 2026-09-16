/**
 * WHY MEDIONE / PARTNER SUPPORT — pinned step story.
 *
 * Same track+sticky pattern as about-scroll.js and cso-scroll.js: a tall
 * track "spends" scroll distance while the stage stays pinned, progress
 * comes from getBoundingClientRect() every frame, and the four steps map
 * onto fixed progress bands with a hysteresis dead-zone at each boundary
 * so slow scrolling through a transition band doesn't flicker between
 * steps. The right-hand nav cards stay in fixed slots — only which one is
 * "active" changes — and the left content crossfades in place instead of
 * being torn down and rebuilt.
 */
(function () {
  "use strict";

  var partnerSteps = [
    {
      id: "product-information",
      number: "01",
      title: "제품 정보 제공",
      shortTitle: "제품 정보 제공",
      description:
        "메디원팜이 취급하는 의료기기 및 의약품의 제품 관련 정보를 CSO 파트너에게 제공합니다. " +
        "파트너가 제품의 특성과 주요 내용을 이해하고 영업 현장에서 정확하게 전달할 수 있도록 필요한 정보를 지속적으로 공유합니다.",
      image: null
    },
    {
      id: "product-education",
      number: "02",
      title: "전문 제품 교육",
      shortTitle: "전문 제품 교육",
      description:
        "제품에 대한 이해도를 높일 수 있도록 제품 특성 및 영업에 필요한 내용을 체계적으로 안내합니다. " +
        "새로운 제품이나 추가로 확인해야 할 사항이 있을 경우에도 파트너가 현장에서 활용할 수 있도록 관련 내용을 공유합니다.",
      image: null
    },
    {
      id: "sales-support",
      number: "03",
      title: "거래처 동행 지원",
      shortTitle: "거래처 동행 지원",
      description:
        "필요한 경우 의료기관 및 거래처 방문 과정에서 메디원팜과의 동행 지원이 가능합니다. " +
        "제품 설명이나 거래처 대응 과정에서 파트너에게 추가적인 지원이 필요한 경우 함께 협력할 수 있는 체계를 운영합니다.",
      image: null
    },
    {
      id: "partnership",
      number: "04",
      title: "지속적인 파트너십",
      shortTitle: "지속적인 파트너십",
      description:
        "단순한 제품 공급 관계에 그치지 않고 CSO 파트너와 지속적으로 소통하며 장기적인 협력 관계를 만들어갑니다. " +
        "메디원팜과 파트너가 함께 성장할 수 있는 지속 가능한 영업 네트워크를 지향합니다.",
      image: null
    }
  ];

  // [enterAt, exitBelow] progress thresholds per step boundary — the gap
  // between them is the transition band's dead-zone (hysteresis).
  var BOUNDARIES = [
    null,                          // step 0 is the resting state at progress 0
    { enter: 0.38, exit: 0.30 },   // -> step 1
    { enter: 0.60, exit: 0.52 },   // -> step 2
    { enter: 0.82, exit: 0.74 }    // -> step 3
  ];
  var CLICK_TARGET_PROGRESS = [0.20, 0.45, 0.67, 0.885];

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function getHeaderHeight() {
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-height");
    return parseFloat(raw) || 0;
  }

  function resolveStepIndex(progress, currentIndex) {
    var index = currentIndex;
    while (index < BOUNDARIES.length - 1 && progress >= BOUNDARIES[index + 1].enter) {
      index++;
    }
    while (index > 0 && progress < BOUNDARIES[index].exit) {
      index--;
    }
    return index;
  }

  function initPartnerStory() {
    var track = document.querySelector(".partner-story-track");
    var stage = document.querySelector(".partner-story-sticky");
    var navWrap = document.getElementById("partnerStoryNav");
    var visualEl = document.getElementById("partnerStoryVisual");
    var textEl = document.getElementById("partnerStoryText");
    var labelEl = document.getElementById("partnerStoryLabel");
    var titleEl = document.getElementById("partnerStoryTitle");
    var descEl = document.getElementById("partnerStoryDesc");
    if (!track || !stage || !navWrap || !visualEl || !textEl) return;

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var navButtons = partnerSteps.map(function (step, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "partner-nav-card";
      btn.setAttribute("role", "tab");
      btn.setAttribute("data-step", step.id);
      btn.setAttribute("aria-current", i === 0 ? "true" : "false");
      btn.textContent = step.shortTitle;
      btn.addEventListener("click", function () { goToStep(i); });
      navWrap.appendChild(btn);
      return btn;
    });

    var currentIndex = -1;
    var switchTimer = null;

    function renderStep(index, animate) {
      var step = partnerSteps[index];

      function apply() {
        labelEl.textContent = "PARTNER SUPPORT " + step.number;
        titleEl.textContent = step.title;
        descEl.textContent = step.description;
        visualEl.setAttribute("data-active-step", step.id);

        navButtons.forEach(function (btn, i) {
          var active = i === index;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-current", active ? "true" : "false");
        });
      }

      if (!animate) {
        apply();
        return;
      }

      window.clearTimeout(switchTimer);
      textEl.classList.add("is-leaving");
      visualEl.classList.add("is-leaving");
      switchTimer = window.setTimeout(function () {
        apply();
        textEl.classList.remove("is-leaving");
        visualEl.classList.remove("is-leaving");
        textEl.classList.add("is-entering");
        visualEl.classList.add("is-entering");
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            textEl.classList.remove("is-entering");
            visualEl.classList.remove("is-entering");
          });
        });
      }, 220);
    }

    function setStep(index, animate) {
      if (index === currentIndex) return;
      currentIndex = index;
      renderStep(index, animate);
    }

    function scrollToStep(index) {
      var stageHeight = stage.offsetHeight;
      var scrollRange = track.offsetHeight - stageHeight;
      var trackTop = track.getBoundingClientRect().top + window.scrollY;
      var targetY =
        trackTop - getHeaderHeight() + CLICK_TARGET_PROGRESS[index] * scrollRange;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }

    // Reduced motion: nav clicks switch the visible step directly, with no
    // scroll-driven auto-play and no smooth-scroll motion of their own.
    function goToStep(index) {
      if (prefersReducedMotion) {
        setStep(index, false);
        return;
      }
      scrollToStep(index);
    }

    if (prefersReducedMotion) {
      setStep(0, false);
      return;
    }

    var ticking = false;

    function update() {
      ticking = false;
      var stageHeight = stage.offsetHeight;
      var scrollRange = track.offsetHeight - stageHeight;
      if (scrollRange <= 0) {
        setStep(partnerSteps.length - 1, true);
        return;
      }

      var rectTop = track.getBoundingClientRect().top;
      var progress = clamp(
        (getHeaderHeight() - rectTop) / scrollRange,
        0,
        1
      );

      var nextIndex = resolveStepIndex(progress, Math.max(currentIndex, 0));
      setStep(nextIndex, true);
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    setStep(0, false);
    update();
  }

  document.addEventListener("DOMContentLoaded", initPartnerStory);
})();
