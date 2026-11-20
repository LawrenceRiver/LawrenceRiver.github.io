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
    function send(hit) {
      var url = gc.url(hit);
      if (!url) return;
      url = url.replace(endpoint + '/count', 'https://lawrenceriver-raw.goatcounter.com/count');
      if (!navigator.sendBeacon || !navigator.sendBeacon(url)) {
        var pixel = new Image();
        pixel.src = url;
      }
    }
    send({path: location.pathname, title: document.title});
    var deviceModel = '未提供';
    function section(path) {
      var key = path.replace(/\/(?=#|$)/g, '') || '/';
      send({path: 'lrsection:' + key, title: key, event: true, no_session: true});
      var source = '直接访问／未提供';
      try {if (document.referrer) source = new URL(document.referrer).hostname;} catch (_) {}
      var ua = navigator.userAgent || '';
      var system = /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iOS / iPadOS' : /Windows/i.test(ua) ? 'Windows' : /Macintosh/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : '未提供';
      var device = deviceModel !== '未提供' ? deviceModel : /iPhone/i.test(ua) ? 'iPhone（型号未提供）' : /iPad/i.test(ua) ? 'iPad（型号未提供）' : /Mobile|Android/i.test(ua) ? '移动设备（型号未提供）' : '电脑／其他（型号未提供）';
      var details = [key, source, device, system, screen.width + ' × ' + screen.height, new Date().toISOString().slice(0,16)+'Z'];
      send({path:'lrdetail:'+encodeURIComponent(JSON.stringify(details)),title:'分栏点击明细',event:true,no_session:true});
    }
    window.addEventListener('section-open', function (event) { section(event.detail); });
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      var url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/^\/(?:bios(?:\/(?:computer|music|ai-music))?|research|music|riverb)?\/?$/.test(url.pathname)) return;
      if (url.hash && !/^#[a-z][a-z0-9-]{0,70}$/i.test(url.hash)) return;
      section(url.pathname + url.hash);
    }, true);
    function model(value) {
      var label = typeof value === 'string' && /^[a-z0-9 ._()+-]{1,64}$/i.test(value.trim()) ? value.trim() : '未提供';
      deviceModel = label;
      send({path: 'lrmodel:' + label, title: label, event: true, no_session: true});
    }
    var hints = navigator.userAgentData;
    if (hints && hints.getHighEntropyValues) {
      hints.getHighEntropyValues(['model']).then(function (info) {model(info.model);}, function () {model();});
    } else model();
  };
  document.head.appendChild(script);
})();
