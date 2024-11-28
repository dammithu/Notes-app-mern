import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";

const AddNote = ({ onClose, userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await fetch("http://localhost:8000/add-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags, userId }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.message);
      } else {
        setError(null);
        onClose();
      }
    } catch (err) {
      setError("Failed to add note. Try again later.");
    }
  };

  const handleAddNote = () => {
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }
    addNewNote();
  };

  return (
    <div className="p-4 relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center 
          absolute -top-4 -right-4 bg-gray-200 text-gray-600 
          hover:bg-gray-300 hover:text-gray-800 transition duration-200 shadow-lg"
        onClick={onClose}
      >
        <MdClose className="text-2xl" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700 text-xs">Title</label>
        <input
          type="text"
          className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition"
          placeholder="Enter note title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="font-medium text-gray-700 text-xs">Content</label>
        <textarea
          className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition resize-none"
          placeholder="Write your note content..."
          rows={6}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="font-medium text-gray-700 text-xs">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="w-full mt-6 py-2 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700 transition"
        onClick={handleAddNote}
      >
        Add Note
      </button>
    </div>
  );
};

export default AddNote;
