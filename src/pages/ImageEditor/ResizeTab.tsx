import React from "react";
import { TextField } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface ResizeTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const ResizeTab: React.FC<ResizeTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <TextField
        fullWidth
        label="Width"
        type="number"
        value={options.width || ""}
        onChange={(e) =>
          updateOption(
            "width",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Height"
        type="number"
        value={options.height || ""}
        onChange={(e) =>
          updateOption(
            "height",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default ResizeTab;