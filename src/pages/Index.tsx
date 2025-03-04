
import { useState, useRef } from "react";
import { PlusCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface ImageLink {
  id: string;
  imageUrl: string;
  linkUrl: string;
  isFullWidth: boolean;
}

const Index = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [imageLinks, setImageLinks] = useState<ImageLink[]>([]);
  const [singleImagePerRow, setSingleImagePerRow] = useState(false);
  const [firstImageFullWidth, setFirstImageFullWidth] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddLink = () => {
    if (!imageUrl || !linkUrl) {
      toast.error("Please fill in both image URL and link URL");
      return;
    }

    const newImageLink: ImageLink = {
      id: crypto.randomUUID(),
      imageUrl,
      linkUrl,
      isFullWidth
    };

    setImageLinks((prev) => [...prev, newImageLink]);
    setImageUrl("");
    setLinkUrl("");
    setIsFullWidth(false);
    toast.success("Link added successfully");
  };

  const handleRemoveLink = (id: string) => {
    setImageLinks((prev) => prev.filter((link) => link.id !== id));
    toast.success("Link removed successfully");
  };

  const handleImageClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const generateHtmlBlock = () => {
    let html = '<div style="width: 100%; display: table; border-collapse: collapse;">\n';
    
    if (firstImageFullWidth && imageLinks.length > 0) {
      // First image takes full width
      html += '  <div style="display: table-row; margin: 0 10px;">\n';
      html += '    <div style="display: table-cell; width: 100%; padding: 10px;">\n';
      html += `      <a href="${imageLinks[0].linkUrl}" style="text-decoration: none;">\n`;
      html += `        <img src="${imageLinks[0].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
      html += '      </a>\n';
      html += '    </div>\n';
      html += '  </div>\n';
      
      // Process the remaining images in pairs
      for (let i = 1; i < imageLinks.length; i += 2) {
        html += '  <div style="display: table-row; margin: 0 10px;">\n';
        
        // First image in the pair
        html += '    <div style="display: table-cell; width: 50%; padding: 10px;">\n';
        html += `      <a href="${imageLinks[i].linkUrl}" style="text-decoration: none;">\n`;
        html += `        <img src="${imageLinks[i].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
        html += '      </a>\n';
        html += '    </div>\n';
        
        // Second image in the pair (if exists)
        if (i + 1 < imageLinks.length) {
          html += '    <div style="display: table-cell; width: 50%; padding: 10px;">\n';
          html += `      <a href="${imageLinks[i + 1].linkUrl}" style="text-decoration: none;">\n`;
          html += `        <img src="${imageLinks[i + 1].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
          html += '      </a>\n';
          html += '    </div>\n';
        } else {
          // Empty cell for odd number of images
          html += '    <div style="display: table-cell; width: 50%; padding: 10px;"></div>\n';
        }
        
        html += '  </div>\n';
      }
    } else if (singleImagePerRow) {
      // Process one image per row
      for (let i = 0; i < imageLinks.length; i++) {
        html += '  <div style="display: table-row; margin: 0 10px;">\n';
        html += '    <div style="display: table-cell; width: 100%; padding: 10px;">\n';
        html += `      <a href="${imageLinks[i].linkUrl}" style="text-decoration: none;">\n`;
        html += `        <img src="${imageLinks[i].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
        html += '      </a>\n';
        html += '    </div>\n';
        html += '  </div>\n';
      }
    } else {
      // Process images with individual full width settings
      let i = 0;
      while (i < imageLinks.length) {
        if (imageLinks[i].isFullWidth) {
          // Full width image
          html += '  <div style="display: table-row; margin: 0 10px;">\n';
          html += '    <div style="display: table-cell; width: 100%; padding: 10px;">\n';
          html += `      <a href="${imageLinks[i].linkUrl}" style="text-decoration: none;">\n`;
          html += `        <img src="${imageLinks[i].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
          html += '      </a>\n';
          html += '    </div>\n';
          html += '  </div>\n';
          i++;
        } else {
          // Regular pair of images
          html += '  <div style="display: table-row; margin: 0 10px;">\n';
          
          // First image in the pair
          html += '    <div style="display: table-cell; width: 50%; padding: 10px;">\n';
          html += `      <a href="${imageLinks[i].linkUrl}" style="text-decoration: none;">\n`;
          html += `        <img src="${imageLinks[i].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
          html += '      </a>\n';
          html += '    </div>\n';
          
          // Second image in the pair (if exists and is not full width)
          if (i + 1 < imageLinks.length && !imageLinks[i + 1].isFullWidth) {
            html += '    <div style="display: table-cell; width: 50%; padding: 10px;">\n';
            html += `      <a href="${imageLinks[i + 1].linkUrl}" style="text-decoration: none;">\n`;
            html += `        <img src="${imageLinks[i + 1].imageUrl}" alt="Link preview" style="width: 100%; height: auto; display: block;">\n`;
            html += '      </a>\n';
            html += '    </div>\n';
            i += 2;
          } else {
            // Empty cell for odd number of images or if next image is full width
            html += '    <div style="display: table-cell; width: 50%; padding: 10px;"></div>\n';
            i++;
          }
          
          html += '  </div>\n';
        }
      }
    }
    
    html += '</div>';
    return html;
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
        <div className="text-center space-y-2">
          <span className="px-4 py-1 text-sm bg-gray-100 rounded-full">Image Link Builder</span>
          <h1 className="text-4xl font-semibold mt-4">Create Your Image Links</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add images with associated links. Click on any image to visit its URL.
          </p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/50 border shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto] items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link URL</label>
              <Input
                placeholder="Enter destination URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="full-width-image"
                  checked={isFullWidth}
                  onCheckedChange={setIsFullWidth}
                />
                <label
                  htmlFor="full-width-image"
                  className="text-sm font-medium cursor-pointer"
                >
                  Full width image
                </label>
              </div>
              <Button onClick={handleAddLink} className="h-10">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </div>
          </div>
        </Card>

        {imageLinks.length > 0 && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="single-image-mode"
                      checked={singleImagePerRow}
                      onCheckedChange={(checked) => {
                        setSingleImagePerRow(checked);
                        if (checked) {
                          setFirstImageFullWidth(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="single-image-mode"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Single image per row
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="first-image-full-width"
                      checked={firstImageFullWidth}
                      onCheckedChange={(checked) => {
                        setFirstImageFullWidth(checked);
                        if (checked) {
                          setSingleImagePerRow(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="first-image-full-width"
                      className="text-sm font-medium cursor-pointer"
                    >
                      First image full width
                    </label>
                  </div>
                </div>
              </div>
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
              {imageLinks.map((link) => (
                <Card
                  key={link.id}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div
                    className="cursor-pointer aspect-video bg-gray-100 relative"
                    onClick={() => handleImageClick(link.linkUrl)}
                  >
                    <img
                      src={link.imageUrl}
                      alt="Link preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm">Click to visit</span>
                    </div>
                    {link.isFullWidth && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Full width
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <a
                        href={link.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 truncate hover:text-gray-900 transition-colors"
                      >
                        {link.linkUrl}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLink(link.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {imageLinks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No image links added yet. Add your first one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
