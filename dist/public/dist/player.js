'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(element, i) {
        _classCallCheck(this, Player);

        this.titleList = ['史诗母猪', '传说母猪', '金母猪', '银母猪', '皇帝', '绿马甲', '骑空士', '德云王', '决斗者', '截胡专家'];
        this.attachElement = element;
        this.stream = undefined;
        this.videoElement = document.createElement('video');
        this.spanElement = document.createElement('span');
        this.videoElement.className = 'player-video';
        this.videoElement.requestFullscreen = this.videoElement.requestFullscreen || this.videoElement.webkitRequestFullScreen || this.videoElement.webkitEnterFullscreen;
        this.spanElement.className = 'player-span';
        this.attachElement.appendChild(this.videoElement);
        this.attachElement.appendChild(this.spanElement);
        this.onSwitchBtnClick = null;
        this.playerNo = i;

        // 制作控制条
        this.controller = this.createController();
        this.attachElement.appendChild(this.controller);
        if (detectMobile()) {
            this.controller.classList.remove('hidden');
        }
    }

    _createClass(Player, [{
        key: 'changeStream',
        value: function changeStream(stream, refresh) {
            if (stream === this.stream && !refresh) return;
            this.stream = stream;
            this.destroyFlvPlayer();
            if (this.stream) {
                // 加载新的stream
                this.createFlvPlayer();
                this.changeTags();
                this.showController();
            } else {
                // 执行销毁操作
                this.spanElement.innerHTML = '';
                this.hideController();
            }
        }
    }, {
        key: 'destroyFlvPlayer',
        value: function destroyFlvPlayer() {
            if (this.flvPlayer) {
                this.flvPlayer.destroy();
                this.flvPlayer = undefined;
            }
        }
    }, {
        key: 'createFlvPlayer',
        value: function createFlvPlayer() {
            var muted = this.muted;
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                cors: true,
                url: 'http://' + host + ':8000/' + this.stream.app + '/' + this.stream.stream + '.flv'
            });
            this.flvPlayer = flvPlayer;
            flvPlayer.attachMediaElement(this.videoElement);
            flvPlayer.load();
            if (!detectMobile()) flvPlayer.play();else {
                this.videoElement.pause();
                this.controller.pause.className = 'fa fa-play';
            }
            if (this.muted) flvPlayer.muted = true;
        }
    }, {
        key: 'changeTags',
        value: function changeTags() {
            var seed = this.stream.id.charCodeAt(0);
            this.spanElement.innerHTML = this.titleList[seed % this.titleList.length] + '-' + this.stream.streamName;
        }
    }, {
        key: 'createController',
        value: function createController() {
            var _this = this;

            var controller = document.createElement('div');
            controller.className = 'player-controller hidden none';
            var left = document.createElement('div');
            var pause = document.createElement('i');
            pause.className = "fa fa-pause";
            pause.setAttribute('aria-hidden', 'true');
            pause.addEventListener('click', function () {
                if (_this.videoElement.paused) {
                    _this.videoElement.play();
                    pause.className = 'fa fa-pause';
                } else {
                    _this.videoElement.pause();
                    pause.className = 'fa fa-play';
                }
            });
            controller.pause = pause;
            var refresh = document.createElement('i');
            refresh.className = "fa fa-refresh";
            refresh.addEventListener('click', function () {
                _this.changeStream(_this.stream, true);
            });
            refresh.setAttribute('aria-hidden', 'true');
            var close = document.createElement('i');
            close.className = "fa fa-close";
            close.setAttribute('aria-hidden', 'true');
            close.addEventListener('click', function () {
                offStream(_this.playerNo);
            });
            var switcher = document.createElement('i');
            switcher.className = "fa fa-window-maximize";
            switcher.setAttribute('aria-hidden', 'true');
            switcher.addEventListener('click', function () {
                if (_this.onSwitchBtnClick) _this.onSwitchBtnClick(_this.playerNo);
            });
            left.appendChild(pause);
            left.appendChild(refresh);
            if (this.playerNo !== 0) left.appendChild(switcher);
            left.appendChild(close);
            controller.appendChild(left);

            var right = document.createElement('div');
            right.className = 'right';

            var volume = document.createElement('div');
            volume.className = 'volume';
            var volumeIcon = document.createElement('i');
            volumeIcon.className = 'fa fa-volume-down';
            volumeIcon.setAttribute('aria-hidden', 'true');
            controller.volumeIcon = volumeIcon;
            volumeIcon.addEventListener('click', function () {
                _this.muted = !_this.muted;
            });
            var volumeRange = document.createElement('input');
            volumeRange.type = 'range';
            volumeRange.min = '0';
            volumeRange.max = '100';
            volumeRange.step = '1';
            volumeRange.value = (this.videoElement.volume * 100).toString();
            volumeRange.addEventListener('input', function () {
                _this.videoElement.volume = parseInt(volumeRange.value) / 100;
            });
            volume.appendChild(volumeIcon);
            volume.appendChild(volumeRange);
            right.appendChild(volume);
            var expand = document.createElement('i');
            expand.className = 'fa fa-expand';
            expand.setAttribute('aria-hidden', 'true');
            expand.addEventListener('click', function () {
                _this.videoElement.requestFullscreen();
            });
            right.appendChild(expand);

            controller.appendChild(right);

            return controller;
        }
    }, {
        key: 'showController',
        value: function showController() {
            if (!this.controller) return;
            this.controller.classList.remove('none');
        }
    }, {
        key: 'hideController',
        value: function hideController() {
            if (!this.controller) return;
            this.controller.classList.add('none');
        }
    }, {
        key: 'muted',
        get: function get() {
            return this.videoElement.muted;
        },
        set: function set(v) {
            this.videoElement.muted = v;
            if (!this.controller) return;
            if (v) this.controller.volumeIcon.className = 'fa fa-volume-off';else this.controller.volumeIcon.className = 'fa fa-volume-down';
        }
    }]);

    return Player;
}();

function detectMobile() {
    var browser = {
        versions: function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息   
                trident: u.indexOf('Trident') > -1, //IE内核  
                presto: u.indexOf('Presto') > -1, //opera内核  
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器  
                iPad: u.indexOf('iPad') > -1, //是否iPad    
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
                qq: u.match(/\sQQ/i) == " qq" //是否QQ  
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
        return true;
    } else {
        return false;
    }
}