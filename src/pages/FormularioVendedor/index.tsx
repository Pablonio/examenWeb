import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        imagenes: e.target.files[0], 
      });
    }
  };

  const handleSubmitFormProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    // Validations
    if (!formData.nombreServicio) {
      toast.error("El nombre del producto es obligatorio.");
      return;
    }
    if (!formData.precio) {
      toast.error("El precio del producto es obligatorio.");
      return;
    }
    if (!formData.imagenes) {
      toast.error("La imagen del producto es obligatorio.");
      return;
    }

    const id = Cookies.get("id") as string;
    const idUsuarioVendedor = parseInt(id, 10);
    const precio = parseInt(formData.precio, 10); 

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imagenUrl = reader.result as string;

      try {
        const res = await axios.post("/api/producto/registrar", {
          nombreServicio: formData.nombreServicio,
          precio, 
          idUsuarioVendedor,
          imagenes: imagenUrl, 
        });
        toast.success("Producto registrado exitosamente!");
      } catch (error) {
        console.error('Error en la solicitud:', error);
        toast.error("Hubo un problema al registrar el producto.");
      }
    };
    reader.readAsDataURL(formData.imagenes); 
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
        <Toaster />
      </form>
    </div>
  );
}
