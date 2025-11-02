'use client';

import React, { useState, useEffect, useCallback } from 'react';
// --- Restored Imports from user's example ---
// --- Imports REMOVED to fix build error ---
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
// --- End Removed Imports ---

import { ArrowUp, ArrowDown, MessageSquare, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const API_URL = 'http://localhost:5000/api';

interface Post {
  _id: string;
  title: string;
  body?: string;
  author?: {
    username: string;
  };
  votes: number;
  createdAt: string;
}

/**
 * A self-contained component to display a single post.
 * (This is from the original file and is kept)
 */
function PostItem({ post, onVote }: { post: Post; onVote: (postId: string, direction: 'up' | 'down') => void }) {
  // Fallback in case author population failed
  const authorName = post.author ? post.author.username : 'Unknown';

  return (
    <div className="group flex bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-orange-500/10">
      {/* --- Vote Section --- */}
      <div className="flex flex-col items-center p-4 bg-slate-900/50 border-r border-slate-700">
        <button
          onClick={() => onVote(post._id, 'up')}
          className="p-2 rounded-lg text-slate-400 hover:bg-orange-500/20 hover:text-orange-500 transition-all duration-200"
          aria-label="Upvote"
        >
          <ArrowUp size={20} />
        </button>
        <span className="font-bold text-base my-2 text-white"
          aria-label={`${post.votes} votes`}
        >
          {post.votes}
        </span>
        <button
          onClick={() => onVote(post._id, 'down')}
          className="p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-500 transition-all duration-200"
          aria-label="Downvote"
        >
          <ArrowDown size={20} />
        </button>
      </div>

      {/* --- Main Content Section --- */}
      <div className="flex-1 p-5 min-w-0">
        {/* Post Metadata */}
        <div className="flex items-center text-xs text-slate-400 mb-2 flex-wrap gap-1">
          <span className="text-slate-300">Posted by u/{authorName}</span>
          <span className="mx-1">·</span>
          <span className="shrink-0">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Post Title */}
        <h2 className="text-xl font-semibold text-white mb-3 wrap-break-word group-hover:text-orange-400 transition-colors">
          {post.title}
        </h2>

        {/* Post Body (truncated) */}
        {post.body && (
          <p className="text-sm text-slate-300 mb-4 wrap-break-word max-h-24 overflow-hidden leading-relaxed"
            style={{ WebkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent)', maskImage: 'linear-gradient(180deg, #000 60%, transparent)' }}
          >
            {post.body}
          </p>
        )}

        {/* Action Bar */}
        <div className="flex items-center space-x-4">
          <a
            href={`/feed/${post._id}`}
            className="flex items-center space-x-2 text-sm text-slate-400 font-medium hover:bg-slate-700/50 px-3 py-2 rounded-lg hover:text-orange-400 transition-all duration-200"
          >
            <MessageSquare size={16} />
            <span>Comments</span>
          </a>
        </div>
      </div>
    </div>
  );
}


/**
 * The main page component for displaying search results.
 */
export default function SearchPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false); // Don't load on init
  const [error, setError] = useState<string | null>(null);
  
  // State for the search input
  const [searchTerm, setSearchTerm] = useState('');
  // State for the query we are actually fetching
  const [queryToFetch, setQueryToFetch] = useState('');

  // --- Removed: useEffect to get name from URL ---

  const fetchPosts = useCallback(async () => {
    // Only fetch if we have a query
    if (!queryToFetch) return;

    console.log(`Fetching posts for query: ${queryToFetch}...`);
    setLoading(true);
    setError(null); // Clear previous errors
    setPosts([]); // Clear previous posts
    try {
      const response = await fetch(`${API_URL}/search?query=${queryToFetch}`);
      console.log(response);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch posts');
      }
      const data = await response.json();
      console.log(data);
      
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [queryToFetch]); // Re-run when queryToFetch changes

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handler for voting
  const handleVote = useCallback(async (postId: string, direction: 'up' | 'down') => {
    // Optimistic UI update
    setPosts(currentPosts =>
      currentPosts.map(p =>
        p._id === postId ? { ...p, votes: p.votes + (direction === 'up' ? 1 : -1) } : p
      )
    );

    // API Call
    try {
      await fetch(`${API_URL}/posts/${postId}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: direction }),
      });
    } catch (err) {
      console.error('Failed to vote:', err);
      // We don't need to full-refetch, the optimistic update is fine
    }
  }, []); // No dependency, it just uses the postId and direction

  // --- NEW: Handler for the search form submit ---
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form reload
    if (searchTerm.trim()) {
      setQueryToFetch(searchTerm.trim());
    }
  };

  // --- Render logic ---

  let content;
  if (loading) {
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-lg">Loading posts...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  } else if (posts.length > 0) {
    content = (
      <div className="space-y-5">
        {posts.map(post => (
          <PostItem key={post._id} post={post} onVote={handleVote} />
        ))}
      </div>
    );
  } else if (queryToFetch) {
    content = (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
        <p className="text-slate-400 text-lg">No posts found for "{queryToFetch}"</p>
      </div>
    );
  } else {
    content = (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
        <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg mb-2">Start Your Exploration</p>
        <p className="text-slate-500">Enter a search query to discover posts</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-950">
        {/* --- Header --- */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-slate-300 hover:text-white" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-slate-700"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-slate-400 hover:text-orange-400 transition-colors">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-200">Search</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6 bg-slate-950 min-h-screen">
          <div className="w-full max-w-4xl mx-auto">
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Post Search
              </h1>
              <p className="text-slate-400">Explore posts and topics</p>
            </div>
            
            {/* --- Search Input Form --- */}
            <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for topics, keywords, or content..."
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center px-6 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-200 glow-pulse"
              >
                <Search size={20} />
              </button>
            </form>
            
            {/* --- Content (Loading, Error, Posts) --- */}
            {content}
          </div>
        </main>

      </SidebarInset>
     </SidebarProvider>
  );
}

