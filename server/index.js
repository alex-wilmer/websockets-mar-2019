const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let messages = [];

wss.on("connection", function connection(ws) {
  console.log(1, "hey new connection   yay");
  
  ws.send(JSON.stringify({
    type: 'history',
    data: messages
  }))

  ws.on("message", function incoming(message) {
    console.log(4, "received: %s", message);

    let parsedMessage = JSON.parse(message);

    parsedMessage.date = Date.now();

    messages = [parsedMessage, ...messages];

    wss.clients.forEach(function each(client) {
      client.send(
        JSON.stringify({
          type: "single_message",
          data: parsedMessage
        })
      );
    });
  });

  let message = {
    type: "single_message",
    data: {
      date: Date.now(),
      message: "hello from the server",
      username: "server"
    }
  };

  ws.send(JSON.stringify(message));
});

console.log(`listening on port 8080 ✨`);
