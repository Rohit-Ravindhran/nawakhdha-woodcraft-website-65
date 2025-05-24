
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SectionTitle from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AboutTeamMemberData } from "@/hooks/content/types";

const AboutPage = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["about_team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_team")
        .select("*")
        .order("id");

      if (error) throw error;
      return data as AboutTeamMemberData[];
    },
  });

  // Fallback team data for when no data exists in admin panel
  const defaultTeam = [
    {
      id: "1",
      name: "Adnan Al Hamar",
      role: "Founder & Managing Director",
      bio: "Founding Al Nawakhdha in 1975, Adnan brings over 50 years of expertise in furniture craftsmanship and wooden design.",
      image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format",
      alt_text: "Adnan Al Hamar - Founder & Managing Director",
    },
    {
      id: "2",
      name: "Fatima Al Hamar",
      role: "Design Director",
      bio: "Leading our design team with innovative vision and an exceptional eye for detail in custom furniture creation.",
      image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format",
      alt_text: "Fatima Al Hamar - Design Director",
    },
    {
      id: "3",
      name: "Mohammed Al Hamar",
      role: "Operations Manager",
      bio: "Overseeing workshop operations and ensuring the highest standards of quality in every project we undertake.",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format",
      alt_text: "Mohammed Al Hamar - Operations Manager",
    },
  ];

  const teamToDisplay = teamMembers && teamMembers.length > 0 ? teamMembers : defaultTeam;

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

      {/* Hero Section */}
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

      {/* Main Content */}
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
                  <Button asChild>
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

      {/* Team Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <SectionTitle
            title="Our Leadership Team"
            subtitle="Meet the dedicated team behind Al Nawakhdha Furniture's success."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center py-12">Loading team members...</div>
            ) : (
              teamToDisplay.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-border text-center"
                >
                  <figure className="mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                      <img
                        src={member.image_url || "https://placehold.co/400x400"}
                        alt={member.alt_text || `${member.name} - ${member.role}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption>
                      <h3 className="font-playfair font-bold text-xl mb-1">
                        {member.name || "Team Member"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {member.role || "Team Member"}
                      </p>
                    </figcaption>
                  </figure>
                  <p className="text-sm">{member.bio || "Bio information not available."}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-wood-dark text-white">
        <div className="container-custom text-center">
          <h2 className="heading-md mb-4">Ready to Create Your Dream Furniture?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Contact us today to discuss your custom furniture needs or to request a quote on any of our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              className="bg-white text-wood-dark hover:bg-white/90"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/products">Browse Our Collections</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
