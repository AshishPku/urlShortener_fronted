import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ShortenForm({ onUrlShortened }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        "https://urlshortener-backend-ki0x.onrender.com/api/shorten",
        { originalUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("URL shortened successfully!");
      setOriginalUrl("");
      if (onUrlShortened) onUrlShortened();
    } catch (error) {
      console.error(
        "Error shortening URL:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to shorten URL");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="url"
        placeholder="Enter your URL (e.g., https://example.com)"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        required
        className="border-indigo-300 focus:ring-indigo-500"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </Button>
    </form>
  );
}

export default ShortenForm;
