import ThermostatController from '../controller/thermostat-controller';

import cron = require('node-cron');
import config = require('config');

export default class CronController {
  private static instance: CronController;

  private thermostatController: ThermostatController;
  private cronExpression: string = config.get<string>('cron.expression');
  private task: any;

  private constructor() {
    this.thermostatController = ThermostatController.Instance;
    this.task = cron.schedule(
      this.cronExpression,
      () => {
        this.thermostatController.regulateThermostat();
      },
      {
        scheduled: false,
      },
    );
  }
  public static get Instance(): CronController {
    return this.instance || (this.instance = new this());
  }

  public startCron() {
    this.task.start();
  }

  public stopCron() {
    this.task.stop();
  }
}
