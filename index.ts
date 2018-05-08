const NodeMediaServer = require('node-media-server');
import { cqsocket } from 'node-cqsocket'
import * as http from 'http'
import * as sio from 'socket.io'
import * as express from 'express'
const app = express();
const server = http.createServer(app);
const io = sio(server);

const liveStreams = [];
const djStreams = [];
let audienceCount = 0;
let groupID = 111438162;

class Stream {
  id:string;
  StreamPath:string;
  constructor(id, StreamPath) {
    this.id = id;
    this.StreamPath = StreamPath;
  }
}

const cq = new cqsocket('127.0.0.1', 9001);

function emitMessage(message) {
  if (groupID === 0) return;

}

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

server.listen(3000, () => console.log('Example app listening on port 3000!'));

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
    // qqbot
    let message = `母猪${stream.StreamPath.slice(6)}走上了舞台，快来[http://live.aigis.me:3000]围观它~`;
    console.log(message);
    emitMessage(message);
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