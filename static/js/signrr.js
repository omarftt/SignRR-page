// SignRR project page: comparison clips (sequence tabs, play/pause, replay) and BibTeX copy.
(function () {
  "use strict";

  var SEQUENCES = {
    "4723": "04October_2010_Monday_tagesschau-4723",
    "2700": "01October_2010_Friday_tagesschau-2700",
    "6436": "06May_2011_Friday_tagesschau-6436",
    "665": "11July_2009_Saturday_tagesschau-665",
    "6963": "15December_2009_Tuesday_tagesschau-6963",
    "3412": "17September_2010_Friday_tagesschau-3412",
    "3226": "26August_2009_Wednesday_tagesschau-3226",
    "5138": "27November_2011_Sunday_tagesschau-5138"
  };
  var CLIP_DIR = "static/videos/comparison/";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupComparison() {
    var root = document.getElementById("comparison");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".seq-tab"));
    var videos = Array.prototype.slice.call(root.querySelectorAll("video[data-model]"));
    var nameEl = root.querySelector("[data-seq-name]");
    var toggleBtn = root.querySelector("[data-action='toggle']");
    var replayBtn = root.querySelector("[data-action='replay']");
    var current = tabs[0].getAttribute("data-seq");
    var loaded = null; // sequence whose clips are attached to the <video> elements
    var userPaused = reduceMotion;

    // Clips load only when the section is near the viewport or a tab is chosen.
    function attach(seq) {
      videos.forEach(function (v) {
        var base = CLIP_DIR + seq + "/" + v.getAttribute("data-model");
        v.poster = base + ".jpg";
        v.src = base + ".mp4";
        v.preload = "auto";
      });
      loaded = seq;
    }

    function play(fromStart) {
      if (loaded !== current) attach(current);
      videos.forEach(function (v) {
        if (fromStart) {
          try { v.currentTime = 0; } catch (e) { /* not loaded yet */ }
        }
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });
    }

    function pause() {
      videos.forEach(function (v) { v.pause(); });
    }

    function showToggleState() {
      toggleBtn.querySelector("[data-label]").textContent = userPaused ? "Play" : "Pause";
      toggleBtn.querySelector("[data-icon='pause']").classList.toggle("is-hidden", userPaused);
      toggleBtn.querySelector("[data-icon='play']").classList.toggle("is-hidden", !userPaused);
    }

    function select(seq, moveFocus) {
      current = seq;
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-seq") === seq;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && moveFocus) t.focus();
      });
      nameEl.textContent = SEQUENCES[seq] || seq;
      attach(seq);
      if (!userPaused) play(true);
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.getAttribute("data-seq"), false); });
      t.addEventListener("keydown", function (e) {
        var j = null;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = tabs.length - 1;
        if (j !== null) {
          e.preventDefault();
          select(tabs[j].getAttribute("data-seq"), true);
        }
      });
    });

    replayBtn.addEventListener("click", function () {
      userPaused = false;
      showToggleState();
      play(true);
    });

    toggleBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      showToggleState();
      if (userPaused) pause();
      else play(false);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (loaded !== current) attach(current);
            if (!userPaused) play(false);
          } else {
            pause();
          }
        });
      }, { rootMargin: "150px 0px" }).observe(root);
    } else {
      attach(current);
      if (!userPaused) play(true);
    }
    showToggleState();
  }

  function setupBibtexCopy() {
    var btn = document.querySelector("[data-action='copy-bibtex']");
    var code = document.getElementById("bibtex");
    if (!btn || !code) return;
    var label = btn.querySelector("[data-label]");

    function fallbackCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* nothing else to try */ }
      document.body.removeChild(ta);
    }

    function copied() {
      label.textContent = "Copied";
      setTimeout(function () { label.textContent = "Copy"; }, 1500);
    }

    btn.addEventListener("click", function () {
      var text = code.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(copied, function () { fallbackCopy(text); copied(); });
      } else {
        fallbackCopy(text);
        copied();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupComparison();
    setupBibtexCopy();
  });
})();
