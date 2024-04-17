const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of all the connections so we can forward messages
  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    connections.push(connection);

    // Forward messages to everyone except the sender
    ws.on('message', function message(data) {
        try {
            const message = JSON.parse(data);

            if (message.type === 'vote') {
            // Handle voting message
              const { songId, shouldAdd } = message;
              console.log(`Received vote for song ${songId}: ${shouldAdd}`);

              // Broadcast vote update to all connected clients
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'voteUpdate', songId, shouldAdd }));
                }
                });
            }
            else {
              console.log("not vote");
            }
        }catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
      /*connections.forEach((c) => {
        if (c.id !== connection.id) {
          c.ws.send(data);
        }
      });*/
    });

    // Remove the closed connection so we don't try to forward anymore
    ws.on('close', () => {
      const pos = connections.findIndex((o, i) => o.id === connection.id);

      if (pos >= 0) {
        connections.splice(pos, 1);
      }
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // Keep active connections alive
  setInterval(() => {
    connections.forEach((c) => {
      // Kill any connection that didn't respond to the ping last time
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);
}

module.exports = { peerProxy };