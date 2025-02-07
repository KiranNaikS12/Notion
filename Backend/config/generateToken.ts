import jwt from 'jsonwebtoken';
import { Response } from 'express';

export interface JwtPayload {
    userId: string,
}

const generateToken = async (res: Response, userId: string) : Promise<void> => {
    try {
        if(!process.env.JWT_SECRET) {
            throw new Error('Undefined Access Token')
        }

        const token  = jwt.sign({userId} as JwtPayload, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('access-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        console.log('Token generated successfully')

    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
}

export default generateToken;