/**
 * ABOUT section — pinned scroll storytelling.
 *
 * The section is a tall "track" with a `position: sticky` stage inside it.
 * As the user scrolls through the track, we read the stage's current
 * position via getBoundingClientRect() (no wheel/preventDefault hijacking)
 * and derive a 0..1 progress value. Each content step becomes visible once
 * progress crosses its threshold, and CSS transitions handle the fade/move.
 * Because progress is recomputed from live layout on every frame, scrolling
 * up reverses the sequence and a mid-page refresh resolves to the correct
 * state automatically.
 */
(function () {
  "use strict";

  var STEP_THRESHOLDS = {
    eyebrow: 0.03,
    title: 0.10,
    subtitle: 0.18,
    image01: 0.27,
    image02: 0.35,
    body1: 0.43,
    image03: 0.54,
    image04: 0.62,
    body2: 0.70,
    final: 0.81,
    logo: 0.90
  };

  function initAboutScrollStory() {
    var track = document.querySelector(".about-scroll-track");
    var stage = document.querySelector(".about-sticky-stage");
    if (!track || !stage) return;

    var steps = Array.prototype.slice
      .call(track.querySelectorAll("[data-about-step]"))
      .map(function (el) {
        return { el: el, threshold: STEP_THRESHOLDS[el.getAttribute("data-about-step")] || 0 };
      });

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      steps.forEach(function (step) { step.el.classList.add("is-active"); });
      return;
    }

    function getHeaderHeight() {
      var raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-height");
      return parseFloat(raw) || 0;
    }

    var ticking = false;

    function update() {
      ticking = false;

      var scrollRange = track.offsetHeight - stage.offsetHeight;
      if (scrollRange <= 0) {
        steps.forEach(function (step) { step.el.classList.add("is-active"); });
        return;
      }

      var rectTop = track.getBoundingClientRect().top;
      var progress = (getHeaderHeight() - rectTop) / scrollRange;
      progress = Math.min(1, Math.max(0, progress));

      steps.forEach(function (step) {
        step.el.classList.toggle("is-active", progress >= step.threshold);
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  document.addEventListener("DOMContentLoaded", initAboutScrollStory);
})();
