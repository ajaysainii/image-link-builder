
import { useState, useRef, ChangeEvent } from "react";
import { PlusCircle, Copy, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ButtonLink {
  id: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  width: number;
  height: number;
}

const ButtonBuilder = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(60);
  const [buttonLinks, setButtonLinks] = useState<ButtonLink[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Create a URL for the image
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    toast.success("Image uploaded successfully");
  };
  
  const handleAddButton = () => {
    if (!imageUrl || !linkUrl || !buttonText) {
      toast.error("Please fill in all fields");
      return;
    }

    const newButtonLink: ButtonLink = {
      id: crypto.randomUUID(),
      imageUrl,
      linkUrl,
      buttonText,
      width,
      height
    };

    setButtonLinks((prev) => [...prev, newButtonLink]);
    setButtonText("");
    toast.success("Button added successfully");
  };

  const handleRemoveButton = (id: string) => {
    setButtonLinks((prev) => prev.filter((button) => button.id !== id));
    toast.success("Button removed successfully");
  };
  
  const generateHtmlBlock = () => {
    return buttonLinks.map(button => {
      return `<a href="${button.linkUrl}" style="display: inline-block; width: ${button.width}px; height: ${button.height}px; background-image: url('${button.imageUrl}'); background-size: cover; background-position: center; text-align: center; line-height: ${button.height}px; color: white; font-weight: bold; text-decoration: none; margin: 10px; border-radius: 5px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
  ${button.buttonText}
</a>`;
    }).join('\n\n');
  };

  const copyHtmlToClipboard = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      navigator.clipboard.writeText(textAreaRef.current.value);
      toast.success("HTML copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Selection
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <span className="px-4 py-1 text-sm bg-gray-100 rounded-full">Button Builder</span>
          <h1 className="text-4xl font-semibold mt-4">Create Image Background Buttons</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design buttons with custom background images for your website.
          </p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/50 border shadow-sm">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Image</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <p className="text-center text-sm text-gray-500 mb-2">- OR -</p>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Link URL</label>
                <Input
                  placeholder="Enter destination URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Button Text</label>
                <Input
                  placeholder="Enter button text..."
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Width (px)</label>
                <Input
                  type="number"
                  placeholder="Width in pixels"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Height (px)</label>
                <Input
                  type="number"
                  placeholder="Height in pixels"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex justify-center mt-2">
              <Button onClick={handleAddButton} className="h-10">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Button
              </Button>
            </div>
          </div>
        </Card>

        {imageUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <div className="p-4 border rounded-md bg-gray-50">
              <div 
                style={{
                  width: `${width}px`,
                  height: `${height}px`, 
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                  fontWeight: 'bold',
                  borderRadius: '5px'
                }}
              >
                {buttonText || "Button Text"}
              </div>
            </div>
          </div>
        )}
        
        {buttonLinks.length > 0 && (
          <>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Generated HTML</h2>
                  <Button onClick={copyHtmlToClipboard} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy HTML
                  </Button>
                </div>
                <textarea
                  ref={textAreaRef}
                  className="w-full h-40 p-4 font-mono text-sm bg-gray-50 border rounded-md"
                  value={generateHtmlBlock()}
                  readOnly
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buttonLinks.map((button) => (
                <Card
                  key={button.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="p-4">
                    <div className="mb-4 flex justify-center">
                      <div 
                        style={{
                          width: `${button.width}px`,
                          height: `${button.height}px`,
                          backgroundImage: `url(${button.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                          fontWeight: 'bold',
                          borderRadius: '5px',
                          margin: '0 auto'
                        }}
                      >
                        {button.buttonText}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <a
                        href={button.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 truncate hover:text-gray-900 transition-colors"
                      >
                        {button.linkUrl}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveButton(button.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {buttonLinks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No buttons added yet. Add your first one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonBuilder;
