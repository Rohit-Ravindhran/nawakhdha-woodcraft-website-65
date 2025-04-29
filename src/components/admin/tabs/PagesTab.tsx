
import PageEditor from "@/components/admin/PageEditor";

const PagesTab = () => {
  return (
    <div className="space-y-8">
      <PageEditor pageName="home" />
      <PageEditor pageName="about" />
      <PageEditor pageName="contact" />
    </div>
  );
};

export default PagesTab;
