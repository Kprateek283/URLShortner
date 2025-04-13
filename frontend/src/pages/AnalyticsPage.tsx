import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchAnalytics } from "../store/slices/analyticsSlice";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";
import axios from "axios";

// Chart imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { getPieChartData } from "../utils/analyticsHelpers";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const { data, loading, error } = useSelector((state: RootState) => state.analytics);
  const [timeframe, setTimeframe] = useState<"hour" | "day" | "week" | "month">("day");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    if (shortId) {
      dispatch(fetchAnalytics(shortId));
    }
  }, [shortId]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${shortId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete URL:", err);
    }
  };

  const getClicksPerHour = (clicks: any[]) => {
    const clicksPerHour = new Array(24).fill(0);
    clicks.forEach((click: any) => {
      const hour = new Date(click.timestamp).getHours();
      clicksPerHour[hour] += 1;
    });
    return clicksPerHour;
  };

  const getClicksPerDay = (clicks: any[]) => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const clicksPerDay = new Array(daysInMonth).fill(0);
    clicks.forEach((click: any) => {
      const day = new Date(click.timestamp).getDate();
      clicksPerDay[day - 1] += 1;
    });
    return clicksPerDay;
  };

  const getClicksPerMonth = (clicks: any[]) => {
    const clicksPerMonth = new Array(12).fill(0);
    clicks.forEach((click: any) => {
      const month = new Date(click.timestamp).getMonth(); // 0 = January, 11 = December
      clicksPerMonth[month] += 1;
    });
    return clicksPerMonth;
  };

  const timeSeries = (() => {
    if (!data) return { labels: [], data: [] };

    switch (timeframe) {
      case "hour":
        return {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          data: getClicksPerHour(data.clicks),
        };
      case "day":
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        return {
          labels: Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
          data: getClicksPerDay(data.clicks),
        };
      case "month":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          data: getClicksPerMonth(data.clicks),
        };
      default:
        return { labels: [], data: [] };
    }
  })();

  const deviceData = data ? getPieChartData(data.clicks, "deviceType") : { labels: [], data: [] };
  const browserData = data ? getPieChartData(data.clicks, "browser") : { labels: [], data: [] };
  const osData = data ? getPieChartData(data.clicks, "os") : { labels: [], data: [] };

  // Pagination Logic
  const indexOfLastClick = currentPage * itemsPerPage;
  const indexOfFirstClick = indexOfLastClick - itemsPerPage;
  const currentClicks = data ? data.clicks.slice(indexOfFirstClick, indexOfLastClick) : [];

  // Pagination Buttons
  const totalPages = data ? Math.ceil(data.clicks.length / itemsPerPage) : 1;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const generateQrCode = (shortId: string) => {
    const link = `${import.meta.env.VITE_BACKEND_URL}/${shortId}`;
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    setQrUrl(qrApi);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
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
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500/80 hover:bg-red-500/90 rounded-lg transition-colors"
            >
              Delete URL
            </button>
            <button
              onClick={() => shortId && dispatch(fetchAnalytics(shortId))}
              className="px-6 py-2 bg-green-500/80 hover:bg-green-500/90 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading && <div className="flex justify-center"><Spinner /></div>}
        {error && error !== "No click information found for this URL" && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>
        )}

        {data ? (
          <div className="space-y-8">
            {/* URL Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">URL Information</h2>
              {data.url && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Original URL:</span><br />
                        <span className="break-all">{data.url.originalUrl}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-medium text-sm text-gray-600">Short URL:</span>
                        <span className="text-blue-600 break-all">
                          {`${import.meta.env.VITE_FRONTEND_URL}/${data.url.shortId}`}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm text-sm"
                            onClick={() => {
                              if (data.url) {
                                window.open(`${import.meta.env.VITE_BACKEND_URL}/${data.url.shortId}`, "_blank");
                              }
                            }}
                          >
                            Visit
                          </button>
                          <button
                            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-sm text-sm"
                            onClick={async () => {
                              try {
                                if (data.url) {
                                  await navigator.clipboard.writeText(
                                    `${import.meta.env.VITE_BACKEND_URL}/${data.url.shortId}`
                                  );
                                }
                                alert("Short URL copied to clipboard!");
                              } catch (err) {
                                alert("Failed to copy URL.");
                              }
                            }}
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => shortId && generateQrCode(shortId)}
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm text-sm"
                          >
                            Generate QR Code
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600 font-medium">Created At</p>
                        <p className="text-gray-800">{new Date(data.url.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600 font-medium">Expiration Date</p>
                        <p className="text-gray-800">{new Date(data.url.expiresAt).toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600 font-medium">Total Clicks</p>
                        <p className="text-2xl font-bold text-blue-600">{data.url.clicks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Time Series Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Clicks Over Time</h2>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="hour">Hourly</option>
                    <option value="day">Daily</option>
                    <option value="month">Monthly</option>
                  </select>
                </div>
                <div className="h-64">
                  <Line
                    data={{
                      labels: timeSeries.labels,
                      datasets: [
                        {
                          label: "Clicks",
                          data: timeSeries.data,
                          borderColor: "rgb(59, 130, 246)",
                          backgroundColor: "rgba(59, 130, 246, 0.5)",
                          tension: 0.3,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Device Distribution Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Device Distribution</h2>
                <div className="h-64">
                  <Pie
                    data={{
                      labels: deviceData.labels,
                      datasets: [
                        {
                          data: deviceData.data,
                          backgroundColor: [
                            "rgba(59, 130, 246, 0.8)",
                            "rgba(16, 185, 129, 0.8)",
                            "rgba(249, 115, 22, 0.8)",
                          ],
                          borderColor: [
                            "rgba(59, 130, 246, 1)",
                            "rgba(16, 185, 129, 1)",
                            "rgba(249, 115, 22, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Browser Distribution Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Browser Distribution</h2>
                <div className="h-64">
                  <Pie
                    data={{
                      labels: browserData.labels,
                      datasets: [
                        {
                          data: browserData.data,
                          backgroundColor: [
                            "rgba(99, 102, 241, 0.8)",
                            "rgba(239, 68, 68, 0.8)",
                            "rgba(245, 158, 11, 0.8)",
                          ],
                          borderColor: [
                            "rgba(99, 102, 241, 1)",
                            "rgba(239, 68, 68, 1)",
                            "rgba(245, 158, 11, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* OS Distribution Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">OS Distribution</h2>
                <div className="h-64">
                  <Pie
                    data={{
                      labels: osData.labels,
                      datasets: [
                        {
                          data: osData.data,
                          backgroundColor: [
                            "rgba(14, 165, 233, 0.8)",
                            "rgba(168, 85, 247, 0.8)",
                            "rgba(234, 179, 8, 0.8)",
                            "rgba(236, 72, 153, 0.8)",
                          ],
                          borderColor: [
                            "rgba(14, 165, 233, 1)",
                            "rgba(168, 85, 247, 1)",
                            "rgba(234, 179, 8, 1)",
                            "rgba(236, 72, 153, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Raw Click Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Click Information</h2>
              <div className="space-y-4">
                {currentClicks.map((click: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Timestamp</p>
                        <p className="text-gray-800">{new Date(click.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Device Info</p>
                        <p className="text-gray-800">{click.deviceType} • {click.browser} • {click.os}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-gray-800">{click.location || 'Unknown'} ({click.ip})</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {data.clicks.length > itemsPerPage && (
                <div className="flex justify-between items-center mt-6">
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
        ) : (
          <NotFound />
        )}

        {/* QR Code Modal */}
        {qrUrl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">QR Code</h2>
              <img src={qrUrl} alt="QR Code" className="mx-auto mb-6 rounded-lg shadow-sm" />
              <button
                onClick={() => setQrUrl(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
