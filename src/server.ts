import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import compression from 'compression';
import cors from 'cors';

import { MONGODB_URI } from './util/secrets';

// import { ProductRoutes } from './routes/productRoutes';
import UserRoutes from './routes/userRoutes';
import ProjectsRoutes from './routes/projectsRoutes';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    Server.mongo();
    this.config();
    this.routes();
    // this.initializeErrorHandling();
  }

  public routes(): void {
    this.app.use('/api/user', new UserRoutes().router);
    this.app.use('/api/projects', new ProjectsRoutes().router);
  }

  public config(): void {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors());
  }

  private static mongo() {
    const { connection } = mongoose;
    connection.on('connected', () => {
      console.log('Mongo Connection Established');
    });
    connection.on('reconnected', () => {
      console.log('Mongo Connection Reestablished');
    });
    connection.on('disconnected', () => {
      console.log('Mongo Connection Disconnected');
      console.log('Trying to reconnect to Mongo ...');
      setTimeout(() => {
        mongoose.connect(MONGODB_URI || '', {
          keepAlive: true,
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        });
      }, 3000);
    });
    connection.on('close', () => {
      console.log('Mongo Connection Closed');
    });
    connection.on('error', (error: Error) => {
      console.log(`Mongo Connection ERROR: ${error}`);
    });

    const run = async () => {
      await mongoose.connect(MONGODB_URI || '', {
        keepAlive: true,
      });
    };
    run().catch((error) => console.error(error));
  }

  // private initializeErrorHandling() {
  //   this.app.use(errorMiddleware);
  // }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('  API is running at http://localhost:%d', this.app.get('port'));
    });
  }
}

const server = new Server();

server.start();
