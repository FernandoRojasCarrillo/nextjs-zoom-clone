"use client";

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation"

import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6 ">
        {sidebarLinks.map((link, index) => {
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);

          return (
            <Link
              key={index}
              className={cn(
                "flex gap-4 items-center p-4 rounded-[.5rem] justify-start",
                {
                  "bg-blue-1": isActive,
                }
              )}
              href={link.route}
            >
              <Image
                src={link.imgUrl}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-lg  font-semibold max-lg:hidden" >{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Sidebar