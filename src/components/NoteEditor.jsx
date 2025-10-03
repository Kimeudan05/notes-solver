import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

export default function NoteEditor({
  onSave,
  onClose,
  editingNote,
  categories,
}) {
  const [title, setTitle] = useState(editingNote?.title || "");
  const [categoryId, setCategoryId] = useState(editingNote?.category_id || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Write your note..." }),
    ],
    content: editingNote ? editingNote.content : "",
  });

  useEffect(() => {
    if (editingNote && editor) {
      setTitle(editingNote.title);
      editor.commands.setContent(editingNote.content);
    }
  }, [editingNote, editor]);

  const handleSave = () => {
    if (!title.trim() || !editor.getText().trim()) return;

    onSave({
      id: editingNote?.id || null,
      title,
      content: editor.getHTML(),
      pinned: editingNote?.pinned || false,
      category_id: categoryId || null,
    });
    onClose();
  };

  if (!editor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[32rem] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {editingNote ? "Edit Note" : "New Note"}
        </h2>
        <select
          className="w-full p-2 mb-3 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Uncategorized</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-3 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Editor */}
        <div className="border rounded p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white min-h-[150px]">
          <EditorContent editor={editor} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-400 hover:bg-gray-500 rounded text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
