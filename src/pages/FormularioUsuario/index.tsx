import axios from "axios";
import React, { useState, useEffect } from "react";
import Form4 from "./Form4";

interface Producto {
  id: number;
  nombreServicio: string;
}

interface FormData {
  nombreServicio: string;
  producto: string;
}

export default function Form3() {
  const [formData3, setFormData3] = useState<FormData>({
    nombreServicio: "",
    producto: "",
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get<Producto[]>("/api/producto/getProductos");
        setProductos(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleSubmitFormCalificacionProductoComprado = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post('/api/producto/calificar', formData3);
      setMessage("Calificación enviada con éxito.");
    } catch (error) {
      setError("Error al enviar la calificación.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-auto w-full flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Registra la Compra</h2>
        <form
          method="post"
          onSubmit={handleSubmitFormCalificacionProductoComprado}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full"
        >
          <label
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            htmlFor="producto"
          >
            Selecciona el producto
          </label>
          <select
            name="producto"
            value={formData3.producto}
            onChange={(e) =>
              setFormData3({ ...formData3, producto: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombreServicio}
              </option>
            ))}
          </select>
          <input
            type="submit"
            value="Enviar"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          />
        </form>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <Form4 />
    </div>
  );
}