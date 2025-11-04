
// import * as React from "react"
// import {
//   Users,
//   FileText,
//   Calendar,
//   CheckSquare,
//   Briefcase,
//   Umbrella,
//   Grid,
//   File,
//   AudioWaveform,
//   Command,
//   GalleryVerticalEnd,
//   LayoutDashboard,
//   Wallet,
//   UserCog,
//   ChartColumnIncreasing
// } from "lucide-react"

// import SidebarItem from "@/components/ui/sidebar-item"
// import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import { useAuth } from "../hooks/useAuth"

// export function AppSidebar({ ...props }) {
//   const { user } = useAuth();
//   // Pour la démo, simulate la team picker mais utilise le vrai user
//   const teams = [
//     { name: "Carso", logo: GalleryVerticalEnd, plan: "Enterprise" },
//     { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
//     { name: "Evil Corp.", logo: Command, plan: "Free" },
//   ];

//   return (
//     <Sidebar collapsible="icon" className="border-r" variant="outline" {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={teams} />
//       </SidebarHeader>
//       <SidebarContent>
//         {/* Main navigation matching the provided design */}
//         <div className="px-2">
//           <ul className="flex flex-col gap-2">
//             <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Tableau de bords" />
//             <SidebarItem to="/dashboard/employes" icon={Users} label="Employés" />
//             <SidebarItem to="/dashboard/contrats" icon={FileText} label="Contrats" />
//             <SidebarItem to="/dashboard/presences" icon={CheckSquare} label="Présences" />
//             <SidebarItem to="/dashboard/absences" icon={Calendar} label="Absences" />
//             <SidebarItem to="/dashboard/conges" icon={Umbrella} label="Congés" />
//             <SidebarItem to="/dashboard/postes" icon={Briefcase} label="Postes" />
//             <SidebarItem to="/dashboard/departements" icon={Grid} label="Volet" />
//             <SidebarItem to="/dashboard/paiements" icon={Wallet} label="Paiements" />
//             <SidebarItem to="/dashboard/bulletins" icon={File} label="Bulletins" />
//             <SidebarItem to="/dashboard/performances" icon={ChartColumnIncreasing} label="Performances" />
//             {user && (user.role === "admin" || user.role === "superadmin") && (
//               <SidebarItem to="/dashboard/utilisateurs" icon={UserCog} label="Utilisateurs" />
//             )}
//           </ul>
//         </div>
//       </SidebarContent>
//       <SidebarFooter>
//         {/* Utilise le vrai user context */}
//         <NavUser />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }
// frontend/src/components/app-sidebar.jsx
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
import { usePermissions } from "../hooks/usePermissions"

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const permissions = usePermissions(); // ✅ Utilisation directe

  console.log('=== DEBUG APP-SIDEBAR ===');
  console.log('1. user:', user);
  console.log('2. permissions:', permissions);
  console.log('3. canAccess type:', typeof permissions.canAccess);
  console.log('4. Test canAccess("employes"):', permissions.canAccess('employes'));
  console.log('========================');

  // Configuration des équipes
  const teams = [
    { name: "Carso", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ];

  // ✅ Configuration des items de navigation avec permissions
  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Tableau de bord",
      show: true // Dashboard accessible à tous
    },
    {
      to: "/dashboard/employes",
      icon: Users,
      label: permissions.isEmploye ? "Mon profil" : "Employés",
      show: permissions.canAccess('employes')
    },
    {
      to: "/dashboard/contrats",
      icon: FileText,
      label: permissions.isEmploye ? "Mon contrat" : "Contrats",
      show: permissions.canAccess('contrats')
    },
    {
      to: "/dashboard/presences",
      icon: CheckSquare,
      label: permissions.isEmploye ? "Mes présences" : "Présences",
      show: permissions.canAccess('presences')
    },
    {
      to: "/dashboard/absences",
      icon: Calendar,
      label: permissions.isEmploye ? "Mes absences" : "Absences",
      show: permissions.canAccess('absences')
    },
    {
      to: "/dashboard/conges",
      icon: Umbrella,
      label: permissions.isEmploye ? "Mes congés" : "Congés",
      show: permissions.canAccess('conges')
    },
    {
      to: "/dashboard/postes",
      icon: Briefcase,
      label: "Postes",
      show: permissions.canAccess('postes')
    },
    {
      to: "/dashboard/departements",
      icon: Grid,
      label: "Départements",
      show: permissions.canAccess('departements')
    },
    {
      to: "/dashboard/paiements",
      icon: Wallet,
      label: permissions.isEmploye ? "Mes paiements" : "Paiements",
      show: permissions.canAccess('paiements')
    },
    {
      to: "/dashboard/bulletins",
      icon: File,
      label: permissions.isEmploye ? "Mes bulletins" : "Bulletins",
      show: permissions.canAccess('bulletins')
    },
    {
      to: "/dashboard/performances",
      icon: ChartColumnIncreasing,
      label: permissions.isEmploye ? "Mes performances" : "Performances",
      show: permissions.canAccess('performances')
    },
    {
      to: "/dashboard/utilisateurs",
      icon: UserCog,
      label: "Utilisateurs",
      show: permissions.canAccess('utilisateurs')
    }
  ];

  // ✅ Filtrer uniquement les items accessibles
  const visibleNavItems = navItems.filter(item => item.show);

  return (
    <Sidebar collapsible="icon" className="border-r" variant="outline" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-2">
          <ul className="flex flex-col gap-2">
            {visibleNavItems.map((item) => (
              <SidebarItem 
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </ul>
        </div>
        
        {/* Section info selon le rôle */}
        <div className="px-4 py-3 mt-4 border-t">
          {permissions.isSuperAdmin && (
            <div className="flex items-center gap-2 text-xs text-red-600">
              <span className="font-bold">👑 Super Admin</span>
              <span>• Accès complet ✅</span>
            </div>
          )}
          {permissions.isAdmin && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <span className="font-bold">🛡️ Admin</span>
              <span>• Gestion complète ✅</span>
            </div>
          )}
          {permissions.isEmploye && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <span className="font-bold">👤 Employé</span>
              <span>• Espace personnel 📋</span>
            </div>
          )}
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}