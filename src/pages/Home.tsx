
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, MousePointer } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="px-4 py-1 text-sm bg-gray-100 rounded-full">Choose a Builder</span>
          <h1 className="text-4xl font-semibold mt-4">Select Your Builder Tool</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the tool you want to use to create your links.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
          <Card 
            className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary"
            onClick={() => navigate("/image-links")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <ImageIcon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-medium">Image Links Builder</h2>
              <p className="text-gray-500">
                Create HTML for image-based links. Perfect for visual galleries, product showcases, and image grids.
              </p>
              <Button onClick={() => navigate("/image-links")} className="mt-4">
                Select Image Links
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary"
            onClick={() => navigate("/button-builder")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <MousePointer className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-medium">Button Builder</h2>
              <p className="text-gray-500">
                Create stunning buttons with custom background images. Perfect for call-to-actions and featured links.
              </p>
              <Button onClick={() => navigate("/button-builder")} className="mt-4">
                Select Button Builder
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
