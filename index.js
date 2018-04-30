const NodeMediaServer = require('node-media-server');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');

const liveStreams = [];
const djStreams = [];
let audienceCount = 0;
let groupID = '';
class Stream {
  constructor(id, StreamPath) {
    this.id = id;
    this.StreamPath = StreamPath;
  }
}
// qqbot
request('http://127.0.0.1:5000/openqq/get_group_basic_info', (err, res, body) => {
  if (err) return;
  let group = body.find((v => {
    return v.uin === 630035378;
  }));
});

app.use(express.static('public'));

io.on('connection', function (socket) {
  audienceCount += 1;
  socket.on('request-liveStreams', (v) => {
    socket.emit('liveStreams-list', liveStreams, djStreams);
    io.emit('update-pig', audienceCount);
  })
  socket.on('se', (v) => {
    io.emit('se', v);
  })
  socket.on('disconnect', (v) => {
    audienceCount -= 1;
    audienceCount = audienceCount < 0 ? 0 : audienceCount;
    io.emit('update-pig', audienceCount);
  })
})

http.listen(3000, () => console.log('Example app listening on port 3000!'));

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

const nms = new NodeMediaServer(config)

nms.on('postPublish', (id, StreamPath, args) => {
  let stream = new Stream(id, StreamPath);
  console.log(StreamPath.indexOf('dj'));
  if (StreamPath.indexOf('dj-') === 6) {
    djStreams.push(stream);
    io.emit('dj-post-publish', stream);
  } else {
    liveStreams.push(stream);
    io.emit('post-publish', stream);
  }

});
nms.on('donePublish', (id, StreamPath, args) => {
  let i = liveStreams.findIndex((v) => {
    return v.id === id;
  })
  if (i !== -1) liveStreams.splice(i, 1);
  i = djStreams.findIndex((v) => {
    return v.id === id;
  })
  if (i !== -1) djStreams.splice(i, 1);
  io.emit('done-publish', id);
});

nms.run();