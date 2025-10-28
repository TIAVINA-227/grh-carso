"use client"

import * as React from "react"
import {
  Users,
  FileText,
  Calendar,
  CheckSquare,
  Briefcase,
  Umbrella,
  Grid,
  File,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  Wallet,
  UserCog,
  ChartColumnIncreasing
} from "lucide-react"

import SidebarItem from "@/components/ui/sidebar-item"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Mamenofo Emmanuel",
    email: "mamenofoemmanuel@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Carso",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  };
export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation matching the provided design */}
        <div className="px-2">
          <ul className="flex flex-col gap-2">
            <SidebarItem to="/dashboard" icon={LayoutDashboard } label="Dashboard" />
            <SidebarItem to="/dashboard/employes" icon={Users} label="Employés" />
            <SidebarItem to="/dashboard/contrats" icon={FileText} label="Contrats" />
            <SidebarItem to="/dashboard/presences" icon={CheckSquare} label="Présences" />
            <SidebarItem to="/dashboard/absences" icon={Calendar} label="Absences" />
            <SidebarItem to="/dashboard/conges" icon={Umbrella} label="Congés" />
            <SidebarItem to="/dashboard/postes" icon={Briefcase} label="Postes" />
            <SidebarItem to="/dashboard/departements" icon={Grid} label="Départements" />
            <SidebarItem to="/dashboard/paiements" icon={Wallet} label="Paiements" />
            <SidebarItem to="/dashboard/bulletins" icon={File} label="Bulletins" />
            <SidebarItem to="/dashboard/performances" icon={ChartColumnIncreasing} label="Performances" />
            <SidebarItem to="/dashboard/utilisateurs" icon={UserCog} label="Utilisateurs" />
          </ul>
        </div>
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
