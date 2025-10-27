"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { createPoll } from "../api";
import { Poll } from "../types";

interface CreatePollModalProps {
  onClose: () => void;
  onPollCreated?: (poll: Poll) => void;
}

// Option with stable ID
interface OptionWithId {
  id: string;
  value: string;
}

// Simple UUID generator
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function CreatePollModal({
  onClose,
  onPollCreated,
}: CreatePollModalProps) {
  const [question, setQuestion] = useState("");
  
  // Initialize options with stable IDs
  const [options, setOptions] = useState<OptionWithId[]>(() => [
    { id: generateId(), value: "" },
    { id: generateId(), value: "" }
  ]);
  
  const [creating, setCreating] = useState(false);

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { id: generateId(), value: "" }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const updateOption = (id: string, value: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, value } : option
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty options
    const validOptions = options.filter((o) => o.value.trim());
    
    if (!question || validOptions.length < 2) {
      alert("Please provide a question and at least 2 options");
      return;
    }

    setCreating(true);
    try {
      const newPoll = await createPoll({
        question,
        options: validOptions.map((option) => ({ text: option.value })),
      });

      if (onPollCreated && newPoll) {
        onPollCreated(newPoll);
      }

      onClose();
    } catch (error) {
      console.error("Failed to create poll:", error);
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-linear-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-lg w-full border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Create New Poll</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all font-medium"
              >
                + Add Option
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={creating}
              className="flex-1 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Poll"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}