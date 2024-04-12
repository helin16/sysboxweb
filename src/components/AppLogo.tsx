import Image from "next/image";

type iAppLogo = {
  width?: number;
  height?: number;
  style?: any;
  className?: string;
};
const AppLogo = ({ width, height, style, className, ...props }: iAppLogo) => {
  return (
    <Image
      className={className}
      alt={"Sysbox Logo"}
      width={width || 200}
      height={height || 100}
      style={style}
      priority
      {...props}
      src={"/images/logo.png"}
    />
  );
};

export default AppLogo;
