import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Store,
  Utensils,
  Zap,
  Droplets,
  Building,
  Banknote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NavigationMap from "@/components/NavigationMap";

// H.A.C.E. Event booth data
const boothData = {
  "food-beverage": [
    {
      id: 1,
      name: "Interfood",
      description: "International food distribution and culinary solutions",
      booth: "F-01",
      category: "Food Distribution",
    },
    {
      id: 2,
      name: "Coffee Shop",
      description: "Premium coffee and espresso beverages",
      booth: "F-02",
      category: "Café",
    },
    {
      id: 3,
      name: "Bakery",
      description: "Fresh baked goods and artisan breads",
      booth: "F-03",
      category: "Bakery",
    },
    {
      id: 4,
      name: "Coffee Competition",
      description: "Professional barista competition and coffee tasting",
      booth: "F-04",
      category: "Competition",
    },
  ],
  facilities: [
    {
      id: 5,
      name: "Entrance",
      description: "Main event entrance and registration area",
      booth: "ENT-01",
      category: "Access Point",
    },
    {
      id: 6,
      name: "Bathroom",
      description: "Public restroom facilities",
      booth: "FAC-01",
      category: "Restroom",
    },
    {
      id: 7,
      name: "Hace Administration",
      description: "Event administration and information desk",
      booth: "ADM-01",
      category: "Administration",
    },
  ],
  technology: [
    {
      id: 8,
      name: "Clean Tech",
      description: "Innovative clean technology solutions and demonstrations",
      booth: "T-01",
      category: "Clean Technology",
    },
  ],
  furnishing: [
    {
      id: 9,
      name: "Furnishing",
      description: "Modern furniture and interior design solutions",
      booth: "FUR-01",
      category: "Interior Design",
    },
  ],
};

const categoryIcons = {
  "food-beverage": Utensils,
  facilities: MapPin,
  technology: Zap,
  furnishing: Building,
};

const Index = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("food-beverage");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getAllBooths = () => {
    return Object.values(boothData).flat();
  };

  const getFilteredBooths = (category?: string) => {
    const booths = category ? boothData[category] : getAllBooths();
    if (!searchTerm) return booths;

    return booths.filter(
      (booth) =>
        booth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booth.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booth.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  if (showAnimation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary-blue animate-pulse mb-4">
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "0ms" }}
            >
              H
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "200ms" }}
            >
              .
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "400ms" }}
            >
              A
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "600ms" }}
            >
              .
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "800ms" }}
            >
              C
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "1000ms" }}
            >
              .
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "1200ms" }}
            >
              E
            </span>
            <span
              className="inline-block animate-bounce"
              style={{ animationDelay: "1400ms" }}
            >
              .
            </span>
          </div>
          <div className="text-2xl text-blue-700 animate-fade-in">
            Indoor Navigation System
          </div>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen chevron-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-primary-blue" />
              <h1 className="text-3xl font-bold text-primary-blue">H.A.C.E.</h1>
            </div>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search booths, companies, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary-blue focus:ring-primary-blue"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Indoor Navigation System
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and navigate through various booths and companies at the
            H.A.C.E. event. Use the search bar or browse by category.
          </p>
        </div>

        {/* Tabs for Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger
              value="food-beverage"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Food & Beverage
            </TabsTrigger>
            <TabsTrigger
              value="facilities"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Facilities
            </TabsTrigger>
            <TabsTrigger
              value="technology"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Zap className="h-4 w-4 mr-2" />
              Technology
            </TabsTrigger>
            <TabsTrigger
              value="furnishing"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Building className="h-4 w-4 mr-2" />
              Furnishing
            </TabsTrigger>
          </TabsList>

          {Object.keys(boothData).map((category) => {
            const Icon = categoryIcons[category];
            const filteredBooths = getFilteredBooths(category);

            return (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="flex items-center mb-6">
                  <Icon className="h-6 w-6 text-primary-blue mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">
                    {category.replace("-", " & ")} ({filteredBooths.length}{" "}
                    {filteredBooths.length === 1 ? "booth" : "booths"})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooths.map((booth) => (
                    <Card
                      key={booth.id}
                      className="bg-white border-gray-200 hover:border-primary-blue hover:shadow-lg transition-all duration-300 hover:shadow-blue-100"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="border-primary-blue text-primary-blue bg-blue-50"
                          >
                            {booth.booth}
                          </Badge>
                          <Store className="h-5 w-5 text-gray-400" />
                        </div>
                        <CardTitle className="text-gray-900">
                          {booth.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {booth.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            {booth.category}
                          </Badge>
                          <Button
                            size="sm"
                            className="bg-primary-blue text-white hover:bg-blue-700"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredBooths.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No booths found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search terms or browse other
                      categories.
                    </p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Search Results - Show when searching across all categories */}
        {searchTerm && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results ({getFilteredBooths().length} found)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredBooths().map((booth) => (
                <Card
                  key={booth.id}
                  className="bg-white border-gray-200 hover:border-primary-blue hover:shadow-lg transition-all duration-300 hover:shadow-blue-100"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="border-primary-blue text-primary-blue bg-blue-50"
                      >
                        {booth.booth}
                      </Badge>
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardTitle className="text-gray-900">
                      {booth.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {booth.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 border-blue-200"
                      >
                        {booth.category}
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-primary-blue text-white hover:bg-blue-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MapPin className="h-6 w-6 text-primary-blue" />
              <span className="text-xl font-bold text-primary-blue">
                H.A.C.E.
              </span>
            </div>
            <p className="text-gray-600">
              Indoor Navigation System - Find your way through the event
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
