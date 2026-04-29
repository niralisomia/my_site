/**
 * Landing page: click-drag to draw ephemeral lines (desktop / fine pointer only).
 * Strokes fade by dropping points older than LINE_MAX_AGE_MS.
 */
(function () {
  'use strict';

  var LINE_MAX_AGE_MS = 60000;
  var canvas;
  var ctx;
  var strokes = [];
  var currentStroke = null;
  var rafId = null;

  function isDesktopDrawEnvironment() {
    // Fine pointer + hover capability filters out most phones and tablets.
    try {
      return (
        window.matchMedia('(pointer: fine)').matches &&
        window.matchMedia('(hover: hover)').matches
      );
    } catch (e) {
      return false;
    }
  }

  function isInteractiveTarget(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest) {
      return !!el.closest(
        'a, button, input, textarea, select, label, [role="button"], [contenteditable="true"]'
      );
    }
    return false;
  }

  function getInkStyle() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue(
      '--primary-text-color'
    );
    var color = (raw && raw.trim()) || '#222';
    return color;
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }

  function clientToCanvas(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function pruneOldPoints(now) {
    var i;
    var s;
    for (i = strokes.length - 1; i >= 0; i--) {
      s = strokes[i];
      s.points = s.points.filter(function (p) {
        return now - p.t <= LINE_MAX_AGE_MS;
      });
      if (s.points.length === 0) strokes.splice(i, 1);
    }
    if (currentStroke) {
      currentStroke.points = currentStroke.points.filter(function (p) {
        return now - p.t <= LINE_MAX_AGE_MS;
      });
    }
  }

  function redraw() {
    if (!canvas || !ctx) return;
    var now = Date.now();
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    pruneOldPoints(now);

    var ink = getInkStyle();
    ctx.save();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function strokePath(points) {
      if (points.length < 2) return;
      var j;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (j = 1; j < points.length; j++) {
        ctx.lineTo(points[j].x, points[j].y);
      }
      ctx.stroke();
    }

    var k;
    for (k = 0; k < strokes.length; k++) {
      strokePath(strokes[k].points);
    }
    if (currentStroke && currentStroke.points.length > 0) {
      strokePath(currentStroke.points);
    }
    ctx.restore();
  }

  function tick() {
    redraw();
    var alive =
      strokes.length > 0 ||
      (currentStroke && currentStroke.points.length > 0);
    if (!alive) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function ensureAnimationLoop() {
    if (rafId != null) return;
    rafId = requestAnimationFrame(tick);
  }

  function onMouseDown(e) {
    if (e.button !== 0) return;
    if (isInteractiveTarget(e.target)) return;
    var pt = clientToCanvas(e.clientX, e.clientY);
    var t = Date.now();
    currentStroke = { points: [{ x: pt.x, y: pt.y, t: t }] };
    ensureAnimationLoop();
  }

  function onMouseMove(e) {
    if (!currentStroke) return;
    if ((e.buttons & 1) !== 1) {
      endStroke();
      return;
    }
    var pt = clientToCanvas(e.clientX, e.clientY);
    var t = Date.now();
    currentStroke.points.push({ x: pt.x, y: pt.y, t: t });
  }

  function endStroke() {
    if (currentStroke && currentStroke.points.length > 1) {
      strokes.push(currentStroke);
    }
    currentStroke = null;
    ensureAnimationLoop();
  }

  function onMouseUp() {
    endStroke();
  }

  function onVisibilityChange() {
    if (document.hidden) endStroke();
  }

  function init() {
    if (!isDesktopDrawEnvironment()) return;

    canvas = document.getElementById('landing-draw-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
