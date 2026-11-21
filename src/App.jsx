import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import WhatsAppButton from "./components/common/WhatsAppButton";

import "./App.css";
import "./styles/admin.css";

function App() {
  return (
    <BrowserRouter>
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