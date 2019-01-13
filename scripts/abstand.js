// todo: see below;
// todo: calculate and show distances in a div-box at the top left
// todo: better attractors (stick all points to the lines)

JXG.Options.renderer = 'canvas';

// todo: load image from local storage or external URL without uploading the image
var url = new URL(window.location.href);
var urlImg = url.searchParams.get('img');
var debug = url.searchParams.get('debug');
if (!urlImg)
  urlImg = 'example/2018-10-05_alltagserlebnisse_17_43_4.jpg.jpg';
// set background image
// todo: determine size of the image automatically (not fixed 192:108 ratio as in FullHD)


var img = document.createElement('img', {id : "tmpimg"});

img.src = urlImg;

var board =  JXG.JSXGraph.initBoard('jxgbox');
var im;

function imgonload_fun(board){

  // initialize coordinate system
  board = JXG.JSXGraph.initBoard('jxgbox', {
    boundingbox: [0, img.naturalHeight, img.naturalWidth, 0],
    keepaspectratio: true,
    opacity: 0,
    zoom : false, // does not work?
    pan : false,  // does not work?
    grid : false,
    showCopyright: false
  });

  board.attr.pan.enabled  = false;
  board.attr.zoom.enabled = false;

  window.document.board = board;

  var boardbox = document.getElementById('jxgbox')

  im = board.create('image', [img.src, [0, 0],
    [img.naturalWidth, img.naturalHeight]
  ], {
    name : 'my_photo',
    fixed: true
  });

  board.update();
};   

img.onload = imgonload_fun(board);

function create_initial_geometry() {
  var board = window.document.board;

  // initialize moving points
  var F = board.create('point', [1080, 820], {
    name: 'F',
    size: 4,
    color: '#ffff00'
  }); // vanishing point
  var moveS = board.create('point', [1425, 20], {
    name: 'moveS',
    size: 20,
    color: '#ffff00',
    withLabel: false
  }); // left lane
  var moveR = board.create('point', [1370, 20], {
    name: 'moveR',
    size: 20,
    color: '#ffff00',
    withLabel: false
  }); // right lane
  var moveA = board.create('point', [660, 20], {
    name: 'moveA',
    size: 20,
    color: '#ffff00',
    withLabel: false
  }); // car
  var movedash = board.create('point', [20, 500], {
    name: 'movedash',
    size: 12,
    color: '#00ff00',
    withLabel: false
  });
  // todo: determine middle of the image automatically
  var midbot = board.create('point', [img.naturalWidth/2, 0], {
    name: 'M',
    size: 4,
    fixed: true
  }); // camera position (bottom)

  var midtop = board.create('point', [img.naturalWidth/2, img.naturalHeight], {
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
  var dashtrack = board.create('segment', ['F', 'movedash'], {
    strokeColor: '#00ff00',
    strokeWidth: 1,
    fixed : true,
    dash : 2
  });

  // horizontal aux lines
  var srtrack = board.create('line', [
    [400, 350],
    [1250, 350]
  ], {
    name: 'srtrack',
    strokeColor: '#ff00ff',
    strokeWidth: 6
  });
  var srtrackcopy = board.create('line', [
    [700, 560],
    [1175, 560]
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
    name: 'S\''
  });
  var Rcopy = board.create('intersection', [rtrack, srtrackcopy, 0], {
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
    name: 'A'
  });
  var K = board.create('intersection', [ktrack, srtrack, 0], {
    name: 'K'
  });
  var R = board.create('intersection', [rtrack, srtrack, 0], {
    name: 'R'
  });
}

// calculations
function show_results() {
  var board = window.document.board;
  var results = board.create('point', [20, 800], {
    name: function() {
      var SR_dist = Math.abs(Math.round( (R.X()-S.X()) * 1000 )/1000);
      var AK_dist = Math.abs(Math.round( (K.X()-A.X()) * 1000 )/1000);
      var AK_dist_ratio = AK_dist / SR_dist;

      var ref_size_in_cm = document.getElementById('ref_size_in_cm').value;
      return '<span style="display: inline-block; font-size:16px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">Abstand zwischen Auto und Kamera = ' + Math.round(Math.round(AK_dist_ratio*1000)/1000 * ref_size_in_cm) + 'cm</span>';
    },
    size: 0,
    color: '#ffffff',
    withLabel: true
  });
  return 0;
}

function show_results2() {
  var board = window.document.board;
  var R = board.elementsByName['R'];
  var S = board.elementsByName['S'];
  var K = board.elementsByName['K'];
  var A = board.elementsByName['A'];
  var SR_dist = Math.abs(Math.round( (R.X()-S.X()) * 1000 ) / 1000);
  var AK_dist = Math.abs(Math.round( (K.X()-A.X()) * 1000 ) / 1000);
  var AK_dist_ratio = AK_dist / SR_dist;
  var ref_size_in_cm = document.getElementById('ref_size_in_cm').value;
  document.getElementById('cam_car_in_cm').value = Math.round(Math.round(AK_dist_ratio*1000)/1000 * ref_size_in_cm) + ' cm';
}


create_initial_geometry();

// show_results();
show_results2();


// Load image from file and update board. Requires jQuery and File API.
$("#imgfiles").change(function() {
  var board = window.document.board;
  var imgfile = document.getElementById('imgfiles').files[0];
  if (!imgfile.type.match('image')) {
    alert("File '" + imgfile.name + "' [" + imgfile.type + "] is not an image!");
    return false;
  }
  var reader = new FileReader();
  reader.readAsDataURL(imgfile);
  reader.onload = function(event) {
    img.src = reader.result; 
    im.url = reader.result;

    var my_photo = board.elementsByName['my_photo'];
    my_photo.setSize(img.naturalWidth, img.naturalHeight);
    var midbot = board.elementsByName['M'];
    var midtop = board.elementsByName['M\''];

    midbot.moveTo([img.naturalWidth/2, 0]);
    midtop.moveTo([img.naturalWidth/2, img.naturalHeight]);

    board.attr.boundingbox = [0, img.naturalHeight, img.naturalWidth, 0];
    board.update();
  }
});

// change reference size in cm
$("#ref_size_in_cm").change(function() {
  var board = window.document.board;
  show_results();
  show_results2();
  board.update();
});

board.on('update', show_results2);


