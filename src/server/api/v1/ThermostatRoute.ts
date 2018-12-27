import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../../BaseRoute";
import { Thermostat } from "../../../model/Thermostat";
import ThermostatController from "../../../controller/thermostat-controller";

export class ThermostatRoute extends BaseRoute {
  private thermostatcontroller: ThermostatController;
  public static create(router: Router) {
    console.log("[IndexRoute::create] Creating index route.");
    router.get(
      "/temperature",
      (req: Request, res: Response, next: NextFunction) => {
        new ThermostatRoute().getTemperature(req, res, next);
      }
    );
    router.post(
      "/temperature",
      (req: Request, res: Response, next: NextFunction) => {
        new ThermostatRoute().setTemperature(req, res, next);
      }
    );
    router.put(
      "/temperature",
      (req: Request, res: Response, next: NextFunction) => {
        new ThermostatRoute().moveTemperature(req, res, next);
      }
    );
  }

  constructor() {
    super();
    this.thermostatcontroller = ThermostatController.Instance;
  }

  public getTemperature(req: Request, res: Response, next: NextFunction) {
    this.thermostatcontroller.updateCurrentTemp();
    this.status(200).json(req, res, Thermostat.Instance.toJSON());
  }

  public setTemperature(req: Request, res: Response, next: NextFunction) {
    if (!req || !req.body || !req.body.temp) {
      return this.status(400).json(req, res, {
        error: true,
        message: "Faltan parametros"
      });
    }

    const temp = parseInt(req.body.temp);
    this.thermostatcontroller.setTemp(temp);
    this.thermostatcontroller.updateCurrentTemp();
    this.status(200).json(req, res, Thermostat.Instance.toJSON());
  }

  public moveTemperature(req: Request, res: Response, next: NextFunction) {
    if (!req || !req.body || !req.body.amount) {
      return this.status(400).json(req, res, {
        error: true,
        message: "Faltan parametros"
      });
    }
    const amount = parseInt(req.body.amount);
    if (amount > 1) {
      this.thermostatcontroller.increateTemp(amount);
    } else {
      this.thermostatcontroller.decreaseTemp(amount);
    }
    this.thermostatcontroller.updateCurrentTemp();
    this.status(200).json(req, res, Thermostat.Instance.toJSON());
  }
}
