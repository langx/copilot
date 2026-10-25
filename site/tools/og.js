// The social preview's connector: the same hand-drawn line as on the page,
// from the note to the mark. Loaded by og-source.html.
function draw() {
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.getElementById("connector");
  var w = document.getElementById("anchor").getBoundingClientRect();
  var l = document.getElementById("note-label").getBoundingClientRect();
  var fs = parseFloat(getComputedStyle(document.getElementById("anchor")).fontSize);
  var r = function (n) { return Math.round(n * 10) / 10; };
  var sx = l.left - 16, sy = l.top + l.height / 2;
  var ex = w.left + w.width * 0.6, ey = w.top + fs * 0.93;
  var dx = sx - ex, dy = sy - ey;
  var c1x = sx - dx * 0.42 + dx * 0.12, c1y = sy + Math.min(10, dy * 0.12) + 2;
  var mx = (sx + ex) / 2 + dx * 0.04, my = sy + dy * 0.02 - 1.5;
  var c2x = ex + dx * 0.16, c2y = ey + dy * 0.98;
  var ang = Math.atan2(ey - c2y, ex - c2x), L = 11;
  var line = document.createElementNS(NS, "path");
  line.setAttribute("d", "M" + r(sx) + " " + r(sy) + " Q" + r(c1x) + " " + r(c1y) + " " + r(mx) + " " + r(my) + " Q" + r(c2x) + " " + r(c2y) + " " + r(ex) + " " + r(ey));
  var head = document.createElementNS(NS, "path");
  head.setAttribute("d", "M" + r(ex - L * Math.cos(ang - 0.48)) + " " + r(ey - L * Math.sin(ang - 0.48)) + " L" + r(ex) + " " + r(ey) + " L" + r(ex - L * Math.cos(ang + 0.5)) + " " + r(ey - L * Math.sin(ang + 0.5)));
  var dot = document.createElementNS(NS, "circle");
  dot.setAttribute("cx", r(sx));
  dot.setAttribute("cy", r(sy));
  dot.setAttribute("r", "2.8");
  svg.appendChild(dot);
  svg.appendChild(line);
  svg.appendChild(head);
}
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(draw, draw);
