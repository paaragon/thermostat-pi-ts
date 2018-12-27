import mqtt = require("mqtt");
import { MqttClient } from "mqtt";
import config = require("config");

export class MQTTService {
  private client: MqttClient;
  private url: string = config.get("mqtt.url");
  private channel: string = config.get("mqtt.channel");
  private username: string = config.get("mqtt.username");
  private password: string = config.get("mqtt.password");
  private quos: mqtt.QoS = config.get("mqtt.qos");

  constructor() {}

  public async connect(): Promise<any> {
    return new Promise((res, rej) => {
      this.client = mqtt.connect(
        this.url,
        { username: this.username, password: this.password }
      );
      this.client.on("connect", err => {
        if (err) {
          return rej(err);
        }
        res();
      });
    });
  }

  public async subscribe(): Promise<any> {
    return new Promise((res, rej) => {
      this.client.subscribe(this.channel, function(err) {
        if (err) {
          return rej(err);
        }
        res();
      });
    });
  }

  public async publish(payload: any): Promise<any> {
    return new Promise((res, rej) => {
      this.client.publish(
        this.channel,
        payload,
        {
          qos: this.quos
        },
        err => {
          if (err) {
            return rej(err);
          }
          res();
        }
      );
    });
  }

  public onMessage(cb: Function) {
    this.client.on("message", (topic, message) => {
      cb(message);
    });
  }

  public async end(): Promise<any> {
    return new Promise((res, rej) => {
      this.client.end(false, () => {
        res();
      });
    });
  }
}
