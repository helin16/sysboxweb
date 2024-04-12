type iContactUsBtn = {
  className?: string;
  style?: any;
};
const ContactUsBtn = ({ className, style }: iContactUsBtn) => {
  return (
    <button
      style={style}
      className={`shadow-lg uppercase py-4 px-10 bg-gradient-to-b from-orange-500 to-orange-600 hover:brightness-150 text-white text-sm rounded-md shadow-lg focus:outline-none drop-shadow font-semibold ${
        className || ""
      }`}
    >
      Contact us
    </button>
  );
};

export default ContactUsBtn;
