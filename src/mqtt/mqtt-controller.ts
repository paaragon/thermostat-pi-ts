import { MQTTService } from "./mqtt-service";
import {
  Actions,
  ActionsEnum,
  SetTempAction,
  IncreaseTempAction,
  DecreaseTempAction,
  Action
} from "./actions";
import ThermostatController from "../controller/thermostat-controller";
import { Logger } from "../logger";

export class MQTTController {
  private static _instance: MQTTController;

  private _mqttService: MQTTService;
  private _thermostatcontroller: ThermostatController;

  private logger: Logger;

  private constructor() {
    this._mqttService = new MQTTService();
    this.logger = new Logger("MQTT");
  }

  public static get Instance(): MQTTController {
    return this._instance || (this._instance = new this());
  }

  public async startMQTTClient() {
    this.logger.info("============ Starting MQTT ============>");
    await this._mqttService.connect();
    await this._mqttService.subscribe();
    await this._mqttService.onMessage(this._onMessage);
  }

  public async publish(message: any): Promise<any> {
    return await this._mqttService.publish(message);
  }

  private _onMessage(message) {
    const action: Action = Actions.parseAction(message);
    if (action.error) {
      // TODO log action.errorMsg
      return;
    }
    this._executeAction(action);
  }

  private _executeAction(action: Action) {
    switch (action.actionName) {
      case ActionsEnum.SET_TEMP: {
        const temp: number = (<SetTempAction>action).params.temp;
        this._thermostatcontroller.setTemp(temp);
        return;
      }
      case ActionsEnum.INCREASE_TEMP: {
        const amount: number = (<IncreaseTempAction>action).params.amount;
        this._thermostatcontroller.increateTemp(amount);
        return;
      }
      case ActionsEnum.DECREASE_TEMP: {
        const amount: number = (<DecreaseTempAction>action).params.amount;
        this._thermostatcontroller.decreaseTemp(amount);
        return;
      }
      case ActionsEnum.TURN_OFF: {
        this._thermostatcontroller.turnThermostatOff();
        return;
      }
      case ActionsEnum.TURN_ON: {
        this._thermostatcontroller.turnThermostatOn();
        return;
      }
      default: {
        return;
      }
    }
  }
}
