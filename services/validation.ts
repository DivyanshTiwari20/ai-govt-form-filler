/**
 * Validation Service
 * Real-time field validation for Aadhaar forms
 */

import { translations } from './i18n';

export interface ValidationResult {
    isValid: boolean;
    error?: {
        hi: string;
        en: string;
    };
}

// Check if name is in capital letters only
export function validateName(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
        return { isValid: true }; // Empty is handled by required check
    }

    // Check for numbers
    if (/\d/.test(value)) {
        return {
            isValid: false,
            error: translations.validation.noNumbers
        };
    }

    // Check for special characters (allow spaces and dots only)
    if (/[^A-Za-z\s.]/.test(value)) {
        return {
            isValid: false,
            error: translations.validation.noSpecialChars
        };
    }

    // Check for lowercase letters
    if (/[a-z]/.test(value)) {
        return {
            isValid: false,
            error: translations.validation.capitalLettersOnly
        };
    }

    // Check for initials (single letter followed by dot)
    if (/^[A-Z]\.\s*[A-Z]/.test(value) || /^[A-Z]\s+[A-Z]\./.test(value)) {
        return {
            isValid: false,
            error: translations.validation.initialsNotAllowed
        };
    }

    // Check if name is too short (less than 3 chars excluding spaces)
    const nameWithoutSpaces = value.replace(/\s/g, '');
    if (nameWithoutSpaces.length < 3) {
        return {
            isValid: false,
            error: translations.validation.tooShort
        };
    }

    return { isValid: true };
}

// Validate date format DD/MM/YYYY
export function validateDate(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
        return { isValid: true };
    }

    // Check format
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dateRegex);

    if (!match) {
        return {
            isValid: false,
            error: translations.validation.invalidDate
        };
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Check valid ranges
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return {
            isValid: false,
            error: translations.validation.invalidDate
        };
    }

    // Check for future date
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
        return {
            isValid: false,
            error: translations.validation.futureDate
        };
    }

    return { isValid: true };
}

// Validate mobile number (Indian format)
export function validateMobile(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
        return { isValid: true };
    }

    // Remove spaces and dashes
    const cleaned = value.replace(/[\s-]/g, '');

    // Check if 10 digits starting with 6-9
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
        return {
            isValid: false,
            error: translations.validation.invalidMobile
        };
    }

    return { isValid: true };
}

// Validate PIN code
export function validatePincode(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
        return { isValid: true };
    }

    // Check if 6 digits
    if (!/^\d{6}$/.test(value)) {
        return {
            isValid: false,
            error: translations.validation.invalidPincode
        };
    }

    return { isValid: true };
}

// Validate age
export function validateAge(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
        return { isValid: true };
    }

    const age = parseInt(value, 10);
    if (isNaN(age) || age < 0 || age > 150) {
        return {
            isValid: false,
            error: {
                hi: 'सही उम्र लिखें',
                en: 'Enter valid age'
            }
        };
    }

    return { isValid: true };
}

// Get validator for field type
export function getValidator(fieldId: string): (value: string) => ValidationResult {
    // Name fields
    if (fieldId.includes('name') || fieldId === 'care_of') {
        return validateName;
    }

    // Date fields
    if (fieldId.includes('date') || fieldId === 'date_of_birth') {
        return validateDate;
    }

    // Mobile
    if (fieldId === 'mobile') {
        return validateMobile;
    }

    // Pincode
    if (fieldId === 'pincode') {
        return validatePincode;
    }

    // Age
    if (fieldId === 'age') {
        return validateAge;
    }

    // Default: no validation
    return () => ({ isValid: true });
}

// Calculate form readiness score (0-100)
export function calculateReadinessScore(
    formData: Record<string, string>,
    fields: { id: string; required?: boolean }[]
): { score: number; issues: string[] } {
    let totalPoints = 0;
    let earnedPoints = 0;
    const issues: string[] = [];

    fields.forEach(field => {
        const value = formData[field.id] || '';
        const points = field.required ? 10 : 5;
        totalPoints += points;

        if (value.trim().length === 0) {
            if (field.required) {
                issues.push(`Missing: ${field.id}`);
            }
            return;
        }

        // Validate the field
        const validator = getValidator(field.id);
        const result = validator(value);

        if (result.isValid) {
            earnedPoints += points;
        } else {
            issues.push(`Invalid: ${field.id}`);
            earnedPoints += points * 0.3; // Partial credit for attempting
        }

        // Bonus for capital letters in name fields
        if (field.id.includes('name') || field.id === 'care_of') {
            if (value === value.toUpperCase()) {
                earnedPoints += 2;
                totalPoints += 2;
            } else {
                totalPoints += 2;
                issues.push('Names should be in CAPITAL letters');
            }
        }
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    return { score: Math.min(score, 100), issues: [...new Set(issues)] };
}

// Auto-format name to uppercase
export function formatName(value: string): string {
    return value.toUpperCase();
}

// Auto-format date
export function formatDate(value: string): string {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) {
        return digits;
    } else if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
}

// Auto-format mobile
export function formatMobile(value: string): string {
    return value.replace(/\D/g, '').slice(0, 10);
}
