import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  buildTransformationUrl,
  type TransformationOptions,
  type CloudinaryResource,
  uploadFromUrl,
} from "../../services/cloudinary/cloudinaryService";
import { ContentContainer, MainContent } from "../../components/cloudinary/ImageTransformModal.styled";
import Header from "./Header";
import ControlsPanel from "./ControlsPanel";
import PresetsTab from "./PresetsTab";
import FormatTab from "./FormatTab";
import EffectsTab from "./EffectsTab";
import FiltersTab from "./FiltersTab";
import AdjustTab from "./AdjustTab";
import TextTab from "./TextTab";
import OverlayTab from "./OverlayTab";
import ArtisticTab from "./ArtisticTab";
import OptimizeTab from "./OptimizeTab";
import AdvancedTab from "./AdvancedTab";
import PreviewPanel from "./PreviewPanel";
import ThumbnailsPanel from "./ThumbnailsPanel";
import CropResizeTab from "./CropResizeTab";

const ImageEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const [options, setOptions] = useState<TransformationOptions>({});
  const [transformedUrl, setTransformedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [image, setImage] = useState<CloudinaryResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get image data from URL parameters
  useEffect(() => {
    const publicId = searchParams.get("publicId");
    const secureUrl = searchParams.get("secureUrl");
    const format = searchParams.get("format") || "jpg";
    const width = parseInt(searchParams.get("width") || "0");
    const height = parseInt(searchParams.get("height") || "0");
    const bytes = parseInt(searchParams.get("bytes") || "0");

    if (publicId && secureUrl) {
      setImage({
        public_id: publicId,
        secure_url: secureUrl,
        url: secureUrl.replace("/upload/", "/upload/fl_lossy/"),
        format,
        width,
        height,
        bytes,
        created_at: new Date().toISOString(),
      });
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (image && options) {
      console.log(
        "Building URL for image:",
        image.public_id,
        "with options:",
        options
      );
      try {
        const url = buildTransformationUrl(image.public_id, options);
        console.log("Generated URL:", url);
        setTransformedUrl(url);
      } catch (error) {
        console.error("Error building transformation URL:", error);
        setTransformedUrl(image.secure_url);
      }
    }
  }, [image, options]);

  const updateOption = <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const resetTransformations = () => {
    setOptions({});
    setActivePreset(null);
  };

  const applyPreset = (preset: string) => {
    if (preset === "none") {
      resetTransformations();
      return;
    }

    const presets: Record<string, TransformationOptions> = {
      thumbnail: { width: 150, height: 150, crop: "thumb" },
      square: { width: 500, height: 500, crop: "crop", gravity: "center" },
      mobile: { width: 375, height: 667, crop: "fit" },
      web: { width: 1200, height: 800, crop: "fit" },
      blur: { effect: "blur:500" },
      grayscale: { effect: "grayscale" },
      sepia: { effect: "sepia" },
      brightness: { effect: "brightness:30" },
      contrast: { effect: "contrast:50" },
      saturation: { effect: "saturation:50" },
      vintage: { effect: "sepia", contrast: 20, brightness: -10 },
      dramatic: { contrast: 80, brightness: -20, saturation: 30 },
      warm: { brightness: 20, saturation: 40, hue: 15 },
      cool: { brightness: -10, saturation: 20, hue: -15 },
      high_contrast: { contrast: 100, brightness: 10 },
      soft_glow: { blur: 2, brightness: 15, saturation: 10 },
      cartoon: { cartoonify: "color" },
      sketch: { sketch: true },
      pixel_art: { pixelate: 10 },
      oil_painting: { oil_paint: 50 },
      vignette_soft: { vignette: "30" },
      vignette_strong: { vignette: "80" },
      sharpen_light: { sharpen: 50 },
      sharpen_strong: { sharpen: 200 },
    };

    const presetOptions = presets[preset];

    if (presetOptions) {
      if (activePreset === preset) {
        setOptions({});
        setActivePreset(null);
      } else {
        setOptions(presetOptions);
        setActivePreset(preset);
      }
    } else {
      console.error("Preset not found:", preset);
    }
  };

  const handleSave = async () => {
    if (!image || !transformedUrl) return;
    setSaving(true);
    try {
      const result = await uploadFromUrl(transformedUrl);
      if (result.success) {
        console.log("Image saved to Cloudinary:", result.data);
        // Navigate back to cloudinary page
        navigate("/cloudinary");
      } else {
        console.error("Failed to save image:", result.error);
        alert("Failed to save image: " + result.error);
      }
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error saving image");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/cloudinary");
  };

  const hasTransformations = Object.keys(options).length > 0 || Boolean(transformedUrl && image && transformedUrl !== image.secure_url && transformedUrl !== "");

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading Snappixy...</Typography>
      </Box>
    );
  }

  if (!image) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Image not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Cloudinary
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}
    >
      <Header
        imageName={image.public_id.split("/").pop() || ""}
        hasTransformations={hasTransformations}
        saving={saving}
        onBack={handleBack}
        onReset={resetTransformations}
        onSave={handleSave}
      />

      <ContentContainer theme={theme}>
        <MainContent>
          <ControlsPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onReset={resetTransformations}
          >
            {activeTab === 0 && (
              <CropResizeTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 1 && (
              <FormatTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 2 && (
              <EffectsTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 3 && (
              <FiltersTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 4 && (
              <AdjustTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 5 && (
              <TextTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 6 && (
              <OverlayTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 7 && (
              <ArtisticTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 8 && (
              <OptimizeTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 9 && (
              <AdvancedTab options={options} updateOption={updateOption} />
            )}
            {activeTab === 10 && (
              <PresetsTab
                activePreset={activePreset}
                onApplyPreset={applyPreset}
                onReset={resetTransformations}
              />
            )}
          </ControlsPanel>

          <PreviewPanel
            image={image}
            transformedUrl={transformedUrl}
            options={options}
            activePreset={activePreset}
            hasTransformations={hasTransformations}
            onSave={handleSave}
            onReset={resetTransformations}
          />

          {image && (
            <ThumbnailsPanel 
              originalImage={image} 
              onImageChange={setTransformedUrl}
            />
          )}
        </MainContent>
      </ContentContainer>
    </Box>
  );
};

export default ImageEditorPage;
