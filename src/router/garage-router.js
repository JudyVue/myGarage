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

garageRouter.get('/api/garages', bearerAuthMiddleware, (request, response, next) => {
  if (!request.profile) return next(new HttpErrors(400, 'GET GARAGE ROUTER: invalid request', { expose: false }));

  if (!request.query.id) return next(new HttpErrors(400, 'GET GARAGE ROUTER: bad query', { expose: false }));

  Garage.findOne({ _id: request.query.id })
    .then((garage) => {
      if (!garage) return next(new HttpErrors(400, 'GARAGE ROUTER GET: garage not found', { expose: false }));
      return response.json(garage);
    })
    .catch(next);
  return undefined;
});

// update route
garageRouter.put('/api/garages', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'PUT GARAGE ROUTER: invalid request', { expose: false }));

  if (!request.query.id) return next(new HttpErrors(400, 'PUT GARAGE ROUTER: bad query', { expose: false }));

  if (!Object.keys(request.body).length) return next(new HttpErrors(400, 'PUT GARAGE ROUTER: Missing request body', { expose: false }));
  
  console.log('~~~~~~~~~~~ GARAGE PUT request.query.id', request.query.id);
  console.log('~~~~~~~~~~~ request.body', request.body);

  Garage.init()
    .then(() => {
      return Garage.findOneAndUpdate({ _id: request.query.id }, request.body);
    })
    .then((garage) => {
      console.log('~~~~~~~~~~~ returned from update:', garage);
      return Garage.findOne(garage._id);
    })
    .then((garage) => {
      console.log('~~~~~~~~~~~ returning', garage);
      response.json(garage);
    })
    .catch(next);
  return undefined;
});

export default garageRouter;
