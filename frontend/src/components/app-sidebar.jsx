"use client"

import * as React from "react"
import {
  Users,
  FileText,
  Calendar,
  CheckSquare,
  TrendingUp,
  Briefcase,
  Umbrella,
  Grid,
  DollarSign,
  File,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Wallet,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation matching the provided design */}
        <div className="px-2">
          <ul className="flex flex-col gap-2">
            <SidebarItem to="/dashboard" icon={LayoutDashboard } label="Dashboard" />
            <SidebarItem to="/employees" icon={Users} label="Employés" />
            <SidebarItem to="/contrats" icon={FileText} label="Contrats" />
            <SidebarItem to="/absences" icon={Calendar} label="Absences" />
            <SidebarItem to="/presences" icon={CheckSquare} label="Présences" />
            <SidebarItem to="/performances" icon={TrendingUp} label="Performances" />
            <SidebarItem to="/postes" icon={Briefcase} label="Postes" />
            <SidebarItem to="/conges" icon={Umbrella} label="Congés" />
            <SidebarItem to="/departements" icon={Grid} label="Départements" />
            <SidebarItem to="/paiements" icon={Wallet} label="Paiements" />
            <SidebarItem to="/bulletins" icon={File} label="Bulletins" />
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
