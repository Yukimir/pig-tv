const NodeMediaServer = require('node-media-server');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000,() => console.log('Example app listening on port 3000!'));

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

var nms = new NodeMediaServer(config)
nms.run();