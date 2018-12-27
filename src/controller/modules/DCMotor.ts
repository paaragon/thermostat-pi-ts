export class DCMotor {
  private pin: number;

  constructor(pin) {
    this.pin = pin;
  }

  public async move(time: number): Promise<any> {
    return new Promise((res, rej) => {
      console.log(`moving for ${time} secs`);
      res();
    });
  }
}
