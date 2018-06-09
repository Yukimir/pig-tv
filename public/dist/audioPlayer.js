'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioPlayer = function () {
    function AudioPlayer(attachElement) {
        _classCallCheck(this, AudioPlayer);

        this.attachElement = attachElement;
        this.streamList = [];
        this.stream;

        this.attachElement.className = "audio-player audio-player-hidden";
        this.createPlayer();
    }

    _createClass(AudioPlayer, [{
        key: 'createPlayer',
        value: function createPlayer() {
            var _this = this;

            // audio
            this.audioElement = document.createElement('audio');
            //dj-list
            this.listContainerElement = document.createElement('div');
            this.pElement = document.createElement('p');
            this.listElement = document.createElement('div');
            this.pElement.classList.add('dj-name');
            this.listElement.classList.add('dj-list');
            this.listContainerElement.classList.add('dj-container');
            var down = document.createElement('i');
            down.className = 'fa fa-sort-desc';
            down.setAttribute('aria-hidden', 'true');
            this.listContainerElement.appendChild(this.pElement);
            this.listContainerElement.appendChild(down);
            this.listContainerElement.appendChild(this.listElement);

            // play
            this.playIcon = document.createElement('i');
            this.playIcon.className = 'fa fa-3 fa-pause-circle';
            this.playIcon.setAttribute('aria-hidden', 'true');
            this.playIcon.addEventListener('click', function () {
                if (_this.audioElement.paused) {
                    _this.audioElement.play();
                    _this.playIcon.className = 'fa fa-3 fa-pause-circle';
                } else {
                    _this.audioElement.pause();
                    _this.playIcon.className = 'fa fa-3 fa-play-circle';
                }
            });
            // volume
            var volume = document.createElement('div');
            volume.className = 'volume';
            var volumeIcon = document.createElement('i');
            volumeIcon.className = 'fa fa-3 fa-volume-down';
            volumeIcon.setAttribute('aria-hidden', 'true');
            this.volumeIcon = volumeIcon;
            volumeIcon.addEventListener('click', function () {
                _this.muted = !_this.muted;
            });
            var volumeRange = document.createElement('input');
            volumeRange.type = 'range';
            volumeRange.min = '0';
            volumeRange.max = '100';
            volumeRange.step = '1';
            volumeRange.value = (this.audioElement.volume * 100).toString();
            volumeRange.addEventListener('input', function () {
                _this.audioElement.volume = parseInt(volumeRange.value) / 100;
            });
            volume.appendChild(volumeIcon);
            volume.appendChild(volumeRange);

            // append
            this.attachElement.appendChild(this.listContainerElement);
            this.attachElement.appendChild(this.playIcon);
            this.attachElement.appendChild(volume);
            this.attachElement.appendChild(this.audioElement);
        }
    }, {
        key: 'loadStreamList',
        value: function loadStreamList(list) {
            this.streamList = list;
            if (this.streamList.length > 0) this.loadStream(0);
            this.genList();
        }
    }, {
        key: 'addStream',
        value: function addStream(stream) {
            this.streamList.push(stream);
            if (this.streamList.length === 1) this.loadStream(0);
            this.genList();
        }
    }, {
        key: 'removeStream',
        value: function removeStream(id) {
            var index = this.streamList.findIndex(function (v) {
                return v.id === id;
            });
            if (index === -1) return;
            this.streamList.splice(index, 1);
            if (this.stream.id === id) {
                // destory
                this.destroyStream();
                if (this.streamList.length > 0) this.loadStream(0);else this.hidePlayer();
            }
            this.genList();
        }
    }, {
        key: 'loadStream',
        value: function loadStream(index) {
            var stream = this.streamList[index];
            if (!stream) return;
            if (stream === this.stream) return;
            this.stream = stream;
            // 先摧毁
            if (this.flvPlayer) this.destroyStream();
            // 再制造
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                cors: true,
                url: 'http://' + host + ':8000/' + this.stream.app + '/' + this.stream.stream + '.flv',
                hasVideo: false
            });
            flvPlayer.attachMediaElement(this.audioElement);
            flvPlayer.load();
            if (!detectMobile()) flvPlayer.play();else {
                this.audioElement.pause();
                this.playIcon.className = 'fa fa-play-circle';
            }
            this.flvPlayer = flvPlayer;
            //调整标签
            this.showPlayer();
            this.pElement.innerHTML = stream.streamName;
        }
    }, {
        key: 'genList',
        value: function genList() {
            var _this2 = this;

            this.listElement.innerHTML = '';

            var _loop = function _loop(i) {
                var stream = _this2.streamList[i];
                var spanElement = document.createElement('p');
                spanElement.className = "list-item";
                var func = function func() {
                    return function () {
                        var index = i;
                        _this2.loadStream(i);
                    };
                };
                spanElement.innerHTML = stream.streamName;
                spanElement.addEventListener('click', func());
                _this2.listElement.appendChild(spanElement);
            };

            for (var i = 0; i < this.streamList.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'destroyStream',
        value: function destroyStream() {
            if (this.flvPlayer) {
                this.audioElement.pause();
                this.flvPlayer.destroy();
                this.flvPlayer = undefined;
                this.pElement.innerHTML = '';
            }
        }
    }, {
        key: 'hidePlayer',
        value: function hidePlayer() {
            this.attachElement.classList.add('audio-player-hidden');
        }
    }, {
        key: 'showPlayer',
        value: function showPlayer() {
            this.attachElement.classList.remove('audio-player-hidden');
        }
    }, {
        key: 'muted',
        get: function get() {
            return this.audioElement.muted;
        },
        set: function set(v) {
            this.audioElement.muted = v;
            if (v) this.volumeIcon.className = 'fa fa-3 fa-volume-off';else this.volumeIcon.className = 'fa fa-3 fa-volume-down';
        }
    }]);

    return AudioPlayer;
}();