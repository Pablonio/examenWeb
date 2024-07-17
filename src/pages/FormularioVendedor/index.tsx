import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface FormData {
  nombreServicio: string;
  precio: string;
  imagenes: File | null;
}

export default function Form2() {
  const [formData, setFormData] = useState<FormData>({
    nombreServicio: "",
    precio: "",
    imagenes: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        imagenes: e.target.files[0], // Solo la primera imagen
      });
    }
  };

  const handleSubmitFormProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = Cookies.get("id") as string;
    const idUsuarioVendedor = parseInt(id, 10);
    const precio = parseInt(formData.precio, 10); // Convertir precio a entero

    if (formData.imagenes) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imagenUrl = reader.result as string; // URL de la imagen

        try {
          const res = await axios.post("/api/producto/registrar", {
            nombreServicio: formData.nombreServicio,
            precio, // Enviar precio como número
            idUsuarioVendedor,
            imagenes: imagenUrl, // Enviar como cadena
          });
          setMessage("Producto registrado exitosamente!");
          console.log(res.data);
        } catch (error) {
          console.error('Error en la solicitud:', error);
          setError("Hubo un problema al registrar el producto.");
          setMessage("");
        }
      };
      reader.readAsDataURL(formData.imagenes); // Leer como URL base64
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-screen flex items-center justify-center">
      <form
        method="post"
        onSubmit={handleSubmitFormProducto}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="nombre">
          Nombre del producto
        </label>
        <input
          type="text"
          name="nombreServicio"
          value={formData.nombreServicio}
          onChange={(e) => setFormData({ ...formData, nombreServicio: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="precio">
          Precio del producto
        </label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="imagen">
          Imagen del producto
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="submit"
          value="Enviar"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        />

        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
