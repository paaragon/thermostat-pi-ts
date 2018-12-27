export interface DHT22Lecture {
  temperature: number;
  humidity: number;
}

export class DHT22 {
  private pin: number;

  constructor(pin) {
    this.pin = pin;
  }

  public async getLecture(): Promise<DHT22Lecture> {
    return new Promise<DHT22Lecture>((res, rej) => {
      return res({
        temperature: 0,
        humidity: 0
      });
    });
  }
}
