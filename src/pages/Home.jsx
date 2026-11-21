import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStory from "../components/home/BrandStory";
import CustomOrderSection from "../components/home/CustomOrderSection";
import Testimonials from "../components/home/Testimonials";

function Home() {
  return (
    <main>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <BrandStory />
      <CustomOrderSection />
      <Testimonials />
    </main>
  );
}

export default Home;