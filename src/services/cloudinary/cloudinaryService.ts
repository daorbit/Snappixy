import axios from 'axios';

const cloudName =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || "your-api-key";
const apiSecret =
  import.meta.env.VITE_CLOUDINARY_API_SECRET || "your-api-secret";

 

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface CloudinaryResourcesResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count: number;
}

export interface UploadResult {
  success: boolean;
  data?: CloudinaryImage;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface EditResult {
  success: boolean;
  data?: CloudinaryResource;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
      throw new Error("Upload preset not configured");
    }

    // ✅ Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    console.log("Uploading to Cloudinary...", {
      cloudName,
      uploadPreset,
      file: { name: file.name, size: file.size, type: file.type },
    });

    // ✅ Send upload request
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data as CloudinaryImage;
    console.log("Upload successful ✅", data);

    return {
      success: true,
      data: {
        public_id: data.public_id,
        secure_url: data.secure_url,
        url: data.url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        created_at: data.created_at,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown upload error" };
  }
};

export const uploadFromUrl = async (url: string, publicId?: string): Promise<UploadResult> => {
  try {
    if (!url) {
      throw new Error("No URL provided");
    }

    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
      throw new Error("Upload preset not configured");
    }

    // ✅ Prepare form data
    const formData = new FormData();
    formData.append("file", url);
    formData.append("upload_preset", uploadPreset);
    if (publicId) {
      formData.append("public_id", publicId);
    }

    console.log("Uploading from URL to Cloudinary...", {
      cloudName,
      uploadPreset,
      url,
      publicId,
    });

    // ✅ Send upload request
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data as CloudinaryImage;
    console.log("Upload from URL successful ✅", data);

    return {
      success: true,
      data: {
        public_id: data.public_id,
        secure_url: data.secure_url,
        url: data.url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        created_at: data.created_at,
      },
    };
  } catch (error) {
    console.error("Upload from URL error:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown upload from URL error" };
  }
};

export const deleteImage = async (publicId: string): Promise<DeleteResult> => {
  try {
    console.log("Attempting to delete image:", publicId);

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(
      `public_id=${publicId}&timestamp=${timestamp}`,
      apiSecret
    );

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());

    console.log("Delete request data:", {
      public_id: publicId,
      api_key: apiKey,
      timestamp: timestamp,
      signature: signature.substring(0, 10) + "...", // Don't log full signature
    });

    const response = await axios.post(`/api/cloudinary/image/destroy`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Delete response status:", response.status);

    const data = response.data;
    console.log("Delete successful:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
};

const generateSignature = async (
  params: string,
  apiSecret: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(params + apiSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const editImage = async (
  publicId: string,
  newName?: string
): Promise<EditResult> => {
  try {
    if (newName) {
      const response = await axios.post(`/api/cloudinary/image/rename`, {
        from_public_id: publicId,
        to_public_id: newName,
        api_key: apiKey,
        api_secret: apiSecret,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data as CloudinaryResource;

      return {
        success: true,
        data: {
          public_id: data.public_id,
          secure_url: data.secure_url,
          url: data.url,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
          created_at: data.created_at,
        },
      };
    }

    return {
      success: false,
      error: "No changes specified",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Edit failed",
    };
  }
};

// Get list of images
export const getImages = async (): Promise<CloudinaryResource[]> => {
  try {
    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    if (!apiKey) {
      throw new Error("Cloudinary API key not configured");
    }

    if (!apiSecret) {
      throw new Error("Cloudinary API secret not configured");
    }

    console.log("Fetching images from Cloudinary...");

    // Use Cloudinary Admin API directly
    const response = await axios.get(`/api/cloudinary/resources/image`, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      params: {
        max_results: 10, // Limit results for performance
      },
    });

    const data = response.data as CloudinaryResourcesResponse;
    console.log("Images fetched successfully:", data.resources?.length || 0);

    if (data.resources && Array.isArray(data.resources)) {
      return data.resources.map((resource: CloudinaryResource) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        url: resource.url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        bytes: resource.bytes,
        created_at: resource.created_at,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    return [];
  }
};

// Save image locally (download)
export const saveImage = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate optimized URL
export const getOptimizedUrl = (
  publicId: string,
  width?: number,
  height?: number
) => {
  let transformations = "";

  if (width) {
    transformations += `w_${width}`;
  }
  if (height) {
    transformations += transformations ? `,h_${height}` : `h_${height}`;
  }

  if (transformations) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};

export interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  format?: string;
  quality?: string | number;
  effect?: string;
  radius?: number;
  angle?: number;
  opacity?: number;
  background?: string;
  color?: string;
  dpr?: number;

  // Aspect ratio
  aspectRatio?: string;

  // Flip and rotate
  flip?: boolean;
  flop?: boolean;

  // Filters
  sharpen?: number;
  blur?: number;
  vignette?: string;
  hue?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;
  gamma?: number;
  exposure?: number;

  // Text overlays
  text?: string;
  text_font_family?: string;
  text_font_size?: number;
  text_font_weight?: string;
  text_color?: string;
  text_position?: string;

  // Image overlays
  overlay?: string; // Public ID of overlay image
  overlay_position?: string; // Position: north_west, center, south_east, etc.
  overlay_width?: number;
  overlay_height?: number;
  overlay_opacity?: number;
  overlay_gravity?: string; // Gravity for positioning

  // Artistic effects
  cartoonify?: string;
  oil_paint?: number;
  pixelate?: number;
  sketch?: boolean;
  negate?: boolean;

  // Optimization
  auto_optimize?: boolean;
  auto_format?: boolean;
  progressive?: boolean;
}

export const buildTransformationUrl = (
  publicId: string,
  options: TransformationOptions
): string => {
  // Validate inputs
  if (!publicId) {
    console.error("No publicId provided");
    throw new Error("Public ID is required");
  }

  if (!cloudName || cloudName === "your-cloud-name") {
    console.error("Cloudinary cloud name not configured:", cloudName);
    throw new Error("Cloudinary cloud name not configured. Please check your .env file.");
  }

  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.aspectRatio) transformations.push(`ar_${options.aspectRatio}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.effect) transformations.push(`e_${options.effect}`);
  if (options.radius !== undefined) transformations.push(`r_${options.radius}`);
  if (options.flip) transformations.push(`a_flip`);
  if (options.flop) transformations.push(`a_flop`);
  if (options.angle) transformations.push(`a_${options.angle}`);
  if (options.flip || options.flop) transformations.push(`v_${Date.now()}`);
  if (options.opacity !== undefined)
    transformations.push(`o_${options.opacity}`);
  if (options.background) transformations.push(`b_${options.background}`);
  if (options.color) transformations.push(`co_${options.color}`);
  if (options.dpr) transformations.push(`dpr_${options.dpr}`);

  // Filters
  if (options.sharpen) transformations.push(`e_sharpen:${options.sharpen}`);
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  if (options.vignette) transformations.push(`e_vignette:${options.vignette}`);
  if (options.hue !== undefined) transformations.push(`e_hue:${options.hue}`);
  if (options.saturation !== undefined) transformations.push(`e_saturation:${options.saturation}`);
  if (options.brightness !== undefined) transformations.push(`e_brightness:${options.brightness}`);
  if (options.contrast !== undefined) transformations.push(`e_contrast:${options.contrast}`);
  if (options.gamma !== undefined) transformations.push(`e_gamma:${options.gamma}`);
  if (options.exposure !== undefined) transformations.push(`e_exposure:${options.exposure}`);

  // Text overlays
  if (options.text) {
    let textTransform = `l_text:${encodeURIComponent(options.text_font_family || 'Arial')}_${options.text_font_size || 30}_${encodeURIComponent(options.text_color || '000000')}:${encodeURIComponent(options.text)}`;
    if (options.text_font_weight) textTransform += `,w_${options.text_font_weight}`;
    if (options.text_position) textTransform += `,g_${options.text_position}`;
    transformations.push(textTransform);
  }

  // Image overlays
  if (options.overlay) {
    let overlayTransform: string;

    // Check if it's a full URL or just a public ID
    if (options.overlay.startsWith('http')) {
      // External URL - use l_fetch
      overlayTransform = `l_fetch:${encodeURIComponent(options.overlay)}`;
    } else {
      // Public ID - use l_
      overlayTransform = `l_${encodeURIComponent(options.overlay)}`;
    }

    // Add positioning first (important for overlay positioning)
    if (options.overlay_gravity) {
      overlayTransform += `,g_${options.overlay_gravity}`;
    } else if (options.overlay_position) {
      overlayTransform += `,g_${options.overlay_position}`;
    } else {
      // Default to center if no position specified
      overlayTransform += `,g_center`;
    }

    if (options.overlay_width) overlayTransform += `,w_${options.overlay_width}`;
    if (options.overlay_height) overlayTransform += `,h_${options.overlay_height}`;
    if (options.overlay_opacity !== undefined) overlayTransform += `,o_${options.overlay_opacity}`;

    console.log("Adding overlay transformation:", overlayTransform);
    transformations.push(overlayTransform);
  }

  // Artistic effects
  if (options.cartoonify) transformations.push(`e_cartoonify:${options.cartoonify}`);
  if (options.oil_paint) transformations.push(`e_oil_paint:${options.oil_paint}`);
  if (options.pixelate) transformations.push(`e_pixelate:${options.pixelate}`);
  if (options.sketch) transformations.push(`e_sketch`);
  if (options.negate) transformations.push(`e_negate`);

  // Optimization
  if (options.auto_optimize) transformations.push(`f_auto`);
  if (options.auto_format) transformations.push(`f_auto`);
  if (options.progressive) transformations.push(`fl_progressive`);

  const transformationString = transformations.join(",");
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  console.log("Building transformation URL:", {
    publicId,
    options,
    transformations,
    transformationString,
    hasTransformations: transformationString.length > 0
  });

  // If no transformations, return the original image URL
  if (transformationString === "") {
    return `${baseUrl}/${publicId}`;
  }

  return `${baseUrl}/${transformationString}/${publicId}`;
};
