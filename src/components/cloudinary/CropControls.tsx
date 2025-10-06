import React from "react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface CropControlsProps {
  options: TransformationOptions;
  onChange: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

export const CropControls: React.FC<CropControlsProps> = ({
  options,
  onChange,
}) => {
  const cropOptions = [
    { value: "", label: "None" },
    { value: "fill", label: "Fill" },
    { value: "crop", label: "Crop" },
    { value: "fit", label: "Fit" },
    { value: "scale", label: "Scale" },
    { value: "thumb", label: "Thumbnail" },
  ];

  const gravityOptions = [
    { value: "", label: "Auto" },
    { value: "face", label: "Face" },
    { value: "center", label: "Center" },
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
  ];

  return (
    <div className="crop-controls">
      <h3>Crop</h3>
      <div className="control-group">
        <label>
          Mode:
          <select
            value={options.crop || ""}
            onChange={(e) => onChange("crop", e.target.value || undefined)}
          >
            {cropOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Gravity:
          <select
            value={options.gravity || ""}
            onChange={(e) => onChange("gravity", e.target.value || undefined)}
          >
            {gravityOptions.map((option) => (
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