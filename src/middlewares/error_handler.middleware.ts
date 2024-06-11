import express from 'express'
import { BadRequestError, InternalServerError, HttpStatusCode, NotFoundError, UnauthorisedError } from '../config/error'
const errorHandlerMiddleware = async (err:Error, req:express.Request, res:express.Response, next:express.NextFunction) => {
    if(err instanceof NotFoundError || err instanceof BadRequestError || err instanceof InternalServerError || err instanceof UnauthorisedError){
        return res.status(err.httpCode).json({ msg: err.httpMessage || err.message })
    }
    console.log('err is ',err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({msg:'Something went wrong, Please try again later.'})
  }
export default errorHandlerMiddleware
  