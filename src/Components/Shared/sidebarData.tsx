import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoBookOutline } from "react-icons/io5";
import { LiaScrollSolid } from "react-icons/lia";

export interface SidebarItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: Omit<SidebarItem, "children">[];
}

export const sidebarData: SidebarItem[] = [
  {
    id: 1,
    title: "الصفحة الرئيسية",
    icon: (
      <AiOutlineHome className="h-5 w-5 shrink-0 transition duration-75 group-hover:text-secondary" />
    ),
    href: "/",
  },
  {
    id: 2,
    title: "القرآن الكريم",
    icon: (
      <IoBookOutline className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-secondary" />
    ),
    children: [
      {
        id: 21,
        title: "المصاحف",
        icon: (
          <IoBookOutline className="shrink-0 w-4 h-4 transition duration-75 group-hover:text-secondary" />
        ),
        href: "/quran",
      },
      {
        id: 22,
        title: "التفسير",
        icon: (
          <IoBookOutline className="shrink-0 w-4 h-4 transition duration-75 group-hover:text-secondary" />
        ),
        href: "/quran/tafseers",
      },
    ],
  },
  {
    id: 3,
    title: "الحديث الشريف",
    icon: (
      <LiaScrollSolid className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-secondary" />
    ),
    children: [
      {
        id: 31,
        title: "الحديث الشريف",
        icon: (
          <LiaScrollSolid className="shrink-0 w-4 h-4 transition duration-75 group-hover:text-secondary" />
        ),
        href: "/hadith",
      },
    ],
  },
  {
    id: 4,
    title: "Sign In",
    icon: (
      <svg
        className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-secondary"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
        />
      </svg>
    ),
    href: "/signin",
  },
];
