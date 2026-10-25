/* copilot.langx.io: "Margin notes".
   Everything here is an enhancement. With JS off the page shows every
   illustration with its marks in their final state, and the navigation as
   a row.

   Order matters: the menu is wired first, then the page is marked
   "enhanced" (the CSS only collapses the navigation once that class is
   there for good). The connectors come last, so a problem drawing them can
   never leave the page half-built. */
(function () {
  "use strict";

  var root = document.documentElement;
  var motion = root.classList.contains("motion");
  var SVG_NS = "http://www.w3.org/2000/svg";

  /* ------------------------------------------------------------------
     Masthead: a hairline appears once the page has scrolled.
     ------------------------------------------------------------------ */
  var masthead = document.querySelector(".masthead");
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     Small-screen menu.
     ------------------------------------------------------------------ */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    toggle.hidden = false;
  }

  /* The menu works: let the CSS collapse the navigation. */
  root.classList.add("enhanced");

  /* ------------------------------------------------------------------
     Connectors: a thin, slightly unsteady line from Copilot's margin note
     to the mark it explains. Only drawn when the note sits beside the
     sentence; when it drops underneath (phones), the note's blue rule
     does the pointing instead.
     ------------------------------------------------------------------ */
  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function r(n) {
    return Math.round(n * 10) / 10;
  }

  /* The note settles in from a few pixels lower; measure where it ends up,
     not where it starts. */
  function shiftY(node) {
    try {
      var t = getComputedStyle(node).transform;
      if (!t || t === "none") return 0;
      return new DOMMatrixReadOnly(t).m42 || 0;
    } catch (e) {
      return 0;
    }
  }

  function drawConnector(fig, opts) {
    opts = opts || {};
    var svg = fig.querySelector(".connector");
    var note = fig.querySelector(".note");
    var anchor = fig.querySelector("[data-anchor]");
    if (!svg || !note || !anchor) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (!fig.offsetParent) return;

    var word = anchor.closest(".w") || anchor;
    var f = fig.getBoundingClientRect();
    var n = note.getBoundingClientRect();
    var label = (note.querySelector(".note-label") || note).getBoundingClientRect();
    var w = word.getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(word).fontSize) || 16;
    var dy0 = shiftY(note);

    // Stacked layout: the note is under the sentence, not beside it.
    if (n.left < w.right + 24) return;

    var sx = n.left - f.left - 14;
    var sy = label.top - dy0 - f.top + label.height / 2;
    var ex = w.left - f.left + w.width * 0.6;
    var ey = w.top - f.top + fs * 0.93;

    if (anchor.closest(".caret")) {
      // A caret: point at its foot, between the words.
      var c = anchor.getBoundingClientRect();
      ex = c.left - f.left + c.width / 2;
      ey = w.top - f.top + fs * 1.16;
    } else if (anchor.classList.contains("mk-under")) {
      // An underline: come up to just beneath it.
      ey = w.top - f.top + fs * 1.16;
    }
    if (sy < ey + 8) sy = ey + 8;

    var dx = sx - ex;
    var dy = sy - ey;
    // Leave the note almost level, sag a touch, then rise into the mark.
    var c1x = sx - dx * 0.42;
    var c1y = sy + Math.min(10, dy * 0.12) + 2;
    var c2x = ex + dx * 0.16;
    var c2y = ey + dy * 0.98;
    // A small midway wobble so it reads as drawn, not plotted.
    var mx = (sx + ex) / 2 + dx * 0.04;
    var my = sy + dy * 0.02 - 1.5;

    var d =
      "M" + r(sx) + " " + r(sy) +
      " Q" + r(c1x + dx * 0.12) + " " + r(c1y) + " " + r(mx) + " " + r(my) +
      " Q" + r(c2x) + " " + r(c2y) + " " + r(ex) + " " + r(ey);

    var ang = Math.atan2(ey - c2y, ex - c2x);
    var L = 9;
    var head =
      "M" + r(ex - L * Math.cos(ang - 0.48)) + " " + r(ey - L * Math.sin(ang - 0.48)) +
      " L" + r(ex) + " " + r(ey) +
      " L" + r(ex - L * Math.cos(ang + 0.5)) + " " + r(ey - L * Math.sin(ang + 0.5));

    svg.classList.toggle("static", !opts.animate);
    if (opts.delay != null) {
      svg.style.setProperty("--t-line-js", Math.max(0, opts.delay).toFixed(2) + "s");
    } else {
      svg.style.removeProperty("--t-line-js");
    }
    svg.appendChild(el("circle", { cx: r(sx), cy: r(sy), r: "2.4" }));
    svg.appendChild(el("path", { d: d, pathLength: "1", class: "cn-line" }));
    svg.appendChild(el("path", { d: head, pathLength: "1", class: "cn-head" }));
  }

  /* A connector is decoration: never let it break anything else. */
  function safeDraw(fig, opts) {
    try {
      drawConnector(fig, opts);
    } catch (e) {}
  }

  /* Restart a figure's CSS marking-up sequence. */
  function play(fig) {
    if (!motion) return;
    fig.classList.remove("play");
    void fig.offsetWidth;
    fig.classList.add("play");
  }

  function lineDelay(fig) {
    var v = getComputedStyle(fig).getPropertyValue("--t-line");
    return parseFloat(v) || 0;
  }

  /* How far the figure's CSS sequence has got, read off the note's own
     animation (it is paused until the fonts are in, so this is the real
     clock, not time since navigation). */
  function sequenceTime(fig) {
    var c = fig.querySelector(".note");
    var a = c && c.getAnimations ? c.getAnimations()[0] : null;
    if (a && a.currentTime != null) return a.currentTime / 1000;
    return performance.now() / 1000;
  }

  function whenFonts(fn) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fn, fn);
    } else {
      fn();
    }
  }

  /* ------------------------------------------------------------------
     Hero: the proof marks itself up on load (in CSS); the connector joins
     in at the right moment, and the reader can replay it.
     ------------------------------------------------------------------ */
  var hero = document.querySelector(".proof--hero");
  var replay = hero && hero.querySelector(".replay");

  function drawHero(fromStart) {
    if (!hero) return;
    if (!motion) return safeDraw(hero, { animate: false });
    var elapsed = fromStart ? 0 : sequenceTime(hero);
    var delay = lineDelay(hero) - elapsed;
    safeDraw(hero, { animate: delay > -0.7, delay: delay });
  }

  if (hero && replay && motion) {
    replay.hidden = false;
    replay.addEventListener("click", function () {
      play(hero);
      drawHero(true);
    });
  }

  /* ------------------------------------------------------------------
     The plates further down: each marks itself up the first time it
     scrolls into view. Until then it waits, paused at its first frame.
     ------------------------------------------------------------------ */
  var plates = Array.prototype.slice.call(
    document.querySelectorAll("[data-proof]:not(.proof--hero)")
  );

  function release(fig) {
    fig.classList.remove("waiting");
  }

  if (motion && plates.length) {
    plates.forEach(function (fig) {
      fig.classList.add("play", "waiting");
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            release(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.45 }
      );
      plates.forEach(function (fig) {
        io.observe(fig);
      });
    } else {
      plates.forEach(release);
    }
  }

  function drawPlate(fig) {
    if (motion && fig.classList.contains("waiting")) {
      safeDraw(fig, { animate: true, delay: lineDelay(fig) });
    } else {
      safeDraw(fig, { animate: false });
    }
  }

  whenFonts(function () {
    drawHero(false);
    plates.forEach(drawPlate);
  });

  /* ------------------------------------------------------------------
     Keep connectors attached to their words when the layout changes.
     ------------------------------------------------------------------ */
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (hero) safeDraw(hero, { animate: false });
      plates.forEach(drawPlate);
    }, 120);
  });
})();
