export default class Thermostat {
  private static instance: Thermostat;

  public currentTemp: number;
  public tempSet: number;
  public on: boolean;

  private constructor() {
    this.currentTemp = 0;
    this.tempSet = 0;
    this.on = false;
  }

  public static get Instance(): Thermostat {
    return this.instance || (this.instance = new this());
  }

  public toJSON() {
    return {
      currentTemp: this.currentTemp,
      tempSet: this.tempSet,
      on: this.on,
    };
  }
}
