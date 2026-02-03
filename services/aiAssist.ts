/**
 * AI Assist Service
 * Lightweight Gemini usage for name/address formatting only
 * Falls back to manual logic if API fails
 */

// Manual fallback: name normalization
export function manualNormalizeName(name: string): string {
    if (!name) return '';

    // Convert to uppercase
    let normalized = name.toUpperCase();

    // Remove special characters except spaces and dots
    normalized = normalized.replace(/[^A-Z\s.]/g, '');

    // Handle common initial patterns
    // R. Kumar -> R KUMAR (keep initial if we can't expand)
    normalized = normalized.replace(/\.\s*/g, ' ');

    // Remove extra spaces
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
}

// Manual fallback: address formatting
export function manualFormatAddress(address: string): string {
    if (!address) return '';

    // Convert to uppercase
    let formatted = address.toUpperCase();

    // Keep most as-is for government forms, just clean up
    formatted = formatted.replace(/\s+/g, ' ').trim();

    return formatted;
}

// AI-assisted name normalization using fetch API
export async function aiNormalizeName(name: string): Promise<string> {
    if (!name || name.trim().length === 0) return name;

    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
        return manualNormalizeName(name);
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Convert this Indian name to proper government form format (ALL CAPS, full name without initials):
Input: "${name}"

Rules:
- Convert to UPPERCASE
- Keep as is if already proper (don't expand known initials unless obvious)
- Remove extra spaces
- Keep only alphabets and spaces

Output ONLY the corrected name, nothing else. No explanation.`
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 50,
                        temperature: 0.1
                    }
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (text && text.length > 0 && text.length < 100) {
                // Clean up the response
                return text.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ').trim();
            }
        }
    } catch (error) {
        console.log('AI name normalization failed, using fallback');
    }

    // Fallback: manual normalization
    return manualNormalizeName(name);
}

// AI-assisted address formatting
export async function aiFormatAddress(address: string): Promise<string> {
    if (!address || address.trim().length === 0) return address;

    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
        return manualFormatAddress(address);
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Format this Indian address for a government form (ALL CAPS):
Input: "${address}"

Rules:
- Convert to UPPERCASE
- Keep numbers and common abbreviations
- Clean up formatting

Output ONLY the formatted address, nothing else. No explanation.`
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 100,
                        temperature: 0.1
                    }
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (text && text.length > 0 && text.length < 200) {
                return text.toUpperCase();
            }
        }
    } catch (error) {
        console.log('AI address formatting failed, using fallback');
    }

    // Fallback: manual formatting
    return manualFormatAddress(address);
}

// Process field with AI assistance
export async function processFieldWithAI(
    fieldId: string,
    value: string,
    aiEnabled: boolean
): Promise<string> {
    if (!value || value.trim().length === 0) {
        return value;
    }

    // Only use AI for name and address fields
    if (fieldId.includes('name') || fieldId === 'care_of' || fieldId === 'relative_name') {
        return aiEnabled ? await aiNormalizeName(value) : manualNormalizeName(value);
    }

    if (['house_no', 'street', 'landmark', 'area', 'village_city', 'post_office'].includes(fieldId)) {
        return aiEnabled ? await aiFormatAddress(value) : manualFormatAddress(value);
    }

    // For other fields, just uppercase if it's a text field
    return value.toUpperCase();
}

// Process all form data with AI
export async function processFormDataWithAI(
    formData: Record<string, string>,
    aiEnabled: boolean
): Promise<Record<string, string>> {
    const processedData: Record<string, string> = {};

    for (const [fieldId, value] of Object.entries(formData)) {
        processedData[fieldId] = await processFieldWithAI(fieldId, value, aiEnabled);
    }

    return processedData;
}
