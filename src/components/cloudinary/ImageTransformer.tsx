import React, { useState, useEffect } from "react";
import { buildTransformationUrl } from "../../services/cloudinary/cloudinaryService";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";
import { ResizeControls } from "./ResizeControls";
import { CropControls } from "./CropControls";
import { FormatControls } from "./FormatControls";
import { QualityControls } from "./QualityControls";
import { EffectControls } from "./EffectControls";
import { AdvancedControls } from "./AdvancedControls";
import "./ImageTransformer.css";

interface ImageTransformerProps {
  publicId: string;
  onUrlChange?: (url: string) => void;
}

export const ImageTransformer: React.FC<ImageTransformerProps> = ({
  publicId,
  onUrlChange,
}) => {
  const [options, setOptions] = useState<TransformationOptions>({});
  const [transformedUrl, setTransformedUrl] = useState<string>("");

  useEffect(() => {
    const url = buildTransformationUrl(publicId, options);
    setTransformedUrl(url);
    onUrlChange?.(url);
  }, [publicId, options, onUrlChange]);

  const updateOption = <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="image-transformer">
      <div className="transformation-controls">
        <ResizeControls options={options} onChange={updateOption} />
        <CropControls options={options} onChange={updateOption} />
        <FormatControls options={options} onChange={updateOption} />
        <QualityControls options={options} onChange={updateOption} />
        <EffectControls options={options} onChange={updateOption} />
        <AdvancedControls options={options} onChange={updateOption} />
      </div>
      <div className="preview-section">
        <img src={transformedUrl} alt="Transformed" className="transformed-image" />
        <div className="url-display">
          <code>{transformedUrl}</code>
        </div>
      </div>
    </div>
  );
};