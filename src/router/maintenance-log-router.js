import { Router } from 'express';
import HttpErrors from 'http-errors';
import MaintenanceLog from '../model/maintenance-log';
import bearerAuthMiddleware from '../lib/middleware/bearer-auth-middleware';
// import logger from '../lib/logger';

const maintenanceLogRouter = new Router();

// update route
maintenanceLogRouter.put('/api/maintenance-logs', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'PUT MAINT LOG ROUTER: invalid request', { expose: false }));

  if (!request.query.id) return next(new HttpErrors(400, 'PUT MAINT LOG ROUTER: bad query', { expose: false }));

  if (!Object.keys(request.body).length) return next(new HttpErrors(400, 'PUT MAINT LOG ROUTER: Missing request body', { expose: false }));
  
  MaintenanceLog.init()
    .then(() => {
      return MaintenanceLog.findOneAndUpdate({ _id: request.query.id }, request.body);
    })
    .then((log) => {
      return MaintenanceLog.findOne(log._id);
    })
    .then((log) => {
      response.json(log);
    })
    .catch(next);
  return undefined;
});

export default maintenanceLogRouter;
