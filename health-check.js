const http = require('http');

const server = http.createServer(function (req, res) {
  res.writeHead(200);
  res.end('Alive!');
});
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
