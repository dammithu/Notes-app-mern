import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";

const EditNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/note/${noteId}`);
        const data = await response.json();

        if (response.ok) {
          setTitle(data.note.title);
          setContent(data.note.content);
          setTags(data.note.tags);
          setIsPinned(data.note.isPinned);
        } else {
          setError("Error fetching note details. Try again later.");
        }
      } catch (error) {
        console.error("Error fetching note details:", error);
        setError("Error fetching note details. Try again later.");
      }
    };

    fetchNoteDetails();
  }, [noteId]);

  const handleEditNote = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/edit-note/${noteId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags, isPinned }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate(`/dashboard/${data.note.userId}`);
      } else {
        setError(data.message || "Failed to update note.");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Try again later.");
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => navigate(-1)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        content: {
          width: "50%",
          maxHeight: "70%",
          margin: "auto",
          padding: "0",
          background: "transparent",
          border: "none",
        },
      }}
    >
      <div className="container mx-auto mt-8 p-6 bg-[#1f2937] rounded-lg shadow-2xl">
        <div className="relative">
          <button
            className="absolute top-2 right-2 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full"
            onClick={() => navigate(-1)}
          >
            <MdClose className="text-lg text-gray-500" />
          </button>

          <h2 className="text-xl font-semibold text-gray-100 text-center mb-4">
            Edit Note
          </h2>
          {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300">Title</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300">Content</label>
              <textarea
                rows="4"
                className="w-full mt-1 p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300">Tags</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 text-sm"
                value={tags.join(", ")}
                onChange={(e) =>
                  setTags(e.target.value.split(",").map((tag) => tag.trim()))
                }
              />
            </div>

            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4 w-4 text-blue-400 rounded border-gray-300"
              />
              <label className="ml-2 text-xs text-gray-300">Pin this note</label>
            </div>
          </div>

          <button
            onClick={handleEditNote}
            className="w-full mt-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditNote;
