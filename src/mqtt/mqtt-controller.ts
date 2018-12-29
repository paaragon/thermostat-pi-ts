import MQTTService from './mqtt-service';
import Actions, {
  ActionsEnum,
  SetTempAction,
  IncreaseTempAction,
  DecreaseTempAction,
  Action,
} from './actions';
import ThermostatController from '../controller/thermostat-controller';
import Logger from '../logger';

export default class MQTTController {
  private static instance: MQTTController;

  private mqttService: MQTTService;
  private thermostatcontroller: ThermostatController;

  private logger: Logger;

  private constructor() {
    this.mqttService = new MQTTService();
    this.logger = new Logger('MQTT');
  }

  public static get Instance(): MQTTController {
    return this.instance || (this.instance = new this());
  }

  public async startMQTTClient() {
    this.logger.info('============ Starting MQTT ============>');
    await this.mqttService.connect();
    await this.mqttService.subscribe();
    await this.mqttService.onMessage(this.onMessage);
  }

  public async publish(message: any): Promise<any> {
    return this.mqttService.publish(message);
  }

  private onMessage(message) {
    const action : Action = Actions.parseAction(message);
    if (action.error) {
      // TODO log action.errorMsg
      return;
    }
    this.executeAction(action);
  }

  private executeAction(action: Action) {
    switch (action.actionName) {
      case ActionsEnum.SET_TEMP: {
        const temp : number = (<SetTempAction>action).params.temp;
        this.thermostatcontroller.setTemp(temp);
        return;
      }
      case ActionsEnum.INCREASE_TEMP: {
        const amount : number = (<IncreaseTempAction>action).params.amount;
        this.thermostatcontroller.increateTemp(amount);
        return;
      }
      case ActionsEnum.DECREASE_TEMP: {
        const amount : number = (<DecreaseTempAction>action).params.amount;
        this.thermostatcontroller.decreaseTemp(amount);
        return;
      }
      case ActionsEnum.TURN_OFF: {
        this.thermostatcontroller.turnThermostatOff();
        return;
      }
      case ActionsEnum.TURN_ON: {
        this.thermostatcontroller.turnThermostatOn();
        return;
      }
      default: {
        this.logger.info('Accion no implementada');
      }
    }
  }
}
