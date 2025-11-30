// frontend/src/components/nav-user.jsx
import { useNavigate } from "react-router-dom";
import { 
  BadgeCheck, 
  Bell, 
  ChevronsUpDown, 
  LogOut,
  User,
  Settings,
  Shield,
  Mail,
  HelpCircle
} from "lucide-react";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { Badge } from "@/components/ui/badge";

export function NavUser() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [confirmDeconexionOpen, setConfirmDeconexionOpen] = useState(false);
  
  // État du profil utilisateur
  const [profil, setProfil] = useState({
    nom_utilisateur: user?.nom_utilisateur || "",
    prenom_utilisateur: user?.prenom_utilisateur || "",
    email: user?.email || "",
    avatar: user?.avatar || null,
  });

  // Statut en ligne via Socket.io
  const { onlineUsers } = useSocket(user?.id || null);
  const isOnline = user && onlineUsers.includes(String(user.id));

  // Charger le profil au montage du composant
  useEffect(() => {
    if (user?.id) {
      fetchProfil();
    }
  }, [user?.id]);

  // Récupérer les données du profil depuis l'API
  const fetchProfil = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfil({
          nom_utilisateur: data.nom_utilisateur || "",
          prenom_utilisateur: data.prenom_utilisateur || "",
          email: data.email || "",
          avatar: data.avatar || null,
        });
      }
    } catch (error) {
      console.error("❌ Erreur chargement profil:", error);
    }
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    console.log("🔴 Déconnexion en cours...");
    logout();
    navigate("/", { replace: true });
    console.log("✅ Déconnexion réussie");
  };

  const confirmLogout = () => {
    setConfirmDeconexionOpen(false);
    handleLogout();
  };

  // Format du rôle
  const getFormattedRole = (role) => {
    const roles = {
      'SUPER_ADMIN': 'Super Administrateur',
      'ADMIN': 'Administrateur',
      'MANAGER': 'Manager',
      'EMPLOYE': 'Employé'
    };
    return roles[role] || role;
  };

  // Couleur du badge selon le rôle
  const getRoleColor = (role) => {
    const colors = {
      'SUPER_ADMIN': 'bg-gradient-to-r from-purple-600 to-pink-600',
      'ADMIN': 'bg-gradient-to-r from-blue-600 to-cyan-600',
      'MANAGER': 'bg-gradient-to-r from-emerald-600 to-teal-600',
      'EMPLOYE': 'bg-gradient-to-r from-gray-600 to-slate-600'
    };
    return colors[role] || 'bg-gradient-to-r from-gray-600 to-slate-600';
  };

  // Obtenir les initiales pour l'avatar
  const getInitiales = () => {
    const prenom = profil.prenom_utilisateur || "";
    const nom = profil.nom_utilisateur || "";
    return `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase() || "U";
  };

  // Obtenir le nom complet
  const getNomComplet = () => {
    const prenom = profil.prenom_utilisateur || "";
    const nom = profil.nom_utilisateur || "";
    return `${prenom} ${nom}`.trim() || profil.email || "Utilisateur";
  };

  // Ne rien afficher si l'utilisateur n'est pas connecté
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 rounded-2xl"
            >
              {/* Avatar avec indicateur de statut en ligne */}
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800 shadow-lg">
                  {profil.avatar ? (
                    <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                  ) : (
                    <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitiales()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Point indicateur en ligne/hors ligne */}
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    isOnline ? "bg-green-500 " : "bg-gray-400"
                  }`}
                  title={isOnline ? "En ligne" : "Hors ligne"}
                />
              </div>

              {/* Informations utilisateur */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900 dark:text-white">
                  {getNomComplet()}
                </span>
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {getFormattedRole(user.role)}
                </span>
              </div>

              {/* Icône chevron */}
              <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Menu déroulant */}
          <DropdownMenuContent
            className="w-80 p-0 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl bg-white dark:bg-gray-950"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            {/* En-tête du menu */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-t-2xl border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    {profil.avatar ? (
                      <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                    ) : (
                      <AvatarFallback className="text-base font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitiales()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {/* Point indicateur en ligne/hors ligne */}
                  <span
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                      isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                    {getNomComplet()}
                  </h3>
                  <Badge className={`${getRoleColor(user.role)} text-white border-0 text-xs font-medium mt-2`}>
                    {getFormattedRole(user.role)}
                  </Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {profil.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Options du menu */}
            <div className="p-2">
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => navigate("/dashboard/profil")}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <div>
                    <span className="font-medium">Mon profil</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Gérer vos informations personnelles
                    </p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate("/dashboard/notifications")}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  <div>
                    <span className="font-medium">Notifications</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Gérer vos alertes et préférences
                    </p>
                  </div>
                </DropdownMenuItem>

              </DropdownMenuGroup>
            </div>

            <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />

            {/* Déconnexion */}
            <div className="p-2">
              <DropdownMenuItem
                onClick={() => setConfirmDeconexionOpen(true)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 font-medium"
              >
                <LogOut className="h-5 w-5" />
                <div>
                  <span>Se déconnecter</span>
                  <p className="text-xs text-red-400/70 dark:text-red-300/70 mt-0.5">
                    Déconnexion sécurisée de votre compte
                  </p>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Modal de confirmation de déconnexion */}
        <AlertDialog open={confirmDeconexionOpen} onOpenChange={setConfirmDeconexionOpen}>
          <AlertDialogContent className="border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl bg-white dark:bg-gray-950">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Confirmer la déconnexion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vous devrez vous reconnecter pour accéder à votre compte et continuer à utiliser l'application.
              </p>
            </div>
            <AlertDialogFooter className="flex gap-3">
              <AlertDialogCancel className="flex-1 rounded-xl border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmLogout}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Se déconnecter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}