var scare=1;
(function (doc, win) {
  var dpr = window.devicePixelRatio || 1;
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 40 * (clientWidth / 1366) + 'px';
      scare=Math.round(clientWidth / 1366);
      // 设置data-dpr属性，留作的css hack之用
      docEl.setAttribute('data-dpr', dpr);
      var delObj = document.getElementById("loading");
      if(delObj){
        $("#loading").remove();
      }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
