/**
 * ABOUT section — pinned scroll storytelling.
 *
 * The section is a tall "track" with a `position: sticky` stage inside it.
 * As the user scrolls through the track, we read the stage's current
 * position via getBoundingClientRect() (no wheel/preventDefault hijacking)
 * and derive a 0..1 progress value.
 *
 * Two reveal styles share that progress value:
 *  - The opening trio (eyebrow/title/subtitle) plus the first image
 *    placeholder play once, fast, as a timed stagger the moment the
 *    section becomes pinned — they are NOT gated by further scroll
 *    distance. The stagger itself lives in each element's CSS
 *    transition-delay (see .about-start-el / .about-image-01 in
 *    style.css); this file only flips a single `is-active` class for
 *    all of them at once.
 *  - Everything else (body copy, slogan, logo, the other three images)
 *    is gated by scroll-progress thresholds, cumulative and reversible.
 * Because progress is recomputed from live layout on every frame, scrolling
 * up reverses the scroll-gated half and a mid-page refresh resolves to the
 * correct state immediately (no replaying the opening stagger).
 */
(function () {
  "use strict";

  var START_STEPS = ["eyebrow", "title", "subtitle"];
  var START_IMMEDIATE_EPSILON = 0.03;

  var SCROLL_THRESHOLDS = {
    body1: 0.14,
    image02: 0.14,
    body2: 0.36,
    image03: 0.36,
    final: 0.58,
    image04: 0.58,
    logo: 0.78
  };

  function initAboutScrollStory() {
    var track = document.querySelector(".about-scroll-track");
    var stage = document.querySelector(".about-sticky-stage");
    if (!track || !stage) return;

    function findStep(step) {
      return track.querySelector('[data-about-step="' + step + '"]');
    }

    var allEls = Array.prototype.slice.call(track.querySelectorAll("[data-about-step]"));

    var scrollSteps = Object.keys(SCROLL_THRESHOLDS)
      .map(function (step) {
        return { el: findStep(step), threshold: SCROLL_THRESHOLDS[step] };
      })
      .filter(function (s) { return s.el; });

    var startEls = START_STEPS.map(findStep).filter(Boolean);
    var image01 = track.querySelector(".about-image-01");
    if (image01) startEls.push(image01);

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      allEls.forEach(function (el) { el.classList.add("is-active"); });
      return;
    }

    var startPlayed = false;

    function playStart(progress) {
      if (startPlayed) return;
      startPlayed = true;

      // Landed mid-track already (deep link, mid-scroll refresh) — skip the
      // delayed stagger so content doesn't pop in late on top of scrolled
      // content the user can already see.
      var instant = progress > START_IMMEDIATE_EPSILON;
      startEls.forEach(function (el) {
        if (instant) el.style.transitionDelay = "0s";
        el.classList.add("is-active");
      });
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
        playStart(1);
        scrollSteps.forEach(function (step) { step.el.classList.add("is-active"); });
        return;
      }

      var rectTop = track.getBoundingClientRect().top;
      var progress = (getHeaderHeight() - rectTop) / scrollRange;
      progress = Math.min(1, Math.max(0, progress));

      if (progress > 0) {
        playStart(progress);
      }

      scrollSteps.forEach(function (step) {
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
