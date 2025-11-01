// components/ObsidianGraph.js (UPDATED)

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 1. Dynamic import (same as before, with the .default fix)
const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading graph...</p>,
  }
);

export default function ObsidianGraph() {
  
  // 2. Use state to hold the graph data
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  // 3. Use useEffect to fetch data when the component mounts
  useEffect(() => {
    // Fetch data from your new backend API
    fetch('http://localhost:3001/api/graph') // <-- Your backend URL
      .then((res) => res.json())
      .then((data) => {
        setGraphData(data); // Set the data in state
      })
      .catch((err) => console.error('Failed to fetch graph data:', err));
  }, []); // The empty array [] means this runs only once

  if (!ForceGraph2D) {
    return <p>Loading graph...</p>;
  }

  return (
    <ForceGraph2D
      graphData={graphData} // <-- Pass the state data to the graph
      
      // --- Styling & Interaction ---
      // Use the 'name' or 'title' property from your nodes as the label
      nodeLabel={(node) => node.name || node.title}
      nodeAutoColorBy="label" // Color nodes by their label (e.g., Person, Movie)
      
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      linkLabel="label" // Show the relationship type on hover
    />
  );
}