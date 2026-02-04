
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, NANO_BANANA_MODEL, HeadshotFeatures } from "../types";

/**
 * Utility to wait for a specified time.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes an API call with exponential backoff for 429 errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');

      if (isRateLimit && i < maxRetries - 1) {
        const waitTime = initialDelay * Math.pow(2, i);
        console.warn(`Rate limit hit. Retrying in ${waitTime}ms... (Attempt ${i + 1}/${maxRetries})`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

/**
 * Master prompt assembler.
 * Enforces strict separation between IDENTITY (Anchors), SCENE (Semantic), and TECHNICAL (Optics).
 */
const getWrappedPrompt = (semantic: string, technical: string): string => {
  return `LINKEDIN HEADSHOT ENGINE v3.0

1. IDENTITY HARD-LOCK (ANCHOR)
- BIOMETRIC DNA: Perform an absolute pixel-perfect mapping of the source face. Maintain exact eye geometry, iris pigmentation, nose bridge structure, and jawline contour.
- MICRO-TEXTURE: Retain all natural landmarks (moles, birthmarks, unique skin grain). DO NOT apply AI smoothing or "beautification."
- EYEWEAR PROTOCOL: If the subject wears glasses, preserve the EXACT frame geometry, material, and color. CRITICAL: Replace lenses with ultra-clear, anti-reflective professional studio glass. Remove all tint, transitions, or sunglass shading.
- CULTURAL FIDELITY: Maintain 100% accuracy for religious headwear (Hijab, Turban, etc.) and original hair texture/growth patterns. the fabric color MUST coordinate dynamically with the selected attire and color grading.

2. SCENE ARCHITECTURE (SEMANTIC INTENT)
This section defines mood, persona, attire, and environment only.
Do NOT infer camera, lighting, optics, framing, or rendering behavior from this section.
Match the attire with a gender specific attire profile (Masculine, Feminine)
${semantic}


3. TECHNICAL EXECUTION (MASTER CONTROLS)
- LIGHTING: Professional studio Rembrandt setup. 45-degree key light with precise catchlights in the irises. Zero harsh shadows.
- Strictly full-frontal orientation: head and shoulders facing directly toward the camera, no head tilt or angle; eyes looking straight into the lens.
- OPTICS & DEPTH: ${technical}.This defines depth behavior only. No lens distortion, no stylization.
Sharp high-frequency focus on the eyes is mandatory.
- TEXTURE: Hyper-realistic 8k photography. Authentic skin translucency and realistic fabric weave.
- COMPOSITION: Professional medium close-up headshot framing.

QUALITY: 
Professional photography asset suitable for LinkedIn.
No hallucinations, no identity drift, no AI smoothing, no stylization.`;
};

/**
 * Generates a professional headshot using split semantic and technical logic.
 */
export const generateHeadshot = async (
  apiKey: string,
  baseImageBase64: string,
  baseImageMimeType: string,
  features: HeadshotFeatures,
  seed?: number
): Promise<GeneratedImage> => {
  // Debug logic
  const isOAuth = apiKey.startsWith('ya29') || apiKey.length > 150; // Simple heuristic for OAuth token vs API Key

  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key or Access Token is missing.');
  }

  // Semantic Intent (Persona, Mood, Environment)
  const semantic = `
    - Persona: Professional with a ${features.expression} expression.
    - Environment: ${features.background}.
    - Attire: ${features.attire}.
    - Presentation: ${features.grooming}.
  `.trim();

  // Technical Master Controls (Camera, Optics, Color)
  const technical = `
    - Angle: ${features.cameraAngle}.
    - Framing: ${features.pose}.
    - Lens/Depth: ${features.lensDepth}.
    - Grade: ${features.colorGrade}.
  `.trim();

  const fullPrompt = getWrappedPrompt(semantic, technical);

  const parts: any[] = [
    {
      inlineData: {
        mimeType: baseImageMimeType,
        data: baseImageBase64
      }
    },
    {
      text: fullPrompt
    }
  ];

  if (features.attireImage && features.attireImageMimeType) {
    parts.splice(1, 0, {
      inlineData: {
        mimeType: features.attireImageMimeType,
        data: features.attireImage
      }
    });
    // Append instruction to use the reference
    parts[parts.length - 1].text += "\n\nCRITICAL: Use the second image provided as the strict reference for the subject's ATTIRE settings. Apply the clothing from the reference image to the subject.";
  }

  return withRetry(async () => {
    if (isOAuth) {
      // Use REST API with OAuth Token
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${NANO_BANANA_MODEL}:generateContent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: parts }],
          generationConfig: {
            temperature: 0.8,
            seed: seed,
            // imageConfig is not supported in all REST versions, check docs if needed. 
            // For flash-image, it might just return an image.
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No candidates returned from API.");
      }

      const imagePart = data.candidates[0].content?.parts.find((p: any) => p.inlineData);
      if (!imagePart || !imagePart.inlineData) {
        throw new Error("No image data found in response.");
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        base64: imagePart.inlineData.data,
        promptUsed: fullPrompt,
        mimeType: imagePart.inlineData.mimeType || 'image/png'
      };

    } else {
      // Use SDK for API Key
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: NANO_BANANA_MODEL,
        contents: {
          parts: parts
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
          temperature: 0.8,
          seed: seed,
        }
      });

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned.");
      }

      const imagePart = response.candidates[0].content?.parts.find(p => p.inlineData);

      if (!imagePart || !imagePart.inlineData) {
        throw new Error("No image data found.");
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        base64: imagePart.inlineData.data,
        promptUsed: fullPrompt,
        mimeType: imagePart.inlineData.mimeType || 'image/png'
      };
    }
  });
};

/**
 * Edits an existing image while strictly preserving the identity established in iteration 1.
 */
export const editHeadshot = async (
  apiKey: string,
  originalImage: GeneratedImage,
  instruction: string
): Promise<GeneratedImage> => {
  const ai = new GoogleGenAI({ apiKey });

  const fullEditPrompt = `RETOUCHING LAYER: ${instruction}. 

CRITICAL CONSTRAINTS: 
- Maintain 100% Identity Hard-Lock (face, eyewear frames, features).
- Preserve existing studio lighting and camera optics.
- Apply ONLY the requested delta change.`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: originalImage.mimeType,
              data: originalImage.base64
            }
          },
          {
            text: fullEditPrompt
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        },
        temperature: 0.4
      }
    });

    const imagePart = response.candidates?.[0].content?.parts.find(p => p.inlineData);
    if (!imagePart || !imagePart.inlineData) throw new Error("Edit failed.");

    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      base64: imagePart.inlineData.data,
      promptUsed: fullEditPrompt,
      mimeType: imagePart.inlineData.mimeType || 'image/png'
    };
  });
};
