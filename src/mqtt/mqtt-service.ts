import { MqttClient } from 'mqtt';

import mqtt = require('mqtt');
import config = require('config');

export default class MQTTService {
  private client: MqttClient;
  private url: string = config.get<string>('mqtt.url');
  private channel: string = config.get<string>('mqtt.channel');
  private username: string = config.get<string>('mqtt.username');
  private password: string = config.get<string>('mqtt.password');
  private quos: mqtt.QoS = config.get<mqtt.QoS>('mqtt.qos');

  public async connect(): Promise<any> {
    return new Promise((res, rej) => {
      this.client = mqtt.connect(
        this.url,
        { username: this.username, password: this.password },
      );
      this.client.on('connect', (err) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  public async subscribe(): Promise<any> {
    return new Promise((res, rej) => {
      this.client.subscribe(this.channel, (err) => {
        if (err) {
          rej(err);
          return;
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
          qos: this.quos,
        },
        (err) => {
          if (err) {
            rej(err);
            return;
          }
          res();
        },
      );
    });
  }

  public onMessage(cb: Function) {
    this.client.on('message', (topic, message) => {
      cb(message);
    });
  }

  public async end(): Promise<any> {
    return new Promise((res) => {
      this.client.end(false, () => {
        res();
      });
    });
  }
}
