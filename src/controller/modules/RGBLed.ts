export class RGBLed {
  private pinR: number;
  private pinG: number;
  private pinB: number;

  constructor(pinR: number, pinG: number, pinB: number) {
    this.pinR = pinR;
    this.pinG = pinG;
    this.pinB = pinB;
  }

  public async setColor(hexColor: string): Promise<any> {
    console.log(`setting color ${hexColor}`);
    return new Promise((res, rej) => null);
  }

  public async turnOn(): Promise<any> {
    console.log(`turning led on`);
    return new Promise((res, rej) => null);
  }

  public async turnOff(): Promise<any> {
    console.log(`turning led off`);
    return new Promise((res, rej) => null);
  }
}
