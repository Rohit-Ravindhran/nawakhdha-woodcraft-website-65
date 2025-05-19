
import React from "react";
import { Helmet } from "react-helmet-async";

interface ContactHeroProps {
  title: string;
  subtitle: string;
}

const ContactHero: React.FC<ContactHeroProps> = ({ title, subtitle }) => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Nawakhdha Woodcraft</title>
        <meta name="description" content="Contact Nawakhdha Woodcraft for custom wooden furniture, doors, cabinets, and civil maintenance services in Bahrain." />
        <meta property="og:title" content="Contact Us | Nawakhdha Woodcraft" />
        <meta property="og:description" content="Contact Nawakhdha Woodcraft for custom wooden furniture, doors, cabinets, and civil maintenance services in Bahrain." />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div
          className="h-[40vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format')"
          }}
        ></div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container-custom">
            <div className="max-w-2xl">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
                {title}
              </h1>
              <p className="text-lg text-white/90">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactHero;
