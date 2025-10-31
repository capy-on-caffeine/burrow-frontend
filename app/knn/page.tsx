"use client"
import React, { useState, useRef } from 'react';
import {
  Box,
  Search,
  Settings,
  ChevronsLeft,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  HelpCircle,
  User,
  Menu,
  Bookmark,
  Share,
  MessageCircle,
  ArrowDown,
  ArrowUp, 
} from 'lucide-react';

interface PostProps {
  subreddit: string;
  author: string;
  timeAgo: string;
  title: string;
  body: string | null; 
  initialVotes: number;
  comments: number;
}

interface Node {
  id: string;
  label: string;
  x: number; 
  y: number; 
  highlighted?: boolean;
}

interface Edge {
  source: string;
  target: string;
}

const initialGraphNodes: Node[] = [
  { id: 'settings', label: 'Settings', x: 30, y: 15 },
  { id: 'about', label: 'About Game', x: 45, y: 25 },
  { id: 'main-level', label: 'Main Level', x: 65, y: 20 },
  { id: 'continue', label: 'Continue Game', x: 55, y: 45 },
  { id: 'dream-one', label: 'Dream One', x: 40, y: 55 },
  { id: 'main-menu', label: 'Main Menu', x: 30, y: 80, highlighted: true },
  { id: 'lab-level', label: 'Lab Level', x: 50, y: 75 },
  { id: 'dream-two', label: 'Dream Two', x: 70, y: 65 },
  { id: 'exit-game', label: 'Exit Game', x: 60, y: 90 },
  { id: 'tunnel-level', label: 'Tunnel Level', x: 85, y: 50 },
];

const graphEdges: Edge[] = [
  { source: 'settings', target: 'main-level' },
  { source: 'settings', target: 'dream-one' },
  { source: 'settings', target: 'main-menu' },
  { source: 'about', target: 'continue' },
  { source: 'main-level', target: 'about' },
  { source: 'main-level', target: 'continue' },
  { source: 'main-level', target: 'dream-two' },
  { source: 'main-level', target: 'tunnel-level' },
  { source: 'continue', target: 'main-menu' },
  { source: 'dream-one', target: 'main-menu' },
  { source: 'dream-one', target: 'lab-level' },
  { source: 'main-menu', target: 'settings' },
  { source: 'main-menu', target: 'exit-game' },
  { source: 'lab-level', target: 'dream-two' },
  { source: 'lab-level', target: 'exit-game' },
  { source: 'dream-two', target: 'exit-game' },
  { source: 'tunnel-level', target: 'exit-game' },
];

const IconButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel: string;
}> = ({ children, onClick, className = '', ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
  >
    {children}
  </button>
);

const LeftSidebar: React.FC<{ onToggle: () => void; show: boolean }> = ({
  onToggle,
  show,
}) => {
  
  // Post data is now defined inside the sidebar
  const post1: PostProps = {
    subreddit: 'reactjs',
    author: 'dev_user',
    timeAgo: '2h ago',
    title: 'Post UI with Tailwind',
    body: 'This post is now inside the sidebar!',
    initialVotes: 1200,
    comments: 84,
  };
  
  const post2: PostProps = {
    subreddit: 'typescript',
    author: 'type_safe',
    timeAgo: '5h ago',
    title: 'Interfaces vs Types',
    body: 'A great debate.',
    initialVotes: 452,
    comments: 102,
  };
  
  const post3: PostProps = {
    subreddit: 'tailwindcss',
    author: 'utility_first',
    timeAgo: '1d ago',
    title: 'Post with no body.',
    body: null,
    initialVotes: 78,
    comments: 12,
  };

  return (
    <nav
      className={`w-[50%] bg-[#2a2a2a] text-gray-300 flex flex-col h-full absolute top-0 left-0 z-20 transition-transform transform ${
        show ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:z-auto shrink-0`} 
    >
      <div className="p-2.5 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Box size={16} />
          <Search size={16} />
        </div>
        <ChevronsLeft
          size={16}
          className="cursor-pointer"
          onClick={onToggle}
        />
      </div>

      {/* This div now scrolls the PostCard components */}
      <div className="flex-1 p-2.5 overflow-y-auto space-y-4">
        
        {/* Posts are rendered here instead of 'items' */}
        <PostCard {...post1} />
        <PostCard {...post2} />
        <PostCard {...post3} />

      </div>

      <div className="p-2.5 border-t border-gray-700 flex flex-col items-center gap-4">
        <HelpCircle size={20} className="cursor-pointer" />
        <User size={20} className="cursor-pointer" />
      </div>
      {/* <Sidebar>
        <SidebarFooter />
      </Sidebar> */}
    </nav>
  );
};


const PostCard: React.FC<PostProps> = ({
  subreddit,
  author,
  timeAgo,
  title,
  body,
  initialVotes,
  comments,
}) => {
  // Use state to manage votes
  const [votes, setVotes] = useState(initialVotes);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setVotes(votes - 1);
      setVoteStatus(null);
    } else {
      setVotes(votes + (voteStatus === 'down' ? 2 : 1));
      setVoteStatus('up');
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setVotes(votes + 1);
      setVoteStatus(null);
    } else {
      setVotes(votes - (voteStatus === 'up' ? 2 : 1));
      setVoteStatus('down');
    }
  };

  // Helper to format large vote numbers
  const formatVotes = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  // NOTE: This component will render in its 'mobile' state inside the narrow sidebar
  return (
    <article className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row overflow-hidden">
      
      {/* 1. Vote Gutter (Desktop-only) - This will be hidden inside the w-60 sidebar */}
      <div className="hidden sm:flex flex-col items-center w-12 bg-gray-50 dark:bg-gray-700/50 p-2">
        <IconButton 
          onClick={handleUpvote} 
          ariaLabel="Upvote"
          className={`hover:text-red-500 ${voteStatus === 'up' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <ArrowUp size={20} />
        </IconButton>
        
        <span className={`text-sm font-bold my-1 ${
          voteStatus === 'up' ? 'text-red-500' : 
          voteStatus === 'down' ? 'text-blue-600' : 
          'text-gray-800 dark:text-gray-200'
        }`}>
          {formatVotes(votes)}
        </span>
        
        <IconButton 
          onClick={handleDownvote} 
          ariaLabel="Downvote"
          className={`hover:text-blue-600 ${voteStatus === 'down' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <ArrowDown size={20} />
        </IconButton>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-hidden">
        
        {/* Post Metadata */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="font-bold text-gray-800 dark:text-gray-200 mr-1">r/{subreddit}</span>
          <span className="mx-1">•</span>
          <span className="mr-1">Posted by u/{author}</span>
          <span>{timeAgo}</span>
        </div>

        {/* Post Title */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
          {title}
        </h2>

        {/* Post Body (Optional) */}
        {body && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
            {body}
          </p>
        )}

        {/* Action Bar (Handles both mobile and desktop) */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Mobile-only Vote Controls - This WILL be visible */}
          <div className="flex sm:hidden items-center rounded-full border border-gray-200 dark:border-gray-600">
            <IconButton 
              onClick={handleUpvote} 
              ariaLabel="Upvote"
              className={`p-1.5 ${voteStatus === 'up' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <ArrowUp size={18} />
            </IconButton>
            <span className={`text-xs font-bold px-1 ${
              voteStatus === 'up' ? 'text-red-500' : 
              voteStatus === 'down' ? 'text-blue-600' : 
              'text-gray-800 dark:text-gray-200'
            }`}>
              {formatVotes(votes)}
            </span>
            <IconButton 
              onClick={handleDownvote} 
              ariaLabel="Downvote"
              className={`p-1.5 ${voteStatus === 'down' ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <ArrowDown size={18} />
            </IconButton>
          </div>

          {/* Comment Button */}
          <button className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 font-medium text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 p-2">
            <MessageCircle size={18} />
            {/* Hide "Comments" text on small screens if needed, but it might fit */}
            <span>{comments}</span>
          </button>

          {/* Share Button */}
          <button className="hidden sm:flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 font-medium text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 p-2">
            <Share size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Save Button */}
          <button className="hidden sm:flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 font-medium text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 p-2">
            <Bookmark size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>

        </div>
      </div>
    </article>
  );
};

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700">
      <button
        className="flex justify-between items-center w-full p-2.5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs font-medium text-white uppercase tracking-wider">
          {title}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="p-2.5 space-y-4">{children}</div>}
    </div>
  );
};

interface ToggleProps {
  label: string;
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}


const ToggleSwitch: React.FC<ToggleProps> = ({ label, toggled, onToggle }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm text-gray-300">{label}</label>
    <button
      onClick={() => onToggle(!toggled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
        toggled ? 'bg-blue-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          toggled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-300">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-blue-600"
    />
  </div>
);

export interface DisplaySettings {
  arrows: boolean;
  linkThickness: boolean;
  textFade: number;
  nodeSize: number;
  animate: boolean;
}

const RightSidebar: React.FC<{
  settings: DisplaySettings;
  setSettings: React.Dispatch<React.SetStateAction<DisplaySettings>>;
  onToggle: () => void;
  show: boolean;
}> = ({ settings, setSettings, onToggle, show }) => {


  return (
    <nav
      className={`w-64 bg-[#2a2a2a] text-gray-400 flex flex-col h-full border-l border-gray-700 absolute top-0 right-0 z-20 transition-transform transform ${
        show ? 'translate-x-0' : 'translate-x-full'
      } md:relative md:translate-x-0 md:z-auto`}
    >
      <div className="flex justify-end p-2.5 items-center border-b border-gray-700 md:hidden">
        <X size={16} className="cursor-pointer" onClick={onToggle} />
      </div>
      <Collapsible title="Filters" />
      <Collapsible title="Groups" />
      <Collapsible title="Display" defaultOpen={true}>
        <ToggleSwitch
          label="Arrows"
          toggled={settings.arrows}
          onToggle={(toggled) =>
            setSettings((s) => ({ ...s, arrows: toggled }))
          }
        />
        <Slider
          label="Text fade threshold"
          min={0}
          max={1}
          step={0.1}
          value={settings.textFade}
          onChange={(val) => setSettings((s) => ({ ...s, textFade: val }))}
        />
        <Slider
          label="Node size"
          min={0.1}
          max={2}
          step={0.1}
          value={settings.nodeSize}
          onChange={(val) => setSettings((s) => ({ ...s, nodeSize: val }))}
        />
        <ToggleSwitch
          label="Link thickness"
          toggled={settings.linkThickness}
          onToggle={(toggled) =>
            setSettings((s) => ({ ...s, linkThickness: toggled }))
          }
        />
        <button
          className="w-full py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            setSettings((s) => ({ ...s, animate: true }));
            setTimeout(() => setSettings((s) => ({ ...s, animate: false })), 1000);
          }}
        >
          Animate
        </button>
      </Collapsible>
      <Collapsible title="Forces" />
    </nav>
  );
};

const MainContent: React.FC<{
  displaySettings: DisplaySettings;
  tabs: string[];
  onTabClose: (tabName: string) => void;
  onTabAdd: () => void;
  onToggleRight: () => void;
}> = ({
  displaySettings,
  tabs,
  onTabClose,
  onTabAdd,
  onToggleRight,
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialGraphNodes);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const findNodePos = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    nodeId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);

    setNodes((currentNodes) =>
      currentNodes.map((n) =>
        n.id === draggingNodeId ? { ...n, x: x, y: y } : n
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      <div className="flex border-b border-gray-700">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#2a2a2a] border-r border-gray-700">
          <span className="text-sm text-gray-300">Graph view</span>
        </div>
        <div className="flex-1 flex items-center">
          {tabs.map((tabName) => (
            <Tab
              key={tabName}
              name={tabName}
              onClose={() => onTabClose(tabName)}
            />
          ))}
          <div className="p-2.5 text-gray-400">
            <Plus
              size={16}
              className="cursor-pointer"
              onClick={onTabAdd}
            />
          </div>
        </div>
        <div className="flex items-center px-4 py-2.5 gap-2">
          <span className="text-sm text-gray-400 hidden md:block">
            Graph view
          </span>
          <Menu
            size={16}
            className="cursor-pointer text-gray-400 md:hidden"
            onClick={onToggleRight}
          />
          <Settings
            size={16}
            className="cursor-pointer text-gray-400"
            onClick={onToggleRight}
          />
        </div>
      </div>

      <div
        className="flex-1 relative w-full h-full overflow-hidden"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} 
      >
        <svg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>

          {graphEdges.map((edge, i) => {
            const source = findNodePos(edge.source);
            const target = findNodePos(edge.target);

            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return null; 
            
            const unitX = dx / dist;
            const unitY = dy / dist;
            
            // Node radius approximation (in percentage units)
            // Scale radius based on nodeSize
            const radius = 2.5 * (displaySettings.nodeSize * 0.5 + 0.5); 

            const tX = target.x - unitX * radius;
            const tY = target.y - unitY * radius;
            console.log(`Rendering edge from ${edge.source} to ${edge.target}: (${source.x}, ${source.y}) -> (${tX}, ${tY})`);

            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={tX}
                y2={tY}
                stroke="#6b7280"
                strokeWidth={
                  displaySettings.linkThickness ? '0.3' : '0.15'
                }
                markerEnd={
                  displaySettings.arrows ? 'url(#arrowhead)' : 'none'
                }
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
            console.log('Rendering node:', node),
          <div
            key={node.id}
            className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
              draggingNodeId === node.id ? 'cursor-grabbing' : 'cursor-grab'
            } ${displaySettings.animate ? 'animate-pulse' : ''}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: `translate(-50%, -50%) scale(${
                displaySettings.nodeSize * 0.8 + 0.6 
              })`,
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-lg transition-all ${
                node.highlighted ? 'bg-red-500' : 'bg-gray-400'
              }`}
            ></div>
            <span
              className={`mt-2 text-xs whitespace-nowrap transition-opacity ${
                node.highlighted ? 'text-red-400' : 'text-gray-300'
              }`}
              style={{
                opacity: displaySettings.textFade * 0.8 + 0.2,
              }}
            >
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tab Component
const Tab: React.FC<{ name: string; onClose: () => void }> = ({
  name,
  onClose,
}) => (
  <div className="flex items-center gap-2 px-3 py-2.5 border-r border-gray-700 cursor-pointer hover:bg-gray-700">
    <span className="text-sm text-gray-300">{name}</span>
    <X
      size={14}
      className="text-gray-500 hover:text-white"
      onClick={(e) => {
        e.stopPropagation(); // Prevent tab click
        onClose();
      }}
    />
  </div>
);

// Main App Component
const App: React.FC = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    arrows: true,
    linkThickness: true,
    textFade: 0.5,
    nodeSize: 0.5,
    animate: false,
  });
  const [tabs, setTabs] = useState(['Main Level', 'About Game']);

  const handleTabClose = (tabName: string) => {
    setTabs((currentTabs) => currentTabs.filter((t) => t !== tabName));
  };

  const handleTabAdd = () => {
    const newTabName = `New Tab ${tabs.length + 1}`;
    setTabs((currentTabs) => [...currentTabs, newTabName]);
  };

  const closeSidebars = () => {
    setShowLeftSidebar(false);
    setShowRightSidebar(false);
  };

  return (
    <div className="flex w-full h-screen bg-[#1e1e1e] font-sans overflow-hidden relative">
      
      <MainContent
        displaySettings={displaySettings}
        tabs={tabs}
        onTabClose={handleTabClose}
        onTabAdd={handleTabAdd}
        onToggleRight={() => setShowRightSidebar(!showRightSidebar)}
      />
      {showRightSidebar && (
            <RightSidebar
                settings={displaySettings}
                setSettings={setDisplaySettings}
                onToggle={closeSidebars}
                show={showRightSidebar}
            />
      )}      
    </div>
  );
};

export default App;

