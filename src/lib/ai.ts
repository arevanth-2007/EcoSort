import { WasteCategory } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIPredictionItem {
  label: string;
  score: number;
  normalizedCategory: WasteCategory;
}

export interface AIAnalysisResult {
  success: boolean;
  modelUsed: string;
  predictedCategory?: WasteCategory;
  materialName?: string;
  confidence?: number;
  reasoning?: string;
  isRecyclable?: boolean;
  imageQuality?: "CLEAR" | "BLURRY" | "POOR_LIGHTING" | "OCCLUDED" | "UNKNOWN";
  warning?: string | null;
  rawLabel?: string;
  predictions?: AIPredictionItem[];
  matchesUserCategory?: boolean;
  meetsConfidenceThreshold?: boolean;
  error?: string;
}

export function normalizeWasteLabel(rawLabel: string): WasteCategory {
  const label = rawLabel.toUpperCase().trim().replace(/[\s-_]+/g, "_");

  if (
    label.includes("PLASTIC") ||
    label.includes("PET") ||
    label.includes("HDPE") ||
    label.includes("POLYMER")
  ) {
    return "PLASTIC";
  }
  if (
    label.includes("CARDBOARD") ||
    label.includes("CARTON") ||
    label.includes("CORRUGATED")
  ) {
    return "CARDBOARD";
  }
  if (
    label.includes("PAPER") ||
    label.includes("NEWSPAPER") ||
    label.includes("MAGAZINE") ||
    label.includes("LEAFLET")
  ) {
    return "PAPER";
  }
  if (
    label.includes("GLASS") ||
    label.includes("JAR") ||
    label.includes("BOTTLE_GLASS")
  ) {
    return "GLASS";
  }
  if (
    label.includes("METAL") ||
    label.includes("ALUMINUM") ||
    label.includes("ALUMINIUM") ||
    label.includes("CAN") ||
    label.includes("TIN") ||
    label.includes("FOIL")
  ) {
    return "METAL";
  }
  if (
    label.includes("ORGANIC") ||
    label.includes("FOOD") ||
    label.includes("BIO") ||
    label.includes("FRUIT") ||
    label.includes("VEGETABLE") ||
    label.includes("COMPOST") ||
    label.includes("PEEL")
  ) {
    return "ORGANIC";
  }
  if (
    label.includes("E_WASTE") ||
    label.includes("EWASTE") ||
    label.includes("ELECTRONIC") ||
    label.includes("BATTERY") ||
    label.includes("CABLE") ||
    label.includes("CIRCUIT") ||
    label.includes("CHARGER")
  ) {
    return "E_WASTE";
  }

  return "OTHER";
}

export function detectImageMimeType(buffer: Buffer): string {
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length > 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length > 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  return "image/jpeg";
}

export async function classifyWasteImageBuffer(
  imageBuffer: Buffer,
  userSelectedCategory?: WasteCategory,
  threshold = 0.80
): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  let modelId = process.env.GEMINI_MODEL_ID?.trim() || "gemini-3.1-flash-lite";

  if (!apiKey) {
    return {
      success: false,
      modelUsed: modelId,
      error:
        "Google Gemini API key (GEMINI_API_KEY) is not configured in .env. Obtain a free API key at https://aistudio.google.com/app/apikey and add GEMINI_API_KEY=\"AIza...\" to your local .env file.",
    };
  }

  const mimeType = detectImageMimeType(imageBuffer);
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  const prompt = `You are EcoSort's professional environmental waste classification AI.
Analyze the provided photograph of waste or recyclable material and classify it into EXACTLY ONE of the following 8 EcoSort categories:
- PLASTIC: Bottles, containers, hard plastics, jugs, clean plastic wraps.
- PAPER: Office printer paper, newspapers, magazines, notebooks, envelopes, leaflets.
- CARDBOARD: Corrugated delivery cartons, cereal boxes, egg cartons, packing boxes.
- GLASS: Glass bottles, jars, clear and colored glassware.
- METAL: Aluminum drink cans, tin food cans, clean aluminum foil, metal jar lids.
- ORGANIC: Fruit and vegetable scraps, food leftovers, coffee grounds, eggshells, garden leaves.
- E_WASTE: Electronics, chargers, power cables, circuit boards, batteries, mice, broken phones.
- OTHER: Non-recyclable mixed garbage, styrofoam, dirty food wrappers, diapers, or unrecognizable items.

Evaluation Guidelines:
1. Visual Features: Inspect shape, texture, material gloss, transparency, labels, and condition.
2. Confidence Score: Return an authentic float between 0.00 and 1.00 reflecting your visual certainty. If the photo is blurry, dark, occluded, or ambiguous, assign lower confidence (< 0.65).
3. Image Quality: Classify quality as 'CLEAR', 'BLURRY', 'POOR_LIGHTING', 'OCCLUDED', or 'UNKNOWN'.
4. Warnings: If the item appears mixed with other materials, contaminated with heavy oils/liquids, or the photo is unclear, provide a brief warning string; otherwise null.
5. Do not invent recycling rules. If an item cannot be confidently identified, assign category 'OTHER' with lower confidence.

Respond ONLY with valid JSON conforming to this structure:
{
  "predictedCategory": "PLASTIC" | "PAPER" | "CARDBOARD" | "GLASS" | "METAL" | "ORGANIC" | "E_WASTE" | "OTHER",
  "materialName": "Concise specific name of the item (e.g. 'PET Plastic Bottle', 'Corrugated Shipping Box', 'Crushed Aluminum Beverage Can')",
  "confidence": 0.0 to 1.0,
  "reasoning": "A concise 1-2 sentence visual explanation of key features observed",
  "isRecyclable": true or false,
  "imageQuality": "CLEAR" | "BLURRY" | "POOR_LIGHTING" | "OCCLUDED" | "UNKNOWN",
  "warning": "Warning message string or null"
}`;

  const genAI = new GoogleGenerativeAI(apiKey);

  const attemptInference = async (targetModel: string) => {
    const model = genAI.getGenerativeModel({
      model: targetModel,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
    return await model.generateContent([prompt, imagePart]);
  };

  try {
    let result: any;
    try {
      result = await attemptInference(modelId);
    } catch (primaryErr: any) {
      const primaryMsg = primaryErr?.message || "";
      if (
        (primaryMsg.includes("503") || primaryMsg.includes("404") || primaryMsg.includes("high demand")) &&
        modelId !== "gemini-3-flash-preview"
      ) {
        console.warn(`Primary model ${modelId} unavailable (${primaryMsg.substring(0, 80)}). Retrying with gemini-3-flash-preview...`);
        modelId = "gemini-3-flash-preview";
        result = await attemptInference(modelId);
      } else {
        throw primaryErr;
      }
    }

    const responseText = result.response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    const rawCategory = String(parsed.predictedCategory || "OTHER").toUpperCase().trim();
    const normalizedCategory = normalizeWasteLabel(rawCategory);
    const confidence =
      typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5;
    const materialName = String(parsed.materialName || normalizedCategory);
    const reasoning = String(parsed.reasoning || "Visual classification completed by Google Gemini Vision.");
    const isRecyclable =
      typeof parsed.isRecyclable === "boolean" ? parsed.isRecyclable : normalizedCategory !== "OTHER";
    const imageQuality = parsed.imageQuality || (confidence < 0.6 ? "BLURRY" : "CLEAR");
    const warning = parsed.warning ? String(parsed.warning) : null;

    const matchesUserCategory = userSelectedCategory ? normalizedCategory === userSelectedCategory : undefined;
    const meetsConfidenceThreshold = confidence >= threshold;

    return {
      success: true,
      modelUsed: modelId,
      predictedCategory: normalizedCategory,
      materialName,
      confidence: Number(confidence.toFixed(4)),
      reasoning,
      isRecyclable,
      imageQuality,
      warning,
      rawLabel: materialName,
      matchesUserCategory,
      meetsConfidenceThreshold,
    };
  } catch (err: any) {
    let errMsg = err.message || "Failed to analyze image with Google Gemini Vision.";
    if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("403") || errMsg.includes("Forbidden")) {
      errMsg =
        "Invalid or unauthorized Google Gemini API key. Verify your key at https://aistudio.google.com/app/apikey.";
    } else if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429")) {
      errMsg = "Google Gemini API rate limit reached (HTTP 429). Please wait a moment before trying again.";
    } else if (errMsg.includes("503") || errMsg.includes("Service Unavailable")) {
      errMsg = "Google Gemini API is currently experiencing a temporary demand spike (HTTP 503). Please retry in a few seconds.";
    }
    return {
      success: false,
      modelUsed: modelId,
      error: errMsg,
    };
  }
}
