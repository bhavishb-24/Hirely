export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  responsibilities: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
  certifications: string;
}

export const sampleResumeData: ResumeData = {
  fullName: "John Smith",
  jobTitle: "Senior Software Engineer",
  summary: "Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience.",
  experiences: [
    {
      id: "1",
      role: "Software Engineer",
      company: "Tech Corp",
      duration: "2021 - Present",
      responsibilities: "Developed and maintained React applications. Led a team of 3 developers. Improved application performance by 40%."
    },
    {
      id: "2",
      role: "Junior Developer",
      company: "StartUp Inc",
      duration: "2019 - 2021",
      responsibilities: "Built features for the main product. Wrote unit tests. Participated in code reviews."
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "State University",
      year: "2019"
    }
  ],
  skills: "JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS",
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with payment integration"
    }
  ],
  certifications: "AWS Certified Developer, Google Cloud Professional"
};
