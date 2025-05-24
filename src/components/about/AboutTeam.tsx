
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SectionTitle from "@/components/ui/section-title";
import { AboutTeamMemberData } from "@/hooks/content/types";

const AboutTeam = () => {
  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ["about_team"],
    queryFn: async () => {
      console.log("🔍 Fetching team members from about_team table...");
      
      const { data, error } = await supabase
        .from("about_team")
        .select("*")
        .order("position", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });

      if (error) {
        console.error("❌ SUPABASE ERROR:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details
        });
        throw error;
      }
      
      console.log("✅ Fetched Team Data:", data);
      console.log("📊 Team members count:", data?.length || 0);
      
      if (data && data.length > 0) {
        console.log("👥 First team member:", data[0]);
      }
      
      return data as AboutTeamMemberData[];
    },
  });

  console.log("🔄 Query state:", { isLoading, error: error?.message, dataLength: teamMembers?.length });

  return (
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
          ) : error ? (
            <div className="col-span-3 text-center py-12 text-red-600">
              <p>Failed to load team members: {error.message}</p>
              <p className="text-sm mt-2">Please check the console for detailed error information.</p>
            </div>
          ) : !teamMembers || teamMembers.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p>No team members found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please add team members via the Admin Panel.
              </p>
            </div>
          ) : (
            teamMembers.map((member) => (
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
                      onError={(e) => {
                        console.warn(`❗ Image load error for ${member.name}:`, member.image_url);
                        e.currentTarget.src = "https://placehold.co/400x400";
                      }}
                      onLoad={() => {
                        console.log(`✅ Image loaded successfully for ${member.name}`);
                      }}
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
  );
};

export default AboutTeam;
