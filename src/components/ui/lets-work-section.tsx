"use client"

import type React from "react"
import { useState } from "react"
import { ArrowUpRight, Calendar } from "lucide-react"

export function LetsWorkTogether() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsClicked(true)

    setTimeout(() => {
      setShowSuccess(true)
    }, 500)
  }

  const handleBookCall = () => {
    window.open("https://cal.com/jatin-yadav05/15min", "_blank")
  }

  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center py-20">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Success State */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700"
          style={{
            opacity: showSuccess ? 1 : 0,
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          {/* Elegant heading */}
          <div className="text-center mb-12">
            <span className="text-muted-foreground text-sm tracking-widest uppercase mb-4 block">
              Perfect
            </span>
            <h2 className="text-4xl md:text-6xl font-light text-foreground">
              Let's talk
            </h2>
          </div>

          {/* Book a call button */}
          <button
            onClick={handleBookCall}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative flex items-center gap-4 transition-all duration-500 cursor-pointer"
            style={{
              transform: showSuccess
                ? isButtonHovered
                  ? "translateY(0) scale(1.02)"
                  : "translateY(0) scale(1)"
                : "translateY(15px) scale(1)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "150ms",
            }}
          >
            {/* Left line */}
            <div className="w-16 h-px bg-border group-hover:w-24 transition-all duration-300" />

            {/* Button content */}
            <div className="flex items-center gap-3 px-6 py-3 border border-border rounded-full hover:bg-accent transition-colors duration-300">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                Book a call
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>

            {/* Right line */}
            <div className="w-16 h-px bg-border group-hover:w-24 transition-all duration-300" />
          </button>

          {/* Subtle subtext */}
          <p className="text-muted-foreground text-sm mt-6 tracking-wide">
            15 min intro call
          </p>
        </div>

        {/* Availability Badge */}
        <div
          className="absolute top-8 right-8 flex items-center gap-2"
          style={{
            opacity: showSuccess ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <span className="text-muted-foreground text-sm">
            Available for projects
          </span>
        </div>

        {/* Main Interactive Element */}
        <div
          className="relative cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => handleClick(e as unknown as React.MouseEvent)}
          style={{
            pointerEvents: isClicked ? "none" : "auto",
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "scale(0.95)" : "scale(1)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="relative overflow-hidden">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-foreground tracking-tight text-center">
                  <span className="block">Let's work</span>
                </h1>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-foreground tracking-tight text-center">
                  <span className="block">together</span>
                </h1>
              </div>

              {/* Animated Arrow */}
              <div
                className="mt-8 flex items-center justify-center"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.4s ease",
                }}
              >
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="ml-3 text-muted-foreground">Click to continue</span>
              </div>
            </div>

            {/* Decorative gradient lines */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-border to-transparent"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s ease",
              }}
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-px bg-gradient-to-l from-transparent via-border to-transparent"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          style={{
            opacity: showSuccess ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-2">
            Have a project in mind? I'd love to hear about it. Let's create something exceptional together.
          </p>
          <span className="text-foreground font-medium">hello@example.com</span>
        </div>
      </div>
    </section>
  )
}
