// todo: see below; 
// todo: calculate and show distances in a div-box at the top left
// todo: better attractors (stick all points to the lines)

// initialize coordinate system
var board = JXG.JSXGraph.initBoard('jxgbox', {
  boundingbox: [0, 100, 100, 0],
  keepaspectratio: true,
  opacity: 0
});



// todo: load image from local storage or external URL without uploading the image
var url = new URL(window.location.href);
var urlImg = url.searchParams.get('img');
if (!urlImg)
  urlImg = 'https://wiki.fricklers.org/lib/exe/fetch.php/abstand/2018-10-05_alltagserlebnisse_17_43_4.jpg.jpg';
// set background image
// todo: determine size of the image automatically (not fixed 192:108 ratio as in FullHD)
var im = board.create('image', [urlImg, [0, 0],
  [192, 108]
], {
  fixed: true
});

// initialize moving points
var F = board.create('point', [108, 82], {
  name: 'F',
  size: 4,
  color: '#ffff00'
}); // vanishing point
var moveS = board.create('point', [18, 20], {
  name: 'moveS',
  size: 20,
  color: '#ffff00',
  withLabel: false
}); // left lane
var moveR = board.create('point', [137, 2], {
  name: 'moveR',
  size: 20,
  color: '#ffff00',
  withLabel: false
}); // right lane
var moveA = board.create('point', [66, 2], {
  name: 'moveA',
  size: 20,
  color: '#ffff00',
  withLabel: false
}); // car 
// todo: determine middle of the image automatically
var midbot = board.create('point', [96, 0], {
  name: 'M',
  size: 4,
  fixed: true
}); // camera position (bottom)

var midbot = board.create('point', [96, 108], {
  name: 'M\'',
  size: 4,
  fixed: true
}); // camera position (top)

// aux lines (perspective)
var ltrack = board.create('segment', ['F', 'moveS'], {
  strokeColor: '#ffffff',
  strokeWidth: 2,
  fixed: true
});
var rtrack = board.create('segment', ['F', 'moveR'], {
  strokeColor: '#0000ff',
  strokeWidth: 2,
  fixed: true
});
// horizontal aux lines
var srtrack = board.create('segment', [
  [40, 35],
  [125, 35]
], {
  name: 'srtrack',
  strokeColor: '#ff00ff',
  strokeWidth: 6
});
var srtrackcopy = board.create('segment', [
  [70, 56],
  [117.5, 56]
], {
  withLabel: false
});
// more aux lines (perspective)
var ktrack = board.create('segment', ['F', 'M'], {
  strokeColor: '#00ff00',
  strokeWidth: 2,
  fixed: true
});

var ktracktop = board.create('segment', ['F', 'M\''], {
  strokeColor: '#00ff00',
  strokeWidth: 2,
  fixed: true
});

var atrack = board.create('segment', ['F', 'moveA'], {
  strokeColor: '#ff0000',
  strokeWidth: 2,
  fixed: true
});
// aux points (copies)
var Scopy = board.create('intersection', [ltrack, srtrackcopy, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:12px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">S\' (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
var Rcopoy = board.create('intersection', [rtrack, srtrackcopy, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:12px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">R\' (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
var Kcopy = board.create('intersection', [ktrack, srtrackcopy, 0], {
    name: function() {
    return '<span style="display: inline-block; font-size:12px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">K\' (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
var Acopy = board.create('intersection', [atrack, srtrackcopy, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:12px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">A\' (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
// copy of car position and camera projection points
var S = board.create('intersection', [ltrack, srtrack, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:20px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">S (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
var A = board.create('intersection', [atrack, srtrack, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:20px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">A (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
var K = board.create('intersection', [ktrack, srtrack, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:20px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">K (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});
var R = board.create('intersection', [rtrack, srtrack, 0], {
  name: function() {
    return '<span style="display: inline-block; font-size:20px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">R (' 
+  Math.round(this.X()*100)/100 + ', ' + Math.round(this.Y()*100)/100 + ')</span>';
  }
});

// calculations

var results = board.create('point', [10, 80], {
  name: function() {
    var SR_dist = Math.round( (R.X()-S.X()) * 100 )/100;
    var SA_dist = Math.round( (A.X()-S.X()) * 100 )/100;
    var SA_dist_ratio = SA_dist / SR_dist * 100;
    var AK_dist = Math.round( (K.X()-A.X()) * 100 )/100;
    var AK_dist_ratio = AK_dist / SR_dist * 100;
    var KR_dist = Math.round( (R.X()-K.X()) * 100 )/100;
    var KR_dist_ratio = KR_dist / SR_dist * 100;

    return '<span style="display: inline-block; font-size:20px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">SR = ' +  SR_dist + '&nbsp;&nbsp;&nbsp;(100%)<br>SA = ' + SA_dist + '&nbsp;&nbsp;&nbsp;(' + Math.round(SA_dist_ratio*10)/10 + '%)<br>AK = ' + AK_dist + '&nbsp;&nbsp;&nbsp;(' + Math.round(AK_dist_ratio*10)/10 + '%)<br>KR = ' + KR_dist + '&nbsp;&nbsp;&nbsp;(' + Math.round(KR_dist_ratio*10)/10 + '%)</span>';
  },
  size: 0,
  color: '#ffffff',
  withLabel: true
}); 


// Load image from file and update board. Requires jQuery and File API.
$("#imgfiles").change(function() {
  var imgfile = document.getElementById('imgfiles').files[0];
  if (!imgfile.type.match('image')) {
    alert("File '" + imgfile.name + "' [" + imgfile.type + "] is not an image!");
    return false;
  }
  var reader = new FileReader();
  reader.readAsDataURL(imgfile);
  reader.onload = function(event) {
    im.url = reader.result;
    board.update();
  }
});



