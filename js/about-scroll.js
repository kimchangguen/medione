/**
 * ABOUT section — pinned scroll storytelling.
 *
 * The section is a tall "track" with a `position: sticky` stage inside it.
 * As the user scrolls through the track, we read the stage's current
 * position via getBoundingClientRect() (no wheel/preventDefault hijacking)
 * and derive a 0..1 progress value.
 *
 * Two different reveal styles share that progress value:
 *  - The opening trio (eyebrow/title/subtitle) + the first image placeholder
 *    play once, fast, as a timed stagger the moment the section becomes
 *    pinned — they are NOT gated by further scroll distance.
 *  - Everything else (body copy, slogan, logo, the other three images) is
 *    gated by scroll-progress thresholds, cumulative and fully reversible.
 * Because progress is recomputed from live layout on every frame, scrolling
 * up reverses the scroll-gated half and a mid-page refresh resolves to the
 * correct state immediately (no replaying the opening stagger).
 */
(function () {
  "use strict";

  // Scroll-gated steps: cumulative reveal tied to scroll progress, reversible.
  var SCROLL_THRESHOLDS = {
    body1: 0.10,
    image02: 0.14,
    body2: 0.32,
    image03: 0.36,
    final: 0.55,
    logo: 0.75,
    image04: 0.75
  };

  // Opening sequence: fires once on entry, fast stagger, not scroll-linked.
  var START_SEQUENCE = ["eyebrow", "title", "subtitle", "image01"];
  var START_STAGGER_MS = 150;
  var START_IMMEDIATE_THRESHOLD = 0.05;

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

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      allEls.forEach(function (el) { el.classList.add("is-active"); });
      return;
    }

    var startPlayed = false;

    function playStartSequence(progress) {
      if (startPlayed) return;
      startPlayed = true;

      var immediate = progress > START_IMMEDIATE_THRESHOLD;
      START_SEQUENCE.forEach(function (step, i) {
        var el = findStep(step);
        if (!el) return;
        if (immediate) {
          el.classList.add("is-active");
        } else {
          window.setTimeout(function () {
            el.classList.add("is-active");
          }, i * START_STAGGER_MS);
        }
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
        playStartSequence(1);
        scrollSteps.forEach(function (step) { step.el.classList.add("is-active"); });
        return;
      }

      var rectTop = track.getBoundingClientRect().top;
      var progress = (getHeaderHeight() - rectTop) / scrollRange;
      progress = Math.min(1, Math.max(0, progress));

      if (progress > 0) {
        playStartSequence(progress);
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
