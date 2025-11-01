export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Start with a Topic",
      description: "Choose any subject that interests you or search for something new.",
    },
    {
      number: "02",
      title: "Explore Connections",
      description: "Navigate through related topics via the interactive knowledge graph.",
    },
    {
      number: "03",
      title: "Contribute & Learn",
      description: "Add your insights, vote on connections, and deepen your understanding.",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Three simple steps to start your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-lg">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-linear-to-r from-orange-500/50 to-transparent transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
