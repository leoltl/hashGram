import ws from 'ws';
import messageQueue from '../config/messageQueue';

const chatWsServer = new ws.Server({ 
  noServer: true, path: '/chat'
});

const userSocketMap = makeUserSocketMap();

function makeUserSocketMap() {
  const _map = new Map();

  function set(user_handle, socket) {
    _map.set(user_handle, socket);
  }

  function get(user_handle) {
    return _map.get(user_handle)
  }

  function reverse(socket) {
    for ([user_handle, soc] in _map.entries()) {
      if (socket === sock) {
        return user_handle
      }
    }
  }

  function del(user_handle) {
    _map.delete(user_handle);
  }

  return {
    set,
    get,
    reverse,
    del,
  }
}

chatWsServer.on('connection', (ws, req) => {
  console.log('new connection')
  userSocketMap.set(req.session.user_handle, ws);

  ws.on('message', (data) => {
    const { type, to, message } = JSON.parse(data);
    const from = req.session.user_handle;
    const body = JSON.stringify({ type, message, to, from });
    if (type === 'newMessage') {
      messageQueue.publish(type, { message, to, from });
    }
    userSocketMap.get(to)?.send(body);
    ws.send(body);
  });

  ws.on('close', () => { 
    userSocketMap.del(req.session.user_handle); 
  });
});

export default function registerWSUpgradeHandler(server, sessionParser) {
  server.on('upgrade', function upgrade(req, socket, head) {
    sessionParser(req, {}, () => {
      // TODO check authentication logic.
      if (!req.session.user_handle) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
      if (req.url === '/chat') {
        chatWsServer.handleUpgrade(req, socket, head, function (ws) {
          chatWsServer.emit('connection', ws, req)
        })
      }
    });
  })
}