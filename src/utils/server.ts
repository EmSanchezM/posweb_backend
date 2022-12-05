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
    'https://dataplushn.com',
  ];
  app.use(cors({ origin: whiteList, credentials: true }));
  app.use(deserializeUser);

  app.get('/', (req, res) => {
    res.send('hello world');
  });

  // Add headers before the routes are defined
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type'
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', '*');

    // Pass to next layer of middleware
    next();
  });

  app.use(router);

  return app;
}

export default createServer;
