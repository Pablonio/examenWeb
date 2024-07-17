import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { idProductoComprado } = req.query;

        if (!idProductoComprado) {
            return res.status(400).json({ error: 'ID del producto es obligatorio' });
        }

        try {
            const comentarios = await db.comentario.findMany({
                where: {
                    idProductoComprado: Number(idProductoComprado),
                },
                include: {
                    Usuario: true, // Use 'Usuario' instead of 'usuario'
                },
            });
            return res.status(200).json(comentarios);
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            return res.status(500).json({ error: 'Error al obtener comentarios. Por favor, intenta de nuevo más tarde.' });
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}
