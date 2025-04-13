
type Click = {
  timestamp: string;
  browser: string;
  os: string;
  deviceType: string;
};

export const getPieChartData = (
  clicks: Click[],
  key: "browser" | "os" | "deviceType"
) => {
  const counts = clicks.reduce((acc: Record<string, number>, click) => {
    const value = click[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(counts),
    data: Object.values(counts),
  };
};
