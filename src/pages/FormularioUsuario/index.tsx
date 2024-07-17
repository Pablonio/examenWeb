import axios from "axios";
import React, { useState, useEffect } from "react";
import Form4 from "./Form4";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

interface Producto {
  id: number;
  nombreServicio: string;
  imagenes: string; 
}

interface Comentario {
  id: number;
  contenido: string;
  calificacion: number;
  idUsuario: number;
  idProductoComprado: number;
  Usuario: {
    nombre: string; 
  };
}

export default function Form3() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get<Producto[]>("/api/producto/getProductos");
        setProductos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductos();
  }, []);

  const id = Cookies.get('id') as string;
  const idUsuario = parseInt(id, 10);

  const handlePurchase = async (idProductoVender: number) => {
    try {
      const response = await axios.post('/api/producto/comprarProducto', {
        idProductoVender,
        idUsuario,
      });
      Cookies.set('idProducto', response.data.idProductoVender);
      Cookies.set('idProductoComprado', response.data.id);
      setSelectedProduct(productos.find(p => p.id === idProductoVender) || null);
      toast.success("Producto comprado exitosamente!");
      setModalOpen(true);
    } catch (error) {
      toast.error("Hubo un problema al comprar el producto.");
      console.error(error);
    }
  };

  const fetchComentarios = async (idProductoVender: number) => {
    try {
      Cookies.set('idProducto', idProductoVender.toString());

      const response = await axios.get(`/api/comentarios/obtener?idProductoVender=${idProductoVender}`);
      console.log(response.data);
      setComentarios(response.data);
      setCommentModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const renderStars = (calificacion: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={solidStar}
          className={`h-4 w-4 ${i <= calificacion ? "text-yellow-500" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-screen w-full flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Registra la Compra</h2>
        <div className="grid grid-cols-1 gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <img src={producto.imagenes} alt={producto.nombreServicio} className="w-full h-40 object-cover mb-4 rounded" />
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">{producto.nombreServicio}</h3>
              <button
                onClick={() => handlePurchase(producto.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Comprar
              </button>
              <button
                onClick={() => fetchComentarios(producto.id)} 
                className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ver Comentarios
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Registra un comentario para {selectedProduct.nombreServicio}</h2>
            <Form4 />
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {commentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Comentarios para {selectedProduct?.nombreServicio}</h2>
            <div className="space-y-4">
              {comentarios.length > 0 ? (
                comentarios.map((comentario) => (
                  <div key={comentario.id} className="border-b pb-2">
                    <p className="text-gray-700 dark:text-gray-300">{comentario.contenido}</p>
                    <div className="flex items-center">
                      {renderStars(comentario.calificacion)}
                      <p className="text-gray-500 dark:text-gray-400 ml-2">Usuario: {comentario.Usuario.nombre}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay comentarios para este producto.</p>
              )}
            </div>
            <button
              onClick={() => setCommentModalOpen(false)}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
