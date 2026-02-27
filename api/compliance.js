module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const { notes } = req.body;
  if (!notes || typeof notes !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid notes field' });
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const prompt = `You are a pharmaceutical compliance expert specializing in PhRMA Code, FDA regulations, and Anti-Kickback statutes. Analyze the following pharma sales call notes and return a JSON object.

Today's date: ${today}

Call Notes:
"""
${notes}
"""

Return ONLY a valid JSON object with exactly this structure (no markdown, no extra text):
{
  "violations": [
    {
      "severity": "critical" | "high" | "medium",
      "type": "string (e.g. PhRMA Code Violation, FDA Compliance Violation, Anti-Kickback Violation, Data Integrity Violation, Documentation Violation)",
      "issue": "string — specific description of the compliance problem found in the notes",
      "recommendation": "string — specific corrective action the rep should take"
    }
  ],
  "actions": [
    {
      "priority": "urgent" | "high" | "medium" | "low",
      "category": "string (e.g. CRM, Materials, Engagement, Medical Education, Contracting, Medical Information, Clinical Evidence)",
      "action": "string — concise action title",
      "dueDate": "string — date in format 'Mon DD, YYYY' based on today (${today})",
      "notes": "string — specific detail about what to do and why"
    }
  ],
  "cleaned": {
    "callType": "string (e.g. In-Person Sales Call, Virtual Call, Phone Call)",
    "date": "${today}",
    "hcpName": "string — extracted from notes or 'HCP Name Not Captured'",
    "institution": "string — extracted from notes or 'Institution Not Captured'",
    "discussionSummary": "string — compliant rewrite of what was discussed, removing all violations",
    "productsDiscussed": "string — products mentioned, within approved indications only",
    "materialsProvided": "string — materials shared or to be shared",
    "samplesProvided": "string — compliant sample documentation statement",
    "hcpQuestions": "string — compliant summary of HCP questions and how they were addressed",
    "followUpCommitments": "string — compliant follow-up commitments made",
    "nextSteps": "string — action items for the rep",
    "complianceNotes": "string — brief compliance attestation statement"
  }
}

Rules:
- Identify ALL PhRMA Code violations (meals >$75, speaker bureau as financial incentive, off-label promotion, etc.)
- Identify ALL FDA violations (unapproved indications, off-label promotion, misrepresenting safety/efficacy)
- Identify ALL Anti-Kickback violations (improper financial arrangements, unofficial pricing)
- Identify documentation violations (samples without signatures, undocumented commitments)
- Identify data integrity violations (confirming uncertain clinical information)
- For actions: always include a CRM update action (urgent, due today). Add other actions based on what was discussed.
- For cleaned content: rewrite in compliant language, removing all violations. Extract the HCP name and institution directly from the notes.
- Return an empty array for violations if none are found.
- The actions array must have at least 1 item (CRM update).`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      return res.status(502).json({ error: 'Gemini API error', details: errText });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(502).json({ error: 'No response from Gemini' });
    }

    const parsed = JSON.parse(rawText);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Compliance API error:', err.message);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
};
