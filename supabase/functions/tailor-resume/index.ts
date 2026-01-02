import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, resumeData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      throw new Error("Please provide a more detailed job description");
    }

    if (!resumeData) {
      throw new Error("Resume data is required");
    }

    console.log("Tailoring resume to job description, JD length:", jobDescription.length);

    const systemPrompt = `You are an expert ATS optimization specialist and professional resume writer. Your job is to tailor the provided resume to better match a specific job description while remaining truthful and professional.

Guidelines:
- Analyze the job description to identify required skills, keywords, responsibilities, and qualifications
- Rephrase and reorganize the resume to better align with the job description
- Prioritize relevant experience, skills, and projects
- Naturally incorporate important keywords from the job description
- Use strong action verbs and measurable outcomes
- Do NOT invent experience or skills - only work with what's provided
- Keep resume professional, concise, and truthful
- Maintain a one-page resume when possible
- Optimize for ATS systems

You MUST respond with a JSON object in this exact format:
{
  "tailoredResume": {
    "fullName": "Person's Full Name",
    "jobTitle": "Professional Title (tailored to target role if appropriate)",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "city, state",
    "summary": "2-3 sentence professional summary tailored to the job",
    "experiences": [
      {
        "role": "Job Title",
        "company": "Company Name",
        "duration": "Start - End",
        "bullets": ["Achievement 1 (tailored)", "Achievement 2 (tailored)"]
      }
    ],
    "education": [
      {
        "degree": "Degree Name",
        "institution": "School Name",
        "year": "Graduation Year"
      }
    ],
    "skills": ["Skill 1", "Skill 2"],
    "projects": [
      {
        "name": "Project Name",
        "description": "Brief description tailored to show relevance"
      }
    ],
    "certifications": "Relevant certifications"
  },
  "matchAnalysis": {
    "matchScore": 85,
    "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
    "missingKeywords": ["missing1", "missing2"],
    "suggestions": [
      "Consider adding experience with X if you have it",
      "Your Y experience aligns well with their requirements"
    ],
    "strengths": [
      "Strong match for required skill A",
      "Relevant experience in B"
    ]
  }
}`;

    const resumeContext = JSON.stringify(resumeData, null, 2);

    const userPrompt = `Please tailor this resume to match the following job description. Analyze the job requirements and optimize the resume accordingly while staying truthful.

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME DATA:
${resumeContext}

Return ONLY the JSON response with the tailored resume and match analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to tailor resume");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    let result;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse tailored resume data");
    }

    console.log("Successfully tailored resume, match score:", result.matchAnalysis?.matchScore);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in tailor-resume function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
