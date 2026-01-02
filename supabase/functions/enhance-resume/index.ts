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
    const { resumeData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Enhancing resume for:", resumeData.fullName);

    const systemPrompt = `You are an expert professional resume writer. Your job is to transform the provided resume information into polished, ATS-friendly content.

Guidelines:
- Use strong action verbs (Led, Developed, Implemented, Achieved, Streamlined, etc.)
- Create impact-driven bullet points with quantifiable metrics where possible
- Keep language concise and professional
- Remove fluff and repetition
- Optimize for ATS systems
- Each experience should have 2-4 impactful bullet points
- Keep the summary to 2-3 sentences maximum
- Enhance project descriptions to highlight technical skills and outcomes

Respond with a JSON object in this exact format:
{
  "summary": "Enhanced professional summary",
  "experiences": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Duration",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Enhanced project description"
    }
  ]
}`;

    const userPrompt = `Please enhance this resume content:

Full Name: ${resumeData.fullName}
Job Title: ${resumeData.jobTitle}

Professional Summary: ${resumeData.summary || "No summary provided"}

Work Experience:
${resumeData.experiences.map((exp: any) => `
Role: ${exp.role}
Company: ${exp.company}
Duration: ${exp.duration}
Responsibilities: ${exp.responsibilities}
`).join("\n")}

Projects:
${resumeData.projects.map((proj: any) => `
Name: ${proj.name}
Description: ${proj.description}
`).join("\n")}

Please enhance this content following the guidelines and return ONLY the JSON response.`;

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
      
      throw new Error("Failed to enhance resume");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    // Extract JSON from the response (handle markdown code blocks)
    let enhancedData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      enhancedData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse enhanced resume data");
    }

    console.log("Successfully enhanced resume");

    // Build the final enhanced resume
    const enhancedResume = {
      fullName: resumeData.fullName,
      jobTitle: resumeData.jobTitle,
      summary: enhancedData.summary || resumeData.summary,
      experiences: enhancedData.experiences || resumeData.experiences.map((exp: any) => ({
        role: exp.role,
        company: exp.company,
        duration: exp.duration,
        bullets: exp.responsibilities.split(".").filter((s: string) => s.trim())
      })),
      education: resumeData.education,
      skills: resumeData.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      projects: enhancedData.projects || resumeData.projects,
      certifications: resumeData.certifications
    };

    return new Response(JSON.stringify({ enhancedResume }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in enhance-resume function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
