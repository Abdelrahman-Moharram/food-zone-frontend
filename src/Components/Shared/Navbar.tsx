import { FaBars } from "react-icons/fa";
import { ThemeToggle, UserDropdown } from ".";

const Navbar = ({ sidebarHandler }: { sidebarHandler: () => void }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border shadow-sm bg-shared-theme backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-4 py-2.5 transition-all duration-300 sm:px-6">
        <button
          type="button"
          aria-label="Toggle Sidebar"
          onClick={sidebarHandler}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-shared-theme-copy shadow-xs transition-all duration-200 hover:border-secondary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary active:scale-95"
        >
          <FaBars className="h-4 w-4" />
        </button>


        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;