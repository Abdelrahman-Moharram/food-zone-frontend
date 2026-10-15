import { useAppSelector } from "../../redux/hooks";
import { LogoLight } from "../utils/Icons";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const { user } = useAppSelector(state => state.auth);

  return (
    <div className="bg-container">
      <div className="px-3.5">

        <div className="flex py-2 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <LogoLight width="30px" height="30px" />
            </a>
          </div>

          <UserDropdown />

        </div>
      </div>
    </div>
  );
};

export default Header;
