// src/components/layout/Header.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo1 from "../../assets/logo1.png";

function Header() {
  const [open, setOpen] = useState(false);

  const linkBase =
    "block px-3 py-2 text-sm font-medium transition-colors hover:text-slate-900";

  return (
    <>
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur px-4">
        <div className="flex items-center justify-between py-3  mx-auto max-w-6xl">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img
                src={Logo1}
                alt="Logo"
                className="h-14"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <NavLink
                to="/#"
                className={({ isActive }) =>
                    [
                    "transition-colors hover:text-slate-900 text-lg",
                    isActive ? "text-slate-900" : "text-slate-600",
                    ].join(" ")
                }
                >
                Peraturan
            </NavLink>
            <NavLink
              to="/#"
              className={({ isActive }) =>
                [
                  "transition-colors hover:text-slate-900 text-lg",
                  isActive ? "text-slate-900" : "text-slate-600",
                ].join(" ")
              }
            >
              Tentang
            </NavLink>
          </nav>

          {/* HAMBURGER MOBILE */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span
                className={`block h-[2px] w-5 bg-slate-900 transition-transform ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-slate-900 transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-slate-900 transition-transform ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* OVERLAY + SLIDE MENU (MOBILE) */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden
          transition-opacity duration-200
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        {/* Background blur + gelap */}
        <div
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Panel kanan yang slide */}
        <div
          className={`
            absolute inset-y-0 right-0 w-72 max-w-[80%]
            bg-white shadow-xl
            transform transition-transform duration-300 ease-out
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold text-slate-800">
            Menu
            </span>
            <button
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            onClick={() => setOpen(false)}
            >
            ✕
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-2 py-3">
            <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                    `${linkBase} ${isActive ? "text-slate-900" : "text-slate-600"}`
                }
            >
                Peraturan
            </NavLink>
            <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                    `${linkBase} ${isActive ? "text-slate-900" : "text-slate-600"}`
                }
            >
                Tentang
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
