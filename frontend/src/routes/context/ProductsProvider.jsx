import { useState, useEffect } from "react"
import { ProductsContext } from "./ProductsContext"

export const ProductsProvider = ({children}) => {

    const [products, setProducts] = useState([])

    const fetchProducts = async() => {
    try {
    const response = await fetch('/api/products')
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
