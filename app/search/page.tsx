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

/**
 * A self-contained component to display a single post.
 * (This is from the original file and is kept)
 */
function PostItem({ post, onVote }) {
  // Fallback in case author population failed
  const authorName = post.author ? post.author.username : 'Unknown';

  return (
    <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* --- Vote Section --- */}
      <div className="flex flex-col items-center p-3 bg-gray-50">
        <button
          onClick={() => onVote(post._id, 'up')}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600"
          aria-label="Upvote"
        >
          <ArrowUp size={18} />
        </button>
        <span className="font-bold text-sm my-1 text-gray-800"
          aria-label={`${post.votes} votes`}
        >
          {post.votes}
        </span>
        <button
          onClick={() => onVote(post._id, 'down')}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600"
          aria-label="Downvote"
        >
          <ArrowDown size={18} />
        </button>
      </div>

      {/* --- Main Content Section --- */}
      <div className="flex-1 p-4 min-w-0">
        {/* Post Metadata */}
        <div className="flex items-center text-xs text-gray-500 mb-1 flex-wrap">
          <span className="font-semibold text-gray-700">r/{post.subreddit}</span>
          <span className="mx-1">·</span>
          <span>Posted by u/{authorName}</span>
          <span className="mx-1">·</span>
          <span className="flex-shrink-0">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Post Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 break-words">
          {post.title}
        </h2>

        {/* Post Body (truncated) */}
        {post.body && (
          <p className="text-sm text-gray-700 mb-3 break-words max-h-24 overflow-hidden"
            style={{ webkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent)', maskImage: 'linear-gradient(180deg, #000 60%, transparent)' }}
          >
            {post.body}
          </p>
        )}

        {/* Action Bar */}
        <div className="flex items-center space-x-4">
          <a
            href={`/feed/${post._id}`} // Links to the comment page you made
            className="flex items-center space-x-1 text-sm text-gray-600 font-medium hover:bg-gray-100 p-2 rounded-md"
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
 * The main page component for displaying posts from a subreddit.
 */
export default function SubredditSearchPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Don't load on init
  const [error, setError] = useState(null);
  
  // State for the search input
  const [searchTerm, setSearchTerm] = useState('');
  // State for the subreddit we are actually fetching
  const [subredditToFetch, setSubredditToFetch] = useState('');

  // --- Removed: useEffect to get name from URL ---

  const fetchPosts = useCallback(async () => {
    // Only fetch if we have a subreddit name
    if (!subredditToFetch) return;

    console.log(`Fetching posts for r/${subredditToFetch}...`);
    setLoading(true);
    setError(null); // Clear previous errors
    setPosts([]); // Clear previous posts
    try {
      const response = await fetch(`${API_URL}/posts/subreddit/${subredditToFetch}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subredditToFetch]); // Re-run when subredditToFetch changes

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handler for voting
  const handleVote = useCallback(async (postId, direction) => {
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
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form reload
    if (searchTerm.trim()) {
      setSubredditToFetch(searchTerm.trim());
    }
  };

  // --- Render logic ---

  let content;
  if (loading) {
    content = <p className="text-gray-500 text-center">Loading posts...</p>;
  } else if (error) {
    content = <p className="text-red-500 text-center">Error: {error}</p>;
  } else if (posts.length > 0) {
    content = (
      <div className="space-y-4">
        {posts.map(post => (
          <PostItem key={post._id} post={post} onVote={handleVote} />
        ))}
      </div>
    );
  } else if (subredditToFetch) {
    // We searched, but found nothing
    content = <p className="text-gray-500 text-center">No posts found for r/{subredditToFetch}.</p>;
  } else {
    // Initial state before any search
    content = <p className="text-gray-500 text-center">Please enter a subreddit to search.</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* --- Header (restored from your example) --- */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Subreddit Search</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-4 bg-gray-50 min-h-screen">
          <div className="w-full max-w-3xl mx-auto">
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Subreddit Post Search
            </h1>
            
            {/* --- NEW: Search Input Form --- */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter subreddit name (e.g., reactjs)"
                  className="w-full p-2 pl-4 border border-gray-300 rounded-full shadow-sm"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">r/</span>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center p-2.5 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700"
              >
                <Search size={18} />
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

