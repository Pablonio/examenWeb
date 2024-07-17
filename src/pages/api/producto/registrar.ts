import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { nombreServicio, precio, idUsuarioVendedor, imagenes } = req.body;

    if (!nombreServicio || !precio || !idUsuarioVendedor || !imagenes) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
      const producto = await db.productoVender.create({
        data: {
          nombreServicio,
          precio: parseInt(precio, 10), // Convertir precio a número
          idUsuarioVendedor,
          imagenes, // Enviar como cadena
        },
      });
      return res.status(201).json(producto);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      return res.status(500).json({ error: 'Hubo un problema al registrar el producto. Por favor, intenta de nuevo más tarde.' });
    }
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
};

export default handler;
