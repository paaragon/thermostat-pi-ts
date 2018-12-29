import Thermostat from '../model/Thermostat';
import RaspberryModulescontroller from './raspberry-modules-controller';

import config = require('config');

export default class ThermostatController {
  private static instance: ThermostatController;
  private raspberryModulesController: RaspberryModulescontroller;
  private thermostat: Thermostat;

  private timeMoveRatio: number = config.get<number>(
    'raspmodules.dcmotor.timemoveratio',
  );

  private constructor() {
    this.raspberryModulesController = RaspberryModulescontroller.Instance;
    this.thermostat = Thermostat.Instance;
  }

  public static get Instance(): ThermostatController {
    return this.instance || (this.instance = new this());
  }

  public turnThermostatOn() {
    this.thermostat.on = true;
  }

  public turnThermostatOff() {
    this.thermostat.on = false;
  }

  public currentTemp(): number {
    this.updateCurrentTemp();
    return this.thermostat.currentTemp;
  }

  public setTemp(temp: number): void {
    this.thermostat.tempSet = temp;
  }

  public increateTemp(amount: number): void {
    this.thermostat.tempSet += amount;
  }

  public decreaseTemp(amount: number): void {
    this.thermostat.tempSet -= amount;
  }

  public async regulateThermostat(): Promise<any> {
    if (this.thermostat.on === true) {
      // 1.- updateCurrentTemp
      this.updateCurrentTemp();
      // 2.- get temp dif between current temp and temp set
      const tempDiff = this.thermostat.tempSet - this.thermostat.currentTemp;
      // 3.- calculate dc motor movement
      const moveTime = tempDiff * this.timeMoveRatio;
      // 4.- move dc motor
      const interval = await this.blinkLed(500, '#FF00FF');
      await this.raspberryModulesController.moveMotor(moveTime);
      await this.stopBlinkLed(interval);
    }
  }

  public async updateCurrentTemp(): Promise<any> {
    // blink led in blue
    const interval = await this.blinkLed(500, '#0000FF');
    // get temp lecture
    const lecture = await this.raspberryModulesController.getTempLecture();
    // stop blink led
    await this.stopBlinkLed(interval);
    // if result is correct, led color is green. In other case, is red
    if (lecture.temperature) {
      await this.raspberryModulesController.setLedColor('#00FF00');
    } else {
      await this.raspberryModulesController.setLedColor('#FF0000');
    }
    // turn off led in 1 second
    setTimeout(async () => {
      await this.raspberryModulesController.turnLedOff();
    }, 1000);
    this.thermostat.currentTemp = lecture.temperature;
  }

  private async blinkLed(period: number, color?: string): Promise<any> {
    let isOn = true;
    if (color) {
      this.raspberryModulesController.setLedColor(color);
    }
    return setInterval(async () => {
      if (isOn) {
        await this.raspberryModulesController.turnLedOff();
        isOn = false;
      } else {
        await this.raspberryModulesController.turnLedOn();
        isOn = true;
      }
    }, 500);
  }

  private async stopBlinkLed(interval: any): Promise<any> {
    clearInterval(interval);
    await this.raspberryModulesController.turnLedOff();
  }
}
