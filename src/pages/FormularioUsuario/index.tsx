import axios from "axios";
import React, { useState, useEffect } from "react";
import Form4 from "./Form4";
import Cookies from "js-cookie";

interface Producto {
  id: number;
  nombreServicio: string;
}

interface FormData {
  producto: string;
}

export default function Form3() {
  const [formData3, setFormData3] = useState<FormData>({
    producto: "",
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get<Producto[]>("/api/producto/getProductos");
        console.log(response.data);
        setProductos(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductos();
  }, []);

  const id = Cookies.get('id') as string;
  const idUsuario = parseInt(id, 10);

  const handleSubmitFormCalificacionProductoComprado = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const idProductoVender = parseInt(formData3.producto, 10);

    try {
      const response = await axios.post('/api/producto/comprarProducto', {
        idProductoVender: idProductoVender,
        idUsuario: idUsuario,
      });
      Cookies.set('idProductoComprado', response.data.id);

    } catch (error) {
      console.error(error);
      setError("Error al enviar la calificación.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-auto w-full flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Registra la Compra</h2>
        <div className="grid grid-cols-1 gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">{producto.nombreServicio}</h3>
              <button
                onClick={() => setFormData3({ ...formData3, producto: producto.id.toString() })}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      <Form4 />
    </div>
  );
}
