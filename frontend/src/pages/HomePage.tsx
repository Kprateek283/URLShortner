import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { shortenUrl } from "../store/actions/urlActions.ts";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Logo from "../components/Logo";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.url);

  const [formData, setFormData] = useState({
    longUrl: "",
    expirationDate: "",
    customAlias: "",
  });

  const [useExpiration, setUseExpiration] = useState(false);
  const [useCustomAlias, setUseCustomAlias] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      originalUrl: formData.longUrl,
      ...(useExpiration && { expirationDate: formData.expirationDate }),
      ...(useCustomAlias && { customAlias: formData.customAlias }),
    };

    const result = await dispatch(shortenUrl(payload));
    if (shortenUrl.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with light background */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
        <div className="flex items-center justify-between p-4 sm:p-6">
          {/* Logo */}
          <Logo />
          <div className="space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main content with lighter gradient */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Shorten Your URL
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Create short, memorable links in seconds
            </p>
          </div>

          {loading && <Spinner />}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Long URL
                </label>
                <input
                  type="url"
                  id="longUrl"
                  name="longUrl"
                  placeholder="Enter the URL you want to shorten"
                  value={formData.longUrl}
                  onChange={handleChange}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useExpiration"
                    checked={useExpiration}
                    onChange={() => setUseExpiration(!useExpiration)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useExpiration" className="ml-2 block text-sm text-gray-700">
                    Set Expiration Date
                  </label>
                </div>

                {useExpiration && (
                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      id="expirationDate"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useCustomAlias"
                    checked={useCustomAlias}
                    onChange={() => setUseCustomAlias(!useCustomAlias)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useCustomAlias" className="ml-2 block text-sm text-gray-700">
                    Set Custom Alias
                  </label>
                </div>

                {useCustomAlias && (
                  <div>
                    <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Alias
                    </label>
                    <input
                      type="text"
                      id="customAlias"
                      name="customAlias"
                      placeholder="Enter your custom alias"
                      value={formData.customAlias}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
