import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Form() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        numero: "",
        rol: "Usuario",
        password: "",
    });
    const [isLogin, setIsLogin] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmitFormUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formDataToSend = {
            ...formData,
            numero: parseInt(formData.numero, 10),
        };

        try {
            const endpoint = isLogin ? '/api/usuario/login' : '/api/usuario/registrar';
            const res = await axios.post(endpoint, formDataToSend);

            if (isLogin) {
                Cookies.set('id', res.data.user.id);
                Cookies.set('rol', res.data.user.rol);
                console.log('Redirigiendo a:', res.data.user.rol === "Vendedor" ? "/FormularioVendedor" : "/FormularioUsuario");
                router.push(res.data.user.rol === "Vendedor" ? "/FormularioVendedor" : "/FormularioUsuario");
            } else {
                setMessage("Registro exitoso. Puedes iniciar sesión ahora.");
                setError("");
            }
        } catch (error) {
            setError(isLogin ? "Hubo un problema al iniciar sesión." : "Hubo un problema al registrar el usuario.");
            setMessage("");
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 h-auto w-96 flex items-center justify-center p-6">
            <form
                method="post"
                onSubmit={handleSubmitFormUser}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
                
                {!isLogin && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="nombre"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="apellido">
                                Apellido
                            </label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="apellido"
                                required
                            />
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="numero">
                        Número
                    </label>
                    <input
                        type="number"
                        name="numero"
                        value={formData.numero}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="numero"
                        required
                    />
                </div>

                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="rol">
                            Selecciona el rol
                        </label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="rol"
                        >
                            <option value="Usuario">Usuario</option>
                            <option value="Vendedor">Vendedor</option>
                        </select>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="password"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <input
                        type="submit"
                        value={isLogin ? "Iniciar Sesión" : "Registrar"}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    />
                </div>

                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-500 mt-4">
                    {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>

                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
}
