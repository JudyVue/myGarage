import { Router } from 'express';
import HttpErrors from 'http-errors';
import Garage from '../model/garage';
import bearerAuthMiddleware from '../lib/middleware/bearer-auth-middleware';
import logger from '../lib/logger';

const garageRouter = new Router();

garageRouter.post('/api/garages', bearerAuthMiddleware, (request, response, next) => {
  console.log('INSIDE POST');
  logger.log(logger.INFO, `.post /api/garages req.body: ${request.body}`);
  if (!request.profile) return next(new HttpErrors(400, 'POST GARAGE_ROUTER: invalid request', { expose: false }));

  Garage.init()
    .then(() => {
      return new Garage({
        ...request.body,
        profileId: request.profile._id,
      }).save();
    })
    .then((garage) => {
      console.log('THIS IS A GARAGE!!!!!!!! ', garage);
      logger.log(logger.INFO, `POST GARAGE ROUTER: new garage created with 200 code, ${JSON.stringify(garage)}`);
      return response.json(garage);
    })
    .catch(next);
  return undefined;
});

garageRouter.get('/api/garages/:id?', bearerAuthMiddleware, (request, response, next) => {
  if (!request.profile) return next(new HttpErrors(400, 'GET GARAGE ROUTER: invalid request', { expose: false }));
  // if (!Object.keys(request.query).length === 0) {
  //   return Garage.find().populate()
  //     .then((garages) => {
  //       return response.json(garages);
  //     })
  //     .catch(next);
  // }
  if (!request.query.id) return next(new HttpErrors(400, 'GET GARAGE ROUTER: bad query', { expose: false }));

  Garage.findOne({ _id: request.query.id })
    .then((garage) => {
      if (!garage) return next(new HttpErrors(400, 'GARAGE ROUTER GET: garage not found', { expose: false }));
      return response.json(garage);
    })
    .catch(next);
  return undefined;
});

export default garageRouter;