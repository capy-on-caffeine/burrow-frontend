import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 to-orange-900/20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Dive In?
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Join thousands exploring the interconnected web of human knowledge
        </p>
        
        <Link href="/signup">
          <Button 
            size="lg" 
            className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-10 py-6 h-auto"
          >
            Create Your Account
          </Button>
        </Link>
      </div>
    </section>
  );
}
