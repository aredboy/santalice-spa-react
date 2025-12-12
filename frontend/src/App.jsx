import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { NavBar } from "./routes/components/NavBar"
import { HomeScreen } from "./routes/HomeScreen"
import { AboutScreen } from "./routes/AboutScreen"
import { ContactScreen } from "./routes/ContactScreen"
import { FAQScreen } from "./routes/FAQScreen"
import { UsuarioProvider } from "./routes/context/UsuarioProvider"
import { LoginScreen } from "./routes/LoginScreen"
import { Cart } from "./routes/components/Cart"
import { ShoppingPage } from "./routes/pages/ShoppingPage"
import { CartPage } from "./routes/pages/CartPage"
import { Product } from "./routes/components/Product"
import { ProductsProvider } from "./routes/context/ProductsProvider"
import { CartProvider } from "./routes/context/CartProvider"
import { Footer } from "./routes/components/Footer"
import { ScrollToTop } from "./routes/components/ScrollToTop"  
import './index.css';

export const App = () => {

    const location = useLocation();

    return (
    <>
    <div className="app-wrapper">
    <UsuarioProvider>
        <ProductsProvider>
            <CartProvider>
                <ScrollToTop/>
                <NavBar></NavBar>
                <main className="app-main">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path='/' element={ <HomeScreen></HomeScreen> }></Route>
                            <Route path='/login' element={ <LoginScreen></LoginScreen> }></Route>
                            <Route path='/about' element={ <AboutScreen></AboutScreen> }></Route>
                            <Route path='/contact' element={ <ContactScreen></ContactScreen> }></Route>
                            <Route path='/FAQ' element={ <FAQScreen></FAQScreen> }></Route>
                            <Route path='/cart' element={ <Cart></Cart> }></Route>
                            <Route path='/products' element={ <ShoppingPage></ShoppingPage> }></Route>
                            <Route path='/products/:category' element={ <ShoppingPage></ShoppingPage> }></Route>
                            <Route path='/product/:id' element={ <Product></Product> }></Route>
                            <Route path='/cartpage' element={ <CartPage></CartPage> }></Route>
                            <Route path='/*' element={ <Navigate to='/'/> }></Route>
                        </Routes>
                    </AnimatePresence>
                </main>
                <Footer></Footer>
            </CartProvider>
        </ProductsProvider>
    </UsuarioProvider>
    </div>
    </>
    )
}
