import PageSection from "./PageSection";

type iPageHeroPanel = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

const PageHeroPanel = ({ className, id, children }: iPageHeroPanel) => {
  return (
    <PageSection id={id} className={`py-16 ${className || ""}`}>
      {children}
    </PageSection>
  );
};

export default PageHeroPanel;
