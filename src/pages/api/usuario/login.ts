import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/lib';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '@prisma/client'; // Import the Prisma types

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        try {
            const user: Usuario | null = await db.usuario.findUnique({
                where: { email },
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    email: true,
                    numero: true,
                    rol: true,
                    contrasena: true, // Include contrasena
                },
            });

            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.contrasena);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const tokenSecret = process.env.JWT_SECRET;
            if (!tokenSecret) {
                throw new Error("JWT_SECRET is not defined");
            }

            const token = jwt.sign({ id: user.id, rol: user.rol }, tokenSecret, { expiresIn: '1h' });

            return res.status(200).json({ token, user });
        } catch (error) {
            console.error('Login failed:', error);
            return res.status(500).json({ error: 'Error en el inicio de sesión. Intenta nuevamente más tarde.' });
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}
