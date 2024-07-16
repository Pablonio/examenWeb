import React, {useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Form2(){
    const [formData2, setFormData2] = useState({
        nombreServicio: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmitFormProducto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const id = Cookies.get('id') as string;

        const idUsuarioVendedor = parseInt(id, 10);
        

        const formDataToSend = {
            ...formData2,
            idUsuarioVendedor,
        };
        
        
        try {
            const res = await axios.post('/api/producto/registrar', formDataToSend);
            setMessage("Usuario registrado exitosamente!");
            console.log(res.data);
            
        } catch (error) {
            setError("Hubo un problema al registrar el usuario.");
            setMessage("");
        }
    };

    return(
        <div className="bg-gray-100 dark:bg-gray-800 h-40 w-96 flex items-center justify-center">
            
            <form 
                method="post"   
                onSubmit={handleSubmitFormProducto} 
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="nombre">
                    Nombre del producto
                </label>
                <input  
                    type="text"     
                    name="nombreServicio"   
                    value={formData2.nombreServicio}    
                    onChange={e => setFormData2({...formData2, nombreServicio: e.target.value})}    
                    className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                <input 
                    type="submit" 
                    value="Enviar"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"/>
            </form>
        </div>
    )
}

