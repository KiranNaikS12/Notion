import { Response} from 'express';

interface APIResponse<T> {
    message: string;
    data?:T;
}

export const sendResponse = <T>(res: Response, statusCode: number, message: string, data?: T) => {
    const responseObj: APIResponse<T> = { message };

    if (data !== undefined) {
        responseObj.data = data;
    }

    return res.status(statusCode).json(responseObj);
};