
import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactInfoData, BusinessHours } from "@/hooks/content/types";
import { parseJSON } from "@/utils/jsonHelpers";

interface ContactInfoProps {
  contactInfo: ContactInfoData | null;
  isLoading: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo, isLoading }) => {
  // Default business hours if not available from database
  const defaultBusinessHours: BusinessHours = {
    monday: "8:30 AM - 5:30 PM",
    tuesday: "8:30 AM - 5:30 PM",
    wednesday: "8:30 AM - 5:30 PM",
    thursday: "8:30 AM - 5:30 PM",
    friday: "8:30 AM - 12:00 PM",
    saturday: "9:00 AM - 5:00 PM",
    sunday: "Closed"
  };

  // Parse business hours JSON or use defaults
  const businessHours: BusinessHours = contactInfo?.business_hours_json 
    ? parseJSON<BusinessHours>(typeof contactInfo.business_hours_json === 'string' 
        ? contactInfo.business_hours_json 
        : JSON.stringify(contactInfo.business_hours_json)
      ) || defaultBusinessHours
    : defaultBusinessHours;

  return (
    <div className="sticky top-24">
      {isLoading ? (
        <div className="bg-secondary/50 border border-border rounded-lg p-6 mb-6 text-center">
          Loading contact information...
        </div>
      ) : (
        <div className="bg-secondary/50 border border-border rounded-lg p-6 mb-6">
          <h3 className="font-playfair font-bold text-xl mb-4">Contact Information</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo?.address || "Address not available"}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium">Phone</p>
                {contactInfo?.phone ? (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Phone not available</p>
                )}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium">Email</p>
                {contactInfo?.email ? (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Email not available</p>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
      
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-playfair font-bold text-xl mb-4">Business Hours</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Monday</span>
            <span>{businessHours.monday || "Not available"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Tuesday</span>
            <span>{businessHours.tuesday || "Not available"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Wednesday</span>
            <span>{businessHours.wednesday || "Not available"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Thursday</span>
            <span>{businessHours.thursday || "Not available"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Friday</span>
            <span>{businessHours.friday || "Not available"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Saturday</span>
            <span>{businessHours.saturday || "Not available"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Sunday</span>
            <span>{businessHours.sunday || "Not available"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactInfo;
