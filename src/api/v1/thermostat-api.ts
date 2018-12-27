import * as express from "express";
import ThermostatController from "../../controller/thermostat-controller";
import { Thermostat } from "../../model/Thermostat";
import { Logger } from "../../logger";

class ThermostatApi {
  public express;
  private thermostatController: ThermostatController;
  private logger: Logger;

  constructor() {
    this.express = express();
    this.mountRoutes();
    this.thermostatController = ThermostatController.Instance;
    this.logger = new Logger("API");
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get("/", this.helloWorld);
    router.post("/temperature", this.setTemperature);
    router.put("/temperature", this.moveTemp);
    this.express.use("/", router);
  }

  private helloWorld(req, res): void {
    res.json({
      message: "Hello World!"
    });
  }

  private async setTemperature(req, res): Promise<any> {
    if (!req || !req.body || !req.body.temp) {
      return res.status(400).json({ message: "Faltan parametros" });
    }

    const temp: number = parseInt(req.body.temp);

    if (isNaN(temp)) {
      return res
        .status(400)
        .json({ message: "El parametro temp no es un numero" });
    }

    await this.thermostatController.setTemp(temp);
    await this.thermostatController.regulateThermostat();
    res.json(Thermostat.Instance.toJSON());
  }

  private async moveTemp(req, res): Promise<any> {
    if (!req || !req.body || !req.body.amount) {
      return res.status(400).json({ message: "Faltan parametros" });
    }

    const amount: number = parseInt(req.body.amount);

    if (isNaN(amount)) {
      return res
        .status(400)
        .json({ message: "El parametro amount no es un numero" });
    }

    if (amount > 1) {
      await this.thermostatController.increateTemp(amount);
    } else {
      await this.thermostatController.decreaseTemp(amount);
    }
    await this.thermostatController.regulateThermostat();
    res.json(Thermostat.Instance.toJSON());
  }
}

export default new ThermostatApi().express;
