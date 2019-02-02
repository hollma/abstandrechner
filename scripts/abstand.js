function imgonload_fun(board, img) {
    // dummy function
};

function create_initial_geometry() {
    // initialize coordinate system via loaded image
    var board = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [0, img.naturalHeight, img.naturalWidth, 0],
        keepaspectratio: true,
        opacity: 0,
        zoom: false, // does not work?
        pan: false,  // does not work?
        grid: false,
        showCopyright: false
    });

    board.attr.pan.enabled = false;
    board.attr.zoom.enabled = false;

    window.document.board = board;

    var boardbox = document.getElementById('jxgbox');

    im = board.create('image', [img.src, [0, 0],
        [img.naturalWidth, img.naturalHeight]
    ], {
        name: 'my_photo',
        fixed: true
    });

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

    F.on('mousedrag', show_results2);
    moveS.on('mousedrag', show_results2);
    moveR.on('mousedrag', show_results2);
    moveA.on('mousedrag', show_results2);
    movedash.on('mousedrag', show_results2);

    // todo: determine middle of the image automatically
    var midbot = board.create('point', [img.naturalWidth / 2, 0], {
        name: 'M',
        size: 4,
        fixed: true
    }); // camera position (bottom)

    var midtop = board.create('point', [img.naturalWidth / 2, img.naturalHeight], {
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
        fixed: true,
        dash: 2
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

    board.update();
}

// calculations
/*
function show_results() {
    var board = window.document.board;
    var results = board.create('point', [20, 800], {
        name: function () {
            var SR_dist = Math.abs(Math.round((R.X() - S.X()) * 1000) / 1000);
            var AK_dist = Math.abs(Math.round((K.X() - A.X()) * 1000) / 1000);
            var AK_dist_ratio = AK_dist / SR_dist;

            var ref_size_in_cm = document.getElementById('ref_size_in_cm').value;
            return '<span style="display: inline-block; font-size:16px; vertical-align: left; background-color:rgba(255,255,0,.5); left-margin: 0px;">Abstand zwischen Auto und Kamera = ' + Math.round(Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm) + 'cm</span>';
        },
        size: 0,
        color: '#ffffff',
        withLabel: true
    });
    return 0;
} */

function show_results2() {
    var board = window.document.board;
    var R = board.elementsByName['R'];
    var S = board.elementsByName['S'];
    var K = board.elementsByName['K'];
    var A = board.elementsByName['A'];
    // var M = board.elementsByName['M'];
    var SR_dist = Math.abs(Math.round((R.X() - S.X()) * 1000) / 1000);
    var AK_dist = Math.abs(Math.round((K.X() - A.X()) * 1000) / 1000);
    var AK_dist_ratio = AK_dist / SR_dist;
    var ref_size_in_cm = document.getElementById('ref_size_in_cm').value;
    // neue Werte
    var offset_right_in_cm = document.getElementById('offset_right_in_cm').value;
    var offset_left_in_cm = document.getElementById('offset_left_in_cm').value;
    var measuring_error = document.getElementById('measuring_error').value;
 
    document.getElementById('cam_car_in_cm').value = Math.round(Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm) + ' cm';
    document.getElementById('cam_car_in_cm_with_error').value =  (Math.round((1 + measuring_error / 100) * Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm)) + ' cm';

    // car left of bike
    if (K.X() > A.X()) {
        document.getElementById('car_bike_in_cm').value = Math.round(Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm) - offset_left_in_cm + ' cm';
        document.getElementById('car_bike_in_cm_with_error').value =  Math.round((1 + measuring_error / 100) * Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm) - offset_left_in_cm + ' cm';
    } // car right of bike
    else {
        document.getElementById('car_bike_in_cm').value = Math.round(Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm) - offset_right_in_cm + ' cm';
        document.getElementById('car_bike_in_cm_with_error').value = Math.round((1 + measuring_error / 100) * Math.round(AK_dist_ratio * 1000) / 1000 * ref_size_in_cm) - offset_right_in_cm + ' cm';
    }
}


JXG.Options.renderer = 'canvas';

// todo: load image from local storage or external URL without uploading the image
// take care of asynchronous javascript behaviour -> callback once the image is loaded? semaphores?
var url = new URL(window.location.href);
var urlImg = url.searchParams.get('img');
var debug = url.searchParams.get('debug');
if (!urlImg)
    urlImg = 'example/2018-10-05_alltagserlebnisse_17_43_4.jpg.jpg';

var board = JXG.JSXGraph.initBoard('jxgbox');
var im;
// set background image

var img = new Image(); 
img.onload = imgonload_fun();
img.src = urlImg;

create_initial_geometry();

// show_results();
show_results2();


// Load image from file and update board. Requires jQuery and File API.
$("#imgfiles").change(function () {
    var board = window.document.board;
    var imgfile = document.getElementById('imgfiles').files[0];
    if (!imgfile.type.match('image')) {
        alert("File '" + imgfile.name + "' [" + imgfile.type + "] is not an image!");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(imgfile);
    reader.onload = function (event) {
        img.src = reader.result;
        im.url = reader.result;

        var my_photo = board.elementsByName['my_photo'];
        my_photo.setSize(img.naturalWidth, img.naturalHeight);
        var midbot = board.elementsByName['M'];
        var midtop = board.elementsByName['M\''];

        midbot.moveTo([img.naturalWidth / 2, 0]);
        midtop.moveTo([img.naturalWidth / 2, img.naturalHeight]);

        board.attr.boundingbox = [0, img.naturalHeight, img.naturalWidth, 0];
        board.update();
    }
});



// change reference size in cm
$("#ref_size_in_cm").change(function () {
    window.document.board.update();
    show_results2();
});

// change left offset
$("#offset_left_in_cm").change(function () {
    window.document.board.update();
    show_results2();
});

// change right offset
$("#offset_right_in_cm").change(function () {
    window.document.board.update();
    show_results2();
});

// change measuring_error
$("#measuring_error").change(function () {
    window.document.board.update();
    show_results2();
});

var board = window.document.board;
board.on('update', show_results2);
/*
var F = board.elementsByName['F'];
var moveS = board.elementsByName['moveS'];
var moveR = board.elementsByName['moveR'];
var moveA = board.elementsByName['moveA'];
var movedash = board.elementsByName['movedash'];
*/



