import React from "react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface QualityControlsProps {
  options: TransformationOptions;
  onChange: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

export const QualityControls: React.FC<QualityControlsProps> = ({
  options,
  onChange,
}) => {
  const qualityOptions = [
    { value: "", label: "Default" },
    { value: "auto", label: "Auto" },
    { value: "auto:best", label: "Auto Best" },
    { value: "auto:good", label: "Auto Good" },
    { value: "auto:eco", label: "Auto Eco" },
    { value: "auto:low", label: "Auto Low" },
  ];

  return (
    <div className="quality-controls">
      <h3>Quality</h3>
      <div className="control-group">
        <label>
          Quality:
          <select
            value={options.quality || ""}
            onChange={(e) => onChange("quality", e.target.value || undefined)}
          >
            {qualityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Custom (1-100):
          <input
            type="number"
            value={typeof options.quality === "number" ? options.quality : ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              onChange("quality", value);
            }}
            placeholder="Auto"
            min="1"
            max="100"
          />
        </label>
      </div>
    </div>
  );
};