(function () {
  var status = document.getElementById('visitor-status');
  var value = document.getElementById('visitor-count');
  if (location.hostname !== 'lawrenceriver.github.io') {
    if (status) status.textContent = '本地预览不计数，请在正式网站查看。';
    return;
  }
  // Keep the original counter alongside GoatCounter for comparison.
  var legacy = document.createElement('script');
  legacy.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  legacy.async = true;
  document.head.appendChild(legacy);
  var endpoint = 'https://lawrenceriver.goatcounter.com';
  if (/^\/visitors-f18c6d90(?:\/|$)/.test(location.pathname)) {
    fetch(endpoint + '/counter/TOTAL.json', {signal: AbortSignal.timeout(12000)})
      .then(function (response) { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(function (data) {
        if (!/^[\d,\s]+$/.test(String(data.count))) throw new Error('Invalid count');
        if (value) value.textContent = data.count;
        if (status) status.textContent = '累计去重访问 · GoatCounter';
      })
      .catch(function () { if (status) status.textContent = '统计暂不可用，或尚未收到首次访问，请稍后查看。'; });
    return;
  }
  if (document.querySelector('script[data-lawrence-counter]')) return;
  // One path for the whole site: browsing multiple pages does not multiply visits.
  window.goatcounter = {path: '/', title: 'Lawrence River'};
  var script = document.createElement('script');
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', endpoint + '/count');
  script.dataset.lawrenceCounter = 'true';
  script.async = true;
  script.onload = function () {
    var gc = window.goatcounter;
    if (!gc || !gc.url || gc.filter()) return;
    var url = gc.url({path: location.pathname, title: document.title});
    if (!url) return;
    url = url.replace(endpoint + '/count', 'https://lawrenceriver-raw.goatcounter.com/count');
    if (!navigator.sendBeacon || !navigator.sendBeacon(url)) {
      var pixel = document.createElement('img');
      pixel.src = url; pixel.alt = ''; pixel.width = 1; pixel.height = 1;
      pixel.style.position = 'absolute';
      document.body.appendChild(pixel);
    }
  };
  document.head.appendChild(script);
})();
