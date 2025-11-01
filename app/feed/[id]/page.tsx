'use client';

import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowDown, ArrowUp, Check, CornerUpRight, Edit, MoreHorizontal, Share, Trash, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { formatDistanceToNow } from 'date-fns';

function CommentThread({
    comment,
    onVote,
    onEdit,
    onDelete,
}: {
    comment: any;
    onVote: (id: string, dir: 'up' | 'down') => void;
    onEdit: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.commentText);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setEditedText(comment.commentText);
    }, [comment.commentText]);

    const handleVote = (direction: 'up' | 'down') => {
        onVote(comment._id, direction);
    };

    const handleShare = () => {
        const commentUrl = `${window.location.origin}${window.location.pathname}#comment-${comment._id}`;
        const textArea = document.createElement('textarea');
        textArea.value = commentUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const handleEditSubmit = () => {
        if (editedText.trim() === '') return;
        onEdit(comment._id, editedText);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(comment._id);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.username || 'User')}&background=random&color=fff`;

    return (
        <div className="flex space-x-3 w-full" id={`comment-${comment._id}`}>
    {/* Avatar + vertical thread line */}
    <div className="flex flex-col items-center flex-shrink-0">
        <img src={avatarUrl} alt={comment.author?.username || 'User'} className="w-8 h-8 rounded-full" />
        {/* UPDATED: Changed 'children' to 'comments' */}
        {comment.comments && comment.comments.length > 0 && (
            <div className="w-px h-full bg-gray-200 mt-2"></div>
        )}
    </div>

    {/* Comment Content */}
    <div className="flex-1 min-w-0">
        {/* User Info - FIXED: Moved spans inside this div */}
        <div className="flex items-center space-x-2 text-sm flex-wrap">
            {/* NEW: Added subreddit name */}
            {comment.subreddit && (
                <>
                    <span className="font-semibold text-gray-900">r/{comment.subreddit}</span>
                    <span className="text-gray-500">·</span>
                </>
            )}
            <span className="font-semibold text-gray-900 truncate">{comment.author?.username || 'Unknown'}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 flex-shrink-0">
                {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
            </span>
        </div>

        {/* NEW: Added Post Title */}
        {comment.title && (
            <h2 className="text-lg font-semibold text-gray-900 mt-2 break-words">
                {comment.title}
            </h2>
        )}

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
                        // UPDATED: Reset text to comment.body
                        onClick={() => { setIsEditing(false); setEditedText(comment.body); }}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-300"
                    >
                        <X size={16} />
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        ) : (
            // UPDATED: Changed 'commentText' to 'body'
            <p className="mt-1 text-gray-800 text-sm whitespace-pre-wrap break-words">{comment.body}</p>
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

                {/* Reply Button */}
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
            {/* UPDATED: Changed 'children' to 'comments' */}
            {comment.comments && comment.comments.map((reply) => (
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
    const [rawComments, setRawComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const API_URL = 'http://localhost:5000/api';

    const fetchComments = useCallback(async () => {
        if (!postId) return;

        try {
            console.log('Fetching comments for postId:', postId);
            setLoading(true);
            const response = await fetch(`${API_URL}/posts/title/${postId}`);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ message: 'Failed to fetch comments' }));
                throw new Error(errData.message || 'Failed to fetch comments');
            }
            const data = await response.json();
            console.log('Fetched comments data:', data);
            setRawComments(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching comments:', err);
            setError(err?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const commentTree = useMemo(() => {
        const map: Record<string, any> = {};
        const roots: any[] = [];
        if (!rawComments || rawComments.length === 0) return [];
        rawComments.forEach((comment) => {
            map[comment._id] = { ...comment, children: [] };
        });
        rawComments.forEach((comment) => {
            if (comment.parentComment && map[comment.parentComment]) {
                map[comment.parentComment].children.push(map[comment._id]);
            } else if (!comment.parentComment) {
                roots.push(map[comment._id]);
            }
        });
        return roots;
    }, [rawComments]);

    const handleVote = useCallback(async (commentId: string, direction: 'up' | 'down') => {
        setRawComments(currentComments =>
            currentComments.map(c =>
                c._id === commentId ? { ...c, votes: (c.votes || 0) + (direction === 'up' ? 1 : -1) } : c
            )
        );

        try {
            await fetch(`${API_URL}/comments/${commentId}/vote`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction }),
            });
        } catch (err) {
            console.error('Failed to vote:', err);
            fetchComments();
        }
    }, [fetchComments]);

    const handleEditSubmit = useCallback(async (commentId: string, newText: string) => {
        setRawComments(currentComments =>
            currentComments.map(c =>
                c._id === commentId ? { ...c, commentText: newText } : c
            )
        );

        try {
            await fetch(`${API_URL}/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentText: newText }),
            });
        } catch (err) {
            console.error('Failed to edit:', err);
            fetchComments();
        }
    }, [fetchComments]);

    const handleDelete = useCallback(async (commentId: string) => {
        const getChildIdsRecursive = (parentId: string, allComments: any[]) => {
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

        try {
            await fetch(`${API_URL}/comments/${commentId}`, {
                method: 'DELETE',
            });
        } catch (err) {
            console.error('Failed to delete:', err);
            fetchComments();
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
                                    <BreadcrumbLink href="/feed">
                                        Feed
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{postId || 'Post'}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="p-4">
                    <div className="p-4 bg-white rounded-lg w-full max-w-4xl mx-auto shadow-sm border">
                        {loading && <p className="text-sm text-gray-500">Loading comments...</p>}

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
    );
}
