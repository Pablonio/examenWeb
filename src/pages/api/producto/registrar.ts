import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { nombreServicio, precio, idUsuarioVendedor, imagenes } = req.body;

        if (!nombreServicio || !precio || !idUsuarioVendedor || !imagenes) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];
            const user = await db.productoVender.create({
                data: {
                    nombreServicio,
                    idUsuarioVendedor: parseInt(idUsuarioVendedor),
                    imagenes: imagenesArray,
                    precio: parseInt(precio),
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            return res.status(500).json({ error: 'Hubo un problema al registrar el producto. Por favor, intenta de nuevo más tarde.' });
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}
