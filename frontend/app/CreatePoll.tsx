"use client";
import { useState } from "react";
import axios from "axios";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/polls/", {
        question,
        options,
      });
      alert("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]);
    } catch (err) {
      console.error(err);
      alert("Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md mb-6">
      <h2 className="text-lg font-bold mb-2">Create Poll</h2>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(idx, e.target.value)}
          className="border p-2 w-full mb-2"
        />
      ))}
      <button onClick={addOption} className="text-blue-600 mb-2">
        + Add Option
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}
