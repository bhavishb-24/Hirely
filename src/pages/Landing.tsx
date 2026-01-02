import { Link } from "react-router-dom";
import { ArrowRight, FileText, Wand2, Target, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const features = [
    {
      icon: FileText,
      title: "Build New Resume",
      description: "Start fresh with our guided form. Fill in your details and let AI craft compelling, impact-driven content."
    },
    {
      icon: Wand2,
      title: "Improve Existing Resume",
      description: "Paste your current resume and watch AI transform it into a polished, ATS-optimized document."
    },
    {
      icon: Target,
      title: "Job Description Matching",
      description: "Tailor your resume to specific job postings. Get a match score and keyword optimization."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Enter your details",
      description: "Fill in your experience, skills, and education — or paste your existing resume."
    },
    {
      number: "02",
      title: "AI enhancement",
      description: "Our AI rewrites your content with strong action verbs and measurable achievements."
    },
    {
      number: "03",
      title: "Choose & download",
      description: "Pick from premium themes and download your polished, ATS-ready resume as PDF."
    }
  ];

  const benefits = [
    "ATS-optimized formatting",
    "AI-powered content enhancement",
    "Tailored to job descriptions",
    "8 premium design themes",
    "Instant PDF download",
    "Easy inline editing"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container-apple">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <FileText className="w-4 h-4 text-background" />
              </div>
              <span className="font-semibold text-foreground">Resume AI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/auth?mode=login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="rounded-full px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-apple text-center">
          <h1 className="text-display animate-fade-in-up">
            Build a resume that<br />
            <span className="text-muted-foreground">gets you hired.</span>
          </h1>
          <p className="mt-6 text-body-large max-w-2xl mx-auto animate-fade-in-delay-1">
            Create professional, ATS-optimized resumes in minutes. 
            Let AI enhance your experience with powerful language that stands out.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-apple hover-lift">
                Create My Resume
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base hover-lift">
                Improve My Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 bg-surface">
        <div className="container-apple">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-headline">Everything you need to land your dream job</h2>
            <p className="mt-4 text-body-large max-w-xl mx-auto">
              Three powerful tools designed to make your resume shine.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`p-8 rounded-2xl bg-card shadow-apple hover-lift animate-fade-in-delay-${index + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-title mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface">
        <div className="container-apple">
          <div className="text-center mb-16">
            <h2 className="text-headline">How it works</h2>
            <p className="mt-4 text-body-large max-w-xl mx-auto">
              Three simple steps to your perfect resume.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center">
                <div className="text-6xl font-semibold text-border mb-6">{step.number}</div>
                <h3 className="text-title mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container-apple">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-headline">Why choose Resume AI?</h2>
            <p className="mt-4 text-body-large">
              We combine the power of AI with professional resume writing best practices.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container-apple text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-6 opacity-80" />
          <h2 className="text-headline text-background">Ready to stand out?</h2>
          <p className="mt-4 text-lg text-background/70 max-w-xl mx-auto">
            Join thousands of professionals who've landed their dream jobs with Resume AI.
          </p>
          <Link to="/auth?mode=signup">
            <Button 
              size="lg" 
              className="mt-10 rounded-full px-8 h-12 text-base bg-background text-foreground hover:bg-background/90 hover-lift"
            >
              Get started for free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container-apple">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
                <FileText className="w-3 h-3 text-background" />
              </div>
              <span className="text-sm text-muted-foreground">© 2025 Resume AI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
