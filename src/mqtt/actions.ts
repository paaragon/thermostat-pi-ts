export enum ActionsEnum {
  SET_TEMP,
  INCREASE_TEMP,
  DECREASE_TEMP,
  TURN_OFF,
  TURN_ON
}
export interface Action {
  actionName: ActionsEnum;
  params: { [key: string]: any };
  error: boolean;
  errorMsg: string;
}
export interface SetTempAction extends Action {
  actionName: ActionsEnum.SET_TEMP;
  params: { temp: number };
}
export interface IncreaseTempAction extends Action {
  actionName: ActionsEnum.INCREASE_TEMP;
  params: { amount: number };
}
export interface DecreaseTempAction extends Action {
  actionName: ActionsEnum.DECREASE_TEMP;
  params: { amount: number };
}
export interface TurnOffAction extends Action {
  actionName: ActionsEnum.TURN_OFF;
}
export interface TurnOnAction extends Action {
  actionName: ActionsEnum.TURN_ON;
}

export default class Actions {
  public static parseAction(message: any): Action {
    if (!message || !message.actionName) {
      return {
        actionName: null,
        params: {},
        error: true,
        errorMsg: 'No se encuentra la accion',
      };
    }

    if (!(message.action in ActionsEnum)) {
      return {
        actionName: null,
        params: {},
        error: true,
        errorMsg: 'Acción no válida',
      };
    }

    switch (message.action) {
      case ActionsEnum.SET_TEMP:
        return Actions.parseSetTemp(message);
      case ActionsEnum.INCREASE_TEMP:
        return Actions.parseIncreaseTemp(message);
      case ActionsEnum.DECREASE_TEMP:
        return Actions.parseDecreaseTemp(message);
      case ActionsEnum.TURN_OFF:
        return Actions.parseTurnOff();
      case ActionsEnum.TURN_ON:
        return Actions.parseTurnOn();
      default:
        return {
          actionName: null,
          params: {},
          error: true,
          errorMsg: 'Acción no válida',
        };
    }
  }
  private static parseSetTemp(message: any): SetTempAction {
    if (!message.params || !('temp' in message.params)) {
      return {
        actionName: ActionsEnum.SET_TEMP,
        params: null,
        error: true,
        errorMsg: 'Faltan parámetros',
      };
    }

    const temp = parseInt(message.params.temp, 10);
    if (isNaN(temp)) {
      return {
        actionName: ActionsEnum.SET_TEMP,
        params: null,
        error: true,
        errorMsg: 'parametro temp no es un numero',
      };
    }
    return {
      actionName: ActionsEnum.SET_TEMP,
      params: { temp },
      error: false,
      errorMsg: null,
    };
  }

  private static parseIncreaseTemp(message: any): IncreaseTempAction {
    if (!message.params || !('amount' in message.params)) {
      return {
        actionName: ActionsEnum.INCREASE_TEMP,
        params: null,
        error: true,
        errorMsg: 'Faltan parámetros',
      };
    }
    const amount = parseInt(message.params.amount, 10);
    if (isNaN(amount)) {
      return {
        actionName: ActionsEnum.INCREASE_TEMP,
        params: null,
        error: true,
        errorMsg: 'parametro amount no es un numero',
      };
    }
    return {
      actionName: ActionsEnum.INCREASE_TEMP,
      params: { amount },
      error: false,
      errorMsg: null,
    };
  }

  private static parseDecreaseTemp(message: any): DecreaseTempAction {
    if (!message.params || !('amount' in message.params)) {
      return {
        actionName: ActionsEnum.DECREASE_TEMP,
        params: null,
        error: true,
        errorMsg: 'Faltan parámetros',
      };
    }

    const amount = parseInt(message.params.amount, 10);
    if (isNaN(amount)) {
      return {
        actionName: ActionsEnum.DECREASE_TEMP,
        params: null,
        error: true,
        errorMsg: 'parametro amount no es un numero',
      };
    }
    return {
      actionName: ActionsEnum.DECREASE_TEMP,
      params: { amount },
      error: false,
      errorMsg: null,
    };
  }

  private static parseTurnOff(): TurnOffAction {
    return {
      actionName: ActionsEnum.TURN_OFF,
      params: null,
      error: false,
      errorMsg: null,
    };
  }

  private static parseTurnOn(): TurnOnAction {
    return {
      actionName: ActionsEnum.TURN_ON,
      params: null,
      error: false,
      errorMsg: null,
    };
  }
}
