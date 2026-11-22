import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import WhatsAppButton from "./components/common/WhatsAppButton";
import ScrollToTop from "./components/common/ScrollToTop";

import "./App.css";
import "./styles/admin.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <WhatsAppButton />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;