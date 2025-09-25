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
        shop.quantity = 1
        const action = {
            type: '[CART] Add shop',
            payload: shop
        }
        dispatch(action)
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

  return (
    <CartContext.Provider value={{shopList, addItem, increaseQuantity, decreaseQuantity, eliminateItem}}>
        {children}
    </CartContext.Provider>
  )
}
