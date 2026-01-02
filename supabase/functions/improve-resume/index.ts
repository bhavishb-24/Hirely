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
    const { resumeText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Please provide more resume content to improve");
    }

    console.log("Improving resume, text length:", resumeText.length);

    const systemPrompt = `You are an expert professional resume writer and ATS optimization specialist. Your job is to transform the provided resume into a polished, ATS-friendly, professional document.

Guidelines:
- Extract and organize all information from the resume into proper sections
- Use strong action verbs (Led, Developed, Implemented, Achieved, Streamlined, etc.)
- Create impact-driven bullet points with quantifiable metrics where possible
- Keep language concise and professional
- Remove filler words and redundancy
- Fix grammar and formatting inconsistencies
- Quantify achievements where possible (numbers, percentages, dollar amounts)
- Keep content truthful and professional
- Optimize for ATS systems
- Each experience should have 2-4 impactful bullet points
- Keep the summary to 2-3 sentences maximum
- Maintain a one-page resume when possible

You MUST respond with a JSON object in this exact format:
{
  "fullName": "Person's Full Name",
  "jobTitle": "Professional Title",
  "email": "email@example.com (if found, or empty string)",
  "phone": "phone number (if found, or empty string)",
  "location": "city, state (if found, or empty string)",
  "summary": "2-3 sentence professional summary",
  "experiences": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "bullets": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "Graduation Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description of project and impact"
    }
  ],
  "certifications": "Certification 1, Certification 2 (or empty string if none)",
  "improvements": [
    "Brief description of key improvement 1",
    "Brief description of key improvement 2",
    "Brief description of key improvement 3"
  ]
}`;

    const userPrompt = `Please analyze and improve this resume. Extract all information, reorganize it professionally, and enhance the content following ATS best practices:

${resumeText}

Return ONLY the JSON response with the improved resume data and list of key improvements made.`;

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
      
      throw new Error("Failed to improve resume");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks)
    let improvedData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      improvedData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse improved resume data");
    }

    console.log("Successfully improved resume for:", improvedData.fullName);

    return new Response(JSON.stringify({ improvedResume: improvedData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in improve-resume function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
