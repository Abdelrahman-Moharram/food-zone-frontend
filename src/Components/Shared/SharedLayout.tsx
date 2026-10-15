import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { sidebarData } from "./sidebarData";
import { NotificationContainer } from "../Notifications";

const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen flex-col ">
      <NotificationContainer />
      <Navbar sidebarHandler={toggleSidebar} />

      <div className="relative flex flex-1 w-full items-stretch">
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isCollapsed ? "md:mr-[68px]" : "md:mr-64"
          }`}
        >
          <div className="">{children}</div>
        </main>

        <Sidebar />
      </div>
    </div>
  );
};

export default SharedLayout;