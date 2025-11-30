//frontend/src/components/ui/sidebar-item.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarItem({
  to = "#",
  icon: Icon,
  label,
  exact = false,
  badge,
  className,
  ...props
}) {
  const { isCollapsed, searchQuery, ...buttonProps } = props;
  const itemDataAttributes = {
    ...(typeof isCollapsed === "boolean" && { "data-collapsed": String(isCollapsed) }),
    ...(searchQuery && { "data-search-active": "true" }),
  };

  return (
    <li {...itemDataAttributes}>
      <NavLink 
        to={to} 
        end={true}
        className="no-underline" 
        aria-current={(navData) => (navData.isActive ? 'page' : undefined)}
      >
        {({ isActive }) => (
          <SidebarMenuButton isActive={isActive} className={className} {...buttonProps}>
            {Icon && <Icon className="size-4" />}
            <span>{label}</span>
            {badge ? <span className="ml-auto text-xs px-1 py-0.5 rounded-md bg-muted text-muted-foreground">{badge}</span> : null}
          </SidebarMenuButton>
        )}
      </NavLink>
    </li>
  );
}

export default SidebarItem;
