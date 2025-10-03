import { Pin, PinOff, Trash2, Edit } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function NoteCard({
  note,
  notes,
  setNotes,
  setEditingNote,
  categories,
}) {
  const category = categories.find((c) => c.id === note.category_id);

  // Toggle pin
  const togglePin = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({ pinned: !note.pinned })
      .eq("id", note.id)
      .select();

    if (!error && data) {
      const updated = notes.map((n) => (n.id === note.id ? data[0] : n));
      setNotes(updated);
    }
  };

  // Delete note
  const deleteNote = async () => {
    const { error } = await supabase.from("notes").delete().eq("id", note.id);
    if (!error) {
      setNotes(notes.filter((n) => n.id !== note.id));
    }
  };

  return (
    <div className="relative p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={togglePin}
          title="Pin/Unpin"
          className="text-gray-500 hover:text-blue-500"
        >
          {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>
        <button
          onClick={() => setEditingNote(note)}
          title="Edit"
          className="text-gray-500 hover:text-green-500"
        >
          <Edit size={16} />
        </button>
        <button
          title="Delete"
          onClick={deleteNote}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Category badge */}
      {category && (
        <span
          className="inline-block px-2 py-1 text-xs rounded-full mb-2"
          style={{
            backgroundColor: category.color || "#e5e7eb",
            color: "#fff",
          }}
        >
          {category.name}
        </span>
      )}

      {/* Title */}
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
        {note.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        📅 -{" "}
        {note.created_at
          ? new Date(note.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : ""}
      </p>

      {/* Content preview */}
      <div
        className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );
}
