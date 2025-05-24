
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContactInfoData } from "@/hooks/content/types";

export function useContactData() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log("🔍 Fetching contact info from database...");
        
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .maybeSingle();
        
        if (error) {
          console.error("❌ SUPABASE ERROR (contact_info):", error);
          throw error;
        }
        
        console.log("📋 Raw contact data from database:", data);
        
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
            map_url: data.map_url || null // Now properly handle the map_url from database
          };
          
          console.log("✅ Processed contact data:", contactData);
          setContactInfo(contactData);
        } else {
          console.warn("⚠️ No contact info found in database");
          setContactInfo(null);
        }
      } catch (error) {
        console.error("💥 Error fetching contact information:", error);
        setContactInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContactInfo();
  }, []);

  return { contactInfo, isLoading };
}
