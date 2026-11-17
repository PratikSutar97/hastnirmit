import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import WhatsAppButton from "./components/common/WhatsAppButton";

import Hero from "./components/home/Hero";
import CategorySection from "./components/home/CategorySection";
import FeaturedProducts from "./components/home/FeaturedProducts";
import BrandStory from "./components/home/BrandStory";
import CustomOrderSection from "./components/home/CustomOrderSection";
import Testimonials from "./components/home/Testimonials";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <CategorySection />

        <FeaturedProducts />

        <BrandStory />

        <CustomOrderSection />

        <Testimonials />
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}

export default App;