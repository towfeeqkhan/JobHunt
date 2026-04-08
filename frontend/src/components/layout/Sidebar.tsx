import { useNavigate, useLocation } from "react-router-dom";
import { RocketIcon, BoardIcon, PlusIcon } from "../icons";

interface SidebarProps {
  onAddClick?: () => void;
  onNavigateHome?: () => void;
}

export const Sidebar = ({ onAddClick, onNavigateHome }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBoardActive = location.pathname === "/";

  const handleHomeClick = () => {
    navigate('/');
    onNavigateHome?.();
  };

  return (
    <aside className="w-65 h-full bg-surface-container-low flex flex-col p-8 px-6 shrink-0 z-10 relative border-r border-surface-container/50">
      <div
        onClick={handleHomeClick}
        className="flex items-center gap-3 mb-12 cursor-pointer"
      >
        <div className="bg-linear-to-br from-primary to-primary-container text-white w-8 h-8 rounded-md flex items-center justify-center">
          <RocketIcon />
        </div>
        <div className="font-display font-extrabold text-xl tracking-[-0.02em]">
          JobHunt
        </div>
      </div>

      <nav className="flex flex-col gap-2 grow">
        <div
          onClick={handleHomeClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
            isBoardActive
              ? "bg-surface-container-lowest text-primary shadow-[0_4px_12px_rgba(25,28,30,0.03)]"
              : "text-on-surface-variant hover:bg-surface-container-high/30 hover:text-on-surface"
          }`}
        >
          <BoardIcon />
          <span>Board</span>
        </div>
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onAddClick}
          className="bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-md py-3 px-4 font-body font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90 w-full mt-2"
        >
          <PlusIcon />
          Add New Job
        </button>
      </div>
    </aside>
  );
};
