/**
 * Translations - Hindi + English
 * All labels, hints, and errors in both languages
 */

export type Language = 'hi' | 'en';

export const translations = {
    // App
    appName: {
        hi: 'आधार फॉर्म सहायक',
        en: 'Aadhaar Form Assistant'
    },

    // Home Screen
    selectForm: {
        hi: 'फॉर्म चुनें',
        en: 'Select Form to Fill'
    },
    aadhaarCard: {
        hi: 'आधार कार्ड',
        en: 'Aadhaar Card'
    },
    tapToStart: {
        hi: 'शुरू करने के लिए टैप करें',
        en: 'Tap to start filling'
    },
    comingSoon: {
        hi: 'जल्द आ रहा है',
        en: 'Coming Soon'
    },

    // Form Input
    question: {
        hi: 'प्रश्न',
        en: 'Question'
    },
    of: {
        hi: 'का',
        en: 'of'
    },
    next: {
        hi: 'अगला',
        en: 'Next'
    },
    previous: {
        hi: 'पिछला',
        en: 'Previous'
    },
    generateForm: {
        hi: 'फॉर्म बनाएं',
        en: 'Generate Form'
    },
    generating: {
        hi: 'बना रहे हैं...',
        en: 'Generating...'
    },
    skip: {
        hi: 'छोड़ें',
        en: 'Skip'
    },
    optional: {
        hi: 'वैकल्पिक',
        en: 'Optional'
    },
    required: {
        hi: 'आवश्यक',
        en: 'Required'
    },

    // Validation Errors
    validation: {
        capitalLettersOnly: {
            hi: 'केवल बड़े अक्षर (CAPITAL LETTERS) लिखें',
            en: 'Use CAPITAL LETTERS only'
        },
        noNumbers: {
            hi: 'नाम में अंक नहीं होने चाहिए',
            en: 'Name should not contain numbers'
        },
        noSpecialChars: {
            hi: 'विशेष अक्षर की अनुमति नहीं है',
            en: 'Special characters not allowed'
        },
        invalidDate: {
            hi: 'सही तारीख लिखें (DD/MM/YYYY)',
            en: 'Enter valid date (DD/MM/YYYY)'
        },
        futureDate: {
            hi: 'भविष्य की तारीख नहीं हो सकती',
            en: 'Date cannot be in future'
        },
        invalidMobile: {
            hi: 'सही 10 अंकों का मोबाइल नंबर लिखें',
            en: 'Enter valid 10-digit mobile number'
        },
        invalidPincode: {
            hi: 'सही 6 अंकों का पिनकोड लिखें',
            en: 'Enter valid 6-digit PIN code'
        },
        tooShort: {
            hi: 'नाम बहुत छोटा है, पूरा नाम लिखें',
            en: 'Name too short, enter full name'
        },
        initialsNotAllowed: {
            hi: 'संक्षिप्त नाम (initials) की अनुमति नहीं है',
            en: 'Initials not allowed, use full name'
        },
        fieldRequired: {
            hi: 'यह फ़ील्ड आवश्यक है',
            en: 'This field is required'
        }
    },

    // Result Screen
    formReady: {
        hi: 'आपका फॉर्म तैयार है!',
        en: 'Your Form is Ready!'
    },
    saveToGallery: {
        hi: 'गैलरी में सेव करें',
        en: 'Save to Gallery'
    },
    share: {
        hi: 'शेयर करें',
        en: 'Share'
    },
    newForm: {
        hi: 'नया फॉर्म',
        en: 'New Form'
    },
    copyWarning: {
        hi: 'इस जानकारी को फॉर्म में हाथ से भरें',
        en: 'Manually copy this into the physical form'
    },
    copied: {
        hi: 'कॉपी हो गया!',
        en: 'Copied!'
    },
    tapToCopy: {
        hi: 'कॉपी करने के लिए टैप करें',
        en: 'Tap to copy'
    },

    // Form Readiness
    formReadiness: {
        hi: 'फॉर्म तैयारी स्कोर',
        en: 'Form Readiness Score'
    },
    excellent: {
        hi: 'उत्कृष्ट! फॉर्म सही भरा है',
        en: 'Excellent! Form is properly filled'
    },
    good: {
        hi: 'अच्छा है, कुछ सुधार करें',
        en: 'Good, but some improvements needed'
    },
    needsWork: {
        hi: 'सुधार आवश्यक है',
        en: 'Needs improvement'
    },

    // Info Cards
    whyRejected: {
        title: {
            hi: 'फॉर्म क्यों रिजेक्ट होते हैं?',
            en: 'Why forms get rejected?'
        },
        reasons: [
            {
                hi: 'नाम छोटे अक्षरों में लिखा',
                en: 'Name written in small letters'
            },
            {
                hi: 'अधूरा पता',
                en: 'Incomplete address'
            },
            {
                hi: 'गलत जन्म तिथि',
                en: 'Wrong date of birth'
            },
            {
                hi: 'मोबाइल नंबर गलत',
                en: 'Incorrect mobile number'
            },
            {
                hi: 'दस्तावेज़ मेल नहीं खाते',
                en: 'Documents don\'t match'
            }
        ]
    },

    commonMistakes: {
        title: {
            hi: 'आम गलतियाँ',
            en: 'Common Mistakes'
        },
        items: [
            {
                hi: '❌ R. Kumar → ✅ RAMESH KUMAR',
                en: '❌ R. Kumar → ✅ RAMESH KUMAR'
            },
            {
                hi: '❌ s/o Shri... → ✅ S/O SHRI...',
                en: '❌ s/o Shri... → ✅ S/O SHRI...'
            },
            {
                hi: '❌ 1/1/1990 → ✅ 01/01/1990',
                en: '❌ 1/1/1990 → ✅ 01/01/1990'
            }
        ]
    },

    // AI Assist
    aiAssist: {
        hi: 'AI सहायता (वैकल्पिक)',
        en: 'AI Help (Optional)'
    },
    aiAssistDesc: {
        hi: 'नाम और पता सुधारने में मदद',
        en: 'Help with name & address formatting'
    }
};

// Get text in both languages
export function getText(key: keyof typeof translations, lang?: Language): string {
    const item = translations[key];
    if (typeof item === 'object' && 'hi' in item && 'en' in item) {
        return lang ? item[lang] : `${item.en}\n${item.hi}`;
    }
    return '';
}

// Get bilingual text (Hindi first, English below)
export function getBilingualText(key: keyof typeof translations): { hi: string; en: string } {
    const item = translations[key];
    if (typeof item === 'object' && 'hi' in item && 'en' in item) {
        return { hi: item.hi as string, en: item.en as string };
    }
    return { hi: '', en: '' };
}
