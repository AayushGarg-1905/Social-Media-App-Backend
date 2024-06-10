export enum HttpStatusCode {
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORISED = 401,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    CONFLICT = 409,
    REDIRECT = 302,
    INTERNAL_SERVER_ERROR = 500
}


export class BaseError extends Error {
    public readonly name:string;
    public readonly httpCode: HttpStatusCode;
    public readonly httpMessage?:string;

    constructor(name:string, httpCode:HttpStatusCode, message:string){
        super(message);
        this.name  = name;
        this.httpCode = httpCode;
        this.httpMessage = message;
    }
}

export class NotFoundError extends BaseError {
    constructor(message:string){
        super('NOT_FOUND',HttpStatusCode.NOT_FOUND,message)
    }
}

export class UnauthorisedError extends BaseError {
    constructor(message="User not authorised"){
        super('UNAUTHORISED',HttpStatusCode.UNAUTHORISED,message)
    }
}

export class BadRequestError extends BaseError {
    constructor(message:string){
        super('BAD_REQUEST',HttpStatusCode.BAD_REQUEST,message)
    }
}

export class InternalServerError extends BaseError {
    constructor(message:string){
        super('INTERNAL_SERVER_ERROR',HttpStatusCode.INTERNAL_SERVER_ERROR,message)
    }
}
