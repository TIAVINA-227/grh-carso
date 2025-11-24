// frontend/src/components/nav-user.jsx
import { useNavigate } from "react-router-dom";
import { 
  BadgeCheck, 
  Bell, 
  ChevronsUpDown, 
  LogOut } from "lucide-react";
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
  const isOnline = user && onlineUsers.includes(user.id);

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

  // Générer les badges de rôle
  const roleBadges = () => {
    if (!user?.role) return [];
    
    const badges = [];
    if (user.role === "SUPER_ADMIN") {
      badges.push({ label: "Super Admin", color: "text-red-400 bg-red-50" });
    } else if (user.role === "ADMIN") {
      badges.push({ label: "Admin", color: "text-blue-400 bg-blue-50" });
    } else if (user.role === "EMPLOYE") {
      badges.push({ label: "Employé", color: "text-green-400 bg-green-50" });
    }
    return badges;
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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Avatar avec indicateur de statut en ligne */}
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  {profil.avatar ? (
                    <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                  ) : (
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitiales()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Point indicateur en ligne/hors ligne */}
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={isOnline ? "En ligne" : "Hors ligne"}
                />
              </div>

              {/* Informations utilisateur */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {getNomComplet()}
                </span>
              </div>

              {/* Icône chevron */}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Menu déroulant */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* En-tête du menu */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="relative pb-5">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                    <AvatarFallback className="rounded-lg">
                      {getInitiales()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Point indicateur */}
                  <span
                    className={`absolute bottom-5 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex flex-col items-center gap-2 flex-wrap">
                    <span className="truncate font-medium">
                      {getNomComplet()}
                    </span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {profil.email}
                  </span>

                  <DropdownMenuSeparator />

                  {/* Badges de rôle */}
                    {roleBadges().map((badge, index) => (
                      <span
                        key={index}
                        className={`text-xs font-semibold ${badge.color} px-2 py-0.5 rounded-full`}
                      >
                        {badge.label}
                      </span>
                    ))}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Options du menu */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/dashboard/profil")}>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Mon compte
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/dashboard/notifications")}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Déconnexion */}
            <DropdownMenuItem
              onClick={() => setConfirmDeconexionOpen(true)}
              className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Modal de confirmation de déconnexion */}
        <AlertDialog open={confirmDeconexionOpen} onOpenChange={setConfirmDeconexionOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir vous déconnecter ? 
                Vous devrez vous reconnecter pour accéder à votre compte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmLogout}
                className="bg-red-600 text-white hover:bg-red-700"
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