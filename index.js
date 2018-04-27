const NodeMediaServer = require('./node-media-server');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const liveStreams = [];
class Stream {
  constructor(id, StreamPath) {
    this.id = id;
    this.StreamPath = StreamPath;
  }
}
app.use(express.static('public'));

io.on('connection', function (socket) {
  socket.on('request-liveStreams', (v) => {
    socket.emit('liveStreams-list',liveStreams);
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
  let stream = new Stream(id,StreamPath);
  console.log(stream);
  liveStreams.push(stream);
  io.emit('post-publish',stream);
});
nms.on('donePublish', (id, StreamPath, args) => {
  let i = liveStreams.findIndex((v) => {
    return v.id === id;
  })
  if (i !== -1) liveStreams.splice(i, 1);
  io.emit('donw-publish',id);
});

nms.run();