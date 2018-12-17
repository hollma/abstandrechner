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
}); // camera position 

// aux lines (perspective)
var ltrack = board.create('line', ['F', 'moveS'], {
  strokeColor: '#ffffff',
  strokeWidth: 2
});
var rtrack = board.create('line', ['F', 'moveR'], {
  strokeColor: '#0000ff',
  strokeWidth: 2
});
// horizontal aux lines
var srtrack = board.create('line', [
  [40, 35],
  [125, 35]
], {
  name: 'srtrack',
  strokeColor: '#ff00ff',
  strokeWidth: 2
});
var srtrackcopy = board.create('line', [
  [70, 56],
  [117.5, 56]
], {
  withLabel: false
});
// more aux lines (perspective)
var ktrack = board.create('line', ['F', 'M'], {
  strokeColor: '#00ff00',
  strokeWidth: 2
});
var atrack = board.create('line', ['F', 'moveA'], {
  strokeColor: '#ff0000',
  strokeWidth: 2
});
// aux points (copies)
var Scopy = board.create('intersection', [ltrack, srtrackcopy, 0], {
  name: 'S\''
});
var Rcopoy = board.create('intersection', [rtrack, srtrackcopy, 0], {
  name: 'R\''
});
var Kcopy = board.create('intersection', [ktrack, srtrackcopy, 0], {
  name: 'K\''
});
var Acopy = board.create('intersection', [atrack, srtrackcopy, 0], {
  name: 'A\''
});
// copy of car position and camera projection points
var S = board.create('intersection', [ltrack, srtrack, 0], {
  name: 'S'
});
var A = board.create('intersection', [atrack, srtrack, 0], {
  name: function() {
    return 'A' + '<span style="display: inline-block; vertical-align: middle; background-color:rgba(255,0,0,.5); margin: 1em;">TODO:<br>display distance K-A<br>as multiple / fraction of<br> (known / measured) distance R\'-S\'</span>';
  }
});
var K = board.create('intersection', [ktrack, srtrack, 0], {
  name: 'K'
});
var R = board.create('intersection', [rtrack, srtrack, 0], {
  name: 'R'
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



