import GraphVisualizer from "@/components/GraphVisualizer";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">🧩 Burrow Knowledge Graph</h1>
      <GraphVisualizer />
    </main>
  );
}
