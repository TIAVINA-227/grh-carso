import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarItem({ to = "#", icon: Icon, label, exact = false, badge, className, ...props }) {
  return (
    <li>
      <NavLink to={to} end={exact} className="no-underline" aria-current={(navData) => (navData.isActive ? 'page' : undefined)}>
        {({ isActive }) => (
          <SidebarMenuButton isActive={isActive} className={className} {...props}>
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
