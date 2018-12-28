import { DHT22 } from "./modules/DHT22";
import { DCMotor } from "./modules/DcMotor";
import { RGBLed } from "./modules/rgbled";
import config = require("config");

export class RaspberryModulescontroller {
  private static _instance: RaspberryModulescontroller;
  private dht22: DHT22;
  private dcMotor: DCMotor;
  private rgbLed: RGBLed;

  private constructor() {
    const dht22Pin: number = config.get<number>("raspmodules.dht22.pin");
    this.dht22 = new DHT22(dht22Pin);

    const dcMotorPin: number = config.get<number>("raspmodules.dcmotor.pin");
    this.dcMotor = new DCMotor(dcMotorPin);

    const rgbLedPin: { red: number; green: number; blue: number } = {
      red: config.get<number>("raspmodules.rgbled.pinR"),
      green: config.get<number>("raspmodules.rgbled.pinG"),
      blue: config.get<number>("raspmodules.rgbled.pinB")
    };
    this.rgbLed = new RGBLed(rgbLedPin.red, rgbLedPin.green, rgbLedPin.blue);
  }

  public static get Instance(): RaspberryModulescontroller {
    return this._instance || (this._instance = new this());
  }

  public moveMotor(time: number): Promise<any> {
    return this.dcMotor.move(time);
  }

  public async getTempLecture(): Promise<{
    temperature: number;
    humidity: number;
  }> {
    return this.dht22.getLecture();
  }

  public async setLedColor(color: string): Promise<any> {
    return this.rgbLed.setColor(color);
  }

  public async turnLedOn(color?: string): Promise<any> {
    if (color) {
      await this.rgbLed.setColor(color);
    }
    return this.rgbLed.turnOn();
  }

  public async turnLedOff(): Promise<any> {
    return this.rgbLed.turnOff();
  }
}
