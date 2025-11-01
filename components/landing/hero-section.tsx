"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DynamicGraph } from "@/components/dynamic-graph";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <DynamicGraph />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          The Home of{" "}
          <span className="bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Rabbit Holes
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Navigate the world's knowledge as an interconnected graph. 
          Discover connections you never knew existed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-6 h-auto"
            >
              Start Exploring
            </Button>
          </Link>
          <Link href="#features">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-500 text-black hover:bg-blue-500/10 text-lg px-8 py-6 h-auto"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-slate-400" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
