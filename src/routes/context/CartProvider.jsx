import { useReducer } from 'react'
import { CartContext } from './CartContext'

const initialState = []


    const shopReducer = (state = initialState, action = {}) => {
        switch (action.type) {
            case '[CART] Add shop':
                return [...state, action.payload]
            case '[CART] Increase Item Quantity':
                return state.map(item => {
                    const quant = item.quantity + 1
                    if(item.id === action.payload) return {...item, quantity: quant}
                    return item
                });
            case '[CART] Decrease Item Quantity':
                return state.map(item => {
                    const quant = item.quantity - 1
                    if(item.id === action.payload && item.quantity > 1) return {...item, quantity: quant}
                    return item
                });
            case '[CART] Eliminate Item':
                return state.filter(shop => shop.id !== action.payload)

            default:
                return state;
        }
    }

export const CartProvider = ({children}) => {

    const [shopList, dispatch] = useReducer(shopReducer, initialState)

    const addItem = (shop) => {
        const exists = shopList.find(item => item.id === shop.id)
        if(exists) {
            dispatch({
                type: '[CART] Increase Item Quantity',
                payload: shop.id
            });
        } else {
                const action = {
                type: '[CART] Add shop',
                payload: { ...shop, quantity: 1 }
                }
                dispatch(action)
            }
    }
    const increaseQuantity = (id) => {
        const action = {
            type: '[CART] Increase Item Quantity',
            payload: id
        }
        dispatch(action)
    }
    const decreaseQuantity = (id) => {
        const action = {
            type: '[CART] Decrease Item Quantity',
            payload: id
        }
        dispatch(action)
    }
    const eliminateItem = (id) => {
        const action = {
            type: '[CART] Eliminate Item',
            payload: id
        }
        dispatch(action)
    }

    const cartCount = shopList.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{shopList, cartCount, addItem, increaseQuantity, decreaseQuantity, eliminateItem}}>
        {children}
    </CartContext.Provider>
  )
}
