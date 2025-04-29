
import PageEditor from "@/components/admin/PageEditor";

const PagesTab = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-border">
        <h2 className="text-xl font-bold mb-6">Manage Main Pages</h2>
        <div className="space-y-8">
          <PageEditor pageName="home" />
          <PageEditor pageName="about" />
          <PageEditor pageName="contact" />
        </div>
      </div>
    </div>
  );
};

export default PagesTab;
