'use strict';

var ran = Math.floor(Math.random() * 3 + 1);
var host = 'live.aigis.me';
var liveStreams = [];
var djStreams = [];
var players = [];
var streamClosed = false;
var usingDJ = void 0;
var pigsCount = 0;
var effectElement = document.getElementById('effectElement');
// play se
function playSE(path) {
    if (effectElement.src !== '' && effectElement.ended === false && effectElement.paused === false) return;
    if (effectElement.src !== path) {
        effectElement.src = path;
        effectElement.load();
    }
    effectElement.play();
}
function muteSE() {
    effectElement.muted = true;
}
function hideOrShowLeft() {
    var left = document.getElementById('left');
    var botton = document.getElementById('botton-arrow');
    if (left.classList.contains('left-hidden')) {
        left.classList.remove('left-hidden');
        botton.classList.remove('arrow-reverse');
    } else {
        left.classList.add('left-hidden');
        botton.classList.add('arrow-reverse');
    }
}
if (flvjs.isSupported()) {
    // Stream
    var offStream = function offStream(i) {
        if (liveStreams[i]) {
            removeStream(liveStreams[i].id);
        }
    };

    var _closeStream = function closeStream() {
        _closeStream = true;
        for (var i = 0; i < 4; i++) {
            players[i].changeStream();
        }
    };

    var switchStream = function switchStream(i) {
        if (!liveStreams[0]) return;
        if (!liveStreams[i]) return;
        var mainStreams = liveStreams[0];
        var subStreams = liveStreams[i];
        liveStreams[0] = subStreams;
        liveStreams[i] = mainStreams;
        loadStreamsByList();
    };

    var addStream = function addStream(stream) {
        liveStreams.push(stream);
        loadStreamsByList();
    };

    var removeStream = function removeStream(id) {
        var index = liveStreams.findIndex(function (v) {
            return v.id === id;
        });
        if (index === -1) return;
        liveStreams.splice(index, 1);
        loadStreamsByList();
    };

    var loadStreamsByList = function loadStreamsByList(list) {
        if (streamClosed) return;
        if (list) liveStreams = list;
        for (var i = 0; i < 4; i++) {
            players[i].changeStream(liveStreams[i]);
            if (i !== 0) players[i].muted = true;
        }
    };
    // DJ


    var closeDJ = function closeDJ() {
        if (usingDJ.flvPlayer === undefined) return;
        var mute = document.getElementById('muteDJ');
    };

    // CreatePlayer


    var emit = function emit(channel, msg) {
        socket.emit(channel, msg);
    };

    for (var i = 0; i < 4; i++) {
        var e = document.getElementById('video-container' + i);
        var player = new Player(e, i);
        player.onSwitchBtnClick = switchStream;
        players.push(player);
    }

    // CreateAudioPlayer
    var a = document.getElementById('dj');
    var audioPlayer = new AudioPlayer(a);
    // WebSocket
    var socket = io();

    socket.on('liveStreams-list', function (streamList) {
        var liveList = [];
        var djList = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = streamList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var stream = _step.value;

                if (stream['app'] === 'dj') djList.push(stream);
                if (stream['app'] === 'live') liveList.push(stream);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        loadStreamsByList(liveList);
        audioPlayer.loadStreamList(djList);
    });
    socket.on('post-publish', function (stream) {
        console.log(stream);
        if (stream['app'] === 'dj') audioPlayer.addStream(stream);
        if (stream['app'] === 'live') addStream(stream);
    });
    socket.on('done-publish', function (id) {
        console.log(id);
        removeStream(id);
        audioPlayer.removeStream(id);
    });
    socket.on('update-pig', function (pigs) {
        pigsCount = pigs;
        document.getElementById('pigs-count').innerHTML = '\u5F53\u524D\u6709' + pigsCount + '\u53EA\u6BCD\u732A\u6B63\u5728\u56F4\u89C2';
    });
    socket.on('se', function (v) {
        playSE(v);
    });
    socket.on('connect', function () {
        socket.emit('request-liveStreams');
    });
}
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}