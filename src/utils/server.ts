import express from 'express';
import cors from 'cors';
import config from 'config';
import router from '../routes';
import deserializeUser from '../middlewares/deserializeUser';
import cookieParser from 'cookie-parser';
import { accessControl } from '../middlewares/accessControl';

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const whiteList = [
    config.get<string>('domain')
  ];

  app.use(cors({ origin: whiteList, credentials: true }));
  app.use(deserializeUser);

  app.use(accessControl());

  app.use(router);

  return app;
}

export default createServer;
