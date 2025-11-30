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
  ChartColumnIncreasing,
  MonitorCog,
  Plus,
  Sparkles,
  Search,
  Settings,
  HelpCircle,
  Bell,
  X
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
      icon: ChartColumnIncreasing,
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
      show: true, // ou permissions.canAccess('notifications') si tu gères ce droit
    },
    {
      to: "/dashboard/utilisateurs",
      icon: MonitorCog,
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
      items: filteredNavItems.slice(0, 3)
    },
    {
      title: "Gestion",
      items: filteredNavItems.slice(3, 9)
    },
    {
      title: "Finance",
      items: filteredNavItems.slice(9, 11)
    },
    {
      title: "Système",
      items: filteredNavItems.slice(11)
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
    // Fermer automatiquement après 3 secondes
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
      <Sidebar collapsible="icon" className="border-r bg-white dark:bg-gray-950" variant="outline" {...props}>
        <SidebarHeader className="border-b px-4 py-3">
          {/* Logo personnalisé - Mode étendu */}
          {!isCollapsed && (
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
            >
              {!logoError ? (
                <img 
                  src={logocarso}
                  alt="Carso Logo" 
                  className="h-10 w-10 object-contain"
                  onError={handleLogoError}
                />
              ) : (
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-lg text-white-900 dark:text-white truncate">
                  Carso
                </h1>
                <p className="text-xs text-gray-300 dark:text-gray-400 truncate">
                  Gestion RH
                </p>
              </div>
            </div>
          )}
          
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-4 overflow-y-auto sidebar-scrollbar">
          {/* Barre de recherche - Mode étendu */}
          {!isCollapsed && (
            <div className="mb-6 px-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  {searchQuery ? (
                    <button 
                      onClick={closeSearch}
                      className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </div>
              </div>
              
              {/* Indicateur de recherche active */}
              {searchQuery && (
                <div className="mt-2 px-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredNavItems.length} résultat{filteredNavItems.length !== 1 ? 's' : ''} trouvé{filteredNavItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Barre de recherche - Mode collapsed */}
          {isCollapsed && isSearchOpen && (
            <div className="mb-4 px-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-500 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <button 
                    onClick={closeSearch}
                    className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bouton de recherche - Mode collapsed */}
          {isCollapsed && !isSearchOpen && (
            <div className="mb-6 px-1 flex justify-center">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group relative"
              >
                <Search className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Rechercher
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </button>
            </div>
          )}

          {/* Navigation groupée */}
          <div className={isCollapsed ? "space-y-2" : "space-y-6"}>
            {groupedNavItems.length > 0 ? (
              groupedNavItems.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Titre de groupe - caché en mode collapsed et pendant la recherche */}
                  {!isCollapsed && !searchQuery && (
                    <div className="px-3 mb-2">
                      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        {group.title}
                      </h3>
                    </div>
                  )}
                  
                  {/* Séparateur visuel en mode collapsed */}
                  {isCollapsed && groupIndex > 0 && !searchQuery && (
                    <div className="px-2 py-2">
                      <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                    </div>
                  )}
                  
                  {/* Items du groupe */}
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
              // Aucun résultat trouvé
              <div className="text-center py-8 px-4">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Aucun résultat trouvé pour "{searchQuery}"
                </p>
                <button 
                  onClick={closeSearch}
                  className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Effacer la recherche
                </button>
              </div>
            )}
          </div>

          {/* Carte de mise à jour Premium */}
          {!isCollapsed && !searchQuery && (
            <div className="mt-6 mx-1">
              <div 
                onClick={() => setShowUpdateDialog(true)}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-indigo-600 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Illustration/Icon */}
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    {/* Badge "New" */}
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      NEW
                    </div>
                  </div>
                </div>

                {/* Texte */}
                <div className="text-center space-y-1.5">
                  <h3 className="text-white font-bold text-sm">
                    Mise à jour de l'application disponible
                  </h3>
                  <p className="text-white/90 text-xs leading-relaxed">
                    Accédez à plus de fonctionnalités
                  </p>
                </div>

                {/* Bouton */}
                <button className="w-full mt-3 bg-white text-emerald-700 font-semibold text-xs py-2 px-4 rounded-lg hover:bg-white/95 transition-colors duration-200 shadow-md">
                  VOIR LA MISE À JOUR
                </button>

                {/* Effet de brillance */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -z-0"></div>
              </div>
            </div>
          )}

          {/* Version collapsed de la carte premium */}
          {isCollapsed && !isSearchOpen && (
            <div className="mt-6 px-1 flex justify-center">
              <button 
                onClick={() => setShowUpdateDialog(true)}
                className="relative p-2 bg-gradient-to-br from-emerald-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all group"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Mise à jour
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </button>
            </div>
          )}

          {/* Actions rapides en mode collapsed
          {isCollapsed && !isSearchOpen && (
            <div className="mt-6 space-y-2 px-1">
              <div className="px-2 py-2">
                <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <button className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center group relative">
                <Settings className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                
                {/* Tooltip 
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Paramètres
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </button>
              <button className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center group relative">
                <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                
                {/* Tooltip 
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Aide
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </button>
            </div>*/}
          
        </SidebarContent>
        
        <SidebarFooter className="border-t p-3">
          <NavUser />
        </SidebarFooter>
        
        <SidebarRail />

        {/* Dialog de mise à jour */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Aucune mise à jour disponible
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Vous utilisez déjà la dernière version de l'application. 
                Revenez plus tard pour découvrir de nouvelles fonctionnalités !
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowUpdateDialog(false)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Compris
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </Sidebar>

      {/* Modal du logo - S'affiche en plein écran et se ferme automatiquement */}
      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="max-w-4xl h-[80vh] flex items-center justify-center bg-transparent border-none shadow-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Logo agrandi */}
            {!modalLogoError ? (
              <img 
                src={logocarso}
                alt="Carso Logo" 
                className="max-w-full max-h-full object-contain animate-pulse"
                onError={handleModalLogoError}
              />
            ) : (
              <div className="w-64 h-64 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-6xl">
                C
              </div>
            )}
            
            {/* Bouton de fermeture manuel (optionnel) */}
            <button
              onClick={() => setShowLogoModal(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}