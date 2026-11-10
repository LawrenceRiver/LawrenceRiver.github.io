(function () {
  var status = document.getElementById('visitor-status');
  var value = document.getElementById('visitor-count');
  if (location.hostname !== 'lawrenceriver.github.io') {
    if (status) status.textContent = '本地预览不计数，请在正式网站查看。';
    return;
  }
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
  document.head.appendChild(script);
})();
