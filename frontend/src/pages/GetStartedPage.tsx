import { useNavigate } from "react-router-dom";
import ManIllustration from "../assets/ManIllustration.png";
import Logo from "../components/Logo";

const GetStartedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with light background */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
        <div className="flex items-center justify-between p-4 sm:p-6">
          {/* Logo */}
          <Logo />

          {/* Auth Buttons */}
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with lighter gradient */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-center gap-8 px-6 lg:px-24 py-12">
          {/* Text Section */}
          <div className="max-w-xl text-center lg:text-left space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-800">
              The only URL shortener you will need
            </h1>
            <p className="text-gray-600 text-lg">
              Create, manage, and analyze all your short links in one place.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Image Section */}
          <div className="w-full max-w-lg lg:max-w-xl p-4">
            <img
              src={ManIllustration}
              alt="Developer working on computer"
              className="w-full h-auto rounded-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
