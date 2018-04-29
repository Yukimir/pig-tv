class Player {
    constructor(element,i) {
        this.titleList = ['史诗母猪', '传说母猪', '金母猪', '银母猪', '皇帝', '绿马甲', '骑空士', '德云王', '决斗者', '截胡专家']
        this.attachElement = element;
        this.stream = undefined;
        this.videoElement = document.createElement('video');
        this.spanElement = document.createElement('span');
        this.videoElement.className = 'player-video';
        this.videoElement.requestFullscreen = this.videoElement.requestFullscreen || this.videoElement.webkitRequestFullScreen || this.videoElement.webkitEnterFullscreen;
        this.spanElement.className = 'player-span';
        this.attachElement.appendChild(this.videoElement);
        this.attachElement.appendChild(this.spanElement);
        this.playerNo = i;

        // 制作控制条
        if (detectMobile()) {
            this.videoElement.controls = 'controls';
        } else {
            this.controller = this.createController();
            this.attachElement.appendChild(this.controller);
        }
    }
    changeStream(stream, refresh) {
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
    destroyFlvPlayer() {
        if (this.flvPlayer) {
            this.flvPlayer.destroy();
            this.flvPlayer = undefined;
        }
    }
    createFlvPlayer() {
        let muted = this.muted;
        let flvPlayer = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            cors: true,
            url: `ws://${host}:8000${this.stream.StreamPath}.flv`,
        })
        this.flvPlayer = flvPlayer;
        flvPlayer.attachMediaElement(this.videoElement);
        flvPlayer.load();
        flvPlayer.play();
        if(this.muted) flvPlayer.muted = true;
    }
    changeTags() {
        let seed = this.stream.id.charCodeAt(0);
        this.spanElement.innerHTML = this.titleList[(seed % (this.titleList.length))] + '-' + this.stream.StreamPath.slice(6);
    }
    get muted() {
        return this.videoElement.muted;
    }
    set muted(v) {
        this.videoElement.muted = v;
        if (v) this.controller.volumeIcon.className = 'fa fa-volume-off';
        else this.controller.volumeIcon.className = 'fa fa-volume-down';
    }

    createController() {
        const controller = document.createElement('div');
        controller.className = 'player-controller hidden none';
        const left = document.createElement('div');
        const pause = document.createElement('i');
        pause.className = "fa fa-pause";
        pause.setAttribute('aria-hidden', 'true');
        pause.addEventListener('click', () => {
            if (this.videoElement.paused) {
                this.videoElement.play();
                pause.className = 'fa fa-pause';
            }
            else {
                this.videoElement.pause();
                pause.className = 'fa fa-play';
            }
        })
        const refresh = document.createElement('i');
        refresh.className = "fa fa-refresh";
        refresh.addEventListener('click', () => {
            this.changeStream(this.stream, true);
        })
        refresh.setAttribute('aria-hidden', 'true');
        const close = document.createElement('i');
        close.className = "fa fa-close";
        close.setAttribute('aria-hidden', 'true');
        close.addEventListener('click',()=>{
            offStream(this.playerNo);
        });

        left.appendChild(pause);
        left.appendChild(refresh);
        left.appendChild(close);
        controller.appendChild(left);

        const right = document.createElement('div');
        right.className = 'right';

        const volume = document.createElement('div');
        volume.className = 'volume';
        const volumeIcon = document.createElement('i');
        volumeIcon.className = 'fa fa-volume-down';
        volumeIcon.setAttribute('aria-hidden', 'true');
        controller.volumeIcon = volumeIcon;
        volumeIcon.addEventListener('click', () => {
            this.muted = !this.muted
        })
        const volumeRange = document.createElement('input');
        volumeRange.type = 'range';
        volumeRange.min = '0';
        volumeRange.max = '100';
        volumeRange.step = '1';
        volumeRange.value = (this.videoElement.volume * 100).toString();
        volumeRange.addEventListener('input', () => {
            this.videoElement.volume = parseInt(volumeRange.value) / 100;
        })
        volume.appendChild(volumeIcon);
        volume.appendChild(volumeRange);
        right.appendChild(volume);
        const expand = document.createElement('i');
        expand.className = 'fa fa-expand';
        expand.setAttribute('aria-hidden', 'true');
        expand.addEventListener('click', () => {
            this.videoElement.requestFullscreen();
        })
        right.appendChild(expand);

        controller.appendChild(right);

        return controller;
    }
    showController() {
        this.controller.classList.remove('none');
    }
    hideController() {
        this.controller.classList.add('none');
    }
}

function detectMobile() {
    const browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息   
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
    }

    if (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
        browser.versions.iPhone || browser.versions.iPad) {
        return true;
    } else { return false; }
}