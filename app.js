var app = require("http").createServer(handler);
var io = require("socket.io").listen(app);
var fs = require("fs");
var Game = require("./pacman/pacman-server");

app.listen(3000);

function handler (req, res) {
  switch (req.url) {
    case "/pacman":
      render("public/game-room.html", res);
      io.sockets.on("connection", function(socket) {
        listenForGameLoad(socket);
      });
      break;
    case "/pacman-client":
      render("public/pacman-client.js", res);
      break;
    default:
      res.writeHead(404);
      res.end("Not found");
      break;
  }
}

function listenForGameLoad(socket) {
  socket.on("gameLoaded", function () {
    var game = new Game(socket);
    game.start(socket);
  });
}

function render(filename, res) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + filename);
    }

    res.writeHead(200);
    res.end(data);
  });
}
