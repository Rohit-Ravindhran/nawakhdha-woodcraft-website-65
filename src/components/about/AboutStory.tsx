
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";

const AboutStory = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <SectionTitle
              title="Our Story"
              subtitle="From humble beginnings to Bahrain's premier woodcraft destination."
            />

            <div className="prose prose-lg max-w-none">
              <p>
                Al Nawakhdha Furniture was incorporated by our managing director Adnan Al Hamar in the year 1975 in Bahrain. It is one of the oldest carpentry workshops on the island. We are reputed for our service, quality and workmanship. We understand the needs of our customers and work towards crafting it with our multinational work force. The perfect combination of creativity, knowledge of art and craftsmanship allow us to create any kind of inlaid and carving work of incomparable beauty.
              </p>

              <h3 className="font-playfair font-bold text-xl mt-8 mb-4">Our Vision</h3>
              <p>To carve our customer's imagination into perfection.</p>

              <h3 className="font-playfair font-bold text-xl mt-8 mb-4">Our Mission</h3>
              <p>
                Our goal when we started Al Nawakhdha was the same as it is today: to bring life and sustainability to our customer's dream with class, perfection, and trend.
              </p>

              <h3 className="font-playfair font-bold text-xl mt-8 mb-4">Our Approach</h3>
              <p>
                At Al Nawakhdha, we believe that the beauty of wooden furniture lies in the details. Each piece we create is the result of careful planning, thoughtful design, and meticulous execution. Our team of skilled craftsmen combines traditional techniques with modern innovations to create furniture that stands the test of time.
              </p>

              <h3 className="font-playfair font-bold text-xl mt-8 mb-4">Our Materials</h3>
              <p>
                We source only the finest woods from sustainable suppliers around the world. From rich mahogany to elegant oak, sturdy teak to versatile pine, we select each material with care to ensure that your furniture is not only beautiful but built to last for generations.
              </p>

              <h3 className="font-playfair font-bold text-xl mt-8 mb-4">Our Commitment</h3>
              <p>
                Customer satisfaction isn't just a goal—it's our foundation. We work closely with each client from concept to completion, ensuring that every detail meets our high standards and your unique vision. Our commitment to quality craftsmanship and personalized service has earned us the trust of countless homeowners, businesses, and designers throughout Bahrain.
              </p>

              <div className="mt-8">
                <Button 
                  asChild
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <div className="mb-8">
                <img
                  src="https://images.unsplash.com/photo-1617266452244-81c7ddd12764?q=80&w=1000&auto=format"
                  alt="Workshop craftsmanship"
                  className="w-full h-auto rounded-lg mb-4"
                />
                <img
                  src="https://images.unsplash.com/photo-1629197402606-8ea9a7ba120a?q=80&w=1000&auto=format"
                  alt="Wooden furniture detail"
                  className="w-full h-auto rounded-lg"
                />
              </div>

              <div className="bg-secondary/50 border border-border rounded-lg p-6">
                <h3 className="font-playfair font-bold text-xl mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Established in 1975</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Located in Bahrain</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Multinational team of craftsmen</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Specializing in custom wooden furniture</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <span>Renowned for quality and artistry</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
