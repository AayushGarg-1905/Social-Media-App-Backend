import * as express from 'express';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';
import { BadRequestError, InternalServerError } from '../config/error';

export default class DtoValidatorMiddleware {
    public validateRequest(dtoClass: any) {
        return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
            const plainObject = {
                ...req.body,
                ...req.params,
                ...req.query
            }
            const output: any = classTransformer.plainToInstance(dtoClass, plainObject);
            const validationErrors: classValidator.ValidationError[] = await classValidator.validate(output,
                {
                    stopAtFirstError: true,
                    forbidUnknownValues: true,
                    whitelist: true,
                    forbidNonWhitelisted: true
                });

            if (validationErrors.length > 0) {
                const errorMsg = validationErrors[0].constraints && Object.values(validationErrors[0].constraints)[0];
                if (errorMsg) {
                    return next(new BadRequestError(errorMsg));
                } else {
                    return next(new InternalServerError('Something went wrong, Please try again later.!'));
                }
            } else {
                return next();
            }
        };
    }

    public async validatePayload(dtoClass: any, plainObject: any) {
        const output: any = classTransformer.plainToInstance(dtoClass, plainObject);
        const validationErrors: classValidator.ValidationError[] = await classValidator.validate(output,
            {
                stopAtFirstError: true,
                forbidUnknownValues: true,
                whitelist: true,
                forbidNonWhitelisted: true
            });

        if (validationErrors.length > 0) {
            const errorMsg = validationErrors[0].constraints && Object.values(validationErrors[0].constraints)[0];
            if (errorMsg) {
                throw new BadRequestError(errorMsg);
            } else {
                throw new InternalServerError('Something went wrong, Please try again later.!');
            }
        }
    }
}
