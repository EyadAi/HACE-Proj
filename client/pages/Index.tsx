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

// Sample booth data for each genre
const boothData = {
  "food-beverage": [
    {
      id: 1,
      name: "Gourmet Delights",
      description: "Premium dining experience",
      booth: "F-01",
      category: "Restaurant",
    },
    {
      id: 2,
      name: "Coffee Corner",
      description: "Artisan coffee & pastries",
      booth: "F-02",
      category: "Café",
    },
    {
      id: 3,
      name: "Fresh Juice Bar",
      description: "Organic fruit juices",
      booth: "F-03",
      category: "Beverages",
    },
    {
      id: 4,
      name: "Pizza Paradise",
      description: "Wood-fired pizza",
      booth: "F-04",
      category: "Fast Food",
    },
    {
      id: 5,
      name: "Sushi Station",
      description: "Fresh sushi & sashimi",
      booth: "F-05",
      category: "Restaurant",
    },
    {
      id: 6,
      name: "Smoothie Heaven",
      description: "Healthy smoothie bowls",
      booth: "F-06",
      category: "Beverages",
    },
    {
      id: 7,
      name: "Burger Kingdom",
      description: "Gourmet burgers",
      booth: "F-07",
      category: "Fast Food",
    },
    {
      id: 8,
      name: "Tea Garden",
      description: "Premium tea selection",
      booth: "F-08",
      category: "Café",
    },
    {
      id: 9,
      name: "Dessert Dreams",
      description: "Artisan desserts",
      booth: "F-09",
      category: "Bakery",
    },
    {
      id: 10,
      name: "Street Food Hub",
      description: "International street food",
      booth: "F-10",
      category: "Fast Food",
    },
  ],
  electricity: [
    {
      id: 11,
      name: "PowerTech Solutions",
      description: "Industrial electrical systems",
      booth: "E-01",
      category: "Infrastructure",
    },
    {
      id: 12,
      name: "Smart Grid Systems",
      description: "Smart electrical grid technology",
      booth: "E-02",
      category: "Technology",
    },
    {
      id: 13,
      name: "Solar Energy Co",
      description: "Solar panel installations",
      booth: "E-03",
      category: "Renewable",
    },
    {
      id: 14,
      name: "ElectroMax",
      description: "Electrical components",
      booth: "E-04",
      category: "Components",
    },
    {
      id: 15,
      name: "Lightning Solutions",
      description: "Professional lighting systems",
      booth: "E-05",
      category: "Lighting",
    },
    {
      id: 16,
      name: "Circuit Masters",
      description: "Electrical circuit design",
      booth: "E-06",
      category: "Design",
    },
    {
      id: 17,
      name: "Power Distribution Ltd",
      description: "Power distribution systems",
      booth: "E-07",
      category: "Infrastructure",
    },
    {
      id: 18,
      name: "EcoElectric",
      description: "Eco-friendly electrical solutions",
      booth: "E-08",
      category: "Renewable",
    },
    {
      id: 19,
      name: "AutoElectric",
      description: "Automotive electrical systems",
      booth: "E-09",
      category: "Automotive",
    },
    {
      id: 20,
      name: "HomeElectric Pro",
      description: "Residential electrical services",
      booth: "E-10",
      category: "Residential",
    },
  ],
  water: [
    {
      id: 21,
      name: "AquaPure Systems",
      description: "Water purification technology",
      booth: "W-01",
      category: "Purification",
    },
    {
      id: 22,
      name: "HydroFlow",
      description: "Water management solutions",
      booth: "W-02",
      category: "Management",
    },
    {
      id: 23,
      name: "Crystal Clear Water",
      description: "Bottled water services",
      booth: "W-03",
      category: "Supply",
    },
    {
      id: 24,
      name: "WaterTech Innovations",
      description: "Smart water systems",
      booth: "W-04",
      category: "Technology",
    },
    {
      id: 25,
      name: "Blue Ocean Filtration",
      description: "Advanced water filters",
      booth: "W-05",
      category: "Filtration",
    },
    {
      id: 26,
      name: "AquaLife Solutions",
      description: "Water quality testing",
      booth: "W-06",
      category: "Testing",
    },
    {
      id: 27,
      name: "H2O Specialists",
      description: "Industrial water treatment",
      booth: "W-07",
      category: "Treatment",
    },
    {
      id: 28,
      name: "Rainwater Harvest Co",
      description: "Rainwater collection systems",
      booth: "W-08",
      category: "Conservation",
    },
    {
      id: 29,
      name: "Pool & Spa Waters",
      description: "Swimming pool maintenance",
      booth: "W-09",
      category: "Recreation",
    },
    {
      id: 30,
      name: "Municipal Water Works",
      description: "Municipal water systems",
      booth: "W-10",
      category: "Municipal",
    },
  ],
  companies: [
    {
      id: 31,
      name: "InnovateCorp",
      description: "Technology innovation",
      booth: "C-01",
      category: "Technology",
    },
    {
      id: 32,
      name: "Global Dynamics",
      description: "International business solutions",
      booth: "C-02",
      category: "Consulting",
    },
    {
      id: 33,
      name: "FutureTech Industries",
      description: "Emerging technology research",
      booth: "C-03",
      category: "Research",
    },
    {
      id: 34,
      name: "Synergy Solutions",
      description: "Business optimization",
      booth: "C-04",
      category: "Optimization",
    },
    {
      id: 35,
      name: "NextGen Enterprises",
      description: "Next generation business",
      booth: "C-05",
      category: "Enterprise",
    },
    {
      id: 36,
      name: "Strategic Partners",
      description: "Strategic business partnerships",
      booth: "C-06",
      category: "Partnerships",
    },
    {
      id: 37,
      name: "Innovation Labs",
      description: "R&D and innovation",
      booth: "C-07",
      category: "Innovation",
    },
    {
      id: 38,
      name: "Digital Transform",
      description: "Digital transformation services",
      booth: "C-08",
      category: "Digital",
    },
    {
      id: 39,
      name: "Growth Accelerator",
      description: "Business growth solutions",
      booth: "C-09",
      category: "Growth",
    },
    {
      id: 40,
      name: "Enterprise Solutions",
      description: "Enterprise software solutions",
      booth: "C-10",
      category: "Software",
    },
  ],
  banking: [
    {
      id: 41,
      name: "Premier Bank",
      description: "Full-service banking",
      booth: "B-01",
      category: "Retail Banking",
    },
    {
      id: 42,
      name: "Investment Partners",
      description: "Investment and wealth management",
      booth: "B-02",
      category: "Investment",
    },
    {
      id: 43,
      name: "FinTech Solutions",
      description: "Digital banking technology",
      booth: "B-03",
      category: "Technology",
    },
    {
      id: 44,
      name: "Credit Union Plus",
      description: "Community banking services",
      booth: "B-04",
      category: "Credit Union",
    },
    {
      id: 45,
      name: "Corporate Finance",
      description: "Corporate banking solutions",
      booth: "B-05",
      category: "Corporate",
    },
    {
      id: 46,
      name: "Mobile Pay Systems",
      description: "Mobile payment solutions",
      booth: "B-06",
      category: "Payments",
    },
    {
      id: 47,
      name: "Loan Specialists",
      description: "Specialized lending services",
      booth: "B-07",
      category: "Lending",
    },
    {
      id: 48,
      name: "Insurance Plus",
      description: "Banking and insurance",
      booth: "B-08",
      category: "Insurance",
    },
    {
      id: 49,
      name: "Crypto Exchange",
      description: "Cryptocurrency services",
      booth: "B-09",
      category: "Cryptocurrency",
    },
    {
      id: 50,
      name: "International Banking",
      description: "Global banking services",
      booth: "B-10",
      category: "International",
    },
  ],
};

const categoryIcons = {
  "food-beverage": Utensils,
  electricity: Zap,
  water: Droplets,
  companies: Building,
  banking: Banknote,
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
    <div className="min-h-screen bg-gray-50">
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
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger
              value="food-beverage"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Utensils className="h-4 w-4 mr-2" />
              Food & Beverage
            </TabsTrigger>
            <TabsTrigger
              value="electricity"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Zap className="h-4 w-4 mr-2" />
              Electricity
            </TabsTrigger>
            <TabsTrigger
              value="water"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Droplets className="h-4 w-4 mr-2" />
              Water
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Building className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger
              value="banking"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white text-gray-700 hover:text-gray-900"
            >
              <Banknote className="h-4 w-4 mr-2" />
              Banking
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
                    booths)
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
