(function () {
  var status = document.getElementById('visitor-status');
  var value = document.getElementById('busuanzi_value_site_uv');
  if (location.hostname !== 'lawrenceriver.github.io') {
    if (status) status.textContent = '本地预览不计数，请在正式网站查看。';
    return;
  }
  if (document.querySelector('script[data-lawrence-counter]')) return;
  var script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  script.dataset.lawrenceCounter = 'true';
  script.onerror = function () {
    if (status) status.textContent = '统计服务暂不可用，请稍后刷新。';
  };
  if (value) {
    var observer = new MutationObserver(function () {
      if (/^\d+$/.test(value.textContent.trim())) {
        status.textContent = '累计访客估算 · 不蒜子';
        observer.disconnect();
      }
    });
    observer.observe(value, {childList: true, characterData: true, subtree: true});
    window.setTimeout(function () {
      if (!/^\d+$/.test(value.textContent.trim())) {
        status.textContent = '统计服务尚未返回数据，请稍后刷新。';
      }
    }, 12000);
  }
  document.head.appendChild(script);
})();
