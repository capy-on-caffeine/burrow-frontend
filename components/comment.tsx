import React from 'react';
import { 
  FaMinusCircle, 
  FaArrowUp, 
  FaArrowDown, 
  FaGift, 
  FaShare, 
  FaEllipsisH 
} from 'react-icons/fa';

interface CommentProps {
  avatar: string;
  username: string;
  flairText?: string;
  flairColor?: 'green' | 'gray';
  timestamp: string;
  commentText: string;
  votes: number;
  children?: React.ReactNode;
}

// Reusable Comment Component
const Comment: React.FC<CommentProps> = ({
  avatar,
  username,
  flairText,
  flairColor = 'gray', // 'green' or 'gray'
  timestamp,
  commentText,
  votes,
  children,
}) => {
  // Define flair styles based on prop
  const flairStyles = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-gray-200 text-gray-800',
  };

  return (
    <div className="flex space-x-2">
      {/* Left Gutter: Collapse button and thread line */}
      <div className="flex flex-col items-center">
        <button className="text-gray-400 hover:text-gray-600 mt-1">
          <FaMinusCircle />
        </button>
        {/* The vertical thread line */}
        <div className="w-px grow bg-gray-300 mt-2"></div>
      </div>

      {/* Main Content: Header, Body, Actions, and Children */}
      <div className="flex-1">
        {/* Comment Header: Avatar, Name, Flair, Time */}
        <div className="flex items-center space-x-2 text-xs mb-1">
          <img src={avatar} alt="avatar" className="w-6 h-6 rounded-full" />
          <span className="font-bold text-gray-800">{username}</span>
          {flairText && (
            <span 
              className={`px-2 py-0.5 rounded-full font-semibold ${flairStyles[flairColor]}`}
            >
              {flairText}
            </span>
          )}
          <span className="text-gray-500">{timestamp}</span>
        </div>

        {/* Comment Body */}
        <div className="text-sm text-gray-900 mb-2">
          {commentText}
        </div>

        {/* Comment Actions: Votes, Award, Share, ... */}
        <div className="flex items-center space-x-3 text-xs font-bold text-gray-500">
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded hover:bg-gray-100"><FaArrowUp /></button>
            <span className="text-gray-800">{votes}</span>
            <button className="p-1 rounded hover:bg-gray-100"><FaArrowDown /></button>
          </div>
          <button className="flex items-center space-x-1 p-1 rounded hover:bg-gray-100">
            <FaGift />
            <span>Award</span>
          </button>
          <button className="flex items-center space-x-1 p-1 rounded hover:bg-gray-100">
            <FaShare />
            <span>Share</span>
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <FaEllipsisH />
          </button>
        </div>

        {/* Nested Replies: Render children here */}
        <div className="mt-3 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Comment;