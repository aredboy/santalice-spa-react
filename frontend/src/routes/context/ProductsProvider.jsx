import { useState, useEffect } from "react"
import { ProductsContext } from "./ProductsContext"

export const ProductsProvider = ({children}) => {

    const [products, setProducts] = useState([])

    const fetchProducts = async() => {
        try {
            // 1. Definimos la URL base. 
            // Si existe la variable de entorno (en Netlify), usa esa. 
            // Si no (en tu PC), usa localhost.
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            console.log("Conectando a:", baseUrl); // Para depurar

            // 2. Hacemos el fetch concatenando la URL base con el endpoint
            const response = await fetch(`${baseUrl}/products`)
            
            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const data = await response.json()
            console.log(data)
            setProducts(data)
        } catch (error) {
            console.log('Error fetching products:', error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])
    
    return (
        <ProductsContext.Provider value={{products}}>
            {children}
        </ProductsContext.Provider>
    )
}