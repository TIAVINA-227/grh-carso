// // frontend/src/components/app-sidebar.jsx
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
//   LayoutDashboard,
//   Wallet,
//   UserCog,
//   ChartColumnIncreasing,
//   MonitorCog,
//   Plus,
//   Sparkles,
//   Search,
//   Settings,
//   HelpCircle,
//   Bell,
//   X
// } from "lucide-react"

// import SidebarItem from "@/components/ui/sidebar-item"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
//   useSidebar
// } from "@/components/ui/sidebar"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { useAuth } from "../hooks/useAuth"
// import { usePermissions } from "../hooks/usePermissions"
// import logocarso from "../assets/carso 7.png"

// export function AppSidebar({ ...props }) {
//   const { user } = useAuth();
//   const permissions = usePermissions();
//   const { state } = useSidebar();
//   const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [isSearchOpen, setIsSearchOpen] = React.useState(false);
//   const [showLogoModal, setShowLogoModal] = React.useState(false);
//   const [logoError, setLogoError] = React.useState(false);
//   const [modalLogoError, setModalLogoError] = React.useState(false);

//   const isCollapsed = state === "collapsed";

//   console.log('=== DEBUG APP-SIDEBAR ===');
//   console.log('1. user:', user);
//   console.log('2. permissions:', permissions);
//   console.log('3. canAccess type:', typeof permissions.canAccess);
//   console.log('4. Test canAccess("employes"):', permissions.canAccess('employes'));
//   console.log('5. Sidebar state:', state);
//   console.log('========================');

//   // Configuration des items de navigation avec permissions
//   const navItems = [
//     {
//       to: "/dashboard",
//       icon: LayoutDashboard,
//       label: "Tableau de bord",
//       show: true
//     },
//     {
//       to: "/dashboard/employes",
//       icon: Users,
//       label: permissions.isEmploye ? "Employés" : "Gérer Employés",
//       show: permissions.canAccess('employes')
//     },
//     {
//       to: "/dashboard/contrats",
//       icon: FileText,
//       label: permissions.isEmploye ? "Contrat" : "Contrats",
//       show: permissions.canAccess('contrats')
//     },
//     {
//       to: "/dashboard/presences",
//       icon: CheckSquare,
//       label: permissions.isEmploye ? "Présences" : "Présences",
//       show: permissions.canAccess('presences')
//     },
//     {
//       to: "/dashboard/absences",
//       icon: Calendar,
//       label: permissions.isEmploye ? "Absences" : "Absences",
//       show: permissions.canAccess('absences')
//     },
//     {
//       to: "/dashboard/conges",
//       icon: Umbrella,
//       label: permissions.isEmploye ? "Congés" : "Congés",
//       show: permissions.canAccess('conges')
//     },
//     {
//       to: "/dashboard/postes",
//       icon: Briefcase,
//       label: "Postes",
//       show: permissions.canAccess('postes')
//     },
//     {
//       to: "/dashboard/departements",
//       icon: Grid,
//       label: "Volet",
//       show: permissions.canAccess('departements')
//     },
//     { 
//       to: "/dashboard/performances",
//       icon: ChartColumnIncreasing,
//       label: permissions.isEmploye ? "Performances" : "Performances",
//       show: permissions.canAccess('performances')
//     },
//     {
//       to: "/dashboard/paiements",
//       icon: Wallet,
//       label: permissions.isEmploye ? "Mes paiements" : "Paiements",
//       show: permissions.canAccess('paiements')
//     },
//     {
//       to: "/dashboard/bulletins",
//       icon: File,
//       label: permissions.isEmploye ? "Bulletins" : "Bulletins",
//       show: permissions.canAccess('bulletins')
//     },
//         {
//       to: "/dashboard/profil",
//       icon: UserCog,
//       label: "Mon Profil",
//       show: true
//     },
//     {
//       to: "/dashboard/notifications",
//       icon: Bell,
//       label: "Notifications",
//       show: true, // ou permissions.canAccess('notifications') si tu gères ce droit
//     },
//     {
//       to: "/dashboard/utilisateurs",
//       icon: MonitorCog,
//       label: "Gérer Utilisateurs",
//       show: permissions.canAccess('utilisateurs')
//     },
//   ];

//   // Filtrer et rechercher les items
//   const filteredNavItems = navItems.filter(item => {
//     if (!item.show) return false;
//     if (!searchQuery) return true;
    
//     const query = searchQuery.toLowerCase();
//     return item.label.toLowerCase().includes(query) || 
//            item.to.toLowerCase().includes(query);
//   });

//   // Groupes de navigation avec recherche
//   const groupedNavItems = [
//     {
//       title: "Principal",
//       items: filteredNavItems.slice(0, 3)
//     },
//     {
//       title: "Gestion",
//       items: filteredNavItems.slice(3, 9)
//     },
//     {
//       title: "Finance",
//       items: filteredNavItems.slice(9, 11)
//     },
//     {
//       title: "Système",
//       items: filteredNavItems.slice(11)
//     }
//   ].filter(group => group.items.length > 0);

//   // Fonction pour fermer la recherche
//   const closeSearch = () => {
//     setSearchQuery("");
//     setIsSearchOpen(false);
//   };

//   // Effet pour fermer la recherche quand la sidebar se collapse
//   React.useEffect(() => {
//     if (isCollapsed && isSearchOpen) {
//       closeSearch();
//     }
//   }, [isCollapsed, isSearchOpen]);

//   // Fonction pour ouvrir le modal du logo
//   const handleLogoClick = () => {
//     setShowLogoModal(true);
//     setModalLogoError(false);
//     // Fermer automatiquement après 3 secondes
//     setTimeout(() => {
//       setShowLogoModal(false);
//     }, 3000);
//   };

//   // Fonction pour gérer l'erreur du logo
//   const handleLogoError = () => {
//     setLogoError(true);
//   };

//   // Fonction pour gérer l'erreur du logo modal
//   const handleModalLogoError = () => {
//     setModalLogoError(true);
//   };

//   return (
//     <>
//       <Sidebar collapsible="icon" className="border-r bg-white dark:bg-gray-950" variant="outline" {...props}>
//         <SidebarHeader className="border-b px-4 py-3">
//           {/* Logo personnalisé - Mode étendu */}
//           {!isCollapsed && (
//             <div 
//               onClick={handleLogoClick}
//               className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
//             >
//               {!logoError ? (
//                 <img 
//                   src={logocarso}
//                   alt="Carso Logo" 
//                   className="h-10 w-10 object-contain"
//                   onError={handleLogoError}
//                 />
//               ) : (
//                 <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
//                   C
//                 </div>
//               )}
//               <div className="flex-1 min-w-0">
//                 <h1 className="font-bold text-lg text-white-900 dark:text-white truncate">
//                   Carso
//                 </h1>
//                 <p className="text-xs text-gray-300 dark:text-gray-400 truncate">
//                   Gestion RH
//                 </p>
//               </div>
//             </div>
//           )}
          
//         </SidebarHeader>
        
//         <SidebarContent className="px-3 py-4 overflow-y-auto sidebar-scrollbar">
//           {/* Barre de recherche - Mode étendu */}
//           {!isCollapsed && (
//             <div className="mb-6 px-1">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Rechercher..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//                 <div className="absolute right-3 top-2.5 text-gray-400">
//                   {searchQuery ? (
//                     <button 
//                       onClick={closeSearch}
//                       className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   ) : (
//                     <Search className="w-4 h-4" />
//                   )}
//                 </div>
//               </div>
              
//               {/* Indicateur de recherche active */}
//               {searchQuery && (
//                 <div className="mt-2 px-1">
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {filteredNavItems.length} résultat{filteredNavItems.length !== 1 ? 's' : ''} trouvé{filteredNavItems.length !== 1 ? 's' : ''}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Barre de recherche - Mode collapsed */}
//           {isCollapsed && isSearchOpen && (
//             <div className="mb-4 px-1">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Rechercher..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-3 py-2 text-sm bg-gray-500 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   autoFocus
//                 />
//                 <div className="absolute right-3 top-2.5 text-gray-400">
//                   <button 
//                     onClick={closeSearch}
//                     className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Bouton de recherche - Mode collapsed */}
//           {isCollapsed && !isSearchOpen && (
//             <div className="mb-6 px-1 flex justify-center">
//               <button 
//                 onClick={() => setIsSearchOpen(true)}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group relative"
//               >
//                 <Search className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                
//                 {/* Tooltip */}
//                 <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
//                   Rechercher
//                   <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
//                 </div>
//               </button>
//             </div>
//           )}

//           {/* Navigation groupée */}
//           <div className={isCollapsed ? "space-y-2" : "space-y-6"}>
//             {groupedNavItems.length > 0 ? (
//               groupedNavItems.map((group, groupIndex) => (
//                 <div key={groupIndex}>
//                   {/* Titre de groupe - caché en mode collapsed et pendant la recherche */}
//                   {!isCollapsed && !searchQuery && (
//                     <div className="px-3 mb-2">
//                       <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
//                         {group.title}
//                       </h3>
//                     </div>
//                   )}
                  
//                   {/* Séparateur visuel en mode collapsed */}
//                   {isCollapsed && groupIndex > 0 && !searchQuery && (
//                     <div className="px-2 py-2">
//                       <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
//                     </div>
//                   )}
                  
//                   {/* Items du groupe */}
//                   <ul className="space-y-1">
//                     {group.items.map((item) => (
//                       <SidebarItem 
//                         key={item.to}
//                         to={item.to}
//                         icon={item.icon}
//                         label={item.label}
//                         isCollapsed={isCollapsed}
//                         searchQuery={searchQuery}
//                       />
//                     ))}
//                   </ul>
//                 </div>
//               ))
//             ) : (
//               // Aucun résultat trouvé
//               <div className="text-center py-8 px-4">
//                 <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">
//                   Aucun résultat trouvé pour "{searchQuery}"
//                 </p>
//                 <button 
//                   onClick={closeSearch}
//                   className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
//                 >
//                   Effacer la recherche
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Carte de mise à jour Premium */}
//           {!isCollapsed && !searchQuery && (
//             <div className="mt-6 mx-1">
//               <div 
//                 onClick={() => setShowUpdateDialog(true)}
//                 className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-indigo-600 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
//               >
//                 {/* Illustration/Icon */}
//                 <div className="flex justify-center mb-3">
//                   <div className="relative">
//                     <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                       <Sparkles className="w-8 h-8 text-white" />
//                     </div>
//                     {/* Badge "New" */}
//                     <div className="absolute -top-1 -right-1 bg-yellow-400 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
//                       NEW
//                     </div>
//                   </div>
//                 </div>

//                 {/* Texte */}
//                 <div className="text-center space-y-1.5">
//                   <p className="text-white/90 text-xs leading-relaxed">
//                     Accédez à plus de fonctionnalités
//                   </p>
//                 </div>

//                 {/* Bouton */}
//                 <button className="w-full mt-3 bg-white text-emerald-700 font-semibold text-xs py-2 px-4 rounded-lg hover:bg-white/95 transition-colors duration-200 shadow-md">
//                   VOIR LA MISE À JOUR
//                 </button>

//                 {/* Effet de brillance */}
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -z-0"></div>
//               </div>
//             </div>
//           )}

//           {/* Version collapsed de la carte premium */}
//           {isCollapsed && !isSearchOpen && (
//             <div className="mt-6 px-1 flex justify-center">
//               <button 
//                 onClick={() => setShowUpdateDialog(true)}
//                 className="relative p-2 bg-gradient-to-br from-emerald-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all group"
//               >
//                 <Sparkles className="w-5 h-5 text-white" />
//                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                
//                 {/* Tooltip */}
//                 <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
//                   Mise à jour
//                   <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
//                 </div>
//               </button>
//             </div>
//           )}
          
//         </SidebarContent>
        
//         <SidebarFooter className="border-t p-3">
//           <NavUser />
//         </SidebarFooter>
        
//         <SidebarRail />

//         {/* Dialog de mise à jour */}
//         <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <div className="flex justify-center mb-4">
//                 <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
//                   <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
//                 </div>
//               </div>
//               <DialogTitle className="text-center text-xl">
//                 Aucune mise à jour disponible
//               </DialogTitle>
//               <DialogDescription className="text-center pt-2">
//                 Vous utilisez déjà la dernière version de l'application. 
//                 Revenez plus tard pour découvrir de nouvelles fonctionnalités !
//               </DialogDescription>
//             </DialogHeader>
//             <div className="flex justify-center mt-4">
//               <button
//                 onClick={() => setShowUpdateDialog(false)}
//                 className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
//               >
//                 Compris
//               </button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </Sidebar>

//       {/* Modal du logo - S'affiche en plein écran et se ferme automatiquement */}
//       <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
//         <DialogContent className="max-w-4xl h-[80vh] flex items-center justify-center bg-transparent border-none shadow-none">
//           <div className="relative w-full h-full flex items-center justify-center">
//             {/* Logo agrandi */}
//             {!modalLogoError ? (
//               <img 
//                 src={logocarso}
//                 alt="Carso Logo" 
//                 className="max-w-full max-h-full object-contain animate-pulse"
//                 onError={handleModalLogoError}
//               />
//             ) : (
//               <div className="w-64 h-64 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-6xl">
//                 C
//               </div>
//             )}
            
//             {/* Bouton de fermeture manuel (optionnel) */}
//             <button
//               onClick={() => setShowLogoModal(false)}
//               className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
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
  LayoutDashboard,
  Wallet,
  UserCog,
  TrendingUp,
  Settings,
  Plus,
  Sparkles,
  Search,
  HelpCircle,
  Bell,
  X,
  Zap
} from "lucide-react"

import SidebarItem from "@/components/ui/sidebar-item"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "../hooks/useAuth"
import { usePermissions } from "../hooks/usePermissions"
import logocarso from "../assets/carso 7.png"

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const permissions = usePermissions();
  const { state } = useSidebar();
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [showLogoModal, setShowLogoModal] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);
  const [modalLogoError, setModalLogoError] = React.useState(false);

  const isCollapsed = state === "collapsed";

  console.log('=== DEBUG APP-SIDEBAR ===');
  console.log('1. user:', user);
  console.log('2. permissions:', permissions);
  console.log('3. canAccess type:', typeof permissions.canAccess);
  console.log('4. Test canAccess("employes"):', permissions.canAccess('employes'));
  console.log('5. Sidebar state:', state);
  console.log('========================');

  // Configuration des items de navigation avec permissions
  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Tableau de bord",
      show: true
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
      to: "/dashboard/performances",
      icon: TrendingUp,
      label: permissions.isEmploye ? "Performances" : "Performances",
      show: permissions.canAccess('performances')
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
      to: "/dashboard/profil",
      icon: UserCog,
      label: "Mon Profil",
      show: true
    },
    {
      to: "/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
      show: true,
    },
    {
      to: "/dashboard/utilisateurs",
      icon: Settings,
      label: "Gérer Utilisateurs",
      show: permissions.canAccess('utilisateurs')
    },
  ];

  // Filtrer et rechercher les items
  const filteredNavItems = navItems.filter(item => {
    if (!item.show) return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(query) || 
           item.to.toLowerCase().includes(query);
  });

  // Groupes de navigation avec recherche
  const groupedNavItems = [
    {
      title: "Principal",
      items: filteredNavItems.slice(0, 3),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Gestion",
      items: filteredNavItems.slice(3, 9),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Finance",
      items: filteredNavItems.slice(9, 11),
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Système",
      items: filteredNavItems.slice(11),
      gradient: "from-orange-500 to-red-500"
    }
  ].filter(group => group.items.length > 0);

  // Fonction pour fermer la recherche
  const closeSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  // Effet pour fermer la recherche quand la sidebar se collapse
  React.useEffect(() => {
    if (isCollapsed && isSearchOpen) {
      closeSearch();
    }
  }, [isCollapsed, isSearchOpen]);

  // Fonction pour ouvrir le modal du logo
  const handleLogoClick = () => {
    setShowLogoModal(true);
    setModalLogoError(false);
    setTimeout(() => {
      setShowLogoModal(false);
    }, 3000);
  };

  // Fonction pour gérer l'erreur du logo
  const handleLogoError = () => {
    setLogoError(true);
  };

  // Fonction pour gérer l'erreur du logo modal
  const handleModalLogoError = () => {
    setModalLogoError(true);
  };

  return (
    <>
      <Sidebar 
        collapsible="icon" 
        className="border-r border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/50 shadow-xl" 
        variant="outline" 
        {...props}
      >
        {/* ===== HEADER AVEC LOGO MODERNE ===== */}
        <SidebarHeader className="border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
          
          {!isCollapsed ? (
            <div 
              onClick={handleLogoClick}
              className="relative flex items-center gap-3 cursor-pointer group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
              
              {/* Logo container avec animation */}
              <div className="relative">
                {!logoError ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-white rounded-xl blur-md opacity-50"></div>
                    <img 
                      src={logocarso}
                      alt="Carso Logo" 
                      className="relative h-12 w-12 object-contain rounded-xl p-1.5 bg-white/90 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
                      onError={handleLogoError}
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    C
                  </div>
                )}
              </div>
              
              {/* Texte avec animation */}
              <div className="relative flex-1 min-w-0">
                <h1 className="font-bold text-xl text-white truncate group-hover:translate-x-0.5 transition-transform duration-300">
                  Carso
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-xs text-blue-100 truncate">
                    Gestion RH Premium
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={handleLogoClick}
              className="relative flex justify-center cursor-pointer group"
            >
              {!logoError ? (
                <img 
                  src={logocarso}
                  alt="Carso Logo" 
                  className="h-10 w-10 object-contain rounded-lg p-1 bg-white/90 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
                  onError={handleLogoError}
                />
              ) : (
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                  C
                </div>
              )}
            </div>
          )}
        </SidebarHeader>
        
        {/* ===== CONTENU AVEC SCROLLBAR STYLÉ ===== */}
        <SidebarContent className="px-3 py-5 overflow-y-auto sidebar-scrollbar">
          {/* ===== RECHERCHE MODERNE - Mode étendu ===== */}
          {!isCollapsed && (
            <div className="mb-6 px-1">
              <div className="relative group">
                {/* Glow effect au focus */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-30 blur transition duration-300"></div>
                
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher une page..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={closeSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Indicateur de résultats avec animation */}
              {searchQuery && (
                <div className="mt-3 px-2 animate-in slide-in-from-top duration-200">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {filteredNavItems.length} résultat{filteredNavItems.length !== 1 ? 's' : ''}
                    </span>
                    <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== RECHERCHE - Mode collapsed ===== */}
          {isCollapsed && !isSearchOpen && (
            <div className="mb-6 px-1 flex justify-center">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-200 group"
              >
                <Search className="w-5 h-5 text-slate-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200" />
                
                {/* Tooltip moderne */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl">
                  Rechercher
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                </div>
              </button>
            </div>
          )}

          {isCollapsed && isSearchOpen && (
            <div className="mb-4 px-1 animate-in slide-in-from-top duration-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  autoFocus
                />
                <button 
                  onClick={closeSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ===== NAVIGATION GROUPÉE MODERNE ===== */}
          <div className={isCollapsed ? "space-y-2" : "space-y-6"}>
            {groupedNavItems.length > 0 ? (
              groupedNavItems.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  {/* Titre de groupe avec gradient */}
                  {!isCollapsed && !searchQuery && (
                    <div className="px-3 mb-3 flex items-center gap-2">
                      <div className={`h-0.5 w-8 bg-gradient-to-r ${group.gradient} rounded-full`}></div>
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {group.title}
                      </h3>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                    </div>
                  )}
                  
                  {/* Séparateur avec gradient en mode collapsed */}
                  {isCollapsed && groupIndex > 0 && !searchQuery && (
                    <div className="px-2 py-2">
                      <div className={`h-0.5 bg-gradient-to-r ${group.gradient} rounded-full opacity-30`}></div>
                    </div>
                  )}
                  
                  {/* Items avec animations */}
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarItem 
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        isCollapsed={isCollapsed}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              // Aucun résultat - Design moderne
              <div className="text-center py-12 px-4">
                <div className="inline-flex p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl mb-4">
                  <Search className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                  Aucun résultat trouvé
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">
                  Essayez avec d'autres mots-clés
                </p>
                <button 
                  onClick={closeSearch}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Effacer la recherche
                </button>
              </div>
            )}
          </div>

          {/* ===== CARTE PREMIUM ULTRA MODERNE ===== */}
          {!isCollapsed && !searchQuery && (
            <div className="mt-8 mx-1">
              <div 
                onClick={() => setShowUpdateDialog(true)}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-5 cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Effet de brillance animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Cercles décoratifs animés */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl"></div>
                
                {/* Contenu */}
                <div className="relative">
                  {/* Icon avec animation */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400/30 rounded-2xl blur-xl animate-pulse"></div>
                      <div className="relative w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      {/* Badge NEW avec animation */}
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
                        NEW
                      </div>
                    </div>
                  </div>

                  {/* Texte avec gradient */}
                  <div className="text-center space-y-2 mb-4">
                    <h4 className="text-white font-bold text-base">
                      Version Premium
                    </h4>
                    <p className="text-emerald-50 text-xs leading-relaxed">
                      Débloquez toutes les fonctionnalités avancées et boostez votre productivité
                    </p>
                  </div>

                  {/* Bouton moderne */}
                  <button className="w-full bg-white text-emerald-700 font-bold text-sm py-2.5 px-4 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn">
                    <Zap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    DÉCOUVRIR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Version collapsed de la carte premium */}
          {isCollapsed && !isSearchOpen && (
            <div className="mt-6 px-1 flex justify-center">
              <button 
                onClick={() => setShowUpdateDialog(true)}
                className="relative p-3 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-110 group"
              >
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl">
                  Version Premium
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
                </div>
              </button>
            </div>
          )}
          
        </SidebarContent>
        
        {/* ===== FOOTER MODERNE ===== */}
        <SidebarFooter className="border-t border-slate-200/50 dark:border-slate-800/50 p-3 bg-slate-50/50 dark:bg-slate-900/50">
          <NavUser />
        </SidebarFooter>
        
        <SidebarRail />

        {/* ===== DIALOG DE MISE À JOUR MODERNE ===== */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden">
            {/* Header avec gradient */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-emerald-600 to-cyan-600"></div>
            
            <DialogHeader className="relative">
              <div className="flex justify-center mb-6 mt-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
                  <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-10 h-10 text-emerald-600 animate-pulse" />
                  </div>
                </div>
              </div>
              <DialogTitle className="text-center text-2xl font-bold text-slate-900 dark:text-white">
                Vous êtes à jour ! 🎉
              </DialogTitle>
              <DialogDescription className="text-center pt-3 text-slate-600 dark:text-slate-400">
                Vous utilisez déjà la dernière version de Carso. 
                <br />
                Revenez bientôt pour découvrir de nouvelles fonctionnalités !
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center mt-6 pb-2">
              <button
                onClick={() => setShowUpdateDialog(false)}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Parfait !
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </Sidebar>

      {/* ===== MODAL LOGO AGRANDI ===== */}
      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="max-w-4xl h-[80vh] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl border-slate-800 shadow-2xl">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Effet de glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
            
            {/* Logo avec animation */}
            {!modalLogoError ? (
              <img 
                src={logocarso}
                alt="Carso Logo" 
                className="relative max-w-full max-h-full object-contain animate-in zoom-in duration-500"
                onError={handleModalLogoError}
              />
            ) : (
              <div className="relative w-80 h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-9xl shadow-2xl animate-in zoom-in duration-500">
                C
              </div>
            )}
            
            {/* Bouton de fermeture stylé */}
            <button
              onClick={() => setShowLogoModal(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-110 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            {/* Timer indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium">
                Fermeture automatique...
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}