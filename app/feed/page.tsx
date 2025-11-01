'use client'; 

import { Navbar } from "@/components/navbar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCallback, useMemo, useRef } from "react";
import { ArrowDown, ArrowUp, Check, CornerUpRight, Edit, MoreHorizontal, Share, Trash, X } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"; // Import hooks
import { formatDistanceToNow } from 'date-fns'; // For formatting timestamps

interface Author {
  username: string;
}

interface Comment {
  _id: string;
  author: Author;
  commentText: string;
  createdAt: string;
  votes: number;
  parentComment?: string;
  children: Comment[];
}

interface CommentThreadProps {
  comment: Comment;
  onVote: (commentId: string, direction: 'up' | 'down') => void;
  onEdit: (commentId: string, newText: string) => void;
  onDelete: (commentId: string) => void;
}

function CommentThread({
  comment,
  onVote,
  onEdit,
  onDelete,
}: CommentThreadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Local Handlers ---
  const handleVote = (direction: 'up' | 'down') => {
    onVote(comment._id, direction);
  };

  const handleShare = () => {
    const commentUrl = `${window.location.origin}${window.location.pathname}/${comment._id}`;
    
    // Use document.execCommand as navigator.clipboard might not work in an iframe
    const textArea = document.createElement('textarea');
    textArea.value = commentUrl;
    textArea.style.position = 'fixed'; // Avoid scrolling to bottom
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Hide "Copied!" after 2s
    } catch (err) {
      console.error('Failed to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  const handleEditSubmit = () => {
    if (editedText.trim() === '') return; // Don't save empty comments
    onEdit(comment._id, editedText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // A custom modal is better, but this avoids window.confirm
    // You can add your modal logic here. For now, it deletes on click.
    onDelete(comment._id);
    setIsDropdownOpen(false);
  };
  
  // Effect to close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Use a dynamic placeholder avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.username)}&background=random&color=fff`;

  return (
    <div className="flex space-x-3 w-full" id={`comment-${comment._id}`}>
      {/* Avatar + vertical thread line */}
      <div className="flex flex-col items-center shrink-0">
        <img src={avatarUrl} alt={comment.author.username} className="w-10 h-10 rounded-full border-2 border-slate-700" />
        {/* Render thread line if there are children */}
        {comment.children.length > 0 && (
          <div className="w-px h-full bg-slate-700 mt-2"></div>
        )}
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0 bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 hover:border-orange-500/30 transition-all">
        {/* User Info */}
        <div className="flex items-center space-x-2 text-sm flex-wrap">
          <span className="font-semibold text-orange-400 truncate">{comment.author.username}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500 shrink-0">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Comment Body or Edit View */}
        {isEditing ? (
          <div className="mt-3">
            <textarea
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
            />
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleEditSubmit}
                className="flex items-center space-x-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-all"
                disabled={editedText.trim() === ''}
              >
                <Check size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditedText(comment.commentText); }}
                className="flex items-center space-x-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-all"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-slate-200 text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">{comment.commentText}</p>
        )}

        {/* Action Bar */}
        {!isEditing && (
          <div className="flex items-center space-x-4 text-sm text-slate-400 mt-3">
            {/* Votes */}
            <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg px-2 py-1">
              <button onClick={() => handleVote('up')} className="p-1 rounded hover:bg-orange-500/20 hover:text-orange-500 transition-all">
                <ArrowUp size={16} />
              </button>
              <span className="font-medium w-6 text-center text-xs text-white">{comment.votes}</span>
              <button onClick={() => handleVote('down')} className="p-1 rounded hover:bg-red-500/20 hover:text-red-500 transition-all">
                <ArrowDown size={16} />
              </button>
            </div>
            
            {/* Reply Button */}
            <button className="flex items-center space-x-1 hover:text-orange-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50">
              <CornerUpRight size={16} />
              <span>Reply</span>
            </button>
            
            {/* Share Button */}
            <button onClick={handleShare} className="flex items-center space-x-1 hover:text-orange-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50">
              <Share size={16} />
              <span className="min-w-10">{copySuccess ? 'Copied!' : 'Share'}</span>
            </button>
            
            {/* More Options Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(o => !o)} className="p-1 rounded hover:bg-slate-800/50 hover:text-orange-400 transition-all">
                <MoreHorizontal size={16} />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-8 left-0 z-10 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-1">
                  <button
                    onClick={() => { setIsEditing(true); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <Trash size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Children (Replies) --- */}
        <div className="mt-4 space-y-4">
          {comment.children.map((reply: Comment) => (
            <CommentThread
              key={reply._id}
              comment={reply}
              onVote={onVote}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export default function Page() {
  const [rawComments, setRawComments] = useState<Comment[]>([]); // Flat list from API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState([]);
  
    // Use the ID from your logs
    const postId = "6904af991781dc91b5c59b29"; 
    // Use the port from your logs
    const API_URL = 'http://localhost:5000/api'; 

   const fetchPosts = useCallback(async () => {
     try {
      console.log('Fetching all posts...');
      setLoading(true);
      // Fetch all posts, not comments for one post
      const response = await fetch(`${API_URL}/posts`); 
       if (!response.ok) {
         const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch posts');
       }
        const data = await response.json();
        console.log('Posts data:', data);
        setPosts(data); // Set posts state
        setError(null);
    } catch (err) {
       console.error('Error fetching posts:', err);
       setError(err instanceof Error ? err.message : 'An error occurred');
 } finally {
 setLoading(false);
 }
  }, []); // No dependencies needed

  useEffect(() => {
      fetchPosts();
  }, [fetchPosts]);

    // --- Data Fetching ---
    const fetchComments = useCallback(async () => {
      try {
        console.log('Fetching comments for postId:', postId);
        setLoading(true);
        const response = await fetch(`${API_URL}/comments/post/${postId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch comments');
        }
        const data = await response.json();
        console.log('Comments data:', data);
        setRawComments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, [postId]); // postId is constant, but good practice
  
    useEffect(() => {
      fetchComments();
    }, [fetchComments]);
  
    // --- Memoized Tree Building ---
    // This builds the nested tree from the flat list every time rawComments changes
    const commentTree = useMemo(() => {
      const map: Record<string, Comment> = {};
      const roots: Comment[] = [];
      if (!rawComments || rawComments.length === 0) return [];
  
      rawComments.forEach(comment => {
        map[comment._id] = { ...comment, children: [] };
      });
      
      rawComments.forEach(comment => {
        if (comment.parentComment && map[comment.parentComment]) {
            map[comment.parentComment].children.push(map[comment._id]);
        } else if (!comment.parentComment) {
          roots.push(map[comment._id]);
        }
      });
      return roots;
    }, [rawComments]);
  
    // --- API Handlers (Passed to CommentThread) ---
    
    const handleVote = useCallback(async (commentId: string, direction: 'up' | 'down') => {
      // Optimistic UI update
      setRawComments(currentComments =>
        currentComments.map(c =>
          c._id === commentId ? { ...c, votes: c.votes + (direction === 'up' ? 1 : -1) } : c
        )
      );
      
      // API Call
      try {
        await fetch(`${API_URL}/comments/${commentId}/vote`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction }),
        });
      } catch (err) {
        console.error('Failed to vote:', err);
        fetchComments(); // Rollback on error
      }
    }, [fetchComments, API_URL]);
  
    const handleEditSubmit = useCallback(async (commentId: string, newText: string) => {
      // Optimistic UI update
      setRawComments(currentComments =>
        currentComments.map(c =>
          c._id === commentId ? { ...c, commentText: newText } : c
        )
      );
      
      // API Call
      try {
        await fetch(`${API_URL}/comments/${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentText: newText }),
        });
      } catch (err) {
        console.error('Failed to edit:', err);
        fetchComments(); // Rollback on error
      }
    }, [fetchComments, API_URL]);
  
    const handleDelete = useCallback(async (commentId: string) => {
      // Optimistic UI update: Remove comment and all its descendants
      const getChildIdsRecursive = (parentId: string, allComments: Comment[]): string[] => {
        let ids: string[] = [];
        const children = allComments.filter(c => c.parentComment === parentId);
        for (const child of children) {
          ids.push(child._id);
          ids = ids.concat(getChildIdsRecursive(child._id, allComments));
        }
        return ids;
      };
      
      const idsToDelete = [commentId, ...getChildIdsRecursive(commentId, rawComments)];
      setRawComments(currentComments =>
        currentComments.filter(c => !idsToDelete.includes(c._id))
      );
      
      // API Call
      try {
        await fetch(`${API_URL}/comments/${commentId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete:', err);
        fetchComments(); // Rollback on error
      }
    }, [rawComments, fetchComments, API_URL]);

  return (
    <>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
      <SidebarInset className="bg-slate-950">
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
                  <BreadcrumbPage className="text-slate-200">Feed</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="p-6 min-h-screen">
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Community Feed
              </h1>
              <p className="text-slate-400">Join the conversation</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              {/* Main Content Area */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400">Loading feed...</p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
                  <p className="text-red-400">Error: {error}</p>
                </div>
              )}
              
              <div className="space-y-6">
                {!loading && !error && commentTree.map(comment => (
                  <CommentThread
                    key={comment._id}
                    comment={comment}
                    onVote={handleVote}
                    onEdit={handleEditSubmit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {!loading && !error && commentTree.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}