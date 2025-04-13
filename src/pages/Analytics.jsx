import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://urlshortener-backend-ki0x.onrender.com/api/urls/${id}/analytics`
        );
        setAnalytics(response.data);
      } catch (error) {
        toast.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  // Device Breakdown Chart
  const deviceChartData = analytics
    ? {
        labels: ["PC", "Mobile", "Unknown"],
        datasets: [
          {
            label: "Clicks by Device",
            data: [
              analytics.deviceBreakdown.PC,
              analytics.deviceBreakdown.Mobile,
              analytics.deviceBreakdown.Unknown,
            ],
            backgroundColor: ["#4f46e5", "#7c3aed", "#9ca3af"],
          },
        ],
      }
    : null;

  // Location Breakdown Chart
  const locationChartData = analytics
    ? {
        labels: Object.keys(analytics.locationBreakdown).slice(0, 5), // Limit to top 5 countries
        datasets: [
          {
            label: "Clicks by Country",
            data: Object.values(analytics.locationBreakdown).slice(0, 5),
            backgroundColor: [
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#3b82f6",
              "#6b7280",
            ],
          },
        ],
      }
    : null;

  // Clicks Over Time Chart (requires backend update, included for completeness)
  const clicksOverTimeData = analytics
    ? {
        labels: [], // Populated by backend if timestamps are aggregated
        datasets: [
          {
            label: "Clicks Over Time",
            data: [],
            borderColor: "#4f46e5",
            fill: false,
          },
        ],
      }
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        asChild
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <Link to="/">Back to Dashboard</Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-indigo-700">URL Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : !analytics ? (
            <div className="text-center text-gray-500">
              No analytics available.
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Clicks: {analytics.totalClicks}
                </h3>
              </div>
              <div className="h-64">
                <h4 className="text-md font-medium text-gray-600 mb-2">
                  Device Breakdown
                </h4>
                <Bar
                  data={deviceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                  }}
                />
              </div>
              <div className="h-64">
                <h4 className="text-md font-medium text-gray-600 mb-2">
                  Location Breakdown
                </h4>
                <Bar
                  data={locationChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                  }}
                />
              </div>
              {/* Uncomment when backend supports clicks over time */}
              {/* <div className="h-64">
                <h4 className="text-md font-medium text-gray-600 mb-2">
                  Clicks Over Time
                </h4>
                <Line
                  data={clicksOverTimeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                  }}
                />
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Analytics;
