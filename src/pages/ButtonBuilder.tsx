
import { useState, useRef, ChangeEvent } from "react";
import { PlusCircle, Copy, ArrowLeft, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ButtonLink {
  id: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  width: number;
  height: number;
  borderRadius: number;
  padding: number;
  alignment: "left" | "center" | "right";
}

const ButtonBuilder = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(60);
  const [borderRadius, setBorderRadius] = useState(5);
  const [padding, setPadding] = useState(0);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center");
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
      height,
      borderRadius,
      padding,
      alignment
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
      const containerStyle = `text-align: ${button.alignment};`;
      
      return `<div style="${containerStyle}">
  <a href="${button.linkUrl}" style="display: inline-block; width: ${button.width}px; height: ${button.height}px; background-image: url('${button.imageUrl}'); background-size: cover; background-position: center; text-align: center; line-height: ${button.height - (button.padding * 2)}px; color: white; font-weight: bold; text-decoration: none; margin: 10px; border-radius: ${button.borderRadius}px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); padding: ${button.padding}px;">
    ${button.buttonText}
  </a>
</div>`;
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

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Border Radius (px)</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[borderRadius]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={(value) => setBorderRadius(value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{borderRadius}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Padding (px)</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[padding]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => setPadding(value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{padding}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alignment</label>
                <RadioGroup 
                  value={alignment} 
                  onValueChange={(value: "left" | "center" | "right") => setAlignment(value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="align-left" />
                    <Label htmlFor="align-left" className="flex items-center">
                      <AlignLeft className="h-4 w-4 mr-1" /> Left
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="center" id="align-center" />
                    <Label htmlFor="align-center" className="flex items-center">
                      <AlignCenter className="h-4 w-4 mr-1" /> Center
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="align-right" />
                    <Label htmlFor="align-right" className="flex items-center">
                      <AlignRight className="h-4 w-4 mr-1" /> Right
                    </Label>
                  </div>
                </RadioGroup>
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
            <div className={`p-4 border rounded-md bg-gray-50 text-${alignment}`}>
              <div 
                style={{
                  width: `${width}px`,
                  height: `${height}px`, 
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'inline-block',
                  textAlign: 'center',
                  lineHeight: `${height - (padding * 2)}px`,
                  color: 'white',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                  fontWeight: 'bold',
                  borderRadius: `${borderRadius}px`,
                  padding: `${padding}px`,
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
                    <div className={`mb-4 text-${button.alignment}`}>
                      <div 
                        style={{
                          width: `${button.width}px`,
                          height: `${button.height}px`,
                          backgroundImage: `url(${button.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'inline-block',
                          textAlign: 'center',
                          lineHeight: `${button.height - (button.padding * 2)}px`,
                          color: 'white',
                          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                          fontWeight: 'bold',
                          borderRadius: `${button.borderRadius}px`,
                          padding: `${button.padding}px`,
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
