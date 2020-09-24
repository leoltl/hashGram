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

  function has(user_handle) {
    return _map.has(user_handle);
  }

  function del(user_handle) {
    _map.delete(user_handle);
  }

  return {
    set,
    get,
    reverse,
    del,
    has,
  }
}

chatWsServer.on('connection', (ws, req) => {
  console.log('new connection')
  userSocketMap.set(req.session.user_handle, ws);

  ws.on('message', (data) => {
    const { type, ...rest } = JSON.parse(data);
    if (type === 'newMessage') {
      const { body, to } = rest;
      const from = req.session.user_handle;
      if (from === to) { 
        ws.send('You can\'t message yourself.');
        return
      }

      // publish the message to chat queue for chat service to persist message to db
      messageQueue.publish("chat", { type, body, to, from });

      // try getting 'to' user from userSocketMap and forward the message, do nothing if user not connected as websocket,
      userSocketMap.get(to)?.send(JSON.stringify({ type, body, to, from }));

      // resend the received message back to originated socket.
      ws.send(JSON.stringify({ type: 'loopback', body, to, from }));
    }

    if (type === 'checkOnline') {
      const { user } = rest;
      const online = userSocketMap.has(user);
      console.log('checkOnline', user, online)
      
      ws.send(JSON.stringify({ type: 'checkOnline', online }))
    }
  });

  ws.on('close', () => { 
    console.log('someone disconnected')
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