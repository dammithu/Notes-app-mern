import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";

const Home = () => {
  const { userId } = useParams();
  const [openAddEditModal, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/get-user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data.user);
      } else if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [userId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:8000/notes/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setNotes(data.notes);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch notes.");
      }
    } catch (err) {
      setError("Failed to fetch notes. Try again later.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/delete-note/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== noteId));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete note.");
      }
    } catch (err) {
      setError("Failed to delete note. Try again later.");
    }
  };

  const handlePinNote = async (noteId) => {
    try {
      const updatedNotes = notes.map((note) =>
        note._id === noteId ? { ...note, isPinned: !note.isPinned } : note
      );

      // Sort notes to place pinned ones at the top
      const sortedNotes = updatedNotes.sort((a, b) => b.isPinned - a.isPinned);

      setNotes(sortedNotes);

      // Optional: If the backend supports updating the pin status
      await fetch(`http://localhost:8000/update-note/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPinned: !notes.find(note => note._id === noteId).isPinned }),
      });
    } catch (error) {
      setError("Failed to pin note. Try again later.");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userInfo={userInfo}
      />

      <div className="container mx-auto mt-8 p-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={new Date(note.createdOn).toLocaleDateString()}
                content={note.content}
                tags={note.tags.join(", ")}
                isPinned={note.isPinned}
                onEdit={() => navigate(`/editnote/${note._id}`)}
                onDelete={() => handleDeleteNote(note._id)}
                onPinNote={() => handlePinNote(note._id)}
              />
            ))
          ) : (
            <p className="text-center col-span-3 text-white text-lg">
              {error || "No notes available. Add a new note to get started!"}
            </p>
          )}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl transform transition-transform duration-300 hover:scale-110 fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px]" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModel({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1000,
          },
          content: {
            width: "55%",
            maxHeight: "85%",
            margin: "auto",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            backgroundColor: "#1e293b",
            overflow: "auto",
            color: "white",
          },
        }}
        contentLabel="Add/Edit Note"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          userId={userId}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
            fetchNotes();
          }}
        />
      </Modal>
    </>
  );
};

export default Home;
