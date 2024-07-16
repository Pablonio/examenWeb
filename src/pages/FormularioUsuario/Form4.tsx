import React, { useState } from "react";

export default function Form4() {
  const [formData4, setFormData4] = useState({
    contenido: "",
    calificacion: 0,
  });

  const handleSubmitFormComentario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData4);
  }

  const handleRatingChange = (newRating: number) => {
    setFormData4({ ...formData4, calificacion: newRating });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          onClick={() => handleRatingChange(i)}
          xmlns="http://www.w3.org/2000/svg"
          fill={i <= formData4.calificacion ? "yellow" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-6 w-6 cursor-pointer ${i <= formData4.calificacion ? "text-yellow-500" : "text-gray-300"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.134 6.57a1 1 0 00.95.69h6.905c.969 0 1.371 1.24.588 1.81l-5.593 4.06a1 1 0 00-.364 1.118l2.133 6.57c.3.921-.755 1.688-1.54 1.118l-5.593-4.06a1 1 0 00-1.176 0l-5.593 4.06c-.784.57-1.84-.197-1.54-1.118l2.133-6.57a1 1 0 00-.364-1.118L2.056 12.6c-.784-.57-.38-1.81.588-1.81h6.905a1 1 0 00.95-.69l2.134-6.57z"
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="w-full max-w-lg mt-6">
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Registra un comentario</h2>
      <form
        method="post"
        onSubmit={handleSubmitFormComentario}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full"
      >
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="nombre">
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
    </div>
  );
}