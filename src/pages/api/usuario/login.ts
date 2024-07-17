import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { db } from '../../../lib/lib';
import corsMiddleware from '../../../middleware/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await corsMiddleware(req, res);

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET not defined' });
    }
    const JWT_SECRET = process.env.JWT_SECRET;

    if (req.method === 'POST') {
        const { email, contrasena } = req.body;
    
        try {
          let usuario = await db.usuario.findUnique({
            where: { email: email },
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
              numero: true,
              rol: true,
              contrasena: true, // Añadimos este campo
            },
          });
    
          if (!usuario) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
    
          const passwordMatch = await compare(contrasena, usuario.contrasena);
    
          if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
    
          const token = sign({ userId: usuario.id }, JWT_SECRET, {
            expiresIn: '1h',
          });
    
          res.status(200).json({
            token,
            user: {
              id: usuario.id,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              email: usuario.email,
              numero: usuario.numero,
              rol: usuario.rol,
            },
          });
        } catch (error) {
          console.error('Login failed:', error);
          res.status(500).json({ error: 'Error en el inicio de sesión' });
        }
      } else {
        res.status(405).json({ error: 'Método no permitido' });
      }
}