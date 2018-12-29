import { Request, Response, Router } from 'express';
import BaseRoute from '../../BaseRoute';
import Thermostat from '../../../model/Thermostat';
import ThermostatController from '../../../controller/thermostat-controller';

export default class ThermostatRoute extends BaseRoute {
  private thermostatcontroller: ThermostatController;
  public static create(router: Router) {
    router.get(
      '/temperature',
      (req: Request, res: Response) => {
        new ThermostatRoute().getTemperature(req, res);
      },
    );
    router.post(
      '/temperature',
      (req: Request, res: Response) => {
        new ThermostatRoute().setTemperature(req, res);
      },
    );
    router.put(
      '/temperature',
      (req: Request, res: Response) => {
        new ThermostatRoute().moveTemperature(req, res);
      },
    );
  }

  constructor() {
    super();
    this.thermostatcontroller = ThermostatController.Instance;
  }

  public getTemperature(req: Request, res: Response): void {
    this.thermostatcontroller.updateCurrentTemp();
    this.status(200).json(req, res, Thermostat.Instance.toJSON());
  }

  public setTemperature(req: Request, res: Response): void {
    if (!req || !req.body || !req.body.temp) {
      this.status(400).json(req, res, {
        error: true,
        message: 'Faltan parametros',
      });
      return;
    }

    const temp = parseInt(req.body.temp, 10);
    this.thermostatcontroller.setTemp(temp);
    this.thermostatcontroller.updateCurrentTemp();
    this.status(200).json(req, res, Thermostat.Instance.toJSON());
  }

  public moveTemperature(req: Request, res: Response): void {
    if (!req || !req.body || !req.body.amount) {
      this.status(400).json(req, res, {
        error: true,
        message: 'Faltan parametros',
      });
      return;
    }
    const amount = parseInt(req.body.amount, 10);
    if (amount > 1) {
      this.thermostatcontroller.increateTemp(amount);
    } else {
      this.thermostatcontroller.decreaseTemp(amount);
    }
    this.thermostatcontroller.updateCurrentTemp();
    this.status(200).json(req, res, Thermostat.Instance.toJSON());
  }
}
