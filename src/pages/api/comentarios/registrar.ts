import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';
import corsMiddleware from '../../../middleware/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await corsMiddleware(req, res);
    if (req.method === 'POST') {
        const { contenido, calificacion, idUsuario, idProductoComprado } = req.body;

        if (!contenido || !idUsuario || !idProductoComprado || !calificacion) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const comentario = await db.comentario.create({
                data: {
                    contenido,
                    calificacion: 0,
                    idUsuario,
                    idProductoComprado,
                },
            });
            return res.status(201).json(comentario);
        } catch (error) {
            console.error('Comentario:', error);
            return res.status(500).json({ error: 'Comentario. Please try again later.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}