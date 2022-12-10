import express from 'express';
import cors from 'cors';
import router from '../routes';
import deserializeUser from '../middlewares/deserializeUser';
import cookieParser from 'cookie-parser';
import { accessControl } from '../middlewares/accessControl';

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const whiteList = [
    'http://127.0.0.1:5173',
    'https://dataplus-posweb.netlify.app',
    'http://localhost:5173',
    'https://dataplushn.com',
  ];
  
  app.use(cors({ origin: whiteList, credentials: true }));
  app.use(deserializeUser);

  app.get('/', (req, res) => {
    res.send('I am alive');
  });

  app.use(accessControl());

  app.use(router);

  return app;
}

export default createServer;
