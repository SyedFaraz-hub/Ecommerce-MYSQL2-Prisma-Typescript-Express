export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;


    constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any) {
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}


export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    ADDRESS_NOT_FOUND = 10056,
    USER_ALREADY_EXIST = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 20001,
    INTERNAL_EXCEPTION  = 30001,
    UNAUTHORIZED = 1004,
    PRODUCT_NOT_FOUND = 1005,
    ORDER_NOT_FOUND = 1006,
 }