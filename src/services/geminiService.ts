/* eslint-disable @typescript-eslint/no-explicit-any */
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GOOGLE_API_KEY is not set");
}

const systemPrompt = `
You are a professional AI image generation assistant.
Your task is to create or edit high-quality, realistic, and visually appealing images based on the user's request.

Always interpret the user’s short instruction as a detailed creative brief.
When generating or editing images, apply the following standards:
- Style: ultra-realistic, cinematic, or digital art depending on the context.
- Resolution: 8K, highly detailed textures, balanced lighting.
- Composition: professional framing, depth of field, and realistic proportions.
- Lighting: natural or cinematic.
- Color grading: vibrant but natural.
- Camera details: 50mm lens, f/1.8 aperture, Canon EOS R5.
`;

function buildGeminiPrompt(userPrompt: string): string {
  return `${systemPrompt}\n\nUser instruction: ${userPrompt}`;
}

export interface ImageGenerationResult {
  image: string;
  usage: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export async function generateImage(
  options: any
): Promise<ImageGenerationResult> {
  const { description, referenceImage } = options;

  // Use description as the primary prompt for image generation
  const prompt = buildGeminiPrompt(description || "Create a professional thumbnail image");

  const contents: any[] = [];

  if (referenceImage) {
    const imageData = await fileToBase64(referenceImage);
    contents.push({
      parts: [
        {
          inlineData: {
            mimeType: referenceImage.type,
            data: imageData,
          },
        },
        {
          text: prompt,
        },
      ],
    });
  } else {
    contents.push({
      parts: [
        {
          text: prompt,
        },
      ],
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          responseModalities: ["text", "image"],
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No response from AI");
  }

  const parts = data.candidates[0].content.parts;
  const imagePart = parts.find((part: any) => part.inlineData);
  if (imagePart) {
    const imageData = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
    return {
      image: `data:${mimeType};base64,${imageData}`,
      usage: data.usageMetadata,
    };
  } else {
    const text = parts.map((part: any) => part.text).join("");
    return {
      image: text,
      usage: data.usageMetadata,
    };
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
