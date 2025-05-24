
import { Helmet } from "react-helmet-async";

const AboutHero = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Nawakhdha Woodcraft</title>
        <meta
          name="description"
          content="Learn about our leadership team at Nawakhdha Woodcraft, bringing decades of experience in custom furniture and wooden designs in Bahrain."
        />
        <meta property="og:title" content="About Us | Nawakhdha Woodcraft" />
        <meta
          property="og:description"
          content="Learn about our leadership team at Nawakhdha Woodcraft, bringing decades of experience in custom furniture and wooden designs in Bahrain."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div
          className="h-[50vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579187707643-35646d22b596?q=80&w=1000&auto=format')",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container-custom">
            <div className="max-w-2xl">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
                About Us
              </h1>
              <p className="text-lg text-white/90">
                Celebrating over five decades of exceptional craftsmanship and wooden artistry.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
