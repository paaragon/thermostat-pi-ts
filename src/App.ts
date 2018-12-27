import * as express from "express";
import ThermostaApi from "./api/v1/thermostat-api";
import { MQTTController } from "./mqtt/mqtt-controller";
import { CronController } from "./cron/cron-controller";
import { Logger } from "./logger";

class App {
  public express;
  private mqtt: MQTTController;
  private cron: CronController;
  private logger: Logger;

  constructor() {
    this.express = express();
    this.logger = new Logger("App");
  }

  public startApp(): void {
    this.logger.info("============ Starting App ============>");
    this.startMqtt();
    this.startCron();
    this.startServer();
  }

  private startServer() {
    this.logger.info("Starting Server");
    this.mountRoutes();
    const port = process.env.PORT || 3000;
    this.express.listen(port, (err: any) => {
      if (err) {
        return console.log(err);
      }
      return console.log(`server is listening on ${port}`);
    });
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.use("/api/v1/", ThermostaApi);
    this.express.use("/", router);
  }

  private startMqtt(): void {
    this.logger.info("Starting Mqtt");
    this.mqtt = MQTTController.Instance;
    this.mqtt.startMQTTClient();
  }

  private startCron(): void {
    this.logger.info("Starting Cron");
    this.cron = CronController.Instance;
    this.cron.startCron();
  }
}

export default new App();
