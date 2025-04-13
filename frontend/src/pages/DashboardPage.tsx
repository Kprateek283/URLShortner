import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";

interface UrlData {
  shortId: string;
  customAlias?: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string;
}

const DashboardPage = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchUrls = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/urls`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUrls(response.data.urls);
      } catch (err) {
        console.error("Error fetching URLs:", err);
        setError("Error fetching URLs");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [token]);

  // Filter URLs based on search input
  const filteredUrls = urls.filter((url) =>
    url.shortId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (url.customAlias && url.customAlias.toLowerCase().includes(searchTerm.toLowerCase())) ||
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic based on filtered results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUrls = filteredUrls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <button 
              onClick={() => navigate("/home")} 
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/profile")} 
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by shortId, alias, or original URL"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Loading/Error */}
        {loading && <div className="flex justify-center"><Spinner /></div>}
        {error && <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>}

        {/* URL List */}
        <div className="space-y-4">
          {currentUrls.length > 0 ? (
            currentUrls.map((url) => (
              <div
                key={url.shortId}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/analytics/${url.shortId}`)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 flex-1">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {url.customAlias || url.shortId}
                    </h2>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-medium">Short ID:</span> 
                        <span className="bg-gray-100 px-2 py-1 rounded">{url.shortId}</span>
                      </p>
                      <p className="text-sm text-gray-600 break-all">
                        <span className="font-medium">Original URL:</span><br />
                        {url.originalUrl}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                        <p className="flex items-center gap-1">
                          <span className="font-medium">Created:</span>
                          {new Date(url.createdAt).toLocaleString()}
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="font-medium">Expires:</span>
                          {new Date(url.expiresAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md w-full md:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`${import.meta.env.VITE_BACKEND_URL}/${url.shortId}`, "_blank");
                    }}
                  >
                    Visit Shortened URL
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                No URLs found.
              </div>
            )
          )}
        </div>

        {/* Pagination Controls */}
        {filteredUrls.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
