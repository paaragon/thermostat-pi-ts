import * as sensor from 'node-dht-sensor';

export interface DHT22Lecture {
  temperature: number;
  humidity: number;
}

export default class DHT22 {
  private pin: number;

  constructor(pin) {
    this.pin = pin;
  }

  public async getLecture(): Promise<DHT22Lecture> {
    return new Promise<DHT22Lecture>((res, rej) => {
      sensor.read(22, this.pin, (err, temperature, humidity) => {
        if (err) {
          return rej(null);
        }
        return res({
          temperature,
          humidity,
        });
      });
    });
  }
}
