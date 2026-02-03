/**
 * Form Templates Service
 * Contains all form field definitions for Aadhaar
 */

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

// Complete Aadhaar form with ALL fields from the actual form
const AADHAAR_FORM: AnalysisResult = {
    formName: 'Aadhaar Enrolment / Correction Form',
    fields: [
        // Row 1-2: Pre-enrolment (optional)
        { id: 'pre_enrolment_id', label: 'Pre-Enrolment ID (if any)', type: 'text', placeholder: 'Leave blank if not applicable', required: false },

        // Row 3: Full Name
        { id: 'full_name', label: 'Full Name (as per documents)', type: 'text', placeholder: 'e.g., RAJESH KUMAR SINGH', required: true },

        // Row 4: Gender
        { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Transgender'], required: true },

        // Row 5: Age & DOB
        { id: 'age', label: 'Age (in years)', type: 'text', placeholder: 'e.g., 25', required: true },
        { id: 'date_of_birth', label: 'Date of Birth (DD/MM/YYYY)', type: 'text', placeholder: 'e.g., 15/08/1998', required: true },
        { id: 'dob_type', label: 'Date of Birth is', type: 'select', options: ['Declared', 'Verified'], required: true },

        // Row 6: Address - Care of
        { id: 'care_of', label: 'Father/Mother/Spouse/Guardian Name', type: 'text', placeholder: 'e.g., S/O SURESH KUMAR SINGH', required: true },

        // Address Details
        { id: 'house_no', label: 'House No / Building / Apartment', type: 'text', placeholder: 'e.g., 123, Flat A-101', required: true },
        { id: 'street', label: 'Street / Road / Lane', type: 'text', placeholder: 'e.g., MG Road', required: true },
        { id: 'landmark', label: 'Landmark', type: 'text', placeholder: 'e.g., Near City Mall', required: false },
        { id: 'area', label: 'Area / Locality / Sector', type: 'text', placeholder: 'e.g., Sector 15', required: true },
        { id: 'village_city', label: 'Village / Town / City', type: 'text', placeholder: 'e.g., Mumbai', required: true },
        { id: 'post_office', label: 'Post Office', type: 'text', placeholder: 'e.g., Andheri PO', required: true },
        { id: 'district', label: 'District', type: 'text', placeholder: 'e.g., Mumbai Suburban', required: true },
        { id: 'sub_district', label: 'Sub-District / Tehsil', type: 'text', placeholder: 'e.g., Andheri', required: false },
        { id: 'state', label: 'State', type: 'text', placeholder: 'e.g., Maharashtra', required: true },
        { id: 'pincode', label: 'PIN Code', type: 'text', placeholder: 'e.g., 400053', required: true },

        // Contact
        { id: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '9876543210', required: true },
        { id: 'email', label: 'Email ID (Optional)', type: 'text', placeholder: 'email@example.com', required: false },

        // Row 7: Parent/Guardian details
        { id: 'relative_name', label: "Parent/Guardian/Spouse Full Name", type: 'text', placeholder: 'e.g., SURESH KUMAR SINGH', required: false },
        { id: 'relative_aadhaar', label: "Their Aadhaar Number (if known)", type: 'text', placeholder: 'e.g., 1234 5678 9012', required: false },

        // Row 8: UIDAI Consent
        { id: 'uidai_consent', label: 'Allow UIDAI to share your info with agencies?', type: 'select', options: ['Yes', 'No'], required: true },

        // Row 9: Bank Linking
        { id: 'bank_linking', label: 'Link Aadhaar with your bank account?', type: 'select', options: ['Yes', 'No'], required: true },
        { id: 'bank_name', label: 'Bank Name (if linking)', type: 'text', placeholder: 'e.g., State Bank of India', required: false },

        // Row 10: Documents
        { id: 'poi_document', label: 'Proof of Identity Document', type: 'text', placeholder: 'e.g., Passport, Voter ID Card', required: true },
        { id: 'poa_document', label: 'Proof of Address Document', type: 'text', placeholder: 'e.g., Electricity Bill, Bank Statement', required: true },
        { id: 'dob_document', label: 'Date of Birth Proof Document', type: 'text', placeholder: 'e.g., Birth Certificate, School Certificate', required: false },
        { id: 'por_document', label: 'Proof of Relationship Document (if any)', type: 'text', placeholder: 'e.g., Marriage Certificate', required: false },
    ]
};

const FORM_TEMPLATES: Record<string, AnalysisResult> = {
    'aadhaar': AADHAAR_FORM,
    'generic': AADHAAR_FORM,
};

export function getFormTemplate(formType: string): AnalysisResult {
    return FORM_TEMPLATES[formType] || FORM_TEMPLATES['aadhaar'];
}

export function getAvailableFormTypes(): { id: string; name: string; icon: string }[] {
    return [
        { id: 'aadhaar', name: 'Aadhaar Card', icon: '🪪' },
    ];
}
