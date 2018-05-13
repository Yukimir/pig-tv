class AudioPlayer {
    constructor(attachElement) {
        this.attachElement = attachElement;
        this.streamList = [];
        this.stream;

        this.attachElement.className = "audio-player audio-player-hidden";
        this.createPlayer();
    }
    createPlayer() {
        // audio
        this.audioElement = document.createElement('audio');
        //dj-list
        this.listContainerElement = document.createElement('div');
        this.pElement = document.createElement('p');
        this.listElement = document.createElement('div');
        this.pElement.classList.add('dj-name');
        this.listElement.classList.add('dj-list');
        this.listContainerElement.classList.add('dj-container');
        const down = document.createElement('i');
        down.className = 'fa fa-sort-desc';
        down.setAttribute('aria-hidden', 'true');
        this.listContainerElement.appendChild(this.pElement);
        this.listContainerElement.appendChild(down);
        this.listContainerElement.appendChild(this.listElement);

        // play
        this.playIcon = document.createElement('i');
        this.playIcon.className = 'fa fa-3 fa-pause-circle';
        this.playIcon.setAttribute('aria-hidden', 'true');
        this.playIcon.addEventListener('click', () => {
            if (this.audioElement.paused) {
                this.audioElement.play();
                this.playIcon.className = 'fa fa-3 fa-pause-circle';
            }
            else {
                this.audioElement.pause();
                this.playIcon.className = 'fa fa-3 fa-play-circle';
            }
        })
        // volume
        const volume = document.createElement('div');
        volume.className = 'volume';
        const volumeIcon = document.createElement('i');
        volumeIcon.className = 'fa fa-3 fa-volume-down';
        volumeIcon.setAttribute('aria-hidden', 'true');
        this.volumeIcon = volumeIcon;
        volumeIcon.addEventListener('click', () => {
            this.muted = !this.muted
        })
        const volumeRange = document.createElement('input');
        volumeRange.type = 'range';
        volumeRange.min = '0';
        volumeRange.max = '100';
        volumeRange.step = '1';
        volumeRange.value = (this.audioElement.volume * 100).toString();
        volumeRange.addEventListener('input', () => {
            this.audioElement.volume = parseInt(volumeRange.value) / 100;
        })
        volume.appendChild(volumeIcon);
        volume.appendChild(volumeRange);

        // append
        this.attachElement.appendChild(this.listContainerElement);
        this.attachElement.appendChild(this.playIcon);
        this.attachElement.appendChild(volume);
        this.attachElement.appendChild(this.audioElement);
    }
    get muted() {
        return this.audioElement.muted;
    }
    set muted(v) {
        this.audioElement.muted = v;
        if (v) this.volumeIcon.className = 'fa fa-3 fa-volume-off';
        else this.volumeIcon.className = 'fa fa-3 fa-volume-down';
    }
    loadStreamList(list) {
        this.streamList = list;
        if (this.streamList.length > 0) this.loadStream(0);
        this.genList();
    }
    addStream(stream) {
        this.streamList.push(stream);
        if (this.streamList.length === 1) this.loadStream(0);
        this.genList();
    }
    removeStream(id) {
        let index = this.streamList.findIndex((v) => {
            return v.id === id;
        });
        if (index === -1) return;
        this.streamList.splice(index, 1);
        if (this.stream.id === id) {
            // destory
            this.destroyStream();
            if (this.streamList.length > 0) this.loadStream(0);
            else this.hidePlayer();
        }
        this.genList();
    }
    loadStream(index) {
        const stream = this.streamList[index];
        if (!stream) return;
        if(stream === this.stream) return;
        // 先摧毁
        if(this.flvPlayer) this.destroyStream();
        // 再制造
        let flvPlayer = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            cors: true,
            url: `http://${host}:8000/${this.stream.app}/${this.stream.stream}.flv`,
            hasVideo: false
        })
        flvPlayer.attachMediaElement(this.audioElement);
        flvPlayer.load();
        if (!detectMobile()) flvPlayer.play();
        else {
            this.audioElement.pause();
            this.playIcon.className = 'fa fa-play-circle';
        }
        this.flvPlayer = flvPlayer;
        this.stream = stream;
        //调整标签
        this.showPlayer();
        this.pElement.innerHTML = stream.StreamPath.slice(9);
    }
    genList() {
        this.listElement.innerHTML = '';
        for (let i = 0; i < this.streamList.length; i++) {
            const stream = this.streamList[i];
            const spanElement = document.createElement('p');
            spanElement.className = "list-item"
            const func = () => {
                return () => {
                    let index = i;
                    this.loadStream(i);
                }
            }
            spanElement.innerHTML = stream.StreamPath.slice(9);
            spanElement.addEventListener('click', func());
            this.listElement.appendChild(spanElement);
        }
    }
    destroyStream() {
        if (this.flvPlayer) {
            this.audioElement.pause();
            this.flvPlayer.destroy();
            this.flvPlayer = undefined;
            this.pElement.innerHTML = '';
        }
    }
    hidePlayer(){
        this.attachElement.classList.add('audio-player-hidden');
    }
    showPlayer(){
        this.attachElement.classList.remove('audio-player-hidden');
    }
}