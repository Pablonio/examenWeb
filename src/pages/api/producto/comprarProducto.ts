import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';
import corsMiddleware from '../../../middleware/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await corsMiddleware(req, res);
    if (req.method === 'POST') {
        const { idProductoVender, idUsuario } = req.body;

        if (!idProductoVender || !idUsuario) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const productoComprado = await db.productoComprado.create({
                data: {
                    idProductoVender,
                    idUsuario,
                },
            });
            return res.status(201).json(productoComprado);
        } catch (error) {
            console.error('Producto comprado:', error);
            return res.status(500).json({ error: 'Producto comprado. Please try again later.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}