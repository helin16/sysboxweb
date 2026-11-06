import Image from "next/image";

/** Natural size of the trimmed logo file, used to keep its proportions. */
const LOGO_WIDTH = 1915;
const LOGO_HEIGHT = 597;

type iAppLogo = {
  /** Displayed width in pixels; height follows the logo's proportions. */
  width?: number;
  height?: number;
  style?: any;
  className?: string;
};
const AppLogo = ({ width = 200, style, className }: iAppLogo) => {
  return (
    <Image
      className={className}
      alt={"Sysbox Digital – Web, Software, Solutions"}
      width={width}
      height={Math.round((width * LOGO_HEIGHT) / LOGO_WIDTH)}
      sizes={`${width}px`}
      style={style}
      priority
      src={"/images/logo-sysbox-digital.png"}
    />
  );
};

export default AppLogo;
