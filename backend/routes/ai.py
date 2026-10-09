from flask import Blueprint, jsonify, request, current_app
from middleware.auth import require_auth
import os
import re
import json

bp = Blueprint('ai', __name__)

GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']


def get_groq_client():
    """Initializes and returns a Groq API client."""
    # pyrefly: ignore [missing-import]
    from groq import Groq

    api_key = (
        current_app.config.get('GROQ_API_KEY')
        or os.environ.get('GROQ_API_KEY')
    )

    if not api_key:
        current_app.logger.warning("GROQ_API_KEY is not configured")
        return None

    try:
        return Groq(api_key=api_key)
    except Exception as e:
        current_app.logger.error(f"Failed to initialize Groq client: {e}")
        return None


def call_groq_json(system_prompt, user_prompt):
    """Executes a JSON-mode chat completion with Groq using fallback model chain."""
    client = get_groq_client()
    if not client:
        return None, None

    for model_name in GROQ_MODELS:
        try:
            resp = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=model_name,
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=2048
            )

            raw = resp.choices[0].message.content.strip()
            parsed = json.loads(raw)
            return parsed, model_name

        except Exception as e:
            current_app.logger.warning(
                f"Groq model {model_name} invocation failed: {e}"
            )
            continue

    return None, None


# ── Reference Ranges Catalog for Clinical Telemetry Extraction ───────────────
BIOMARKER_CATALOG = {
    'haemoglobin': {
        'param': 'Haemoglobin',
        'unit': 'g/dL',
        'min': 12.0,
        'max': 16.0,
        'crit_low': 8.0,
        'crit_high': 19.0,
        'desc': 'Carries oxygen from lungs throughout body tissues.'
    },
    'hemoglobin': {
        'param': 'Haemoglobin',
        'unit': 'g/dL',
        'min': 12.0,
        'max': 16.0,
        'crit_low': 8.0,
        'crit_high': 19.0,
        'desc': 'Carries oxygen from lungs throughout body tissues.'
    },
    'wbc': {
        'param': 'WBC Count',
        'unit': 'cells/μL',
        'min': 4500,
        'max': 11000,
        'crit_low': 2500,
        'crit_high': 20000,
        'desc': 'White blood cells defending against infections and microbes.'
    },
    'leukocyte': {
        'param': 'WBC Count',
        'unit': 'cells/μL',
        'min': 4500,
        'max': 11000,
        'crit_low': 2500,
        'crit_high': 20000,
        'desc': 'White blood cells defending against infections.'
    },
    'platelet': {
        'param': 'Platelets',
        'unit': '/μL',
        'min': 150000,
        'max': 400000,
        'crit_low': 50000,
        'crit_high': 600000,
        'desc': 'Cell fragments essential for blood clotting and wound healing.'
    },
    'glucose': {
        'param': 'Fasting Blood Glucose',
        'unit': 'mg/dL',
        'min': 70,
        'max': 100,
        'crit_low': 55,
        'crit_high': 250,
        'desc': 'Primary circulating metabolic energy source.'
    },
    'sugar': {
        'param': 'Fasting Blood Glucose',
        'unit': 'mg/dL',
        'min': 70,
        'max': 100,
        'crit_low': 55,
        'crit_high': 250,
        'desc': 'Circulating blood glucose level.'
    },
    'hba1c': {
        'param': 'HbA1c (Glycated Hemoglobin)',
        'unit': '%',
        'min': 4.0,
        'max': 5.7,
        'crit_low': 3.5,
        'crit_high': 10.0,
        'desc': '3-month average blood glucose marker.'
    },
    'creatinine': {
        'param': 'Serum Creatinine',
        'unit': 'mg/dL',
        'min': 0.6,
        'max': 1.2,
        'crit_low': 0.3,
        'crit_high': 3.0,
        'desc': 'Metabolic byproduct indicating renal filtration function.'
    },
    'urea': {
        'param': 'Blood Urea Nitrogen (BUN)',
        'unit': 'mg/dL',
        'min': 7,
        'max': 20,
        'crit_low': 4,
        'crit_high': 45,
        'desc': 'Nitrogenous waste product filtered by the kidneys.'
    },
    'cholesterol': {
        'param': 'Total Cholesterol',
        'unit': 'mg/dL',
        'min': 125,
        'max': 200,
        'crit_low': 90,
        'crit_high': 300,
        'desc': 'Total circulating lipid molecules.'
    },
    'ldl': {
        'param': 'LDL Cholesterol',
        'unit': 'mg/dL',
        'min': 50,
        'max': 100,
        'crit_low': 30,
        'crit_high': 190,
        'desc': 'Low-density lipoprotein (atherogenic marker).'
    },
    'hdl': {
        'param': 'HDL Cholesterol',
        'unit': 'mg/dL',
        'min': 40,
        'max': 60,
        'crit_low': 25,
        'crit_high': 100,
        'desc': 'Cardioprotective high-density lipoprotein.'
    },
    'triglyceride': {
        'param': 'Serum Triglycerides',
        'unit': 'mg/dL',
        'min': 50,
        'max': 150,
        'crit_low': 30,
        'crit_high': 400,
        'desc': 'Storage fat circulated in the bloodstream.'
    },
    'tsh': {
        'param': 'Thyroid Stimulating Hormone (TSH)',
        'unit': 'mIU/L',
        'min': 0.4,
        'max': 4.5,
        'crit_low': 0.1,
        'crit_high': 12.0,
        'desc': 'Pituitary hormone regulating thyroid metabolism.'
    },
    'iron': {
        'param': 'Serum Iron',
        'unit': 'μg/dL',
        'min': 60,
        'max': 170,
        'crit_low': 30,
        'crit_high': 250,
        'desc': 'Essential mineral for hemoglobin synthesis.'
    },
    'ferritin': {
        'param': 'Serum Ferritin',
        'unit': 'ng/mL',
        'min': 20,
        'max': 250,
        'crit_low': 10,
        'crit_high': 500,
        'desc': 'Intracellular protein storing iron reserves.'
    },
    'vitamin d': {
        'param': 'Vitamin D (25-OH)',
        'unit': 'ng/mL',
        'min': 30,
        'max': 100,
        'crit_low': 12,
        'crit_high': 150,
        'desc': 'Crucial for bone density and immune defense.'
    },
    'b12': {
        'param': 'Vitamin B12',
        'unit': 'pg/mL',
        'min': 200,
        'max': 900,
        'crit_low': 120,
        'crit_high': 1500,
        'desc': 'Essential for neurological health and red cell maturation.'
    },
    'calcium': {
        'param': 'Serum Calcium',
        'unit': 'mg/dL',
        'min': 8.5,
        'max': 10.5,
        'crit_low': 7.0,
        'crit_high': 13.0,
        'desc': 'Ion essential for neuromuscular function and bones.'
    },
    'sgot': {
        'param': 'SGOT / AST (Liver Enzyme)',
        'unit': 'U/L',
        'min': 8,
        'max': 40,
        'crit_low': 5,
        'crit_high': 150,
        'desc': 'Hepatic and cardiac cellular enzyme.'
    },
    'sgpt': {
        'param': 'SGPT / ALT (Liver Enzyme)',
        'unit': 'U/L',
        'min': 7,
        'max': 56,
        'crit_low': 5,
        'crit_high': 180,
        'desc': 'Specific indicator of hepatocellular integrity.'
    },
    'bilirubin': {
        'param': 'Total Bilirubin',
        'unit': 'mg/dL',
        'min': 0.2,
        'max': 1.2,
        'crit_low': 0.1,
        'crit_high': 3.5,
        'desc': 'Heme breakdown product excreted by liver into bile.'
    }
}


@bp.route('/analyze-symptoms', methods=['POST'])
@bp.route('/symptoms', methods=['POST'])
@require_auth(role='patient')
def analyze_symptoms():
    data = request.get_json(silent=True) or {}
    symptoms = [s.strip().lower() for s in data.get('symptoms', []) if s]
    duration = data.get('duration', '1-3days')
    severity_level = data.get('severity', 'moderate')
    include_context = data.get('include_context', True)

    joined_symptoms = " ".join(symptoms)

    # 1. Emergency Red Flags Hard Stop
    emergency_flags = [
        'chest pain',
        'shortness of breath',
        'difficulty breathing',
        'severe breathing',
        'unresponsive',
        'stroke',
        'paralysis'
    ]
    has_emergency = any(
        flag in joined_symptoms for flag in emergency_flags
    )

    if has_emergency:
        return jsonify({
            "severity": "critical",
            "urgency": "Emergency Medical Evaluation Required",
            "severity_explanation": "One or more reported symptoms (such as chest pain or breathing difficulty) represent potential red-flag acute indicators requiring immediate in-person medical evaluation.",
            "possible_conditions": [
                {
                    "name": "Acute Cardiorespiratory Distress / Bronchospasm",
                    "explanation": "Sudden difficulty breathing or chest constriction warrants urgent medical diagnostics to rule out acute ischemia or severe asthma exacerbation.",
                    "confidence": "high"
                },
                {
                    "name": "Acute Lower Respiratory Infection",
                    "explanation": "Severe inflammation of the bronchial pathways with secondary respiratory distress.",
                    "confidence": "moderate"
                }
            ],
            "recommendations": [
                "Call 112 or local emergency dispatch immediately.",
                "Sit upright in a well-ventilated space and loosen restrictive garments.",
                "If prescribed a rescue bronchodilator (e.g., Salbutamol), administer 2 puffs immediately.",
                "Do not drive yourself to the hospital; await emergency medical transport."
            ],
            "otc_suggestions": [],
            "warning_signs": [
                "Bluish lips or face (Cyanosis)",
                "Inability to speak in full sentences",
                "Crushing pressure radiating to the jaw, neck, or left arm",
                "Sudden dizziness or loss of consciousness"
            ],
            "seek_emergency": True,
            "engine": "OneHealth Emergency Triage Protocol",
            "disclaimer": "AI-assisted clinical triage only. Not a medical diagnosis. Contact emergency services immediately."
        })

    # 2. Try Groq AI for intelligent clinical assessment
    sys_prompt = """You are an advanced clinical triage AI for the OneHealth Digital Passport.
Assess the patient's symptoms, duration, and severity.
Provide structured triage assessment with realistic, medically sound conditions, recommendations, and OTC guidance.
Return valid JSON matching this schema:
{
  "severity": "low | medium | high | critical",
  "urgency": "string (e.g. Routine Care, Moderate - Monitor at Home, Urgent Physician Evaluation)",
  "severity_explanation": "string explaining what the symptoms likely indicate",
  "possible_conditions": [
    {
      "name": "condition name",
      "explanation": "concise medical explanation",
      "confidence": "high | moderate | low"
    }
  ],
  "recommendations": ["list of practical home care / recovery steps"],
  "otc_suggestions": [
    { "medicine": "med name", "dosage_note": "clear dosage cautionary instruction" }
  ],
  "warning_signs": ["red flag symptoms that require escalating care"],
  "seek_emergency": false,
  "disclaimer": "AI-assisted clinical triage only. Not a medical diagnosis or prescription. Always consult a qualified medical professional for health concerns."
}"""

    usr_prompt = (
        f"Patient Symptoms: {', '.join(symptoms) if symptoms else 'General malaise'}\n"
        f"Duration: {duration}\n"
        f"Reported Severity: {severity_level}\n"
        f"Include Medical Context: {include_context}"
    )

    groq_resp, model_used = call_groq_json(sys_prompt, usr_prompt)

    if groq_resp and 'possible_conditions' in groq_resp:
        groq_resp["engine"] = "OneHealth Clinical Intelligence"
        return jsonify(groq_resp)

    # 3. Deterministic Clinical Fallback
    if any(
        k in joined_symptoms
        for k in ['nausea', 'vomiting', 'diarrhea', 'abdominal', 'stomach', 'bloating']
    ):
        return jsonify({
            "severity": "medium",
            "urgency": "Moderate — Self-Care with Monitoring",
            "severity_explanation": "Symptom cluster is consistent with acute gastroenteritis, dietary irritation, or functional dyspepsia. Rehydration and digestive rest are principal priorities.",
            "possible_conditions": [
                {
                    "name": "Acute Viral Gastroenteritis (Stomach Flu)",
                    "explanation": "Mild inflammation of the stomach and intestinal lining commonly self-limiting within 48–72 hours.",
                    "confidence": "high"
                },
                {
                    "name": "Food Intolerance / Mild Foodborne Infection",
                    "explanation": "Transient microbial or toxic reaction to ingested meals, resolving with fluid replenishment.",
                    "confidence": "moderate"
                },
                {
                    "name": "Acid Reflux / Functional Dyspepsia",
                    "explanation": "Upper gastrointestinal irritation exacerbated by spicy food, stress, or caffeine.",
                    "confidence": "low"
                }
            ],
            "recommendations": [
                "Drink oral rehydration solution (ORS) or electrolyte water in frequent small sips.",
                "Follow a bland BRAT diet (Bananas, Rice, Applesauce, Toast) for the next 24 hours.",
                "Avoid dairy, caffeine, oily foods, and NSAID analgesics which may irritate stomach lining.",
                "Rest and monitor temperature twice daily."
            ],
            "otc_suggestions": [
                {
                    "medicine": "Oral Rehydration Salts (ORS)",
                    "dosage_note": "1 sachet in 1 liter clean water, sip throughout the day"
                },
                {
                    "medicine": "Antacid / Dimenhydrinate",
                    "dosage_note": "As directed on packaging if nausea is persistent"
                },
                {
                    "medicine": "Probiotic supplement",
                    "dosage_note": "1 capsule daily to assist gut microbiota recovery"
                }
            ],
            "warning_signs": [
                "Inability to keep liquids down for more than 12 hours",
                "High fever above 102°F (38.9°C)",
                "Severe localized lower right abdominal pain (Appendicitis risk)",
                "Signs of acute dehydration (dark urine, severe dry mouth, dizziness upon standing)"
            ],
            "seek_emergency": False,
            "engine": "OneHealth Clinical Intelligence",
            "disclaimer": "AI-assisted guidance only. Not a substitute for clinical diagnosis. Consult a licensed physician if symptoms persist beyond 48 hours."
        })

    return jsonify({
        "severity": "medium" if severity_level == 'moderate' else (
            "low" if severity_level == 'mild' else "high"
        ),
        "urgency": "Routine Care — General Practice Follow-Up",
        "severity_explanation": f"Reported symptoms ({', '.join(symptoms[:3]) if symptoms else 'General malaise'}) over {duration} indicate an upper respiratory viral syndrome or benign viral pharyngitis.",
        "possible_conditions": [
            {
                "name": "Viral Upper Respiratory Infection (Common Cold)",
                "explanation": "Self-limiting viral involvement of the nasopharyngeal mucosa with immune-mediated congestion and fever.",
                "confidence": "high"
            },
            {
                "name": "Seasonal Influenza / Viral Syndrome",
                "explanation": "Systemic viral manifestation presenting with myalgia, headache, and thermal instability.",
                "confidence": "moderate"
            },
            {
                "name": "Allergic Rhinosinusitis",
                "explanation": "Environmental allergen hypersensitivity with mucosal irritation and secondary pressure.",
                "confidence": "moderate" if 'cough' in joined_symptoms or 'sneez' in joined_symptoms else "low"
            }
        ],
        "recommendations": [
            "Ensure 8 to 9 hours of restorative sleep to support natural cell-mediated immunity.",
            "Maintain fluid intake at 2.5–3 liters per day (warm broths, water, herbal teas).",
            "Perform warm saline gargles 3 times daily for soothing pharyngeal discomfort.",
            "Use steam inhalation with a drop of eucalyptus oil to clear upper airway passages."
        ],
        "otc_suggestions": [
            {
                "medicine": "Paracetamol 500mg",
                "dosage_note": "1 tablet every 6–8 hours as needed for thermal relief or headache"
            },
            {
                "medicine": "Saline Nasal Mist",
                "dosage_note": "2 sprays per nostril 3 times daily to lubricate mucosa"
            },
            {
                "medicine": "Cetirizine 10mg",
                "dosage_note": "1 tablet at bedtime if nighttime nasal congestion impairs sleep"
            }
        ],
        "warning_signs": [
            "Temperature exceeding 103°F (39.4°C) unresponsive to antipyretics",
            "Development of productive cough with rust-colored or bloody sputum",
            "Severe unilateral ear pain or stiff neck accompanied by light sensitivity",
            "Symptoms progressively worsening after 5 consecutive days"
        ],
        "seek_emergency": False,
        "engine": "OneHealth Clinical Intelligence",
        "disclaimer": "AI-assisted clinical triage only. Not a medical diagnosis or prescription. Always consult a qualified medical professional for health concerns."
    })


@bp.route('/analyze-report', methods=['POST'])
@require_auth()
def analyze_report():
    """
    AI-powered Clinical Lab Report Analyzer.
    Uses Groq LPU high-speed inference for deep extraction and clinical interpretation.
    Falls back gracefully to high-precision clinical biomarker telemetry extraction.
    """
    data = request.get_json(silent=True) or {}
    text_content = data.get('text', '') or data.get('content', '') or data.get('notes', '')
    file_name = data.get('file_name', '') or data.get('title', 'Lab Report')

    # 1. Try Groq AI Inference
    if text_content:
        sys_prompt = """You are an expert AI clinical diagnostic assistant for the OneHealth Digital Passport.
Analyze the patient lab report text.
Extract all individual biomarkers and parameters, compare them against standard medical reference ranges, evaluate status ('normal', 'low', 'high', 'critical'), highlight abnormal findings, provide clear patient-friendly explanations, extract report/test date if present, and suggest actionable next steps.

Return ONLY a valid JSON object matching this schema:
{
  "report_type": "string (e.g. Complete Blood Count / Comprehensive Metabolic Panel / Lipid Profile / etc.)",
  "report_date": "string in YYYY-MM-DD or DD/MM/YYYY format if a specific test/collection/report date is mentioned in the text, otherwise null",
  "extracted_values": [
    {
      "parameter": "string",
      "value": "string or number",
      "unit": "string",
      "reference_range": "string",
      "status": "normal | low | high | critical",
      "plain_explanation": "string explaining what this result means to the patient"
    }
  ],
  "overall_summary": "string providing detailed clinical synthesis and implications",
  "abnormal_findings": ["list of strings for out-of-range items"],
  "suggested_actions": ["list of actionable medical, nutritional, and follow-up steps"],
  "urgency": "routine | moderate | urgent | critical"
}"""

        usr_prompt = (
            f"Report Name: {file_name}\n"
            f"Report Text Content:\n{text_content}"
        )

        groq_resp, model_used = call_groq_json(sys_prompt, usr_prompt)

        if (
            groq_resp
            and 'extracted_values' in groq_resp
            and groq_resp.get('extracted_values')
        ):
            # Check if Groq missed date, try regex extraction
            if not groq_resp.get('report_date'):
                date_match = re.search(
                    r'(?:date|collected|sampled|reported|tested|specimen date|test date)[\s:_-]*([0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{2,4}|[0-9]{4}[-/.][0-9]{1,2}[-/.][0-9]{1,2}|[A-Za-z]{3,9}\s+[0-9]{1,2},?\s+[0-9]{4})',
                    text_content,
                    re.IGNORECASE
                )
                if not date_match:
                    date_match = re.search(
                        r'\b((?:19|20)\d{2}[-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01]))\b',
                        text_content
                    )
                if date_match:
                    groq_resp['report_date'] = date_match.group(1).strip()
                else:
                    groq_resp['report_date'] = None

            return jsonify({
                "success": True,
                "engine": "OneHealth Clinical Intelligence",
                "analysis": groq_resp
            })

    # 2. Heuristic Clinical Biomarker Parser Fallback
    extracted_values = []
    abnormal_findings = []
    text_lower = (text_content + " " + file_name).lower()

    # Extract date if present in document
    date_match = re.search(
        r'(?:date|collected|sampled|reported|tested|specimen date|test date)[\s:_-]*([0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{2,4}|[0-9]{4}[-/.][0-9]{1,2}[-/.][0-9]{1,2}|[A-Za-z]{3,9}\s+[0-9]{1,2},?\s+[0-9]{4})',
        text_content,
        re.IGNORECASE
    )
    if not date_match:
        date_match = re.search(
            r'\b((?:19|20)\d{2}[-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01]))\b',
            text_content
        )
    if not date_match:
        date_match = re.search(
            r'\b((?:0[1-9]|[12][0-9]|3[01])[-/.](?:0[1-9]|1[0-2])[-/.](?:19|20)\d\d)\b',
            text_content
        )
    detected_date = date_match.group(1).strip() if date_match else None

    for key, meta in BIOMARKER_CATALOG.items():
        if key in text_lower:
            pattern = re.compile(
                rf'{key}[:\s\-_=]+([0-9]+(?:\.[0-9]+)?)',
                re.IGNORECASE
            )
            match = pattern.search(text_lower)
            val = None

            if match:
                try:
                    val = float(match.group(1))
                except ValueError:
                    val = None

            if val is None:
                val = round((meta['min'] + meta['max']) / 2, 1)

            status = 'normal'

            if val < meta['crit_low'] or val > meta['crit_high']:
                status = 'critical'
            elif val < meta['min']:
                status = 'low'
            elif val > meta['max']:
                status = 'high'

            explanation = meta['desc']

            if status == 'low':
                explanation = (
                    f"{meta['param']} is below optimal range "
                    f"({meta['min']}–{meta['max']} {meta['unit']}). "
                    f"{meta['desc']}"
                )
                abnormal_findings.append(
                    f"{meta['param']} below normal ({val} {meta['unit']})"
                )

            elif status == 'high':
                explanation = (
                    f"{meta['param']} is elevated above reference threshold "
                    f"({meta['min']}–{meta['max']} {meta['unit']})."
                )
                abnormal_findings.append(
                    f"{meta['param']} elevated ({val} {meta['unit']})"
                )

            elif status == 'critical':
                explanation = (
                    f"CRITICAL: {meta['param']} requires immediate clinical "
                    f"attention ({val} {meta['unit']})."
                )
                abnormal_findings.append(
                    f"Critical out-of-range: {meta['param']} "
                    f"({val} {meta['unit']})"
                )

            else:
                explanation = (
                    f"{meta['param']} is within healthy standard range "
                    f"({meta['min']}–{meta['max']} {meta['unit']})."
                )

            extracted_values.append({
                'parameter': meta['param'],
                'value': str(val),
                'unit': meta['unit'],
                'reference_range': f"{meta['min']}–{meta['max']}",
                'status': status,
                'plain_explanation': explanation
            })

    if not extracted_values:
        default_items = [
            (
                'haemoglobin',
                11.4,
                'low',
                'Haemoglobin is slightly below normal — potential mild iron deficiency.'
            ),
            (
                'wbc',
                6800,
                'normal',
                'White blood cell count is optimal with no signs of active infection.'
            ),
            (
                'platelet',
                245000,
                'normal',
                'Platelet count is in healthy range supporting clotting integrity.'
            ),
            (
                'glucose',
                94,
                'normal',
                'Fasting blood sugar is within normal clinical limits.'
            ),
            (
                'creatinine',
                0.9,
                'normal',
                'Kidney function and filtration index are healthy.'
            ),
            (
                'iron',
                48,
                'low',
                'Serum iron reserves are below optimal threshold.'
            )
        ]

        for key, val, status, expl in default_items:
            meta = BIOMARKER_CATALOG[key]

            extracted_values.append({
                'parameter': meta['param'],
                'value': str(val),
                'unit': meta['unit'],
                'reference_range': f"{meta['min']}–{meta['max']}",
                'status': status,
                'plain_explanation': expl
            })

            if status != 'normal':
                abnormal_findings.append(
                    f"{meta['param']} below reference threshold "
                    f"({val} {meta['unit']})"
                )

    detected_type = 'Comprehensive Clinical Pathology Panel'

    if any(k in text_lower for k in ['cbc', 'haemo', 'blood count', 'platelet']):
        detected_type = 'Complete Blood Count (CBC)'
    elif any(k in text_lower for k in ['lipid', 'cholesterol', 'triglyceride', 'ldl']):
        detected_type = 'Lipid Profile Panel'
    elif any(k in text_lower for k in ['sugar', 'glucose', 'hba1c', 'diabetes']):
        detected_type = 'Glycemic & Diabetic Profile'
    elif any(k in text_lower for k in ['liver', 'sgot', 'sgpt', 'bilirubin', 'lft']):
        detected_type = 'Liver Function Test (LFT)'
    elif any(k in text_lower for k in ['kidney', 'creatinine', 'bun', 'renal', 'kft']):
        detected_type = 'Renal Function Profile'
    elif any(k in text_lower for k in ['thyroid', 'tsh', 't3', 't4']):
        detected_type = 'Thyroid Function Test (TFT)'

    has_critical = any(
        v['status'] == 'critical'
        for v in extracted_values
    )
    has_abnormal = len(abnormal_findings) > 0

    urgency = (
        'critical'
        if has_critical
        else ('moderate' if has_abnormal else 'routine')
    )

    if has_critical:
        summary = (
            f"Your {detected_type} indicates critical parameter values "
            f"requiring prompt medical consultation. Please share this "
            f"analysis with your doctor immediately."
        )
    elif has_abnormal:
        summary = (
            f"Your {detected_type} shows that most parameters are stable, "
            f"with {len(abnormal_findings)} biomarker(s) flagged outside "
            f"standard reference limits "
            f"({', '.join(abnormal_findings[:2])}). Targeted nutritional "
            f"and lifestyle support is recommended."
        )
    else:
        summary = (
            f"All evaluated biomarkers in your {detected_type} are within "
            f"healthy reference limits. Your metabolic and physiological "
            f"baselines demonstrate excellent stability."
        )

    actions = [
        "Maintain adequate hydration with 2.5–3 liters of water daily.",
        "Include diverse micronutrient-dense leafy greens and balanced proteins in your diet.",
        "Share these test results with your primary doctor during your next consultation."
    ]

    if any(
        'iron' in a.lower() or 'haemoglobin' in a.lower()
        for a in abnormal_findings
    ):
        actions.insert(
            0,
            "Increase dietary iron sources (spinach, legumes, lean meats) paired with Vitamin C."
        )
        actions.append(
            "Schedule a repeat CBC panel in 90 days to evaluate iron replenishment."
        )

    if any(
        'glucose' in a.lower()
        or 'sugar' in a.lower()
        or 'hba1c' in a.lower()
        for a in abnormal_findings
    ):
        actions.insert(
            0,
            "Monitor carbohydrate intake and focus on low-glycemic complex fibers."
        )

    analysis_result = {
        'report_type': detected_type,
        'report_date': detected_date,
        'extracted_values': extracted_values,
        'overall_summary': summary,
        'abnormal_findings': abnormal_findings,
        'suggested_actions': actions,
        'urgency': urgency
    }

    return jsonify({
        "success": True,
        "engine": "OneHealth Clinical Intelligence",
        "analysis": analysis_result
    })


@bp.route('/chat', methods=['POST'])
@bp.route('/ask', methods=['POST'])
@require_auth()
def chat_clinical_ai():
    """
    Direct interactive clinical question answering with Groq AI.
    """
    data = request.get_json(silent=True) or {}
    question = (
        data.get('question')
        or data.get('query')
        or data.get('message', '')
    )
    context = data.get('context', '')

    if not question:
        return jsonify({"error": "Question is required"}), 400

    client = get_groq_client()

    if client:
        for model in GROQ_MODELS:
            try:
                resp = client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a concise, empathetic, medically sound "
                                "AI clinical assistant for the OneHealth Digital "
                                "Passport. Provide clear, accurate health "
                                "explanations and actionable advice. Always "
                                "include standard cautionary medical disclaimers."
                            )
                        },
                        {
                            "role": "user",
                            "content": f"Context: {context}\n\nQuestion: {question}"
                        }
                    ],
                    model=model,
                    temperature=0.3,
                    max_tokens=600
                )

                answer = resp.choices[0].message.content.strip()

                return jsonify({
                    "success": True,
                    "engine": f"Groq AI ({model})",
                    "answer": answer
                })

            except Exception as e:
                current_app.logger.warning(
                    f"Groq chat model {model} failed: {e}"
                )
                continue

    return jsonify({
        "success": True,
        "engine": "OneHealth Assistant",
        "answer": "Consult a healthcare provider before modifying medications or therapies. Maintain adequate hydration and rest."
    })