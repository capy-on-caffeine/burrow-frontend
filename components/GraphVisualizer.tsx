"use client";
import { useEffect, useRef } from "react";

type NeovisConfig = {
  containerId: string;
  serverUrl: string;
  serverUser: string;
  serverPassword: string;
  database?: string;
  labels?: Record<string, unknown>;
  relationships?: Record<string, unknown>;
  initialCypher?: string;
  // driverConfig is supported by neovis for flags like encryption
  driverConfig?: Record<string, unknown>;
};

export default function GraphVisualizer() {
  const visRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || !visRef.current) return;
    startedRef.current = true;

    (async () => {
      const { default: NeoVis } = await import("neovis.js");

      const config: NeovisConfig = {
        containerId: "burrow-graph",
        serverUrl:
          process.env.NEXT_PUBLIC_NEO4J_URI ?? "bolt://localhost:7687",
        serverUser:
          process.env.NEXT_PUBLIC_NEO4J_USER ?? "neo4j",
        serverPassword:
          process.env.NEXT_PUBLIC_NEO4J_PASSWORD ?? "hackonhills",
        database:
          process.env.NEXT_PUBLIC_NEO4J_DB ?? "neo4j",

        // If you’re on local Desktop without TLS, keep encryption off.
        // If on Aura, REMOVE this and use neo4j+s plus Aura creds.
        driverConfig: { encrypted: "ENCRYPTION_OFF" },

        labels: {
          Topic: { caption: "title", color: "#00aaff", size: "pagerank", community: "community" },
          Keyword: { caption: "name", color: "#ffcc00", size: 10 },
        },
        relationships: {
          TAGGED_WITH: { color: "#ffaa00", width: 2 },
          RELATED_TO: { color: "#999999", width: 1 },
        },
        initialCypher: `
          MATCH (t:Topic)-[r]->(n)
          RETURN t, r, n
          LIMIT 150
        `,
      };

      const viz: any = new (NeoVis as any)(config);

      viz?.registerOnEvent?.("completed", () => {
        console.log("✅ Graph rendered successfully!");
      });
      viz?.registerOnEvent?.("error", (e: any) => {
        console.error("Neovis error:", e?.error || e);
      });

      try {
        viz.render();
      } catch (err: any) {
        // Neo4j driver attaches a code
        console.error("Neo4j render failed:", err?.code, err?.message);
      }

      return () => { try { viz.clearNetwork?.(); } catch {} };
    })();
  }, []);

  return (
    <div id="burrow-graph" ref={visRef} className="w-full h-[80vh] rounded-xl shadow-md border border-gray-300" />
  );
}
