
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionTitle from "@/components/ui/section-title";
import { useToast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      {/* Hero Section */}
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
                Contact Us
              </h1>
              <p className="text-lg text-white/90">
                Get in touch with our team to discuss your custom furniture needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionTitle
                title="Get In Touch"
                subtitle="We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."
              />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+973 1234 5678"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Custom Furniture Inquiry"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or inquiry..."
                    className="min-h-32"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
            
            <div>
              <div className="sticky top-24">
                <div className="bg-secondary/50 border border-border rounded-lg p-6 mb-6">
                  <h3 className="font-playfair font-bold text-xl mb-4">Contact Information</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          Building 1234, Road 5678, Block 123
                          <br />
                          Manama, Kingdom of Bahrain
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href="tel:+97317777777"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          +973 1777 7777
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href="mailto:info@anfurnwll.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          info@anfurnwll.com
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white border border-border rounded-lg p-6">
                  <h3 className="font-playfair font-bold text-xl mb-4">Business Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Thursday</span>
                      <span>8:30 AM - 5:30 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Friday</span>
                      <span>8:30 AM - 12:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-secondary/30 py-12">
        <div className="container-custom">
          <SectionTitle
            title="Our Location"
            subtitle="Visit our workshop and showroom in Manama, Bahrain."
            centered
          />
          <div className="aspect-video rounded-lg overflow-hidden border border-border">
            {/* Replace with actual Google Maps embed code */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-muted-foreground">Google Maps will be embedded here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Quote CTA */}
      <section className="section-padding bg-wood-dark text-white">
        <div className="container-custom text-center">
          <h2 className="heading-md mb-4">Need a Custom Quote?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            For large projects or specialized custom work, let us prepare a detailed quote for you.
          </p>
          <Button variant="secondary" className="bg-white text-wood-dark hover:bg-white/90">
            Request a Custom Quote
          </Button>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
