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
      "id": "product-information",
      "number": "01",
      "title": "제품 정보 제공",
      "shortTitle": "제품 정보 제공",
      "subtitle": "정확한 정보로 신뢰를 더하고,\n더 나은 비즈니스를 함께 만들어갑니다.",
      "paragraphs": [
        "메디원팜은 파트너가 제품을 정확하고 깊이 있게 이해할 수 있도록 체계적이고 신뢰도 높은 제품 정보를 제공합니다.",
        "제품의 주요 특징과 사용 방법, 관련 자료와 변경 사항 등 영업 현장에서 필요한 정보를 이해하기 쉽게 정리하여 파트너가 거래처에 보다 명확하게 설명할 수 있도록 지원합니다.",
        "새로운 제품이 출시되거나 기존 제품의 안내 사항이 변경되는 경우에도 필요한 내용을 빠르게 확인할 수 있도록 정보를 지속적으로 정리하고 파트너와 공유합니다.",
        "단순히 자료를 전달하는 데 그치지 않고, 파트너가 제품을 자신 있게 소개하고 신뢰를 쌓아갈 수 있도록 정보의 정확성과 접근성을 꾸준히 높여 나갑니다."
      ],
      "quote": "정확한 정보가 더 큰 가치를 만듭니다."
    },
    {
      "id": "product-education",
      "number": "02",
      "title": "전문 제품 교육",
      "shortTitle": "전문 제품 교육",
      "subtitle": "제품에 대한 이해가 깊어질수록\n영업의 전문성과 자신감도 함께 높아집니다.",
      "paragraphs": [
        "메디원팜은 파트너가 제품의 특징과 핵심 정보를 정확하게 이해하고 실제 영업 현장에서 효과적으로 활용할 수 있도록 체계적인 제품 교육을 지원합니다.",
        "제품별 주요 특성과 사용 목적, 현장에서 자주 접하는 질문, 설명 과정에서 꼭 알아야 할 핵심 포인트 등을 중심으로 실무에 도움이 되는 내용을 전달합니다.",
        "새로운 제품이나 추가로 확인해야 할 내용이 발생하는 경우에도 관련 정보를 빠르게 공유하여 파트너가 변화하는 영업 환경에 유연하게 대응할 수 있도록 돕습니다.",
        "단순히 제품을 외우는 교육이 아니라, 파트너가 거래처 앞에서 제품의 가치를 이해하기 쉽게 설명하고 전문성을 갖춘 영업 활동을 이어갈 수 있도록 지원합니다."
      ],
      "quote": "제품을 이해하는 힘이 영업의 경쟁력이 됩니다."
    },
    {
      "id": "sales-support",
      "number": "03",
      "title": "거래처 동행 지원",
      "shortTitle": "거래처 동행 지원",
      "subtitle": "필요한 순간에는 현장에서 함께하며\n파트너의 영업 활동에 힘을 더합니다.",
      "paragraphs": [
        "파트너가 거래처와 제품 상담을 진행하는 과정에서 추가적인 설명이나 현장 지원이 필요한 경우 메디원팜은 상황에 따라 거래처 동행을 지원합니다.",
        "제품에 대한 보다 전문적인 설명이 필요하거나 새로운 거래처에서 제품 소개가 필요한 경우, 파트너와 함께 현장을 방문하여 원활한 상담이 이루어질 수 있도록 돕습니다.",
        "현장에서 발생하는 다양한 질문과 요구 사항을 함께 확인하고, 필요한 정보를 빠르게 공유하여 파트너가 보다 안정적으로 영업 활동을 이어갈 수 있는 환경을 만들어갑니다.",
        "메디원팜은 파트너의 뒤에서 단순히 제품을 공급하는 회사가 아니라 필요한 순간 함께 움직이는 실질적인 영업 파트너를 지향합니다."
      ],
      "quote": "필요한 순간, 현장에서 함께합니다."
    },
    {
      "id": "partnership",
      "number": "04",
      "title": "지속적인 파트너십",
      "shortTitle": "지속적인 파트너십",
      "subtitle": "한 번의 거래가 아닌,\n함께 성장하는 장기적인 관계를 만들어갑니다.",
      "paragraphs": [
        "메디원팜은 단기적인 제품 공급에 그치지 않고 파트너와 지속적으로 소통하며 함께 성장하는 협력 관계를 지향합니다.",
        "영업 과정에서 발생하는 문의와 현장의 의견을 꾸준히 공유하고, 필요한 정보와 지원을 지속적으로 제공하여 파트너가 안정적인 영업 기반을 만들어갈 수 있도록 돕습니다.",
        "시장과 제품 환경이 변화하더라도 파트너와 긴밀하게 소통하며 필요한 내용을 함께 확인하고, 더 나은 방향을 찾아가는 관계를 만들어갑니다.",
        "서로의 경험과 전문성을 연결하고 신뢰를 쌓아가며 오랫동안 함께 성장할 수 있는 파트너십, 그것이 메디원팜이 지향하는 협력의 방식입니다."
      ],
      "quote": "신뢰를 연결하고, 함께 성장합니다."
    }
  ];

  // Inline artwork and icons are presentation-only; no external assets.
  var partnerIcons = [
    "<path d=\"M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h3\"/><circle cx=\"18\" cy=\"17\" r=\"4\"/><path d=\"M18 17v2M18 14.5v.2\"/>",
    "<path d=\"m2 8 10-5 10 5-10 5zM6 10v7q6 5 12 0v-7M22 8v8\"/>",
    "<circle cx=\"7\" cy=\"9\" r=\"3\"/><path d=\"M1 21v-3a6 6 0 0 1 12 0v3M22 8c0 4-5 8-5 8s-5-4-5-8a5 5 0 0 1 10 0Z\"/><circle cx=\"17\" cy=\"8\" r=\"1.5\"/>",
    "<path d=\"M12 12c-3-5-5-5-7-5a5 5 0 0 0 0 10c2 0 4-1 7-5s5-5 7-5a5 5 0 0 1 0 10c-2 0-4-1-7-5Z\"/>"
  ];

  var partnerArtwork = [
    `<svg class="support-art" viewBox="0 0 360 420" fill="none" aria-hidden="true" focusable="false">
<defs><linearGradient id="support-doc" x1="95" y1="110" x2="265" y2="350" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#F1F7FF"/></linearGradient><linearGradient id="support-bars" x1="150" y1="200" x2="245" y2="290" gradientUnits="userSpaceOnUse"><stop stop-color="#72A7FF"/><stop offset="1" stop-color="#3978F6"/></linearGradient><pattern id="support-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#91B3E2" opacity=".35"/></pattern></defs>
<rect x="26" y="62" width="308" height="302" fill="url(#support-dots)"/>
<ellipse cx="183" cy="226" rx="162" ry="111" stroke="#A8C9F4" stroke-dasharray="3 8" transform="rotate(-25 183 226)"/>
<circle cx="41" cy="241" r="5" fill="#72A7FF"/><circle cx="301" cy="116" r="4" fill="#3978F6"/>
<rect x="102" y="85" width="158" height="222" rx="17" fill="#C9DEFF" fill-opacity=".6" stroke="#A9C7F9" transform="rotate(13 181 196)"/>
<rect x="88" y="103" width="162" height="222" rx="17" fill="#E1EDFF" stroke="#BCD4FA" transform="rotate(-9 169 214)"/>
<g class="support-art-shadow"><rect x="96" y="119" width="168" height="224" rx="18" fill="url(#support-doc)" stroke="#C3D9F5"/><path d="M120 151h59M120 161h35" stroke="#84A8D6" stroke-width="4" stroke-linecap="round"/>
<rect x="120" y="225" width="23" height="49" rx="5" fill="#C9DDFF"/><rect x="153" y="207" width="23" height="67" rx="5" fill="#99BCFF"/><rect x="186" y="188" width="23" height="86" rx="5" fill="url(#support-bars)"/><path d="M120 294h119M120 306h96M120 318h62" stroke="#CFDFF4" stroke-width="3" stroke-linecap="round"/></g>
<g class="support-art-shadow"><rect x="227" y="72" width="64" height="64" rx="19" fill="#fff" stroke="#D8E7FB"/><circle cx="259" cy="104" r="17" fill="#EDF4FF" stroke="#72A7FF"/><path d="M259 101v13M259 94v1" stroke="#3978F6" stroke-width="3" stroke-linecap="round"/></g>
<rect x="47" y="296" width="70" height="44" rx="13" fill="#fff" stroke="#D8E7FB"/><path d="m61 322 10-9 9 4 15-12M88 305h7v7" stroke="#3978F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M281 268h12M287 262v12" stroke="#88B3F3" stroke-width="2"/>
</svg>`,
    `<svg class="support-art" viewBox="0 0 360 420" fill="none" aria-hidden="true" focusable="false">
<defs><linearGradient id="support-book" x1="73" y1="213" x2="285" y2="319" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#E8EEFF"/></linearGradient><linearGradient id="support-cap" x1="118" y1="109" x2="246" y2="168" gradientUnits="userSpaceOnUse"><stop stop-color="#496FE8"/><stop offset="1" stop-color="#829BF7"/></linearGradient></defs>
<circle cx="180" cy="215" r="145" stroke="#D2DCFB"/><circle cx="180" cy="215" r="116" stroke="#D2DCFB" stroke-dasharray="2 7"/><circle cx="180" cy="215" r="86" fill="#DCE5FF" fill-opacity=".5"/>
<path d="M41 239c30 111 219 136 283-18" stroke="#BACCF7" stroke-width="2"/>
<g class="support-art-shadow"><path d="M69 227c41-18 76-17 111 4 36-21 70-22 111-4v94c-40-14-77-14-111 7-35-21-70-21-111-7Z" fill="#C1D0F7"/><path d="M73 214c40-17 75-15 107 5 33-20 67-22 107-5v96c-39-14-73-14-107 7-34-21-69-21-107-7Z" fill="url(#support-book)" stroke="#B7CAF6"/><path d="M180 219v98M96 243c21-4 40-1 61 8M96 260c21-4 40-1 61 8M96 277c21-4 40-1 61 8M203 251c20-9 40-12 60-8M203 268c20-9 40-12 60-8M203 285c20-9 40-12 60-8" stroke="#ABC0EE" stroke-width="2.5" stroke-linecap="round"/></g>
<g class="support-art-shadow"><path d="M130 139v35c30 20 65 20 99 0v-35" fill="#718FF1"/><path d="m104 131 76-35 76 35-76 36Z" fill="url(#support-cap)" stroke="#496FE8"/><path d="M251 135v39l-5 15h10l-5-15" stroke="#496FE8" stroke-width="2.5" stroke-linejoin="round"/><path d="m164 130 12 12 23-23" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>
<g fill="#fff" stroke="#D1DDF8"><rect x="32" y="150" width="54" height="54" rx="16"/><rect x="275" y="182" width="54" height="54" rx="16"/><rect x="153" y="350" width="54" height="46" rx="15"/></g>
<g stroke="#607FE9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m46 171 13-7 13 7v14l-13 7-13-7ZM46 171l13 7 13-7M59 178v14M297 197v22M286 208h22M169 374l8 8 15-17"/></g>
<circle cx="76" cy="91" r="4" fill="#8BA3F3"/><path d="M271 93h14M278 86v14" stroke="#9AAFF3" stroke-width="2"/>
</svg>`,
    `<svg class="support-art" viewBox="0 0 360 420" fill="none" aria-hidden="true" focusable="false">
<defs><linearGradient id="support-route" x1="47" y1="121" x2="308" y2="301" gradientUnits="userSpaceOnUse"><stop stop-color="#258BD8"/><stop offset="1" stop-color="#48B9D9"/></linearGradient><pattern id="support-map" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)"><path d="M0 0h46v46" stroke="#B4DEE8" stroke-opacity=".45"/></pattern></defs>
<rect x="18" y="42" width="324" height="339" rx="60" fill="url(#support-map)"/>
<path d="M24 323c42-77 133-9 159-91s102-115 153-83M27 122c102-26 73 97 147 101s70 94 155 66" stroke="#C0E5EF" stroke-width="17" stroke-linecap="round"/>
<path d="M75 307c9-41 49-31 49-87s61-58 126-73" stroke="url(#support-route)" stroke-width="2" stroke-dasharray="4 6"/>
<path d="M121 220h122l41 90" stroke="#67BFDA" stroke-width="2" stroke-dasharray="4 6"/>
<g class="support-art-shadow"><rect x="67" y="165" width="97" height="107" rx="28" fill="#fff" stroke="#BEDFED"/><rect x="200" y="185" width="97" height="107" rx="28" fill="#fff" stroke="#BEDFED"/></g>
<circle cx="115" cy="203" r="16" fill="#DCEFFF" stroke="#258BD8" stroke-width="2"/><path d="M87 249v-9a28 28 0 0 1 56 0v9" fill="#ECF7FF" stroke="#258BD8" stroke-width="2"/>
<circle cx="248" cy="223" r="16" fill="#DEF6F7" stroke="#329FBF" stroke-width="2"/><path d="M220 269v-9a28 28 0 0 1 56 0v9" fill="#ECFAFC" stroke="#329FBF" stroke-width="2"/>
<circle cx="181" cy="224" r="22" fill="url(#support-route)" stroke="#fff" stroke-width="5"/><path d="m173 224 5 5 10-11" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<g class="support-art-shadow"><rect x="219" y="69" width="69" height="71" rx="18" fill="#fff" stroke="#C8E6F0"/><path d="M235 123V87h36v36M250 94v13M244 100h12M243 115h3M257 115h3" stroke="#258BD8" stroke-width="2" stroke-linecap="round"/></g>
<path d="M91 316c0 14-18 31-18 31s-18-17-18-31a18 18 0 0 1 36 0Z" fill="#fff" stroke="#48B9D9" stroke-width="2"/><circle cx="73" cy="316" r="6" fill="#DDF7FA" stroke="#48B9D9" stroke-width="2"/>
<circle cx="286" cy="315" r="7" fill="#48B9D9" stroke="#fff" stroke-width="4"/><circle cx="123" cy="110" r="5" fill="#76BDD9"/>
</svg>`,
    `<svg class="support-art" viewBox="0 0 360 420" fill="none" aria-hidden="true" focusable="false">
<defs><linearGradient id="support-loop" x1="67" y1="150" x2="300" y2="238" gradientUnits="userSpaceOnUse"><stop stop-color="#3978F6"/><stop offset=".6" stop-color="#639DEB"/><stop offset="1" stop-color="#43C4B3"/></linearGradient><radialGradient id="support-aqua"><stop stop-color="#CFF5ED"/><stop offset="1" stop-color="#E2FAF6" stop-opacity="0"/></radialGradient></defs>
<circle cx="227" cy="231" r="125" fill="url(#support-aqua)"/>
<ellipse cx="180" cy="206" rx="157" ry="97" stroke="#BFDCF1" transform="rotate(-24 180 206)"/><ellipse cx="180" cy="206" rx="134" ry="129" stroke="#D4E8F4" stroke-dasharray="3 8"/>
<g class="support-art-shadow"><rect x="57" y="142" width="123" height="123" rx="40" fill="#fff" fill-opacity=".8" stroke="#C9DDF8" transform="rotate(-8 118 203)"/><rect x="182" y="142" width="123" height="123" rx="40" fill="#fff" fill-opacity=".8" stroke="#C3E7E8" transform="rotate(8 243 203)"/>
<path d="M180 205c-33-48-52-51-69-51a51 51 0 0 0 0 102c17 0 36-3 69-51s52-51 69-51a51 51 0 0 1 0 102c-17 0-36-3-69-51Z" stroke="url(#support-loop)" stroke-width="17" stroke-linecap="round"/>
<path d="M181 197c-33-45-51-47-70-47" stroke="#fff" stroke-opacity=".65" stroke-width="3" stroke-linecap="round"/></g>
<rect x="218" y="61" width="68" height="54" rx="17" fill="#fff" stroke="#CCE5F2"/><path d="m233 98 13-13 10 5 16-17M261 73h11v11" stroke="#3978F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M89 337h182" stroke="#BBDCDf" stroke-width="2"/><g fill="#fff" stroke="#CBE3ED"><circle cx="89" cy="337" r="25"/><circle cx="180" cy="337" r="25"/><circle cx="271" cy="337" r="25"/></g>
<g stroke="#3978F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m79 329 10-4 10 4v10q-2 8-10 12-8-4-10-12ZM84 337l4 4 6-8M176 331l-5 5a5 5 0 0 0 7 7l5-5M184 343l5-5a5 5 0 0 0-7-7l-5 5"/></g><path d="m260 344 8-8 6 3 9-11M276 328h7v7" stroke="#3DB5AD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M68 105h12M74 99v12" stroke="#78ADEE" stroke-width="2"/><circle cx="309" cy="264" r="5" fill="#76CEC4"/>
</svg>`
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
    var subtitleEl = document.getElementById("partnerStorySubtitle");
    var quoteEl = document.getElementById("partnerStoryQuote");
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
      var icon = document.createElement("span");
      icon.className = "partner-nav-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">' + partnerIcons[i] + '</svg>';
      var copy = document.createElement("span");
      copy.className = "partner-nav-copy";
      var number = document.createElement("span");
      number.className = "partner-nav-number";
      number.textContent = step.number;
      var name = document.createElement("span");
      name.textContent = step.shortTitle;
      copy.appendChild(number);
      copy.appendChild(name);
      btn.appendChild(icon);
      btn.appendChild(copy);
      btn.addEventListener("click", function () { scrollToStep(i); });
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
        subtitleEl.textContent = step.subtitle;
        descEl.replaceChildren();
        step.paragraphs.forEach(function (paragraph) {
          var p = document.createElement("p");
          p.textContent = paragraph;
          descEl.appendChild(p);
        });
        descEl.scrollTop = 0;
        quoteEl.textContent = step.quote;
        visualEl.innerHTML = partnerArtwork[index];
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
      renderStep(index, animate && !prefersReducedMotion);
    }

    function scrollToStep(index) {
      var stageHeight = stage.offsetHeight;
      var scrollRange = track.offsetHeight - stageHeight;
      var trackTop = track.getBoundingClientRect().top + window.scrollY;
      var targetY =
        trackTop - getHeaderHeight() + CLICK_TARGET_PROGRESS[index] * scrollRange;
      // Reduced motion: jump instantly rather than animating the scroll —
      // the step still changes via the normal scroll-driven update() once
      // the page lands there, so nav clicks stay fully functional.
      window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? "auto" : "smooth" });
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
