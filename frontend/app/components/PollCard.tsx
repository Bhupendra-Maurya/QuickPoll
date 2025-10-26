"use client"
import { useState, useMemo } from "react";
import { Poll, Option } from "../types";
import { voteOption, likePoll, unlikePoll, deletePoll } from "../api";
import { motion, AnimatePresence } from "framer-motion";

interface PollCardProps {
  poll: Poll;
  onUpdate: (poll: Poll) => void;
  onDelete: (pollId: number) => void;
}

export default function PollCard({ poll, onUpdate, onDelete }: PollCardProps) {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  
  // Calculate total votes using useMemo to avoid recalculation on every render
  const totalVotes = useMemo(() => 
    poll.options.reduce((sum, opt) => sum + opt.votes, 0), 
    [poll.options]
  );
  
  // Generate recent voters once per totalVotes change
  const recentVoters = useMemo(() => {
    const voters = ["Alex", "Sam", "Jordan", "Taylor", "Morgan"];
    return voters.slice(0, Math.min(3, totalVotes));
  }, [totalVotes]);

  const handleVote = async (optionId: number) => {
    if (voted || isVoting) return;
    
    setIsVoting(true);
    setSelectedOption(optionId);
    
    try {
      const updated = await voteOption(poll.id, optionId);
      onUpdate(updated);
      setVoted(true);
    } catch (error) {
      console.error("Vote failed:", error);
      setSelectedOption(null);
    } finally {
      // Always clear voting state after a delay for animation
      setTimeout(() => setIsVoting(false), 500);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        const updated = await unlikePoll(poll.id);
        onUpdate(updated);
        setIsLiked(false);
      } else {
        const updated = await likePoll(poll.id);
        onUpdate(updated);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Like/unlike failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePoll(poll.id);
      onDelete(poll.id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getOptionPercentage = (option: Option) => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes / totalVotes) * 100);
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <motion.div
      layout
      className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      {/* Live indicator */}
      {totalVotes > 0 && (
        <div className="absolute -top-2 -right-2">
          <div className="relative">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{poll.question}</h2>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-purple-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>{totalVotes} votes</span>
          </div>
          <div className="flex items-center gap-1 text-pink-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{poll.likes} likes</span>
          </div>
        </div>

        {/* Recent Voters */}
        {recentVoters.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex -space-x-2">
              {recentVoters.map((voter, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white/20 flex items-center justify-center text-xs text-white font-bold"
                >
                  {voter[0]}
                </div>
              ))}
            </div>
            <span className="text-xs text-purple-200">voted recently</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {poll.options.map((option, index) => {
          const percentage = getOptionPercentage(option);
          const isSelected = selectedOption === option.id;
          const isWinning = totalVotes > 0 && option.votes === Math.max(...poll.options.map(o => o.votes));
          
          return (
            <motion.button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted || isVoting}
              className={`relative w-full text-left p-4 rounded-xl transition-all duration-300 ${
                voted
                  ? "bg-white/5 cursor-default"
                  : "bg-white/10 hover:bg-white/20 cursor-pointer"
              } ${isSelected ? "ring-2 ring-purple-400" : ""}`}
              whileHover={!voted ? { scale: 1.02 } : {}}
              whileTap={!voted ? { scale: 0.98 } : {}}
            >
              {/* Background Progress Bar */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(index)} rounded-xl opacity-30`}
                initial={{ width: "0%" }}
                animate={{ width: voted ? `${percentage}%` : "0%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              
              {/* Content */}
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{option.text}</span>
                  {isWinning && totalVotes > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-bold"
                    >
                      Leading
                    </motion.span>
                  )}
                </div>
                
                {voted && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-white font-bold">{percentage}%</span>
                    <span className="text-purple-200 text-sm">({option.votes})</span>
                  </motion.div>
                )}
              </div>

              {/* Voting Animation */}
              {isSelected && isVoting && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isLiked
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <motion.svg
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </motion.svg>
            <span className="font-medium">{isLiked ? "Liked" : "Like"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
            </svg>
            <span className="font-medium">Share</span>
          </motion.button>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-full right-0 mb-2 p-3 bg-red-500 rounded-lg shadow-lg"
              >
                <p className="text-white text-sm mb-2 whitespace-nowrap">Delete this poll?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-white text-red-500 rounded font-medium text-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 bg-red-600 text-white rounded font-medium text-sm"
                  >
                    No
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}