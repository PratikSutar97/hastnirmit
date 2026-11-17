import {
  Sparkles,
  Heart,
  Gift,
  Palette,
  ArrowRight,
} from "lucide-react";

import CustomOrderForm from "../forms/CustomOrderForm";

function CustomOrderSection() {
  const benefits = [
    {
      icon: Palette,
      title: "Your Design",
      description: "Choose your colours, patterns and style.",
    },
    {
      icon: Heart,
      title: "Made With Love",
      description: "Thoughtfully created around your idea.",
    },
    {
      icon: Gift,
      title: "Perfect for Gifting",
      description: "Make celebrations more personal.",
    },
  ];

  return (
    <section className="custom-order-section" id="custom-order">

      <div className="custom-order-intro">

        <div className="custom-order-badge">
          <Sparkles size={15} />
          MADE JUST FOR YOU
        </div>

        <h2>
          Dream It.
          <br />
          <span>We'll Handmade It.</span>
        </h2>

        <p>
          Have something special in mind?
          A unique jewellery design, a personalised gift
          or festive home decoration?

          Tell us your idea and let's bring it to life
          with handmade creativity.
        </p>

        <div className="custom-benefits">

          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div className="custom-benefit" key={item.title}>

                <div className="custom-benefit-icon">
                  <Icon size={22} />
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

              </div>
            );
          })}

        </div>

        <div className="custom-order-highlight">
          <span>✦</span>
          Every custom creation starts with your idea.
        </div>

        <a href="#shop" className="custom-back-link">
          Explore ready-made collections
          <ArrowRight size={16} />
        </a>

      </div>

      <div className="custom-order-form-wrapper">
        <CustomOrderForm />
      </div>

    </section>
  );
}

export default CustomOrderSection;