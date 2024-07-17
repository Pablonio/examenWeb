import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { db } from '../../../lib/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET not defined' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (req.method === 'POST') {
        const { email, contrasena } = req.body;

        if (!email || !contrasena) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        try {
            const user = await db.usuario.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const passwordMatch = await compare(contrasena, user.contrasena);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const token = sign({ userId: user.id, rol: user.rol }, JWT_SECRET, {
                expiresIn: '1h',
            });

            res.status(200).json({ token, user: { id: user.id, nombre: user.nombre, contrasena: user.contrasena, apellido: user.apellido, email: user.email, numero: user.numero, rol: user.rol } });
        } catch (error) {
            console.error('Login failed:', error);
            res.status(500).json({ error: 'Error en el inicio de sesión' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
