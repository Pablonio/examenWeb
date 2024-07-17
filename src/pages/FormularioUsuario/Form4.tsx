import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

interface FormData {
  contenido: string;
  calificacion: number;
}

export default function Form4() {
  const [formData4, setFormData4] = useState<FormData>({
    contenido: "",
    calificacion: 0,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmitFormComentario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = Cookies.get('id') as string;
    const idUsuario = parseInt(id, 10);
    const idProductoComprado = Cookies.get('idProductoComprado') as string;
    const idProductoCompradoParse = parseInt(idProductoComprado, 10);

    try {
      const response = await axios.post('/api/comentarios/registrar', {
        contenido: formData4.contenido,
        calificacion: formData4.calificacion,
        idUsuario: idUsuario,
        idProductoComprado: idProductoCompradoParse,
      });
      setMessage("Comentario registrado exitosamente!");
      setFormData4({ contenido: "", calificacion: 0 });
    } catch (error) {
      console.error("Error al registrar comentario:", error);
      setError("Error al registrar comentario. Por favor, intenta de nuevo.");
    }
  };

  const handleRatingChange = (newRating: number) => {
    setFormData4({ ...formData4, calificacion: newRating });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={solidStar}
          onClick={() => handleRatingChange(i)}
          className={`h-6 w-6 cursor-pointer ${i <= formData4.calificacion ? "text-yellow-500" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="w-full max-w-lg mt-6">
      <form
        method="post"
        onSubmit={handleSubmitFormComentario}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full"
      >
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="contenido">
          Realiza un comentario
        </label>
        <input
          type="text"
          name="contenido"
          value={formData4.contenido}
          onChange={e => setFormData4({ ...formData4, contenido: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="calificacion">
          Calificación
        </label>
        <div className="flex space-x-2">
          {renderStars()}
        </div>
        <input
          type="submit"
          value="Enviar"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        />
      </form>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
