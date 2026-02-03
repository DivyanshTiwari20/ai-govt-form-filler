/**
 * Gemini AI Service - MVP Version with Image Generation
 * Creates filled form by overlaying user data on the original image
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (API_KEY) {
    console.log('Gemini API Key loaded:', API_KEY.substring(0, 4) + '...' + API_KEY.substring(API_KEY.length - 4));
} else {
    console.warn('WARNING: No Gemini API key found!');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: string[];
}

export interface AnalysisResult {
    formName: string;
    fields: FormField[];
}

// ============================================
// PREDEFINED FORM TEMPLATES
// ============================================
const FORM_TEMPLATES: Record<string, AnalysisResult> = {
    'aadhaar': {
        formName: 'Aadhaar Card Enrollment Form',
        fields: [
            { id: 'full_name', label: 'Full Name (पूरा नाम)', type: 'text', placeholder: 'e.g., Rajesh Kumar', required: true },
            { id: 'date_of_birth', label: 'Date of Birth (जन्म तिथि)', type: 'text', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'gender', label: 'Gender (लिंग)', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
            { id: 'mobile_number', label: 'Mobile Number', type: 'text', placeholder: '9876543210', required: true },
            { id: 'email', label: 'Email (optional)', type: 'text', placeholder: 'email@example.com', required: false },
            { id: 'house_no', label: 'House/Building No.', type: 'text', placeholder: 'e.g., 123', required: true },
            { id: 'street', label: 'Street/Road', type: 'text', placeholder: 'e.g., MG Road', required: true },
            { id: 'locality', label: 'Locality/Village', type: 'text', placeholder: 'e.g., Andheri East', required: true },
            { id: 'city', label: 'City/Town', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'district', label: 'District', type: 'text', placeholder: 'e.g., Mumbai Suburban', required: true },
            { id: 'state', label: 'State', type: 'text', placeholder: 'e.g., Maharashtra', required: true },
            { id: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400001', required: true },
            { id: 'father_name', label: "Father's Name", type: 'text', placeholder: "e.g., Suresh Kumar", required: true },
        ]
    },
    'pan': {
        formName: 'PAN Card Application (Form 49A)',
        fields: [
            { id: 'last_name', label: 'Last Name/Surname', type: 'text', placeholder: 'e.g., KUMAR', required: true },
            { id: 'first_name', label: 'First Name', type: 'text', placeholder: 'e.g., RAJESH', required: true },
            { id: 'middle_name', label: 'Middle Name', type: 'text', placeholder: 'e.g., SURESH', required: false },
            { id: 'father_last_name', label: "Father's Last Name", type: 'text', placeholder: "e.g., KUMAR", required: true },
            { id: 'father_first_name', label: "Father's First Name", type: 'text', placeholder: "e.g., SURESH", required: true },
            { id: 'date_of_birth', label: 'Date of Birth', type: 'text', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
            { id: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '9876543210', required: true },
            { id: 'email', label: 'Email', type: 'text', placeholder: 'email@example.com', required: true },
            { id: 'flat_no', label: 'Flat/Door/Block No', type: 'text', placeholder: 'e.g., 101, A Wing', required: true },
            { id: 'building', label: 'Building/Premises', type: 'text', placeholder: 'e.g., Sunshine Apartments', required: true },
            { id: 'road', label: 'Road/Street/Lane', type: 'text', placeholder: 'e.g., Link Road', required: true },
            { id: 'area', label: 'Area/Locality', type: 'text', placeholder: 'e.g., Malad West', required: true },
            { id: 'city', label: 'Town/City/District', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'state', label: 'State', type: 'text', placeholder: 'e.g., Maharashtra', required: true },
            { id: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400064', required: true },
            { id: 'aadhaar', label: 'Aadhaar Number (optional)', type: 'text', placeholder: '1234 5678 9012', required: false },
        ]
    },
    'passport': {
        formName: 'Passport Application Form',
        fields: [
            { id: 'given_name', label: 'Given Name', type: 'text', placeholder: 'e.g., RAJESH', required: true },
            { id: 'surname', label: 'Surname', type: 'text', placeholder: 'e.g., KUMAR', required: true },
            { id: 'date_of_birth', label: 'Date of Birth', type: 'text', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'place_of_birth', label: 'Place of Birth', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: true },
            { id: 'marital_status', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
            { id: 'father_name', label: "Father's Full Name", type: 'text', placeholder: "e.g., SURESH KUMAR", required: true },
            { id: 'mother_name', label: "Mother's Full Name", type: 'text', placeholder: "e.g., ANITA DEVI", required: true },
            { id: 'address', label: 'Present Address', type: 'text', placeholder: 'Full address', required: true },
            { id: 'city', label: 'City', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'state', label: 'State', type: 'text', placeholder: 'e.g., Maharashtra', required: true },
            { id: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400001', required: true },
            { id: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '9876543210', required: true },
            { id: 'email', label: 'Email ID', type: 'text', placeholder: 'email@example.com', required: true },
            { id: 'emergency_name', label: 'Emergency Contact Name', type: 'text', placeholder: 'e.g., Spouse/Parent name', required: true },
            { id: 'emergency_phone', label: 'Emergency Phone', type: 'text', placeholder: '9876543210', required: true },
        ]
    },
    'voter_id': {
        formName: 'Voter ID (Form 6)',
        fields: [
            { id: 'full_name', label: 'Full Name (as per records)', type: 'text', placeholder: 'e.g., Rajesh Kumar', required: true },
            { id: 'father_husband_name', label: "Father's/Husband's Name", type: 'text', placeholder: "e.g., Suresh Kumar", required: true },
            { id: 'relation', label: 'Relation', type: 'select', options: ['Father', 'Mother', 'Husband'], required: true },
            { id: 'date_of_birth', label: 'Date of Birth', type: 'text', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'age', label: 'Age (as on 1st Jan)', type: 'text', placeholder: 'e.g., 25', required: true },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
            { id: 'house_no', label: 'House No', type: 'text', placeholder: 'e.g., 123', required: true },
            { id: 'street', label: 'Street/Area', type: 'text', placeholder: 'e.g., MG Road', required: true },
            { id: 'town', label: 'Town/Village', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'district', label: 'District', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'state', label: 'State', type: 'text', placeholder: 'e.g., Maharashtra', required: true },
            { id: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400001', required: true },
            { id: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '9876543210', required: false },
        ]
    },
    'generic': {
        formName: 'Government Form',
        fields: [
            { id: 'full_name', label: 'Full Name', type: 'text', placeholder: 'e.g., Rajesh Kumar', required: true },
            { id: 'father_name', label: "Father's Name", type: 'text', placeholder: "e.g., Suresh Kumar", required: true },
            { id: 'date_of_birth', label: 'Date of Birth', type: 'text', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
            { id: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '9876543210', required: true },
            { id: 'address', label: 'Full Address', type: 'text', placeholder: 'House No, Street, Area', required: true },
            { id: 'city', label: 'City', type: 'text', placeholder: 'e.g., Mumbai', required: true },
            { id: 'state', label: 'State', type: 'text', placeholder: 'e.g., Maharashtra', required: true },
            { id: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400001', required: true },
        ]
    }
};

export function getFormTemplate(formType: string): AnalysisResult {
    return FORM_TEMPLATES[formType] || FORM_TEMPLATES['generic'];
}

export function getAvailableFormTypes(): { id: string; name: string }[] {
    return [
        { id: 'aadhaar', name: 'Aadhaar Card' },
        { id: 'pan', name: 'PAN Card' },
        { id: 'passport', name: 'Passport' },
        { id: 'voter_id', name: 'Voter ID' },
        { id: 'generic', name: 'Other Form' },
    ];
}

/**
 * Convert image URI to base64
 */
async function imageToBase64(uri: string): Promise<string> {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                const base64 = base64data.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw new Error('Failed to process image');
    }
}

/**
 * Analyze form image to extract relevant questions
 * Uses Gemini Vision to understand what fields are in the form
 */
export async function analyzeForm(imageUri: string): Promise<AnalysisResult> {
    try {
        console.log('Analyzing form with AI...');

        // Try to use Gemini for smart analysis
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const base64Image = await imageToBase64(imageUri);

        const prompt = `Analyze this Indian government form image. Identify what type of form it is and list ALL the blank fields that need to be filled.

Return ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "formName": "Name of the form",
  "fields": [
    {"id": "field_id", "label": "Field Label", "type": "text", "placeholder": "example", "required": true}
  ]
}

Field types can be: text, number, date, or select.
For select type, add "options": ["Option1", "Option2"]`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error: any) {
        console.log('AI analysis failed, using template:', error.message);
        // Fallback to generic template
        return FORM_TEMPLATES['generic'];
    }
}

/**
 * Generate filled form data for display
 * Returns the user data formatted for overlay
 */
export function formatFormData(formData: Record<string, string>, formName: string): string {
    const lines = Object.entries(formData)
        .filter(([_, value]) => value && value.trim())
        .map(([key, value]) => {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${label}: ${value}`;
        });

    return lines.join('\n');
}

/**
 * Generate filled form - returns data for visual overlay
 * The actual image generation is done in the Result screen component
 */
export async function generateFilledForm(
    originalImageUri: string,
    formData: Record<string, string>,
    formName: string
): Promise<{ imageUri: string; formattedData: string }> {
    console.log('Preparing filled form data...');

    const formattedData = formatFormData(formData, formName);

    // Return original image and formatted data
    // The Result screen will create the visual overlay
    return {
        imageUri: originalImageUri,
        formattedData: formattedData,
    };
}
