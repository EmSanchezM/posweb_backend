import express from 'express';
import cors from 'cors';
import router from '../routes';
import deserializeUser from '../middlewares/deserializeUser';
import cookieParser from 'cookie-parser';

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const whiteList = [
    'http://127.0.0.1:5173',
    'https://dataplus-posweb.netlify.app',
    'http://localhost:5173',
  ];
  app.use(cors({ origin: whiteList }));
  app.use(deserializeUser);

  app.use(router);

  return app;
}

export default createServer;
