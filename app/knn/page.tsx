'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

// --- Imports from Sidebar File ---
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// --- End Sidebar Imports ---

// 1. Dynamic import (from Graph File)
const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <GraphPlaceholder message="Loading Graph Engine..." />,
  }
);

// 2. Placeholder component (from Graph File)
const GraphPlaceholder = ({ message }: { message: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      color: '#aaa',
      fontFamily: 'sans-serif',
      // Added position absolute to center it within the main container
      position: 'absolute',
      top: 0,
      left: 0,
    }}
  >
    {message}
  </div>
);

// 3. Renamed component from 'ObsidianGraph' to 'Page'
export default function Page() {
  // --- All state and hooks from Graph File ---
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [highlightNodes, setHighlightNodes] = useState<Set<any>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<any>>(new Set());
  const [hoverNode, setHoverNode] = useState<any | null>(null);
  const graphRef = useRef<any>(null);

  // 5. Data fetching (from Graph File)
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    fetch('http://localhost:5000/api/graph')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setGraphData(data);
      })
      .catch((err) => {
        console.error('Failed to fetch graph data:', err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 6. Highlight handler (from Graph File)
  const linksById = React.useMemo(() => {
    const map = new Map();
    graphData.links.forEach((link) => {
      const source = graphData.nodes.find((n) => n.id === link.source);
      const target = graphData.nodes.find((n) => n.id === link.target);
      if (!source || !target) return;

      const linkWithNodes = { ...link, source, target };

      map.set(link.source, [...(map.get(link.source) || []), linkWithNodes]);
      map.set(link.target, [...(map.get(link.target) || []), linkWithNodes]);
    });
    return map;
  }, [graphData.nodes, graphData.links]);

  const handleNodeHover = useCallback(
    (node: any | null) => {
      setHoverNode(node);
      if (node) {
        const newHighlightNodes = new Set([node]);
        const newHighlightLinks = new Set();

        (linksById.get(node.id) || []).forEach((link: any) => {
          newHighlightLinks.add(link);
          newHighlightNodes.add(link.source.id === node.id ? link.target : link.source);
        });

        setHighlightNodes(newHighlightNodes);
        setHighlightLinks(newHighlightLinks);
      } else {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
      }
    },
    [linksById]
  );
  
  const handleNodeClick = useCallback(
    (node: any) => {
      console.log('Clicked Node:', node);

      // Keep the existing zoom/pan behavior
      if (graphRef.current) {
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(2, 500);
      }

      const subredditName = node.name || node.title;

      if (subredditName) {
        const url = `/feed/${encodeURIComponent(subredditName)}`;
        window.open(url, '_blank');
      } else {
        console.warn('Clicked node does not have a "name" or "title" property.');
      }
    },
    [graphRef]
  ); // Dependency [graphRef] is correct

  const handleLinkClick = useCallback(
    (link: any) => {
      console.log('Clicked Link:', link);
      const center = {
        x: (link.source.x + link.target.x) / 2,
        y: (link.source.y + link.target.y) / 2,
      };
      if (graphRef.current) {
        graphRef.current.centerAt(center.x, center.y, 1000);
        graphRef.current.zoom(2, 500);
      }
    },
    [graphRef]
  );

  const handleBackgroundClick = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  }, [graphRef]);

  // --- Combined Render ---
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-950">
        {/* --- Header --- */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-slate-300 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4 bg-slate-700" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-200">Knowledge Graph</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="relative w-full h-[calc(100vh-4rem)] bg-slate-950">
          {/* Gradient overlay for aesthetics */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none z-0"></div>
          
          {/* --- Render logic --- */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4 mx-auto"></div>
                <p className="text-slate-400 text-lg">Loading knowledge graph...</p>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 max-w-md text-center">
                <p className="text-red-400 text-lg">Error loading graph. Please try again.</p>
              </div>
            </div>
          )}
          
          {!isLoading && !isError && !graphData.nodes.length && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center max-w-md">
                <p className="text-slate-400 text-lg">No graph data available</p>
              </div>
            </div>
          )}

          {/* Render the graph only if data is ready */}
          {!isLoading && !isError && graphData.nodes.length > 0 && (
            <div className="relative z-0 w-full h-full">
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                // --- INTERACTION ---
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                onBackgroundClick={handleBackgroundClick}
                onLinkClick={handleLinkClick}
                linkHoverPrecision={4}
                // --- VISUALS ---
                nodeVal={8}
                nodeColor={(node: any) => {
                  if (highlightNodes.size === 0) {
                    return 'rgba(249, 115, 22, 0.8)'; // Orange default
                  }
                  return highlightNodes.has(node) ? 'rgba(249, 115, 22, 1)' : 'rgba(100, 116, 139, 0.3)';
                }}
                // --- LINKS ---
                linkWidth={(link: any) => (highlightLinks.has(link) ? 3 : 1)}
                linkColor={(link: any) => highlightLinks.has(link) ? 'rgba(249, 115, 22, 0.6)' : 'rgba(100, 116, 139, 0.4)'}
                linkDirectionalArrowLength={4}
                linkDirectionalArrowRelPos={1}
                // --- LABELS ---
                nodeLabel={(node: any) => node.name || node.title}
                linkLabel="label"
                backgroundColor="#020617"
              />
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
