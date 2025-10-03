import { useState, useContext, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({
  categories,
  setCategories,
  activeCategory,
  setActiveCategory,
  isOpen,
  toggleSidebar,
}) {
  const { user } = useContext(AuthContext);
  const [showInput, setShowInput] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const sidebarRef = useRef();

  // Close sidebar if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        toggleSidebar(); // Collapse sidebar
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    if (categories.length >= 5) {
      alert("You can only have 5 categories");
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ user_id: user.id, name: newCat, color: "#3b82f6" }])
      .select();

    if (!error && data) {
      setCategories([...categories, data[0]]);
      setNewCat("");
      setShowInput(false);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (catId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", catId);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== catId));
      if (activeCategory?.id === catId) setActiveCategory(null);
    }
  };

  // Save category edit
  const handleEditSave = async (catId) => {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: editedName })
      .eq("id", catId)
      .select();

    if (!error && data) {
      setCategories(
        categories.map((c) => (c.id === catId ? { ...c, name: editedName } : c))
      );
      setEditingCategoryId(null);
      setEditedName("");
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-gray-100 dark:bg-gray-800 p-4 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-200 z-40 shadow-lg lg:shadow-none`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Categories
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInput(!showInput)}
            className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            title="Add category"
          >
            <Plus size={16} />
          </button>
          <br />
          <button
            onClick={toggleSidebar}
            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded lg:hidden"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Categories List */}
      <ul className="space-y-2 mb-4">
        <li
          key="all"
          onClick={() => setActiveCategory(null)}
          className={`p-2 rounded cursor-pointer ${
            !activeCategory
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          All
        </li>

        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`flex justify-between items-center p-2 rounded cursor-pointer ${
              activeCategory?.id === cat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {/* Color Dot + Name/Input */}
            <span className="flex items-center gap-2 flex-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color || "#3b82f6" }}
              ></span>
              {editingCategoryId === cat.id ? (
                <input
                  type="text"
                  className="flex-1 bg-white dark:bg-gray-600 rounded px-2 py-1"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{cat.name}</span>
              )}
            </span>

            {/* Actions */}
            <div className="flex gap-1">
              {editingCategoryId === cat.id ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSave(cat.id);
                    }}
                    className="text-green-600 hover:text-green-700 text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategoryId(null);
                      setEditedName("");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-xs"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategoryId(cat.id);
                      setEditedName(cat.name);
                    }}
                    className="text-gray-500 hover:text-green-500"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat.id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Add category input */}
      {showInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="New category"
            className="flex-1 p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button
            onClick={handleAddCategory}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      )}
    </aside>
  );
}
