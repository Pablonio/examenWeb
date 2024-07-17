import type { NextApiRequest, NextApiResponse } from 'next';
import {db} from "../../../lib/lib";
import corsMiddleware from '../../../middleware/cors';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await corsMiddleware(req, res);
    if (req.method === 'GET') {
        try {
            const productos = await db.productoVender.findMany();
            return res.status(200).json(productos);
        } catch (error) {
            console.error('Productos obtenidos:', error);
            return res.status(500).json({ error: 'Productos obtenidos. Please try again later.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}