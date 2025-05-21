
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContactInfoData } from "@/hooks/content/types";

export function useContactData() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const contactData: ContactInfoData = {
            id: data.id,
            address: data.address || null,
            phone: data.phone || null,
            email: data.email || null,
            business_hours_json: data.business_hours_json ? 
              (typeof data.business_hours_json === 'string' ? 
                data.business_hours_json : 
                JSON.stringify(data.business_hours_json)
              ) : null,
            // Handle the map_url property which is missing in the database
            map_url: null // Set to null as it's not present in the database schema
          };
          setContactInfo(contactData);
        } else {
          setContactInfo(null);
        }
      } catch (error) {
        console.error("Error fetching contact information:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContactInfo();
  }, []);

  return { contactInfo, isLoading };
}
