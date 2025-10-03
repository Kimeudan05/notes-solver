import { Plus } from "lucide-react";

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 lg:hidden bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
    >
      <Plus size={24} />
    </button>
  );
}
