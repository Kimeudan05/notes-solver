import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";

// Components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import NoteEditor from "../components/NoteEditor";
import FloatingButton from "../components/FloatingButton";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // ----------------------------
  // State management
  // ----------------------------
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  // ----------------------------
  // Fetch categories
  // ----------------------------
  useEffect(() => {
    if (!user) return;
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setCategories(data);
    };
    fetchCategories();
  }, [user]);

  // ----------------------------
  // Fetch notes
  // ----------------------------
  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, pinned, category_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setNotes(data);
    };
    fetchNotes();
  }, [user]);

  // ----------------------------
  // Sidebar toggle (mobile)
  // ----------------------------
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ----------------------------
  // Add or update a note
  // ----------------------------
  const saveNote = async (note) => {
    if (note.id) {
      // Update note
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: note.title,
          content: note.content,
          pinned: note.pinned || false,
          category_id: note.category_id,
        })
        .eq("id", note.id)
        .select();

      if (!error && data) {
        setNotes(notes.map((n) => (n.id === note.id ? data[0] : n)));
      }
    } else {
      // Create note
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.id,
            title: note.title,
            content: note.content,
            pinned: note.pinned || false,
            category_id: note.category_id || activeCategory?.id || null,
          },
        ])
        .select();

      if (!error && data) {
        setNotes([data[0], ...notes]);
      }
    }
  };

  // ----------------------------
  // Filter and sort notes
  // ----------------------------
  const sortNotes = (list) => {
    let sorted = [...list];
    if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOption === "pinned") {
      sorted.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.pinned ? -1 : 1;
      });
    }
    return sorted;
  };

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      !activeCategory || note.category_id === activeCategory.id;
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const finalNotes = sortNotes(filteredNotes);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          setCategories={setCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Search + Sort + Add */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <input
              type="text"
              placeholder="Search notes..."
              className="px-3 py-2 rounded border bg-white dark:bg-gray-700 dark:text-white flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-2 items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="pinned">Pinned First</option>
              </select>

              <button
                onClick={() => setShowEditor(true)}
                className="hidden sm:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                + Add Note
              </button>
            </div>
          </div>

          {/* Notes List */}
          {finalNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  notes={notes}
                  setNotes={setNotes}
                  setEditingNote={(note) => {
                    setEditingNote(note);
                    setShowEditor(true);
                  }}
                  categories={categories}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {activeCategory
                ? "No notes in this category"
                : "No notes yet. Add one!"}
            </p>
          )}
        </main>
      </div>

      {/* Mobile Add Button */}
      <FloatingButton onClick={() => setShowEditor(true)} />

      {/* Editor Modal */}
      {showEditor && (
        <NoteEditor
          onSave={saveNote}
          onClose={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
          editingNote={editingNote}
          categories={categories}
        />
      )}
    </div>
  );
}
