import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { nombre, apellido, email, numero, rol, password } = req.body;

        if (!nombre || !apellido || !email || !numero || !rol || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await db.usuario.create({
                data: {
                    nombre,
                    apellido,
                    email,
                    numero,
                    rol,
                    contrasena: hashedPassword,
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


