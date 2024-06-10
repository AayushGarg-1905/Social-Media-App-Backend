import * as express from 'express';
import { Filter, ObjectId } from 'mongodb';
import { BadRequestError,UnauthorisedError  } from '../config/error';
import { DatabaseService, PassportModel, UserModel } from '../internal_exports';

export default class AuthMiddleware {
    constructor() {

    }

    public async authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const authorization = req.headers['authorization'];

            if(!authorization) {
                return next(new UnauthorisedError());
            }

            const accessToken = authorization.split(' ')[1];
            const passport = await PassportModel.default.findOne({accessToken});
            if(!passport) {
                return next(new UnauthorisedError());
            }

            req.userId = passport.userId
            // console.log('req is ',req);

            return next();
        } catch(e) {
            return next(e);
        }
        
    }
}