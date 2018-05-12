const NodeMediaServer = require('node-media-server');
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
  id: string;
  StreamPath: string;
  constructor(id, StreamPath) {
    this.id = id;
    this.StreamPath = StreamPath;
  }
}

// qq-Bot
const cq = new cqsocket('127.0.0.1', 60000);
function emitMessage(message) {
  if (groupID === 0) return;
  cq.SendGroupMessage(groupID, message);
}
cq.listen(60001);
cq.on('GroupMessage', (event) => {
  if (event.ID === groupID) {
    if (Math.random() < 0.03)
      cq.SendGroupMessage(event.ID, event.message);
  }
})
cq.on('PrivateMessage', (event) => {
  if (event.qq === 2745927718) emitMessage(event.message);
})

// http-server
app.use(bodyParser.json());
app.use(express.static('public'));

// RTMP-server callback
app.post('/api/streams', async (req, res) => {
  res.statusCode = 200;
  res.send('0');

  // my logic
  const body = req.body;
  const id = crypto.createHash('md5').update(body['client_id'].toString()).digest('hex');
  const StreamPath = `/${body['app']}/${body['stream']}`;
  const stream = new Stream(id, StreamPath);
  if (body['action'] === 'on_publish') {
    // 开始推流
    if (StreamPath.indexOf('dj-') === 6) {
      djStreams.push(stream);
      io.emit('dj-post-publish', stream);
    } else {
      liveStreams.push(stream);
      io.emit('post-publish', stream);
      // qqbot
      let message = `母猪${stream.StreamPath.slice(6)}走上了舞台，快来[http://live.aigis.me:3000]围观它~`;
      emitMessage(message);
    }
  }


  if (body['action'] === 'on_unpublish') {
    // 结束推流
    let i = liveStreams.findIndex((v) => {
      return v.id === id;
    })
    if (i !== -1) liveStreams.splice(i, 1);

    i = djStreams.findIndex((v) => {
      return v.id === id;
    })
    if (i !== -1) djStreams.splice(i, 1);
    io.emit('done-publish', id);
  }

  // 如果要增加QQ验证的话
  // 需要做数据库的读取
  // 用户在通过QQ登陆之后，会获得唯一uid（ObjectID）
  // 用户可以设置昵称和密码，密码会+qq号和时间转换为md5在服务器保存
  // 用户通过这个md5作为path来进行推流
  // {qq,nickname,sign} <- 数据model
  // 大概就是这样，狗屎QQ还要审核，傻逼
})

// socket-io
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