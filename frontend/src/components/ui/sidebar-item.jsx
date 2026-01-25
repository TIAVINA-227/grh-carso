//frontend/src/components/ui/sidebar-item.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarItem({
  to = "#",
  icon: Icon,
  label,
  badge,
  badgeComponent,
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
            <div className="relative flex items-center gap-2 flex-1">
              {Icon && <Icon className="size-4" />}
              <span className="relative inline-block">{label}</span>
              {badgeComponent}
            </div>
            {badge ? (
              <span className="ml-auto text-xs px-1 py-0.5 rounded-md bg-muted text-muted-foreground">{badge}</span>
            ) : null}
          </SidebarMenuButton>
        )}
      </NavLink>
    </li>
  );
}

export default SidebarItem;
