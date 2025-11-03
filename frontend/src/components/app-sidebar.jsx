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
import { useAuth } from "../hooks/useAuth"

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  // Pour la démo, simulate la team picker mais utilise le vrai user
  const teams = [
    { name: "Carso", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r" variant="outline" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation matching the provided design */}
        <div className="px-2">
          <ul className="flex flex-col gap-2">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Tableau de bords" />
            <SidebarItem to="/dashboard/employes" icon={Users} label="Employés" />
            <SidebarItem to="/dashboard/contrats" icon={FileText} label="Contrats" />
            <SidebarItem to="/dashboard/presences" icon={CheckSquare} label="Présences" />
            <SidebarItem to="/dashboard/absences" icon={Calendar} label="Absences" />
            <SidebarItem to="/dashboard/conges" icon={Umbrella} label="Congés" />
            <SidebarItem to="/dashboard/postes" icon={Briefcase} label="Postes" />
            <SidebarItem to="/dashboard/departements" icon={Grid} label="Volet" />
            <SidebarItem to="/dashboard/paiements" icon={Wallet} label="Paiements" />
            <SidebarItem to="/dashboard/bulletins" icon={File} label="Bulletins" />
            <SidebarItem to="/dashboard/performances" icon={ChartColumnIncreasing} label="Performances" />
            {user && (user.role === "admin" || user.role === "superadmin") && (
              <SidebarItem to="/dashboard/utilisateurs" icon={UserCog} label="Utilisateurs" />
            )}
          </ul>
        </div>
      </SidebarContent>
      <SidebarFooter>
        {/* Utilise le vrai user context */}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
