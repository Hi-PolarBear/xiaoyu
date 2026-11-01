(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- section entrances ---------- */

  var reveals = document.querySelectorAll('[data-reveal], [data-reveal-child]');

  if (!('IntersectionObserver' in window) || reduce) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ---------- the reel: the scroll wheel is the transport ---------- */

  var reel = document.getElementById('reel');
  var frames = reel ? reel.querySelectorAll('.player__frame') : [];
  var fill = document.getElementById('reelFill');
  var time = document.getElementById('reelTime');
  var cap = document.getElementById('reelCap');
  var track = document.getElementById('reelTrack');
  var dots = reel ? reel.querySelectorAll('.dot') : [];
  var reset = document.getElementById('reelReset');

  var CAPS = [
    '南天极光 · 印度洋上空 · NASA',
    '纳米布沙漠 · 沙丘的纹路，从上面看 · NASA',
    '巴哈马 · 浅海和深海，两种蓝 · NASA',
    '喜马拉雅 · 那道分开次大陆的雪线 · NASA'
  ];
  var SHORT = ['开头，极光', '纳米布沙漠', '巴哈马', '喜马拉雅'];
  var DURATION = 24;

  var shown = -1;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function timecode(sec) {
    return pad(Math.floor(sec / 60)) + ':' + pad(Math.floor(sec % 60));
  }

  function showSegment(i) {
    if (i === shown) return;

    Array.prototype.forEach.call(frames, function (f, k) {
      f.classList.toggle('is-on', k === i);
      if (k !== i) f.style.transform = '';
    });

    Array.prototype.forEach.call(dots, function (d, k) {
      d.classList.toggle('is-on', k === i);
      d.setAttribute('aria-current', k === i ? 'true' : 'false');
    });

    if (cap) {
      if (shown >= 0 && !reduce) {
        cap.classList.add('is-fading');
        window.setTimeout(function () {
          cap.textContent = CAPS[i];
          cap.classList.remove('is-fading');
        }, 180);
      } else {
        cap.textContent = CAPS[i];
      }
    }

    if (track) track.setAttribute('aria-valuetext', SHORT[i]);
    shown = i;
  }

  function scrub() {
    if (!reel) return;

    var rect = reel.getBoundingClientRect();
    var total = reel.offsetHeight - window.innerHeight;
    var p = total > 0 ? -rect.top / total : 0;
    p = p < 0 ? 0 : (p > 1 ? 1 : p);

    var count = CAPS.length;
    var idx = Math.floor(p * count);
    if (idx > count - 1) idx = count - 1;

    showSegment(idx);

    /* the shot creeps closer as its own segment plays: scrub back and it retreats */
    var frame = frames[idx];
    if (frame && !reduce) {
      var local = p * count - idx;
      frame.style.transform = 'scale(' + (1.08 + local * 0.1).toFixed(4) + ')';
    }

    if (fill) fill.style.width = (p * 100).toFixed(2) + '%';
    if (time) time.textContent = timecode(p * DURATION) + ' / ' + timecode(DURATION);
    if (track) track.setAttribute('aria-valuenow', String(Math.round(p * DURATION)));
  }

  var queued = false;

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      settle();
      scrub();
    });
  }

  /* ---------- the signature move: the wordmark settles as you leave ---------- */

  var mark = document.querySelector('.wordmark');

  function settle() {
    if (!mark || reduce) return;
    var h = window.innerHeight || 1;
    var progress = Math.min(window.scrollY, h) / h;
    mark.style.transform = 'scale(' + (1 - progress * 0.06).toFixed(4) + ')';
  }

  if (reel) {
    scrub();

    if (reset) {
      reset.addEventListener('click', function () {
        var top = reel.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      });
    }

    Array.prototype.forEach.call(dots, function (dot) {
      dot.addEventListener('click', function () {
        var count = CAPS.length;
        var seg = Number(dot.dataset.go) || 0;
        var total = reel.offsetHeight - window.innerHeight;
        var top = reel.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top + total * (seg / count) + 4,
          behavior: reduce ? 'auto' : 'smooth'
        });
      });
    });

    if (track) {
      track.addEventListener('click', function (e) {
        var box = track.getBoundingClientRect();
        var ratio = (e.clientX - box.left) / box.width;
        ratio = ratio < 0 ? 0 : (ratio > 1 ? 1 : ratio);
        var total = reel.offsetHeight - window.innerHeight;
        var top = reel.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + total * ratio, behavior: reduce ? 'auto' : 'smooth' });
      });
    }
  }

  if (mark || reel) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---------- the fixed half changes to the picture that matches ---------- */

  var facts = document.getElementById('facts');

  if (facts && 'IntersectionObserver' in window) {
    var moonIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        root.classList.toggle('moon', entry.isIntersecting);
      });
    }, { rootMargin: '-30% 0px -30% 0px' });

    moonIo.observe(facts);
  }

  /* ---------- day / night ---------- */

  var button = document.getElementById('night');

  if (button) {
    button.addEventListener('click', function () {
      var night = root.classList.toggle('night');
      button.setAttribute('aria-pressed', night ? 'true' : 'false');
    });
  }
})();
