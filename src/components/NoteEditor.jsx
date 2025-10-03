import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

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
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
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

  const transformText = (transformFn) => {
    const text = editor.state.doc.textBetween(
      0,
      editor.state.doc.content.size,
      "\n"
    );
    editor.commands.setContent(transformFn(text));
  };

  if (!editor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[32rem] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {editingNote ? "Edit Note" : "New Note"}
        </h2>

        {/* Category selector */}
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

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-3 text-sm">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive("underline")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive("strike")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            S
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 })
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            1. List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >
            "
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editor.isActive("codeBlock")
                ? "bg-blue-500 text-white px-2 py-1 rounded"
                : "bg-gray-200 px-2 py-1 rounded"
            }
          >{`</>`}</button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            ⇤
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            ⇆
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            ⇥
          </button>
          <button
            onClick={() => transformText((t) => t.toUpperCase())}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            ABC
          </button>
          <button
            onClick={() => transformText((t) => t.toLowerCase())}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            abc
          </button>
          <button
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
            className="bg-red-400 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>

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
