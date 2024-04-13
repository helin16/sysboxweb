type iPageSection = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  innerClassName?: string;
  style?: any;
};

const PageSection = ({
  id,
  className,
  innerClassName,
  children,
  style,
}: iPageSection) => {
  return (
    <div id={id} className={className} style={style}>
      <div className={`mx-auto container ${innerClassName || ""}`}>
        {children}
      </div>
    </div>
  );
};

export default PageSection;
