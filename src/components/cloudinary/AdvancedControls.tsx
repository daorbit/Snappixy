import React from "react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface AdvancedControlsProps {
  options: TransformationOptions;
  onChange: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

export const AdvancedControls: React.FC<AdvancedControlsProps> = ({
  options,
  onChange,
}) => {
  return (
    <div className="advanced-controls">
      <h3>Advanced</h3>
      <div className="control-group">
        <label>
          Radius:
          <input
            type="number"
            value={options.radius || ""}
            onChange={(e) => onChange("radius", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            min="0"
          />
        </label>
        <label>
          Angle:
          <input
            type="number"
            value={options.angle || ""}
            onChange={(e) => onChange("angle", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            min="-360"
            max="360"
          />
        </label>
        <label>
          Opacity:
          <input
            type="number"
            value={options.opacity || ""}
            onChange={(e) => onChange("opacity", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="100"
            min="0"
            max="100"
          />
        </label>
        <label>
          DPR:
          <input
            type="number"
            value={options.dpr || ""}
            onChange={(e) => onChange("dpr", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="1"
            min="0.1"
            step="0.1"
          />
        </label>
        <label>
          Background:
          <input
            type="color"
            value={options.background || "#ffffff"}
            onChange={(e) => onChange("background", e.target.value)}
          />
        </label>
        <label>
          Color:
          <input
            type="color"
            value={options.color || "#000000"}
            onChange={(e) => onChange("color", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};