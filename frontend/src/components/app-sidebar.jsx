//frontend/srrc/components/app-sidebar.jsx
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
  LayoutDashboard,
  Wallet,
  UserCog,
  ChartColumnIncreasing,
  MonitorCog,
  Layers
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
    { name: "Carso", logo: Layers, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ];

  // Configuration des items de navigation avec permissions
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
      label: permissions.isEmploye ? "Employés" : "Gérer Employés",
      show: permissions.canAccess('employes')
    },
    {
      to: "/dashboard/contrats",
      icon: FileText,
      label: permissions.isEmploye ? "Contrat" : "Contrats",
      show: permissions.canAccess('contrats')
    },
    {
      to: "/dashboard/presences",
      icon: CheckSquare,
      label: permissions.isEmploye ? "Présences" : "Présences",
      show: permissions.canAccess('presences')
    },
    {
      to: "/dashboard/absences",
      icon: Calendar,
      label: permissions.isEmploye ? "Absences" : "Absences",
      show: permissions.canAccess('absences')
    },
    {
      to: "/dashboard/conges",
      icon: Umbrella,
      label: permissions.isEmploye ? "Congés" : "Congés",
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
      label: "Volet",
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
      label: permissions.isEmploye ? "Bulletins" : "Bulletins",
      show: permissions.canAccess('bulletins')
    },
    {
      to: "/dashboard/performances",
      icon: ChartColumnIncreasing,
      label: permissions.isEmploye ? "Performances" : "Performances",
      show: permissions.canAccess('performances')
    },
    {
      to: "/dashboard/utilisateurs",
      icon:MonitorCog,
      label: "Gérer Utilisateurs",
      show: permissions.canAccess('utilisateurs')
    },
    {
      to: "/dashboard/profil",
      icon: UserCog,
      label: "Mon Profil",
      show: true // Visible par tous
    },
  ];

  // Filtrer uniquement les items accessibles
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
            <div className="flex items-center gap-2 text-xs text-red-100">
              <span className="font-bold">Super Admin</span>
              <span>• Accès complet </span>
            </div>
          )}
          {permissions.isAdmin && (
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <span className="font-bold">Admin</span>
              <span>• Gestion complète </span>
            </div>
          )}
          {permissions.isEmploye && (
            <div className="flex items-center gap-2 text-xs text-green-300">
              <span className="font-bold">Employé</span>
              <span>• Espace personnel </span>
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
// import * as React from "react"
// import { NavLink } from "react-router-dom"
// import {
//   Users,
//   FileText,
//   Calendar,
//   CheckSquare,
//   Briefcase,
//   Umbrella,
//   Grid,
//   File,
//   LayoutDashboard,
//   Wallet,
//   UserCog,
//   TrendingUp,
//   Monitor,
//   ChevronDown,
//   Building2,
//   Settings
// } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar"
// import logocarso from "@/assets/carso 1.png"
// import { useAuth } from "@/hooks/useAuth"
// import { usePermissions } from "@/hooks/usePermissions"
// import { cn } from "@/lib/utils"


// /* ---------------------------------------------------------
//    UTIL : Initiales utilisateur
// --------------------------------------------------------- */
// const getUserInitials = (user) => {
//   const first = user?.prenom_utilisateur ?? user?.firstName ?? user?.name ?? ""
//   const last = user?.nom_utilisateur ?? user?.lastName ?? ""
//   const initials = `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`

//   return initials || user?.email?.charAt(0)?.toUpperCase() || "U"
// }


// /* ---------------------------------------------------------
//    AVATAR UTILISATEUR
// --------------------------------------------------------- */
// const UserAvatar = ({ user, isOnline = true, size = "md" }) => {
//   const sizeClasses = {
//     sm: "w-8 h-8",
//     md: "w-10 h-10",
//     lg: "w-12 h-12"
//   }

//   const dotSizeClasses = {
//     sm: "w-2 h-2",
//     md: "w-2.5 h-2.5",
//     lg: "w-3 h-3"
//   }

//   const displayName =
//     `${user?.prenom_utilisateur ?? ""} ${user?.nom_utilisateur ?? ""}`.trim() ||
//     user?.name ||
//     "Utilisateur"

//   return (
//     <div className="relative">
//       <div
//         className={cn(
//           sizeClasses[size],
//           "rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold overflow-hidden"
//         )}
//       >
//         {user?.avatar ? (
//           <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
//         ) : (
//           <span className="text-sm">{getUserInitials(user)}</span>
//         )}
//       </div>

//       {isOnline && (
//         <div
//           className={cn(
//             "absolute bottom-0 right-0 rounded-full border-2 border-white",
//             dotSizeClasses[size],
//             "bg-green-500"
//           )}
//         >
//           <div
//             className={cn(
//               "absolute rounded-full animate-ping",
//               dotSizeClasses[size],
//               "bg-green-500"
//             )}
//           />
//         </div>
//       )}
//     </div>
//   )
// }


// /* ---------------------------------------------------------
//    LOGO ENTREPRISE
// --------------------------------------------------------- */
// const CompanyLogo = ({ name = "CARSO", logocarso }) => (
//   <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
//     <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//       {logocarso ? (
//         <img src={logocarso} alt={name} className="w-6 h-6" />
//       ) : (
//         <Building2 className="w-6 h-6 text-white" />
//       )}
//     </div>
//     <div className="flex-1">
//       <h3 className="text-white font-bold text-sm">{name}</h3>
//       <p className="text-white/70 text-xs">Enterprise</p>
//     </div>
//     <ChevronDown className="w-4 h-4 text-white/70" />
//   </div>
// )


// /* ---------------------------------------------------------
//    NAV ITEM
// --------------------------------------------------------- */
// const NavItem = ({ to, icon: Icon, label, hasNotification = false }) => (
//   <li>
//     <NavLink
//       to={to}
//       end={to === "/dashboard"}
//       className={({ isActive }) =>
//         cn(
//           "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium no-underline",
//           "text-gray-300 hover:bg-white/5 hover:text-white",
//           isActive && "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
//         )
//       }
//     >
//       <Icon className="w-5 h-5 flex-shrink-0" />
//       <span className="flex-1 text-left">{label}</span>
//       {hasNotification && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
//     </NavLink>
//   </li>
// )


// /* ---------------------------------------------------------
//    SECTION NAVIGATION
// --------------------------------------------------------- */
// const NavSection = ({ title, items }) => {
//   if (!items.length) return null

//   return (
//     <div className="mb-6">
//       <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
//         {title}
//       </h4>
//       <ul className="space-y-1">
//         {items.map((item) => (
//           <NavItem key={item.to} {...item} />
//         ))}
//       </ul>
//     </div>
//   )
// }


// /* ---------------------------------------------------------
//    CARTE ESPACE UTILISÉ
// --------------------------------------------------------- */
// const SpaceUsageCard = ({ usedSpace, lastUpdate, updateDate }) => (
//   <div className="p-4 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-white/10">
//     <div className="flex items-center justify-between mb-2">
//       <h4 className="text-sm font-semibold text-white">Espace Utilisé</h4>
//       <span className="text-xs text-gray-400">{usedSpace}%</span>
//     </div>

//     <p className="text-xs text-gray-400 mb-3">Admin mis à jour {lastUpdate}</p>
//     <p className="text-xs text-gray-500 mb-2">{updateDate}</p>

//     <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
//       <div
//         className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
//         style={{ width: `${usedSpace}%` }}
//       />
//     </div>
//   </div>
// )


// /* ---------------------------------------------------------
//    BADGES ROLES
// --------------------------------------------------------- */
// const roleBadges = (permissions) => {
//   const badges = []

//   if (permissions.isSuperAdmin) badges.push({ label: "Super Admin", color: "text-red-400" })
//   if (permissions.isAdmin) badges.push({ label: "Admin", color: "text-blue-400" })
//   if (permissions.isEmploye) badges.push({ label: "Employé", color: "text-green-400" })

//   return badges
// }


// /* ---------------------------------------------------------
//    🟣 COMPOSANT PRINCIPAL : AppSidebar
// --------------------------------------------------------- */
// export default function AppSidebar(props) {
//   const { user } = useAuth()
//   const permissions = usePermissions()

//   /* items filtrés */
//   const navItems = React.useMemo(
//     () => [
//       {
//         to: "/dashboard",
//         icon: LayoutDashboard,
//         label: "Tableau de bord",
//         show: true,
//         notification: false,
//         group: "navigation",
//       },
//       {
//         to: "/dashboard/employes",
//         icon: Users,
//         label: permissions.isEmploye ? "Employés" : "Gérer Employés",
//         show: permissions.canAccess("employes"),
//         notification: false,
//         group: "navigation",
//       },
//       {
//         to: "/dashboard/contrats",
//         icon: FileText,
//         label: permissions.isEmploye ? "Contrat" : "Contrats",
//         show: permissions.canAccess("contrats"),
//         notification: false,
//         group: "navigation",
//       },
//       {
//         to: "/dashboard/presences",
//         icon: CheckSquare,
//         label: "Présences",
//         show: permissions.canAccess("presences"),
//         notification: true,
//         group: "navigation",
//       },
//       {
//         to: "/dashboard/absences",
//         icon: Calendar,
//         label: "Absences",
//         show: permissions.canAccess("absences"),
//         notification: false,
//         group: "navigation",
//       },
//       {
//         to: "/dashboard/conges",
//         icon: Umbrella,
//         label: "Congés",
//         show: permissions.canAccess("conges"),
//         notification: false,
//         group: "navigation",
//       },
//       {
//         to: "/dashboard/postes",
//         icon: Briefcase,
//         label: "Postes",
//         show: permissions.canAccess("postes"),
//         notification: false,
//         group: "management",
//       },
//       {
//         to: "/dashboard/departements",
//         icon: Grid,
//         label: "Volet",
//         show: permissions.canAccess("departements"),
//         notification: false,
//         group: "management",
//       },
//       {
//         to: "/dashboard/paiements",
//         icon: Wallet,
//         label: permissions.isEmploye ? "Mes paiements" : "Paiements",
//         show: permissions.canAccess("paiements"),
//         notification: false,
//         group: "management",
//       },
//       {
//         to: "/dashboard/bulletins",
//         icon: File,
//         label: "Bulletins",
//         show: permissions.canAccess("bulletins"),
//         notification: false,
//         group: "management",
//       },
//       {
//         to: "/dashboard/performances",
//         icon: TrendingUp,
//         label: "Performances",
//         show: permissions.canAccess("performances"),
//         notification: false,
//         group: "management",
//       },
//       {
//         to: "/dashboard/utilisateurs",
//         icon: Monitor,
//         label: "Gérer Utilisateurs",
//         show: permissions.canAccess("utilisateurs"),
//         notification: false,
//         group: "management",
//       },
//       {
//         to: "/dashboard/profil",
//         icon: UserCog,
//         label: "Mon Profil",
//         show: true,
//         notification: false,
//         group: "management",
//       },
//     ],
//     [permissions]
//   )

//   const visibleNav = navItems.filter((item) => item.show)

//   const navSections = {
//     navigation: visibleNav.filter((i) => i.group === "navigation"),
//     management: visibleNav.filter((i) => i.group === "management"),
//   }

//   const usedSpace = 73
//   const lastUpdate = "il y a 12 min"
//   const updateDate = "8 Novembre, 2025"

//   const displayName =
//     `${user?.prenom_utilisateur ?? ""} ${user?.nom_utilisateur ?? ""}`.trim() ||
//     user?.name ||
//     "Utilisateur"

//   return (
//     <Sidebar
//       collapsible="icon"
//       className="border-r border-white/10 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl"
//       {...props}
//     >
//       <SidebarHeader className="border-b border-white/10">
//         <CompanyLogo name="CARSO" />
//       </SidebarHeader>

//       <SidebarContent className="px-3 py-4 text-white gap-6">
//         <NavSection title="Navigation" items={navSections.navigation} />
//         <NavSection title="Gestion" items={navSections.management} />

//         <SpaceUsageCard
//           usedSpace={usedSpace}
//           lastUpdate={lastUpdate}
//           updateDate={updateDate}
//         />
//       </SidebarContent>

//       <SidebarFooter className="border-t border-white/10">
//         <div className="flex items-center gap-3 px-2 py-1">
//           <UserAvatar user={user} isOnline size="md" />
//           <div className="flex-1 min-w-0">
//             <h4 className="text-sm font-semibold truncate">{displayName}</h4>
//             <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//             <div className="flex flex-wrap gap-1 mt-1">
//               {roleBadges(permissions).map((badge) => (
//                 <span key={badge.label} className={cn("text-xs font-medium", badge.color)}>
//                   {badge.label}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
//             <Settings className="w-4 h-4 text-gray-300" />
//           </button>
//         </div>
//       </SidebarFooter>

//       <SidebarRail />
//     </Sidebar>
//   )
// }
