'use client'; 

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


function CommentThread({
  comment,
  onVote,
  onEdit,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef(null);

  // --- Local Handlers ---
  const handleVote = (direction) => {
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
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  // Use a dynamic placeholder avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.username)}&background=random&color=fff`;

  return (
    <div className="flex space-x-3 w-full" id={`comment-${comment._id}`}>
      {/* Avatar + vertical thread line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <img src={avatarUrl} alt={comment.author.username} className="w-8 h-8 rounded-full" />
        {/* Render thread line if there are children */}
        {comment.children.length > 0 && (
          <div className="w-px h-full bg-gray-200 mt-2"></div>
        )}
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* User Info */}
        <div className="flex items-center space-x-2 text-sm flex-wrap">
          <span className="font-semibold text-gray-900 truncate">{comment.author.username}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500 flex-shrink-0">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Comment Body or Edit View */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="w-full p-2 border rounded-md text-sm"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={handleEditSubmit}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                disabled={editedText.trim() === ''}
              >
                <Check size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditedText(comment.commentText); }}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-gray-800 text-sm whitespace-pre-wrap break-words">{comment.commentText}</p>
        )}

        {/* Action Bar */}
        {!isEditing && (
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
            {/* Votes */}
            <div className="flex items-center space-x-1">
              <button onClick={() => handleVote('up')} className="p-1 rounded-full hover:bg-gray-100 hover:text-gray-800">
                <ArrowUp size={16} />
              </button>
              <span className="font-medium w-4 text-center text-xs">{comment.votes}</span>
              <button onClick={() => handleVote('down')} className="p-1 rounded-full hover:bg-gray-100 hover:text-gray-800">
                <ArrowDown size={16} />
              </button>
            </div>
            
            {/* Reply Button (Not functional, but good UI) */}
            <button className="flex items-center space-x-1 hover:text-gray-900">
              <CornerUpRight size={16} />
              <span>Reply</span>
            </button>
            
            {/* Share Button */}
            <button onClick={handleShare} className="flex items-center space-x-1 hover:text-gray-900">
              <Share size={16} />
              <span className="min-w-[40px]">{copySuccess ? 'Copied!' : 'Share'}</span>
            </button>
            
            {/* More Options Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(o => !o)} className="p-1 rounded-full hover:bg-gray-100 hover:text-gray-800">
                <MoreHorizontal size={16} />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-8 left-0 z-10 w-32 bg-white border rounded-md shadow-lg py-1">
                  <button
                    onClick={() => { setIsEditing(true); setIsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
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
          {comment.children.map(reply => (
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
  const [rawComments, setRawComments] = useState([]); // Flat list from API
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
  
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
       setError(err.message);
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
        setError(err.message);
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
      const map = {};
      const roots = [];
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
    
    const handleVote = useCallback(async (commentId, direction) => {
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
    }, [fetchComments]);
  
    const handleEditSubmit = useCallback(async (commentId, newText) => {
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
    }, [fetchComments]);
  
    const handleDelete = useCallback(async (commentId) => {
      // Optimistic UI update: Remove comment and all its descendants
      const getChildIdsRecursive = (parentId, allComments) => {
        let ids = [];
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
    }, [rawComments, fetchComments]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbLink href="#">
                    Feed
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="p-4">
          <div className="p-4 bg-white rounded-lg w-full max-w-4xl mx-auto shadow-sm border">
            {/* Main Content Area */}
            {loading && <p className="text-sm text-gray-500">Loading feed...</p>}
            
            {error && <p className="text-sm text-red-500">Error: {error}</p>}
            
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
               <p className="text-sm text-gray-500">Be the first to comment!</p>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}