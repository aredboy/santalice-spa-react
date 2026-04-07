import { useReducer, useState } from 'react'
import { CartContext } from './CartContext'

const initialState = []

const shopReducer = (state = initialState, action = {}) => {
    switch (action.type) {
    case '[CART] Add shop':
        return [...state, { ...action.payload, quantity: 1 }]

    case '[CART] Increase Item Quantity':
        return state.map(item =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        )

    case '[CART] Decrease Item Quantity':
        return state.map(item =>
        item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )

    case '[CART] Eliminate Item':
        return state.filter(item => item.id !== action.payload)

    default:
        return state
    }
}

export const CartProvider = ({ children }) => {
    const [shopList, dispatch] = useReducer(shopReducer, initialState)
    const [appointment, setAppointment] = useState(null)

    const addItem = (shop) => {
    dispatch(
        shopList.find(item => item.id === shop.id)
        ? { type: '[CART] Increase Item Quantity', payload: shop.id }
        : { type: '[CART] Add shop', payload: shop }
    )
    }

    const increaseQuantity = (id) =>
    dispatch({ type: '[CART] Increase Item Quantity', payload: id })

    const decreaseQuantity = (id) =>
    dispatch({ type: '[CART] Decrease Item Quantity', payload: id })

    const eliminateItem = (id) =>
    dispatch({ type: '[CART] Eliminate Item', payload: id })

    const cartCount = shopList.reduce((acc, item) => acc + item.quantity, 0)

    return (
    <CartContext.Provider value={{
        shopList, cartCount,
        addItem, increaseQuantity, decreaseQuantity, eliminateItem,
        appointment,
        scheduleOrder: setAppointment,
        clearAppointment: () => setAppointment(null),
    }}>
        {children}
    </CartContext.Provider>
    )
}
