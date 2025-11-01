import GraphVisualizer from "@/components/GraphVisualizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            🧩 Burrow Knowledge Graph
          </h1>
          <p className="text-slate-400 text-lg">Visualize connections across the knowledge universe</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <GraphVisualizer />
        </div>
      </div>
    </main>
  );
}
