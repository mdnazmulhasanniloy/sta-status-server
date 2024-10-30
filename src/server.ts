/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createServer, Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const colors = require('colors');

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(Number(config.port), config.ip as string, () => {
      //@ts-ignore
      console.log(`app is listening on ${config.ip}:${config.port}`.green.bold);
    });

    // io.listen(Number(config.socket_port));
    // console.log(`Socket is listening on port ${config.socket_port}`);
  } catch (err) {
    console.error(err);
  }
}
main();
process.on('unhandledRejection', err => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
