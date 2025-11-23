//frontend/src/components/topbar.jsx
import React, { useState, useEffect } from "react";
import { Sun, Moon, Bell, Search, Menu, User, Settings, LogOut, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // États
  const [theme, setTheme] = useState("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "Nouveau congé en attente",
      message: "Jean Dupont a soumis une demande de congé",
      time: "Il y a 5 min",
      read: false
    },
    {
      id: 2,
      type: "success",
      title: "Validation effectuée",
      message: "La demande de congé de Marie Martin a été approuvée",
      time: "Il y a 1h",
      read: false
    },
    {
      id: 3,
      type: "warning",
      title: "Rappel",
      message: "3 demandes en attente de validation",
      time: "Il y a 2h",
      read: true
    }
  ]);

  // Profil utilisateur
  const [profil, setProfil] = useState({
    nom_utilisateur: user?.nom_utilisateur || "",
    prenom_utilisateur: user?.prenom_utilisateur || "",
    email: user?.email || "",
    avatar: user?.avatar || null
  });

  // Charger le profil utilisateur
  useEffect(() => {
    const fetchProfil = async () => {
      if (!user?.id) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
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
        console.error("❌ Erreur chargement profil:", error);
      }
    };

    if (user?.id) {
      fetchProfil();
    }
  }, [user?.id]);

  // Gestion du mode sombre
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Supprimer une notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

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

  // Recherche (à implémenter selon vos besoins)
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche:", searchQuery);
    // TODO: Implémenter la logique de recherche
  };

  // Icône de notification selon le type
  const getNotifIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };
  
    if (!user) return null;
    
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        
        {/* ===== GAUCHE : Trigger Sidebar + Recherche ===== */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger 
            className=" w-10"
          />
          
          {/* Recherche Desktop */}
          <div className="hidden md:block w-full max-w-lg">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search size={16} />
                </span>
                <input
                  type="search"
                  placeholder="Rechercher un employé, congé, contrat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border px-10 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Recherche Mobile */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-muted/50 transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={18} />
          </button>
        </div>

        {/* ===== DROITE : Actions ===== */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Bouton Mode Sombre */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted/50 transition-colors"
            title={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
          >
            {theme === "light" ? (
              <Moon size={18} className="text-gray-700" />
            ) : (
              <Sun size={18} className="text-yellow-500" />
            )}
          </button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notif.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getNotifIcon(notif.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{notif.title}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Menu Profil Utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  {profil.avatar ? (
                    <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                  ) : (
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitiales()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden lg:inline-block text-sm font-medium">
                  {getNomComplet()}
                </span>
              </button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== Barre de recherche Mobile (expandable) ===== */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={16} />
              </span>
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border px-10 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}