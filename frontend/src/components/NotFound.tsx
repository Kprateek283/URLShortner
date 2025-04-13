// src/components/NotFound.tsx
import notFoundImage from "../assets/notFound.png";

const NotFound = ({ message }: { message?: string }) => {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-10">
        <img src={notFoundImage} alt="Not found" className="w-48 h-48 mb-4 object-contain" />
        <h2 className="text-xl font-semibold mb-2">{message || "No data found"}</h2>
        <p>Please check back later or try a different URL.</p>
      </div>
    );
  };
  
  export default NotFound;
  