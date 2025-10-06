import React from "react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface FormatControlsProps {
  options: TransformationOptions;
  onChange: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

export const FormatControls: React.FC<FormatControlsProps> = ({
  options,
  onChange,
}) => {
  const formatOptions = [
    { value: "", label: "Original" },
    { value: "auto", label: "Auto" },
    { value: "jpg", label: "JPEG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "avif", label: "AVIF" },
    { value: "gif", label: "GIF" },
  ];

  return (
    <div className="format-controls">
      <h3>Format</h3>
      <div className="control-group">
        <label>
          Format:
          <select
            value={options.format || ""}
            onChange={(e) => onChange("format", e.target.value || undefined)}
          >
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};