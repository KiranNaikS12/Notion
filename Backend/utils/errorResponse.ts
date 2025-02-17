import { Response} from 'express';

export const sendErrorResponse = (res: Response, statusCode: number, message: string, error?: string): void => {
    res.status(statusCode).json({ message, error });
};
  