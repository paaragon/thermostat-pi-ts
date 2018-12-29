import { Gpio } from 'pigpio';

export default class RGBLed {
  private pinR: Gpio;
  private pinG: Gpio;
  private pinB: Gpio;
  private hexColor: string;

  constructor(pinR: number, pinG: number, pinB: number) {
    this.pinR = new Gpio(pinR, { mode: Gpio.OUTPUT });
    this.pinG = new Gpio(pinG, { mode: Gpio.OUTPUT });
    this.pinB = new Gpio(pinB, { mode: Gpio.OUTPUT });
    process.on('SIGINT', () => {
      this.turnOff();
    });
  }

  public async setColor(hexColor: string): Promise<any> {
    return new Promise(async (res) => {
      this.hexColor = hexColor;
      await this.turnOff();
      await this.turnOn();
      res();
    });
  }

  public async turnOn(): Promise<any> {
    return new Promise((res) => {
      const c = RGBLed.parseColor(this.hexColor);
      this.pinR.pwmWrite(c.r);
      this.pinG.pwmWrite(c.g);
      this.pinB.pwmWrite(c.b);
      res();
    });
  }

  public async turnOff(): Promise<any> {
    return new Promise((res) => {
      this.pinR.digitalWrite(0);
      this.pinG.digitalWrite(0);
      this.pinB.digitalWrite(0);
      res();
    });
  }

  private static parseColor(color: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : {
      r: 0,
      g: 0,
      b: 0,
    };
  }
}
