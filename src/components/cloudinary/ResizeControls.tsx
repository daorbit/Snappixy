import React from "react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface ResizeControlsProps {
  options: TransformationOptions;
  onChange: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

export const ResizeControls: React.FC<ResizeControlsProps> = ({
  options,
  onChange,
}) => {
  return (
    <div className="resize-controls">
      <h3>Resize</h3>
      <div className="control-group">
        <label>
          Width:
          <input
            type="number"
            value={options.width || ""}
            onChange={(e) => onChange("width", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Auto"
            min="1"
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={options.height || ""}
            onChange={(e) => onChange("height", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Auto"
            min="1"
          />
        </label>
      </div>
    </div>
  );
};