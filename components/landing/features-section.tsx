export function FeaturesSection() {
  const features = [
    {
      title: "Graph-Based Navigation",
      description: "Explore topics through an intuitive knowledge graph that reveals hidden connections.",
      icon: "🕸️",
    },
    {
      title: "Community-Driven",
      description: "Contribute to the collective understanding by adding nodes and connections.",
      icon: "👥",
    },
    {
      title: "Discover Connections",
      description: "Find surprising relationships between seemingly unrelated topics.",
      icon: "🔗",
    },
    {
      title: "Deep Dive",
      description: "Go down rabbit holes with purpose. Track your journey through knowledge.",
      icon: "🐰",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Knowledge,{" "}
            <span className="bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A new way to explore, understand, and contribute to the world's knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
