import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Package, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

interface PalletsPackagingDropdownProps {
  className?: string;
}

export function PalletsPackagingDropdown({ className }: PalletsPackagingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const menuItems = [
    {
      label: "Wooden Pallets",
      href: "/wooden-pallets-bahrain-saudi-arabia",
      icon: Warehouse,
      dataAttr: "pallets"
    },
    {
      label: "Wooden Packaging", 
      href: "/custom-wooden-packaging-bahrain-saudi-arabia",
      icon: Package,
      dataAttr: "packaging"
    }
  ];

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => (prev + 1) % menuItems.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => prev <= 0 ? menuItems.length - 1 : prev - 1);
        }
        break;
    }
  };

  // Handle mouse interactions
  const handleMouseEnter = () => {
    // Only open on hover for desktop (non-touch devices)
    if (!("ontouchstart" in window)) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!("ontouchstart" in window)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(0);
    }
  };

  return (
    <div 
      className={cn("relative", className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group inline-flex h-10 items-center justify-center rounded-2xl bg-background px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-sm focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        data-nav="pallets-packaging"
      >
        <span>Pallets and Packaging</span>
        <ChevronDown 
          className={cn(
            "ml-1 h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Panel */}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 mt-1 w-64 -translate-x-1/2 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg transition-all duration-200",
          isOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        )}
        role="menu"
        aria-orientation="vertical"
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
                focusedIndex === index 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
              data-nav-item={item.dataAttr}
              onClick={() => {
                setIsOpen(false);
                setFocusedIndex(-1);
              }}
              onMouseEnter={() => setFocusedIndex(index)}
              onFocus={() => setFocusedIndex(index)}
            >
              <Icon className={cn(
                "h-4 w-4 transition-colors",
                focusedIndex === index && "text-primary"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}