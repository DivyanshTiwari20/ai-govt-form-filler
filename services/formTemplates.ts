/**
 * Aadhaar Form HTML Template
 * Exact replica of the official UIDAI Aadhaar Enrolment/Correction Form
 */

export function generateAadhaarFormHTML(data: Record<string, string>): string {
    // Helper to get checked state
    const isChecked = (field: string, value: string) => data[field] === value;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif;
            background: #fff;
            padding: 5px;
            font-size: 9px;
            line-height: 1.3;
        }
        .form {
            border: 1px solid #000;
            max-width: 100%;
            background: #fff;
        }
        .header {
            display: flex;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid #000;
        }
        .logo {
            width: 50px;
            margin-right: 10px;
        }
        .logo-circle {
            width: 45px;
            height: 45px;
            border: 2px solid #e65100;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            font-size: 6px;
            color: #e65100;
            font-weight: bold;
        }
        .header-text {
            flex: 1;
            text-align: center;
        }
        .header-hindi {
            font-size: 8px;
            color: #333;
        }
        .header-title {
            font-size: 12px;
            font-weight: bold;
            color: #000;
            margin: 3px 0;
        }
        .header-note {
            font-size: 7px;
            color: #333;
        }
        .uidai-logo {
            width: 50px;
            text-align: center;
        }
        .uidai-box {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #e65100, #ff8a00);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
        }
        .instruction {
            background: #fff9c4;
            padding: 4px 8px;
            font-size: 8px;
            font-style: italic;
            border-bottom: 1px solid #000;
        }
        .row {
            display: flex;
            border-bottom: 1px solid #000;
        }
        .row:last-child {
            border-bottom: none;
        }
        .cell {
            padding: 4px 6px;
            border-right: 1px solid #000;
            min-height: 22px;
        }
        .cell:last-child {
            border-right: none;
        }
        .cell-label {
            font-size: 7px;
            color: #333;
        }
        .cell-value {
            font-size: 10px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            color: #000;
            min-height: 12px;
            background: #fffde7;
            padding: 2px 4px;
            margin-top: 2px;
        }
        .cell-num {
            width: 18px;
            text-align: center;
            font-weight: bold;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
        }
        .checkbox-group {
            display: flex;
            gap: 6px;
            align-items: center;
            flex-wrap: wrap;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 2px;
            font-size: 8px;
        }
        .checkbox {
            width: 10px;
            height: 10px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
        }
        .checkbox.checked {
            background: #000;
            color: #fff;
        }
        .section-header {
            background: #e0e0e0;
            padding: 3px 6px;
            font-weight: bold;
            font-size: 8px;
            border-bottom: 1px solid #000;
        }
        .half { flex: 1; }
        .third { flex: 0.33; }
        .quarter { flex: 0.25; }
        .small { flex: 0.2; }
        .signature-box {
            height: 30px;
            border-bottom: 1px solid #000;
            margin: 5px 0;
        }
        .footer {
            background: #4caf50;
            color: white;
            padding: 4px;
            text-align: center;
            font-size: 8px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="form">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-circle">
                    भारत सरकार<br>सत्यमेव जयते
                </div>
            </div>
            <div class="header-text">
                <div class="header-hindi">भारतीय विशिष्ट पहचान प्राधिकरण</div>
                <div class="header-title">AADHAAR ENROLMENT / CORRECTION FORM</div>
                <div class="header-note">Aadhaar Enrolment is free and voluntary. Correction within 96 hours is also free.</div>
            </div>
            <div class="uidai-logo">
                <div class="uidai-box">आधार<br>uidai</div>
            </div>
        </div>

        <div class="instruction">
            Please follow the instructions overleaf while filling up the form. Use capital letters only.
        </div>

        <!-- Row 1-2: Pre-Enrolment ID & NPR -->
        <div class="row">
            <div class="cell cell-num">1</div>
            <div class="cell half">
                <div class="cell-label">Pre-Enrolment ID :</div>
                <div class="cell-value">${data.pre_enrolment_id || '-'}</div>
            </div>
            <div class="cell cell-num">2</div>
            <div class="cell half">
                <div class="cell-label">NPR Receipt/TIN Number :</div>
                <div class="cell-value">${data.npr_tin || '-'}</div>
            </div>
        </div>

        <!-- Row 3: Full Name -->
        <div class="row">
            <div class="cell cell-num">3</div>
            <div class="cell" style="flex: 1;">
                <div class="cell-label">Full Name:</div>
                <div class="cell-value">${(data.full_name || '').toUpperCase()}</div>
            </div>
        </div>

        <!-- Row 4-5: Gender & DOB -->
        <div class="row">
            <div class="cell cell-num">4</div>
            <div class="cell half">
                <div class="cell-label">Gender:</div>
                <div class="checkbox-group" style="margin-top: 3px;">
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('gender', 'Male') ? 'checked' : ''}">${isChecked('gender', 'Male') ? '✓' : ''}</div>
                        <span>Male</span>
                    </div>
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('gender', 'Female') ? 'checked' : ''}">${isChecked('gender', 'Female') ? '✓' : ''}</div>
                        <span>Female</span>
                    </div>
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('gender', 'Transgender') ? 'checked' : ''}">${isChecked('gender', 'Transgender') ? '✓' : ''}</div>
                        <span>Trans</span>
                    </div>
                </div>
            </div>
            <div class="cell cell-num">5</div>
            <div class="cell small">
                <div class="cell-label">Age:</div>
                <div class="cell-value">${data.age || ''}</div>
            </div>
            <div class="cell quarter">
                <div class="cell-label">Date of Birth:</div>
                <div class="cell-value">${data.date_of_birth || ''}</div>
            </div>
            <div class="cell small">
                <div class="checkbox-group" style="flex-direction: column; align-items: flex-start;">
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('dob_type', 'Declared') ? 'checked' : ''}">${isChecked('dob_type', 'Declared') ? '✓' : ''}</div>
                        <span>Declared</span>
                    </div>
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('dob_type', 'Verified') ? 'checked' : ''}">${isChecked('dob_type', 'Verified') ? '✓' : ''}</div>
                        <span>Verified</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 6: Address -->
        <div class="row">
            <div class="cell cell-num">6</div>
            <div class="cell" style="flex: 1;">
                <div class="cell-label">Address: C/o ( ) D/o ( ) S/o ( ) W/o ( ) H/o ( )</div>
                <div class="cell-value">${(data.care_of || '').toUpperCase()}</div>
            </div>
        </div>

        <div class="row">
            <div class="cell half">
                <div class="cell-label">House No/ Bldg./Apt.</div>
                <div class="cell-value">${(data.house_no || '').toUpperCase()}</div>
            </div>
            <div class="cell half">
                <div class="cell-label">Street/Road/Lane</div>
                <div class="cell-value">${(data.street || '').toUpperCase()}</div>
            </div>
        </div>

        <div class="row">
            <div class="cell half">
                <div class="cell-label">Landmark</div>
                <div class="cell-value">${(data.landmark || '').toUpperCase()}</div>
            </div>
            <div class="cell half">
                <div class="cell-label">Area/locality/sector</div>
                <div class="cell-value">${(data.area || '').toUpperCase()}</div>
            </div>
        </div>

        <div class="row">
            <div class="cell half">
                <div class="cell-label">Village/Town/City</div>
                <div class="cell-value">${(data.village_city || '').toUpperCase()}</div>
            </div>
            <div class="cell half">
                <div class="cell-label">Post Office</div>
                <div class="cell-value">${(data.post_office || '').toUpperCase()}</div>
            </div>
        </div>

        <div class="row">
            <div class="cell third">
                <div class="cell-label">District</div>
                <div class="cell-value">${(data.district || '').toUpperCase()}</div>
            </div>
            <div class="cell third">
                <div class="cell-label">Sub-District</div>
                <div class="cell-value">${(data.sub_district || '').toUpperCase()}</div>
            </div>
            <div class="cell third">
                <div class="cell-label">State</div>
                <div class="cell-value">${(data.state || '').toUpperCase()}</div>
            </div>
        </div>

        <div class="row">
            <div class="cell third">
                <div class="cell-label">E Mail</div>
                <div class="cell-value">${data.email || ''}</div>
            </div>
            <div class="cell third">
                <div class="cell-label">Mobile No</div>
                <div class="cell-value">${data.mobile || ''}</div>
            </div>
            <div class="cell third">
                <div class="cell-label">PIN CODE</div>
                <div class="cell-value">${data.pincode || ''}</div>
            </div>
        </div>

        <!-- Row 7: Relative Details -->
        <div class="row">
            <div class="cell cell-num">7</div>
            <div class="cell" style="flex: 1;">
                <div class="cell-label">Details of : Father ( ) Mother ( ) Guardian ( ) Husband ( ) Wife ( )</div>
                <div class="cell-value">${(data.relative_name || '').toUpperCase()}</div>
                <div class="cell-label" style="margin-top: 3px;">EID/ Aadhaar No.:</div>
                <div class="cell-value">${data.relative_aadhaar || ''}</div>
            </div>
        </div>

        <!-- Row 8: UIDAI Consent -->
        <div class="row">
            <div class="cell cell-num">8</div>
            <div class="cell" style="flex: 1;">
                <div class="cell-label">I have no objection to UIDAI sharing information provided by me with agencies engaged in delivery of welfare services.</div>
                <div class="checkbox-group" style="margin-top: 3px;">
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('uidai_consent', 'Yes') ? 'checked' : ''}">${isChecked('uidai_consent', 'Yes') ? '✓' : ''}</div>
                        <span>YES</span>
                    </div>
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('uidai_consent', 'No') ? 'checked' : ''}">${isChecked('uidai_consent', 'No') ? '✓' : ''}</div>
                        <span>NO</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 9: Bank Linking -->
        <div class="row">
            <div class="cell cell-num">9</div>
            <div class="cell" style="flex: 1;">
                <div class="cell-label">I want the UIDAI to facilitate opening of a new Bank/Post Office Account linked to my Aadhaar Number.</div>
                <div class="checkbox-group" style="margin-top: 3px;">
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('bank_linking', 'Yes') ? 'checked' : ''}">${isChecked('bank_linking', 'Yes') ? '✓' : ''}</div>
                        <span>YES</span>
                    </div>
                    <div class="checkbox-item">
                        <div class="checkbox ${isChecked('bank_linking', 'No') ? 'checked' : ''}">${isChecked('bank_linking', 'No') ? '✓' : ''}</div>
                        <span>NO</span>
                    </div>
                </div>
                ${data.bank_name ? `<div class="cell-label" style="margin-top: 3px;">Bank Name: <span class="cell-value" style="display: inline;">${data.bank_name}</span></div>` : ''}
            </div>
        </div>

        <!-- Row 10: For Document Based -->
        <div class="row">
            <div class="cell cell-num">10</div>
            <div class="cell" style="flex: 1;">
                <div class="section-header">For Document Based (Write Names of the documents produced)</div>
                <div style="display: flex; margin-top: 4px;">
                    <div style="flex: 1; padding-right: 5px;">
                        <div class="cell-label">a. POI (Proof of Identity)</div>
                        <div class="cell-value">${(data.poi_document || '').toUpperCase()}</div>
                    </div>
                    <div style="flex: 1; padding-left: 5px;">
                        <div class="cell-label">b. POA (Proof of Address)</div>
                        <div class="cell-value">${(data.poa_document || '').toUpperCase()}</div>
                    </div>
                </div>
                <div style="display: flex; margin-top: 4px;">
                    <div style="flex: 1; padding-right: 5px;">
                        <div class="cell-label">c. DOB (Date of Birth proof)</div>
                        <div class="cell-value">${(data.dob_document || '').toUpperCase()}</div>
                    </div>
                    <div style="flex: 1; padding-left: 5px;">
                        <div class="cell-label">d. POR (Proof of Relationship)</div>
                        <div class="cell-value">${(data.por_document || '').toUpperCase()}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Consent Section -->
        <div class="row">
            <div class="cell" style="flex: 1;">
                <div class="section-header">Consent / Declaration</div>
                <div style="font-size: 7px; padding: 4px;">
                    I confirm that information (including biometrics) provided by me to the UIDAI and the information contained herein is my own and is true, correct and accurate.
                </div>
                <div style="display: flex; justify-content: flex-end; padding: 5px 10px;">
                    <div style="text-align: center;">
                        <div class="signature-box" style="width: 120px;"></div>
                        <div style="font-size: 7px; font-weight: bold;">Applicant's Signature/Thumbprint</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            ✓ FILLED BY FORM FILLER APP | For Reference Only
        </div>
    </div>
</body>
</html>`;
}

// Get the form HTML based on type
export function getFormHTML(formType: string, data: Record<string, string>, formName: string): string {
    switch (formType) {
        case 'aadhaar':
            return generateAadhaarFormHTML(data);
        default:
            return generateAadhaarFormHTML(data);
    }
}
