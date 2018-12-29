import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as http from 'http';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import ThermostatRoute from './api/v1/ThermostatRoute';
import Logger from '../logger';

export default class Server {
  private static instance: Server;
  private app: express.Application;
  private version: string = 'v1';
  private port: number = 3000;
  private logger: Logger = new Logger('Server');

  public start() {
    this.config();
    this.api();
    http.createServer(this.app).listen(this.port, () => {
      this.logger.info(`Express server listening on port ${this.port}`);
    });
  }

  public static get Instance(): Server {
    return this.instance || (this.instance = new this());
  }

  private api() {
    const router : express.Router = express.Router();
    ThermostatRoute.create(router);
    this.app.use(`/api/${this.version}`, router);
  }

  private config() {
    // add static paths
    this.app.use(express.static(path.join(__dirname, 'public')));

    // configure pug
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'pug');

    // use logger middlware
    this.app.use(logger('dev'));

    // use json form parser middlware
    this.app.use(bodyParser.json());

    // use query string parser middlware
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );

    // use cookie parser middleware
    this.app.use(cookieParser('SECRET_GOES_HERE'));

    // use override middlware
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const error = err;
        error.status = 404;
        next(error);
      },
    );

    // error handling
    this.app.use(errorHandler());
  }
}
