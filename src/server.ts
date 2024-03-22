import express from 'express';
import cors from 'cors';

import dbconnect from './repositories/mongo/connection/db.server';
import { NotFoundErrorHandler, unhandledErrorHandler } from './middleWares/error-handlers';
import router from './routes/index';
import logger from './utils/winston';
// import { jwtErrorHandler } from './middleWares/error-handlers';

const server = async () => {
  const app = express();
  const Port = process.env.PORT || 3000;
  const url = process.env.APP_URL || `http://localhost:${Port}`;

  // middlewares
  app.use(cors());
  app.use(express.json());

  app.use('/v1', router);

  app.use(NotFoundErrorHandler);
  app.use(unhandledErrorHandler);

  await dbconnect();
  app.listen(Port, () => {
    logger.info(`unicornis server is running on ${url} 🚀`);
  });
};

server();

export default server;
