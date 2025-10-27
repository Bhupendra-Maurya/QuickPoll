"use client";
import { useEffect, useState, useMemo } from "react";
import { getPolls } from "../api";
import { wsClient } from "../ws";
import { Poll, WSMessage } from "../types";
import PollCard from "./PollCard";
import CreatePollModal from "./CreatePollModal";
import { motion, AnimatePresence } from "framer-motion";

export default function PollPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  // Fix: Start with a static value to avoid hydration mismatch
  const [liveUsers, setLiveUsers] = useState(25);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag and initialize random value after hydration
  useEffect(() => {
    setMounted(true);
    // Set initial random value only on client
    setLiveUsers(Math.floor(Math.random() * 50) + 10);
  }, []);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls();
        setPolls(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  useEffect(() => {
    const unsubscribe = wsClient.subscribe((msg: WSMessage) => {
      switch (msg.event) {
        case "poll_created":
          setPolls((prev) => [msg.poll, ...prev]);
          break;
        case "vote_update":
        case "like_update":
          setPolls((prev) =>
            prev.map((p) => (p.id === msg.poll.id ? msg.poll : p))
          );
          break;
        case "poll_deleted":
          setPolls((prev) => prev.filter((p) => p.id !== msg.poll_id));
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  // Simulate live users changes
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setLiveUsers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        const newValue = prev + change;
        return Math.max(5, Math.min(100, newValue));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  const sortedPolls = useMemo(() => {
    const sorted = [...polls];
    switch (sortBy) {
      case "popular":
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      case "votes":
        sorted.sort((a, b) => {
          const aVotes = a.options.reduce((sum, opt) => sum + opt.votes, 0);
          const bVotes = b.options.reduce((sum, opt) => sum + opt.votes, 0);
          return bVotes - aVotes;
        });
        break;
      default:
        sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  }, [polls, sortBy]);

  const handleUpdate = (updatedPoll: Poll) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === updatedPoll.id ? updatedPoll : p))
    );
  };

  const handleDelete = (pollId: number) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: mounted ? "blob 7s infinite" : "none",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: mounted ? "blob 7s infinite 2s" : "none",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: mounted ? "blob 7s infinite 4s" : "none",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: mounted ? 360 : 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-linear-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  QuickPolls
                </h1>
                <p className="text-purple-200 text-sm">
                  Real-time opinion polling
                </p>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  {mounted && (
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  )}
                </div>
                <span className="text-white font-medium">
                  {liveUsers} users online
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Poll
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {["newest", "popular", "votes"].map((sort) => (
            <motion.button
              key={sort}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                sortBy === sort
                  ? "bg-white text-purple-900 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-500"></div>
              {mounted && (
                <div
                  className="absolute inset-0 w-20 h-20 border-4 border-pink-200 rounded-full border-t-pink-500"
                  style={{
                    animation: "spin 1s linear infinite",
                    animationDelay: "150ms",
                  }}
                />
              )}
            </div>
          </div>
        ) : sortedPolls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No polls yet</h2>
            <p className="text-purple-200 mb-6">
              Be the first to create a poll!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Create First Poll
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {sortedPolls.map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PollCard
                    poll={poll}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Create Poll Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePollModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
