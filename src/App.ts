import * as express from "express";
import { Server } from "./server/Server";
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
    Server.bootstrap();
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
