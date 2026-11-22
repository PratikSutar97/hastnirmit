import SEO from "../components/common/SEO";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStory from "../components/home/BrandStory";
import CustomOrderSection from "../components/home/CustomOrderSection";
import Testimonials from "../components/home/Testimonials";

function Home() {
  return (
    <>
      <SEO
        path="/"
        title="Handmade Jewellery, Gifts & Custom Crafts"
        description="Shop unique handmade seashell jewellery, crochet accessories, and bespoke handcrafted gifts made with love at Hastnirmit."
        schema={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Hastnirmit",
          url: "https://hastnirmit.netlify.app",
          logo: "https://hastnirmit.netlify.app/images/hastnirmit_logo.png",
          description:
            "Personalized. Handmade. Heartfelt. Handcrafted jewellery and gifts in India.",
        }}
      />
    <main>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <BrandStory />
      <CustomOrderSection />
      <Testimonials />
      
    </main>
    </>
  );
}

export default Home;