export const drag = (obj: any, sent: any) => {

  var dmW = document.documentElement.clientWidth || document.body.clientWidth;
  var dmH = document.documentElement.clientHeight || document.body.clientHeight;

  var sent = sent || {};
  var l = sent.l || 0;
  var r = sent.r || dmW - obj.offsetWidth;
  var t = sent.t || 0;
  var b = sent.b || dmH - obj.offsetHeight;
  // var n = sent.n || 10;

  obj.onmousedown = function (ev: any) {
    console.log('mousedown');
    var oEvent = ev || event;
    var sentX = oEvent.clientX - obj.offsetLeft;
    var sentY = oEvent.clientY - obj.offsetTop;

    document.onmousemove = function (ev) {
      var oEvent = ev || event;
      console.log('mousemove');
      var slideLeft = oEvent.clientX - sentX;
      var slideTop = oEvent.clientY - sentY;

      if (slideLeft <= l) {
        slideLeft = l;
      }
      if (slideLeft >= r) {
        slideLeft = r;
      }
      if (slideTop <= t) {
        slideTop = t;
      }
      if (slideTop >= b) {
        slideTop = b;
      }

      obj.style.left = slideLeft + 'px';
      obj.style.top = slideTop + 'px';

      // document.getElementById('posTop').innerHTML = slideTop;
      // document.getElementById('posLeft').innerHTML = slideLeft;

    };
    document.onmouseup = function () {
      console.log('mouseup');
      document.onmousemove = null;
      document.onmouseup = null;
    }

    return false;
  }
}