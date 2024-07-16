import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { nombreServicio, idUsuarioVendedor } = req.body;

        if (!nombreServicio|| !idUsuarioVendedor) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const user = await db.productoVender.create({
                data: {
                    nombreServicio,
                    idUsuarioVendedor
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            console.error('User creation failed:', error);
            return res.status(500).json({ error: 'User creation failed. Please try again later.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

