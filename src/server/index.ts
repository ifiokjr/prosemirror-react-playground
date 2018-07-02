import { createServer } from 'http';
import { handleCollabRequest } from './server';

const port = 8000;

// The collaborative editing document server.

const server = createServer((req, res) => {
  if (!handleCollabRequest(req, res)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(port, '127.0.0.1');

// tslint:disable-next-line:no-console
console.log(`Collab demo server listening on ${port}`);
