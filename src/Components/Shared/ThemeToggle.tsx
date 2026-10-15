import { FaMoon } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeColorMode } from "../../redux/features/authSlice";

const ThemeToggle = () => {
  const { colormode } = useAppSelector(state=>state.auth);
  const dispatch      = useAppDispatch()  

  return (
    <button
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-shared-theme-copy shadow-xs transition-all duration-200 hover:border-secondary hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary active:scale-95"
      onClick={() => dispatch(changeColorMode(colormode === "dark" ? "light" : "dark"))}
    >
      {
        colormode === 'dark'?
          <FaMoon className="h-4 w-4 block transition-transform duration-200" />
        :
          <IoIosSunny className="h-4 w-4 block transition-transform duration-200" />
      }
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
};

export default ThemeToggle;
