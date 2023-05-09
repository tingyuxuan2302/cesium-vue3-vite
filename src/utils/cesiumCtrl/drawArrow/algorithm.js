import P from "./plotUtil"
import * as Cesium from "cesium"

var xp = {
  version: "1.0.0",
  createTime: "2018.6.19",
  author: "xupinhui"
}
var doubleArrowDefualParam = {
  type: "doublearrow",
  headHeightFactor: .25,
  headWidthFactor: .3,
  neckHeightFactor: .85,
  fixPointCount: 4,
  neckWidthFactor: .15
}
var tailedAttackArrowDefualParam = {
  headHeightFactor: .18,
  headWidthFactor: .3,
  neckHeightFactor: .85,
  neckWidthFactor: .15,
  tailWidthFactor: .1,
  headTailFactor: .8,
  swallowTailFactor: 1
};
var fineArrowDefualParam = {
  tailWidthFactor: 0.15,
  neckWidthFactor: 0.20,
  headWidthFactor: 0.25,
  headAngle: Math.PI / 8.5,
  neckAngle: Math.PI / 13
};
xp.algorithm = {},
  xp.algorithm.doubleArrow = function (inputPoint) {
    this.connPoint = null;
    this.tempPoint4 = null;
    this.points = inputPoint;
    var result = {
      controlPoint: null,
      polygonalPoint: null
    };
    //获取已经点击的坐标数
    var t = inputPoint.length;
    if (!(2 > t)) {
      if (2 == t) return inputPoint;
      var o = this.points[0],    //第一个点
        e = this.points[1],        //第二个点
        r = this.points[2],        //第三个点
        t = inputPoint.length; //获取已经点击的坐标数
      //下面的是移动点位后的坐标
      3 == t ? this.tempPoint4 = xp.algorithm.getTempPoint4(o, e, r) : this.tempPoint4 = this.points[3],
        3 == t || 4 == t ? this.connPoint = P.PlotUtils.mid(o, e) : this.connPoint = this.points[4];
      var n, g;
      P.PlotUtils.isClockWise(o, e, r) ? (n = xp.algorithm.getArrowPoints(o, this.connPoint, this.tempPoint4, !1), g = xp.algorithm.getArrowPoints(this.connPoint, e, r, !0)) : (n = xp.algorithm.getArrowPoints(e, this.connPoint, r, !1), g = xp.algorithm.getArrowPoints(this.connPoint, o, this.tempPoint4, !0));
      var i = n.length,
        s = (i - 5) / 2,
        a = n.slice(0, s),
        l = n.slice(s, s + 5),
        u = n.slice(s + 5, i),
        c = g.slice(0, s),
        p = g.slice(s, s + 5),
        h = g.slice(s + 5, i);
      c = P.PlotUtils.getBezierPoints(c);
      var d = P.PlotUtils.getBezierPoints(h.concat(a.slice(1)));
      u = P.PlotUtils.getBezierPoints(u);
      var f = c.concat(p, d, l, u);
      var newArray = xp.algorithm.array2Dto1D(f);
      result.controlPoint = [o, e, r, this.tempPoint4, this.connPoint];
      result.polygonalPoint = Cesium.Cartesian3.fromDegreesArray(newArray);
    }
    return result;
  },
  xp.algorithm.threeArrow = function (inputPoint) {
    this.connPoint = null;
    this.tempPoint4 = null;
    this.tempPoint5 = null;
    this.points = inputPoint;
    var result = {
      controlPoint: null,
      polygonalPoint: null
    };
    //获取已经点击的坐标数
    var t = inputPoint.length;
    if (t >= 2) {
      if (t == 2) {
        return inputPoint;
      }
      var o = this.points[0],    //第一个点
        e = this.points[1],        //第二个点
        r = this.points[2],        //第三个点
        t = inputPoint.length; //获取已经点击的坐标数
      //下面的是移动点位后的坐标
      if (t == 3) {
        this.tempPoint4 = xp.algorithm.getTempPoint4(o, e, r);
        this.tempPoint5 = P.PlotUtils.mid(r, this.tempPoint4);
      } else {
        this.tempPoint4 = this.points[3];
        this.tempPoint5 = this.points[4];
      }
      if (t < 6) {
        this.connPoint = P.PlotUtils.mid(o, e);
      } else {
        this.connPoint = this.points[5];
      }
      var n, g;
      if (P.PlotUtils.isClockWise(o, e, r)) {
        n = xp.algorithm.getArrowPoints(o, this.connPoint, this.tempPoint4, !1);
        g = xp.algorithm.getArrowPoints(this.connPoint, e, r, !0);
      } else {
        n = xp.algorithm.getArrowPoints(e, this.connPoint, r, !1);
        g = xp.algorithm.getArrowPoints(this.connPoint, o, this.tempPoint4, !0);
      }
      var i = n.length,
        s = (i - 5) / 2,
        a = n.slice(0, s),
        l = n.slice(s, s + 5),
        u = n.slice(s + 5, i),
        c = g.slice(0, s),
        p = g.slice(s, s + 5),
        h = g.slice(s + 5, i);
      c = P.PlotUtils.getBezierPoints(c);
      var d = P.PlotUtils.getBezierPoints(h.concat(a.slice(1)));
      u = P.PlotUtils.getBezierPoints(u);
      var f = c.concat(p, d, l, u);
      var newArray = xp.algorithm.array2Dto1D(f);
      result.controlPoint = [o, e, r, this.tempPoint4, this.tempPoint5, this.connPoint];
      result.polygonalPoint = Cesium.Cartesian3.fromDegreesArray(newArray);
    }
    return result;
  },
  xp.algorithm.array2Dto1D = function (array) {
    var newArray = [];
    array.forEach(function (elt) {
      newArray.push(elt[0]);
      newArray.push(elt[1]);
    });
    return newArray;
  },
  xp.algorithm.getArrowPoints = function (t, o, e, r) {
    this.type = doubleArrowDefualParam.type,
      this.headHeightFactor = doubleArrowDefualParam.headHeightFactor,
      this.headWidthFactor = doubleArrowDefualParam.headWidthFactor,
      this.neckHeightFactor = doubleArrowDefualParam.neckHeightFactor,
      this.neckWidthFactor = doubleArrowDefualParam.neckWidthFactor;
    var n = P.PlotUtils.mid(t, o),
      g = P.PlotUtils.distance(n, e),
      i = P.PlotUtils.getThirdPoint(e, n, 0, .3 * g, !0),
      s = P.PlotUtils.getThirdPoint(e, n, 0, .5 * g, !0);
    i = P.PlotUtils.getThirdPoint(n, i, P.Constants.HALF_PI, g / 5, r),
      s = P.PlotUtils.getThirdPoint(n, s, P.Constants.HALF_PI, g / 4, r);
    var a = [n, i, s, e],
      l = xp.algorithm.getArrowHeadPoints(a, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor),
      u = l[0],
      c = l[4],
      p = P.PlotUtils.distance(t, o) / P.PlotUtils.getBaseLength(a) / 2,
      h = xp.algorithm.getArrowBodyPoints(a, u, c, p),
      d = h.length,
      f = h.slice(0, d / 2),
      E = h.slice(d / 2, d);
    return f.push(u),
      E.push(c),
      f = f.reverse(),
      f.push(o),
      E = E.reverse(),
      E.push(t),
      f.reverse().concat(l, E)
  },
  xp.algorithm.getArrowHeadPoints = function (t, o, e) {
    this.type = doubleArrowDefualParam.type,
      this.headHeightFactor = doubleArrowDefualParam.headHeightFactor,
      this.headWidthFactor = doubleArrowDefualParam.headWidthFactor,
      this.neckHeightFactor = doubleArrowDefualParam.neckHeightFactor,
      this.neckWidthFactor = doubleArrowDefualParam.neckWidthFactor;
    var r = P.PlotUtils.getBaseLength(t),
      n = r * this.headHeightFactor,
      g = t[t.length - 1],
      i = (P.PlotUtils.distance(o, e), n * this.headWidthFactor),
      s = n * this.neckWidthFactor,
      a = n * this.neckHeightFactor,
      l = P.PlotUtils.getThirdPoint(t[t.length - 2], g, 0, n, !0),
      u = P.PlotUtils.getThirdPoint(t[t.length - 2], g, 0, a, !0),
      c = P.PlotUtils.getThirdPoint(g, l, P.Constants.HALF_PI, i, !1),
      p = P.PlotUtils.getThirdPoint(g, l, P.Constants.HALF_PI, i, !0),
      h = P.PlotUtils.getThirdPoint(g, u, P.Constants.HALF_PI, s, !1),
      d = P.PlotUtils.getThirdPoint(g, u, P.Constants.HALF_PI, s, !0);
    return [h, c, g, p, d];
  },
  xp.algorithm.getArrowBodyPoints = function (t, o, e, r) {
    for (var n = P.PlotUtils.wholeDistance(t), g = P.PlotUtils.getBaseLength(t), i = g * r, s = P.PlotUtils.distance(o, e), a = (i - s) / 2, l = 0, u = [], c = [], p = 1; p < t.length - 1; p++) {
      var h = P.PlotUtils.getAngleOfThreePoints(t[p - 1], t[p], t[p + 1]) / 2;
      l += P.PlotUtils.distance(t[p - 1], t[p]);
      var d = (i / 2 - l / n * a) / Math.sin(h),
        f = P.PlotUtils.getThirdPoint(t[p - 1], t[p], Math.PI - h, d, !0),
        E = P.PlotUtils.getThirdPoint(t[p - 1], t[p], h, d, !1);
      u.push(f),
        c.push(E)
    }
    return u.concat(c)
  },
  xp.algorithm.getTempPoint4 = function (t, o, e) {
    var r, n, g, i, s = P.PlotUtils.mid(t, o),
      a = P.PlotUtils.distance(s, e),
      l = P.PlotUtils.getAngleOfThreePoints(t, s, e);
    return l < P.Constants.HALF_PI ? (n = a * Math.sin(l), g = a * Math.cos(l), i = P.PlotUtils.getThirdPoint(t, s, P.Constants.HALF_PI, n, !1), r = P.PlotUtils.getThirdPoint(s, i, P.Constants.HALF_PI, g, !0)) : l >= P.Constants.HALF_PI && l < Math.PI ? (n = a * Math.sin(Math.PI - l), g = a * Math.cos(Math.PI - l), i = P.PlotUtils.getThirdPoint(t, s, P.Constants.HALF_PI, n, !1), r = P.PlotUtils.getThirdPoint(s, i, P.Constants.HALF_PI, g, !1)) : l >= Math.PI && l < 1.5 * Math.PI ? (n = a * Math.sin(l - Math.PI), g = a * Math.cos(l - Math.PI), i = P.PlotUtils.getThirdPoint(t, s, P.Constants.HALF_PI, n, !0), r = P.PlotUtils.getThirdPoint(s, i, P.Constants.HALF_PI, g, !0)) : (n = a * Math.sin(2 * Math.PI - l), g = a * Math.cos(2 * Math.PI - l), i = P.PlotUtils.getThirdPoint(t, s, P.Constants.HALF_PI, n, !0), r = P.PlotUtils.getThirdPoint(s, i, P.Constants.HALF_PI, g, !1)),
      r
  },
  xp.algorithm.tailedAttackArrow = function (inputPoint) {
    inputPoint = xp.algorithm.dereplication(inputPoint);
    this.tailWidthFactor = tailedAttackArrowDefualParam.tailWidthFactor;
    this.swallowTailFactor = tailedAttackArrowDefualParam.swallowTailFactor;
    this.swallowTailPnt = tailedAttackArrowDefualParam.swallowTailPnt;
    //控制点
    var result = {
      controlPoint: null,
      polygonalPoint: null
    };
    result.controlPoint = inputPoint;
    var t = inputPoint.length;
    if (!(2 > t)) {
      if (2 == inputPoint.length) {
        result.polygonalPoint = inputPoint;
        return result;
      }
      var o = inputPoint,
        e = o[0],
        r = o[1];
      P.PlotUtils.isClockWise(o[0], o[1], o[2]) && (e = o[1], r = o[0]);
      var n = P.PlotUtils.mid(e, r),
        g = [n].concat(o.slice(2)),
        i = xp.algorithm.getAttackArrowHeadPoints(g, e, r, tailedAttackArrowDefualParam),
        s = i[0],
        a = i[4],
        l = P.PlotUtils.distance(e, r),
        u = P.PlotUtils.getBaseLength(g),
        c = u * this.tailWidthFactor * this.swallowTailFactor;
      this.swallowTailPnt = P.PlotUtils.getThirdPoint(g[1], g[0], 0, c, !0);
      var p = l / u,
        h = xp.algorithm.getAttackArrowBodyPoints(g, s, a, p),
        t = h.length,
        d = [e].concat(h.slice(0, t / 2));
      d.push(s);
      var f = [r].concat(h.slice(t / 2, t));
      var newArray = [];
      f.push(a),
        d = P.PlotUtils.getQBSplinePoints(d),
        f = P.PlotUtils.getQBSplinePoints(f),
        newArray = xp.algorithm.array2Dto1D(d.concat(i, f.reverse(), [this.swallowTailPnt, d[0]]));
      result.polygonalPoint = Cesium.Cartesian3.fromDegreesArray(newArray);
    }
    return result;
  },
  xp.algorithm.getAttackArrowHeadPoints = function (t, o, e, defaultParam) {
    this.headHeightFactor = defaultParam.headHeightFactor;
    this.headTailFactor = defaultParam.headTailFactor;
    this.headWidthFactor = defaultParam.headWidthFactor;
    this.neckWidthFactor = defaultParam.neckWidthFactor;
    this.neckHeightFactor = defaultParam.neckHeightFactor;
    var r = P.PlotUtils.getBaseLength(t),
      n = r * this.headHeightFactor,
      g = t[t.length - 1];
    r = P.PlotUtils.distance(g, t[t.length - 2]);
    var i = P.PlotUtils.distance(o, e);
    n > i * this.headTailFactor && (n = i * this.headTailFactor);
    var s = n * this.headWidthFactor,
      a = n * this.neckWidthFactor;
    n = n > r ? r : n;
    var l = n * this.neckHeightFactor,
      u = P.PlotUtils.getThirdPoint(t[t.length - 2], g, 0, n, !0),
      c = P.PlotUtils.getThirdPoint(t[t.length - 2], g, 0, l, !0),
      p = P.PlotUtils.getThirdPoint(g, u, P.Constants.HALF_PI, s, !1),
      h = P.PlotUtils.getThirdPoint(g, u, P.Constants.HALF_PI, s, !0),
      d = P.PlotUtils.getThirdPoint(g, c, P.Constants.HALF_PI, a, !1),
      f = P.PlotUtils.getThirdPoint(g, c, P.Constants.HALF_PI, a, !0);
    return [d, p, g, h, f]
  },
  xp.algorithm.getAttackArrowBodyPoints = function (t, o, e, r) {
    for (var n = P.PlotUtils.wholeDistance(t), g = P.PlotUtils.getBaseLength(t), i = g * r, s = P.PlotUtils.distance(o, e), a = (i - s) / 2, l = 0, u = [], c = [], p = 1; p < t.length - 1; p++) {
      var h = P.PlotUtils.getAngleOfThreePoints(t[p - 1], t[p], t[p + 1]) / 2;
      l += P.PlotUtils.distance(t[p - 1], t[p]);
      var d = (i / 2 - l / n * a) / Math.sin(h),
        f = P.PlotUtils.getThirdPoint(t[p - 1], t[p], Math.PI - h, d, !0),
        E = P.PlotUtils.getThirdPoint(t[p - 1], t[p], h, d, !1);
      u.push(f),
        c.push(E)
    }
    return u.concat(c)
  },
  xp.algorithm.dereplication = function (array) {
    var last = array[array.length - 1];
    var change = false;
    var newArray = [];
    newArray = array.filter(function (i) {
      if (i[0] != last[0] && i[1] != last[1]) {
        return i;
      }
      change = true;
    });
    if (change) newArray.push(last);
    return newArray;
  },
  xp.algorithm.fineArrow = function (tailPoint, headerPoint) {
    if ((tailPoint.length < 2) || (headerPoint.length < 2)) return;
    //画箭头的函数
    let tailWidthFactor = fineArrowDefualParam.tailWidthFactor;
    let neckWidthFactor = fineArrowDefualParam.neckWidthFactor;
    let headWidthFactor = fineArrowDefualParam.headWidthFactor;
    let headAngle = fineArrowDefualParam.headAngle;
    let neckAngle = fineArrowDefualParam.neckAngle;
    var o = [];
    o[0] = tailPoint;
    o[1] = headerPoint;
    var e = o[0],
      r = o[1],
      n = P.PlotUtils.getBaseLength(o),
      g = n * tailWidthFactor,
      //尾部宽度因子
      i = n * neckWidthFactor,
      //脖子宽度银子
      s = n * headWidthFactor,
      //头部宽度因子
      a = P.PlotUtils.getThirdPoint(r, e, P.Constants.HALF_PI, g, !0),
      l = P.PlotUtils.getThirdPoint(r, e, P.Constants.HALF_PI, g, !1),
      u = P.PlotUtils.getThirdPoint(e, r, headAngle, s, !1),
      c = P.PlotUtils.getThirdPoint(e, r, headAngle, s, !0),
      p = P.PlotUtils.getThirdPoint(e, r, neckAngle, i, !1),
      h = P.PlotUtils.getThirdPoint(e, r, neckAngle, i, !0),
      d = [];
    d.push(a[0], a[1], p[0], p[1], u[0], u[1], r[0], r[1], c[0], c[1], h[0], h[1], l[0], l[1], e[0], e[1]);
    return Cesium.Cartesian3.fromDegreesArray(d);
  }
export { xp }