import { NextApiRequest, NextApiResponse } from "next";
import {db} from "../../../lib/lib";

interface Usuario {
  id: number;
  nombre: string;
}

interface Comentario {
  id: number;
  contenido: string;
  fecha: Date;
  idUsuario: number;
  calificacion: number;
  Usuario: Usuario;
}

interface ProductoComprado {
    id: number;
    idProductoVender: number;
    fecha: Date;
    idUsuario: number;
    Comentarios: Comentario[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { idProductoVender } = req.query;

  if (!idProductoVender) {
    return res.status(400).json({ message: "idProductoVender es requerido." });
  }

  try {
    
    const productosComprados: ProductoComprado[] = await db.productoComprado.findMany({
      where: {
        idProductoVender: Number(idProductoVender), 
      },
      include: {
        Comentarios: {
          include: {
            Usuario: true ,
          },
        },
      },
    });

    const comentarios = productosComprados.flatMap(pc => pc.Comentarios);

    return res.status(200).json(comentarios);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Error al obtener comentarios." });
  }
}
