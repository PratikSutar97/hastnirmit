import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Products from "../admin/pages/Products";
import AddProduct from "../admin/pages/AddProduct";
import EditProduct from "../admin/pages/EditProduct";
import Categories from "../admin/pages/Categories";
import Orders from "../admin/pages/Orders";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";

import AdminLogin from "../admin/pages/AdminLogin";
import Dashboard from "../admin/pages/Dashboard";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

function StoreLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin area */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;