//frontend/src/components/nav-user.jsx
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
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

export function NavUser() {
  const { user, logout } = useAuth(); // ✅ Récupérer logout du contexte
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [confirmDeconexionOpen, setConfirmDeconexionOpen] = useState(false); // ✅ Correction du nom

    // Profil utilisateur
    const [profil, setProfil] = useState({
      nom_utilisateur: user?.nom_utilisateur || "",
      prenom_utilisateur: user?.prenom_utilisateur || "",
      email: user?.email || "",
      avatar: user?.avatar || null
    });

    useEffect(() => {
      if (user?.id) {
        fetchProfil();
      }
    },);

      // Initiales pour l'avatar
  const getInitiales = () => {
    const prenom = profil.prenom_utilisateur || "";
    const nom = profil.nom_utilisateur || "";
    return `${prenom[0] || ''}${nom[0] || ''}`.toUpperCase();
  };
  // Nom complet
  const getNomComplet = () => {
    const prenom = profil.prenom_utilisateur || "";
    const nom = profil.nom_utilisateur || "";
    return `${prenom} ${nom}`.trim() || profil.email || "Utilisateur";
  };

  const fetchProfil = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfil({
          nom_utilisateur: data.nom_utilisateur || "",
          prenom_utilisateur: data.prenom_utilisateur || "",
          email: data.email || "",
          avatar: data.avatar || null
        });
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  };

  // ✅ Fonction de déconnexion complète
  const handleLogout = () => {
    console.log('🔴 Déconnexion demandée');
    
    // 1. Appeler logout du contexte (supprime token + user)
    logout();
    
    // 2. Rediriger vers login avec replace
    navigate("/", { replace: true });
    
    console.log('✅ Déconnexion terminée');
  };

  // ✅ Fonction de confirmation
  const confirmLogout = () => {
    setConfirmDeconexionOpen(false);
    handleLogout();
  };

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                 {profil.avatar ? (
                    <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                      ) : (
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitiales()}
                    </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.prenom_utilisateur || user.nom_utilisateur || 'Utilisateur'}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.nom_utilisateur} />
                  <AvatarFallback className="rounded-lg">
                    {user.prenom_utilisateur?.[0] || user.nom_utilisateur?.[0] || 'U'}
                    {user.nom_utilisateur?.[1] || ''}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.prenom_utilisateur || user.nom_utilisateur}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/dashboard/profil')}>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Mon compte
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* ✅ Bouton déconnexion avec modal de confirmation */}
            <DropdownMenuItem
              onClick={() => setConfirmDeconexionOpen(true)}
              className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ✅ Modal de confirmation */}
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
                className="bg-red-600 text-white hover:bg-red-700">
                Se déconnecter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}