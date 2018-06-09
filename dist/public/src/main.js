let ran = Math.floor((Math.random() * 3) + 1);
var host = `live.aigis.me`
let liveStreams = [];
let djStreams = [];
let players = [];
let streamClosed = false;
let usingDJ;
let pigsCount = 0;
const effectElement = document.getElementById('effectElement');
// play se
function playSE(path) {
    if (effectElement.src !== '' && (effectElement.ended === false && effectElement.paused === false)) return;
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
    const left = document.getElementById('left');
    const botton = document.getElementById('botton-arrow')
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
    function offStream(i) {
        if (liveStreams[i]) {
            removeStream(liveStreams[i].id);
        }
    }
    function closeStream() {
        closeStream = true;
        for (let i = 0; i < 4; i++) {
            players[i].changeStream();
        }
    }
    function switchStream(i) {
        if (!liveStreams[0]) return;
        if (!liveStreams[i]) return;
        const mainStreams = liveStreams[0];
        const subStreams = liveStreams[i];
        liveStreams[0] = subStreams;
        liveStreams[i] = mainStreams;
        loadStreamsByList();
    }
    function addStream(stream) {
        liveStreams.push(stream);
        loadStreamsByList();
    }
    function removeStream(id) {
        let index = liveStreams.findIndex((v) => {
            return v.id === id;
        });
        if (index === -1) return;
        liveStreams.splice(index, 1);
        loadStreamsByList();
    }
    function loadStreamsByList(list) {
        if (streamClosed) return;
        if (list) liveStreams = list;
        for (let i = 0; i < 4; i++) {
            players[i].changeStream(liveStreams[i]);
            if (i !== 0) players[i].muted = true;
        }
    }
    // DJ
    function closeDJ() {
        if (usingDJ.flvPlayer === undefined) return;
        const mute = document.getElementById('muteDJ');
    }

    // CreatePlayer
    for (let i = 0; i < 4; i++) {
        const e = document.getElementById(`video-container${i}`);
        const player = new Player(e, i);
        player.onSwitchBtnClick = switchStream;
        players.push(player);
    }

    // CreateAudioPlayer
    const a = document.getElementById('dj');
    const audioPlayer = new AudioPlayer(a);
    // WebSocket
    var socket = io();
    function emit(channel, msg) {
        socket.emit(channel, msg);
    }
    socket.on('liveStreams-list', (streamList) => {
        const liveList = [];
        const djList = [];
        for (let stream of streamList) {
            if (stream['app'] === 'dj') djList.push(stream);
            if (stream['app'] === 'live') liveList.push(stream);
        }
        loadStreamsByList(liveList);
        audioPlayer.loadStreamList(djList);
    })
    socket.on('post-publish', (stream) => {
        console.log(stream);
        if (stream['app'] === 'dj') audioPlayer.addStream(stream);
        if (stream['app'] === 'live') addStream(stream);
    })
    socket.on('done-publish', (id) => {
        console.log(id);
        removeStream(id);
        audioPlayer.removeStream(id);
    })
    socket.on('update-pig', (pigs) => {
        pigsCount = pigs;
        document.getElementById('pigs-count').innerHTML = `当前有${pigsCount}只母猪正在围观`;
    })
    socket.on('se', (v) => {
        playSE(`/assets/${v}`);
    })
    socket.on('connect', () => {
        socket.emit('request-liveStreams', navigator.userAgent);
    })
} else {
    document.body.innerHTML = `<div style="text-align:center;font-size:50px;margin-top:300px;margin-left:50px;margin-right:50px;">QQ内置浏览器不支持视频播放，请使用其他浏览器打开</div>`
}
function toggleFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    }
    else {
        cancelFullScreen.call(doc);
    }
}