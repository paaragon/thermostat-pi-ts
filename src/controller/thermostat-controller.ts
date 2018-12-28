import { Thermostat } from "../model/Thermostat";
import { RaspberryModulescontroller } from "./raspberry-modules-controller";
import config = require("config");

class ThermostatController {
  private static _instance: ThermostatController;
  private raspberryModulesController: RaspberryModulescontroller;
  private thermostat: Thermostat;

  private _timeMoveRatio: number = config.get<number>(
    "raspmodules.dcmotor.timemoveratio"
  );

  private constructor() {
    this.raspberryModulesController = RaspberryModulescontroller.Instance;
    this.thermostat = Thermostat.Instance;
  }

  public static get Instance(): ThermostatController {
    return this._instance || (this._instance = new this());
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
    this.thermostat.tempSet++;
  }

  public decreaseTemp(amount: number): void {
    this.thermostat.tempSet--;
  }

  public async regulateThermostat(): Promise<any> {
    if (this.thermostat.on === true) {
      // 1.- updateCurrentTemp
      this.updateCurrentTemp();
      // 2.- get temp dif between current temp and temp set
      const tempDiff = this.thermostat.tempSet - this.thermostat.currentTemp;
      // 3.- calculate dc motor movement
      const moveTime = tempDiff * this._timeMoveRatio;
      // 4.- move dc motor
      const interval = await this._blinkLed(500, "#FF00FF");
      await this.raspberryModulesController.moveMotor(moveTime);
      await this._stopBlinkLed(interval);
    }
  }

  public async updateCurrentTemp(): Promise<any> {
    // blink led in blue
    const interval = await this._blinkLed(500, "#0000FF");
    // get temp lecture
    const lecture = await this.raspberryModulesController.getTempLecture();
    // stop blink led
    await this._stopBlinkLed(interval);
    // if result is correct, led color is green. In other case, is red
    if (lecture.temperature) {
      await this.raspberryModulesController.setLedColor("#00FF00");
    } else {
      await this.raspberryModulesController.setLedColor("#FF0000");
    }
    // turn off led in 1 second
    setTimeout(async () => {
      await this.raspberryModulesController.turnLedOff();
    }, 1000);
    this.thermostat.currentTemp = lecture.temperature;
  }

  private async _blinkLed(period: number, color?: string): Promise<any> {
    let isOn = true;
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

  private async _stopBlinkLed(interval: any): Promise<any> {
    clearInterval(interval);
    await this.raspberryModulesController.turnLedOff();
  }
}

export default ThermostatController;
