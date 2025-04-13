import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate("/")}
      className={`flex items-center gap-2 cursor-pointer group ${className}`}
    >
      <img 
        src={logo} 
        alt="URL Shortener" 
        className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
      />
      <span className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
        URL Shortener
      </span>
    </div>
  );
};

export default Logo; 