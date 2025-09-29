import { Routes, Route, Navigate } from "react-router-dom"
import { NavBar } from "./routes/components/NavBar"
import { HomeScreen } from "./routes/HomeScreen"
import { AboutScreen } from "./routes/AboutScreen"
import { ConstactScreen } from "./routes/ConstactScreen"
import { FAQScreen } from "./routes/FAQScreen"
import { UsuarioProvider } from "./routes/context/UsuarioProvider"
import { LoginScreen } from "./routes/LoginScreen"
import { Cart } from "./routes/components/Cart"
import { ShoppingPage } from "./routes/pages/ShoppingPage"
import { CartPage } from "./routes/pages/CartPage"
import { ProductsProvider } from "./routes/context/ProductsProvider"
import { CartProvider } from "./routes/context/CartProvider"
import { Footer } from "./routes/components/Footer"

export const App = () => {
    return (
    <>
    <UsuarioProvider>
        <ProductsProvider>
            <CartProvider>
                <NavBar></NavBar>

                <Routes>
                    <Route path='/' element={ <HomeScreen></HomeScreen> }></Route>
                    <Route path='/login' element={ <LoginScreen></LoginScreen> }></Route>
                    <Route path='/about' element={ <AboutScreen></AboutScreen> }></Route>
                    <Route path='/contact' element={ <ConstactScreen></ConstactScreen> }></Route>
                    <Route path='/FAQ' element={ <FAQScreen></FAQScreen> }></Route>
                    <Route path='/cart' element={ <Cart></Cart> }></Route>
                    <Route path='/products' element={ <ShoppingPage></ShoppingPage> }></Route>
                    <Route path='/products/:category' element={ <ShoppingPage></ShoppingPage> }></Route>
                    <Route path='/cartpage' element={ <CartPage></CartPage> }></Route>
                    <Route path='/*' element={ <Navigate to='/'/> }></Route>
                </Routes>
                <Footer></Footer>
            </CartProvider>
        </ProductsProvider>
    </UsuarioProvider>
    </>
    )
}
