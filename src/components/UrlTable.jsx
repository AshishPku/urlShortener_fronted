import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

function UrlTable({ refreshKey }) {
  const [urls, setUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `https://urlshortener-backend-ki0x.onrender.com/api/urls?page=${page}&limit=5&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUrls(response.data.urls);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(
        "Error fetching URLs:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch URLs. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [page, search, refreshKey, navigate]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-indigo-700">Your URLs</CardTitle>
        <Input
          placeholder="Search URLs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="mt-2 max-w-sm border-indigo-300 focus:ring-indigo-500"
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : urls.length === 0 ? (
          <div className="text-center text-gray-500">No URLs found.</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url._id}>
                    <TableCell className="truncate max-w-xs">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {url.originalUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {url.shortUrl}
                      </a>
                    </TableCell>
                    <TableCell>{url.clicks.length}</TableCell>
                    <TableCell>
                      {new Date(url.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        asChild
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Link to={`/analytics/${url._id}`}>
                          <Eye className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Previous
              </Button>
              <span className="self-center">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UrlTable;
