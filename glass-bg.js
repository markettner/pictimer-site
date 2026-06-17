/* ============================================================================
   Pictimer — animated glass-orb background (init)
   ----------------------------------------------------------------------------
   Finds every element with [data-glass-bg] and fills it with the orb layer,
   the frosted overlay, and (once per page) the SVG refraction filter.

   No dependencies. Pages only need:
       <div class="glass-bg" data-glass-bg></div>
       <link rel="stylesheet" href="glass-bg.css">
       <script src="glass-bg.js"></script>
   ========================================================================== */
(function () {
  'use strict';

  var DRIFTS = ['drift-a', 'drift-b', 'drift-c', 'drift-d',
                'drift-e', 'drift-f', 'drift-g', 'drift-h'];
  // staggered start delays (negative = already mid-cycle on load)
  var DELAYS = [0, -6, -12, -3, -9, -15, -4, -11];
  var ORB_COUNT = 8;

  function buildOrbs(host) {
    var orbs = document.createElement('div');
    orbs.className = 'glass-bg__orbs';
    for (var i = 0; i < ORB_COUNT; i++) {
      var orb = document.createElement('div');
      orb.className = 'orb';
      orb.style.setProperty('--drift', DRIFTS[i % DRIFTS.length]);
      orb.style.setProperty('--delay', DELAYS[i % DELAYS.length] + 's');
      orbs.appendChild(orb);
    }
    host.appendChild(orbs);

    var frost = document.createElement('div');
    frost.className = 'glass-bg__frost';
    host.appendChild(frost);
  }

  // Inject the SVG filter used by the experimental refraction toggle, once.
  function ensureRefractionFilter() {
    if (document.getElementById('glass-refraction')) return;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.innerHTML =
      '<filter id="glass-refraction" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" ' +
          'numOctaves="2" seed="7" result="noise"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="noise" scale="38" ' +
          'xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>';
    document.body.appendChild(svg);
  }

  function init() {
    ensureRefractionFilter();
    var hosts = document.querySelectorAll('[data-glass-bg]');
    for (var i = 0; i < hosts.length; i++) {
      buildOrbs(hosts[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
