import logo from "../assets/logo_ceprunsa.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-12 w-auto" }: LogoProps) => {
  return <img src={logo} alt="CEPRUNSA" className={className} />;
};

export default Logo;
