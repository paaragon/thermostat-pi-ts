export enum ActionsEnum {
  SET_TEMP = "settemp",
  INCREASE_TEMP = "increasetemp",
  DECREASE_TEMP = "decreasetemp",
  TURN_OFF = "turnoff",
  TURN_ON = "turnon"
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

export class Actions {
  public static parseAction(message: any): Action {
    if (!message || !message.actionName) {
      return {
        actionName: null,
        params: {},
        error: true,
        errorMsg: "No se encuentra la accion"
      };
    }

    if (!(message.action in ActionsEnum)) {
      return {
        actionName: null,
        params: {},
        error: true,
        errorMsg: "Acción no válida"
      };
    }

    switch (message.action) {
      case ActionsEnum.SET_TEMP:
        return Actions._parseSetTemp(message);
      case ActionsEnum.INCREASE_TEMP:
        return Actions._parseIncreaseTemp(message);
      case ActionsEnum.DECREASE_TEMP:
        return Actions._parseDecreaseTemp(message);
      case ActionsEnum.TURN_OFF:
        return Actions._parseTurnOff(message);
      case ActionsEnum.TURN_ON:
        return Actions._parseTurnOn(message);
      default:
        return {
          actionName: null,
          params: {},
          error: true,
          errorMsg: "Acción no válida"
        };
    }
  }
  private static _parseSetTemp(message: any): SetTempAction {
    if (!message.params || !("temp" in message.params)) {
      return {
        actionName: ActionsEnum.SET_TEMP,
        params: null,
        error: true,
        errorMsg: "Faltan parámetros"
      };
    }

    const temp = parseInt(message.params.temp);
    if (isNaN(temp)) {
      return {
        actionName: ActionsEnum.SET_TEMP,
        params: null,
        error: true,
        errorMsg: "parametro temp no es un numero"
      };
    }
    return {
      actionName: ActionsEnum.SET_TEMP,
      params: { temp: temp },
      error: false,
      errorMsg: null
    };
  }

  private static _parseIncreaseTemp(message: any): IncreaseTempAction {
    if (!message.params || !("amount" in message.params)) {
      return {
        actionName: ActionsEnum.INCREASE_TEMP,
        params: null,
        error: true,
        errorMsg: "Faltan parámetros"
      };
    }
    const amount = parseInt(message.params.amount);
    if (isNaN(amount)) {
      return {
        actionName: ActionsEnum.INCREASE_TEMP,
        params: null,
        error: true,
        errorMsg: "parametro amount no es un numero"
      };
    }
    return {
      actionName: ActionsEnum.INCREASE_TEMP,
      params: { amount: amount },
      error: false,
      errorMsg: null
    };
  }

  private static _parseDecreaseTemp(message: any): DecreaseTempAction {
    if (!message.params || !("amount" in message.params)) {
      return {
        actionName: ActionsEnum.DECREASE_TEMP,
        params: null,
        error: true,
        errorMsg: "Faltan parámetros"
      };
    }

    const amount = parseInt(message.params.amount);
    if (isNaN(amount)) {
      return {
        actionName: ActionsEnum.DECREASE_TEMP,
        params: null,
        error: true,
        errorMsg: "parametro amount no es un numero"
      };
    }
    return {
      actionName: ActionsEnum.DECREASE_TEMP,
      params: { amount: amount },
      error: false,
      errorMsg: null
    };
  }

  private static _parseTurnOff(message: any): TurnOffAction {
    return {
      actionName: ActionsEnum.TURN_OFF,
      params: null,
      error: false,
      errorMsg: null
    };
  }

  private static _parseTurnOn(message: any): TurnOnAction {
    return {
      actionName: ActionsEnum.TURN_ON,
      params: null,
      error: false,
      errorMsg: null
    };
  }
}
