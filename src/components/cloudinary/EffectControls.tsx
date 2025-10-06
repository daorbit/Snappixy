import React from "react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface EffectControlsProps {
  options: TransformationOptions;
  onChange: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

export const EffectControls: React.FC<EffectControlsProps> = ({
  options,
  onChange,
}) => {
  const effectOptions = [
    { value: "", label: "None" },
    { value: "blur", label: "Blur" },
    { value: "grayscale", label: "Grayscale" },
    { value: "sepia", label: "Sepia" },
    { value: "brightness", label: "Brightness" },
    { value: "contrast", label: "Contrast" },
    { value: "saturation", label: "Saturation" },
    { value: "hue", label: "Hue" },
    { value: "vignette", label: "Vignette" },
    { value: "pixelate", label: "Pixelate" },
  ];

  return (
    <div className="effect-controls">
      <h3>Effects</h3>
      <div className="control-group">
        <label>
          Effect:
          <select
            value={options.effect || ""}
            onChange={(e) => onChange("effect", e.target.value || undefined)}
          >
            {effectOptions.map((option) => (
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