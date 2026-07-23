const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

server.listen(port, host, () => {
  console.log(`JSON Server is running on http://${host}:${port}`);
});
