import { useState, useEffect } from "react";
import ShortenForm from "../components/ShortenForm";
import UrlTable from "../components/UrlTable";
import { LinkIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0); // Trigger for table refresh

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Callback to refresh table after shortening
  const handleUrlShortened = () => {
    setRefreshTable((prev) => prev + 1);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="inline-block animate-bounce bg-indigo-600 p-3 rounded-full mb-4">
            <LinkIcon className="text-white" size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Short Links, Big Impact
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create concise, trackable URLs in seconds. Monitor clicks, devices,
            and locations with ease.
          </p>
        </div>

        <div
          className={`mb-8 transition-all duration-700 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          <Card className="shadow-lg border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <CardTitle className="text-xl font-bold text-white">
                Create Short URL
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ShortenForm onUrlShortened={handleUrlShortened} />
            </CardContent>
          </Card>
        </div>

        <div
          className={`transition-all duration-700 delay-200 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Card className="shadow-lg border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-white">
                Your Links
              </CardTitle>
              <ArrowRight className="text-white animate-pulse" size={24} />
            </CardHeader>
            <CardContent className="p-6">
              <UrlTable refreshKey={refreshTable} />
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 text-center text-gray-500 py-6">
          <p>
            © {new Date().getFullYear()} URL Shortener. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
