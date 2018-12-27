import { NextFunction, Request, Response } from "express";

/**
 * Constructor
 *
 * @class BaseRoute
 */
export class BaseRoute {
  protected title: string;

  private scripts: string[];

  private _status: number;

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor() {
    //initialize variables
    this.title = "Tour of Heros";
    this.scripts = [];
  }

  /**
   * Add a JS external file to the request.
   *
   * @class BaseRoute
   * @method addScript
   * @param src {string} The src to the external JS file.
   * @return {BaseRoute} Self for chaining
   */
  public addScript(src: string): BaseRoute {
    this.scripts.push(src);
    return this;
  }

  public status(stat) {
    this._status = stat;
    return this;
  }

  public json(
    req: Request,
    res: Response,
    json: any,
    status?: number,
    options?: Object
  ) {
    res.locals.BASE_URL = "/";
    res.locals.scripts = this.scripts;
    res.locals.title = this.title;
    const _status = status ? status : 200;
    res.status(_status).json(json);
  }

  /**
   * Render a page.
   *
   * @class BaseRoute
   * @method render
   * @param req {Request} The request object.
   * @param res {Response} The response object.
   * @param view {String} The view to render.
   * @param options {Object} Additional options to append to the view's local scope.
   * @return void
   */
  public render(req: Request, res: Response, view: string, options?: Object) {
    //add constants
    res.locals.BASE_URL = "/";

    //add scripts
    res.locals.scripts = this.scripts;

    //add title
    res.locals.title = this.title;

    //render view
    res.render(view, options);
  }
}
