import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, Search, X, Loader2, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useNotifications } from "../hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatRelativeTime = (value) => {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return "À l'instant";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user?.token || localStorage.getItem("token");
  const { socket } = useSocket(user?.id || null);
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
  } = useNotifications({ userId: user?.id || null, token, socket });
  
  // États
  const [theme, setTheme] = useState("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Profil utilisateur
  const [profil, setProfil] = useState({
    nom_utilisateur: user?.nom_utilisateur || "",
    prenom_utilisateur: user?.prenom_utilisateur || "",
    email: user?.email || "",
    avatar: user?.avatar || null
  });

  // Détecter le scroll pour effet glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleNotificationClick = async (notification) => {
    if (notification.lue) return;
    try {
      await markOneAsRead(notification.id);
    } catch (err) {
      console.error("❌ Impossible de marquer la notification :", err);
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await deleteOne(notificationId);
    } catch (err) {
      console.error("❌ Impossible de supprimer la notification :", err);
    }
  };

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

  // Recherche intelligente
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    
    // Détecter le type de recherche et naviguer vers la page appropriée
    // Les pages utiliseront le paramètre de recherche pour filtrer
    if (query.includes('employé') || query.includes('employee') || query.includes('employe')) {
      navigate('/dashboard/employes', { state: { searchQuery: query } });
    } else if (query.includes('contrat') || query.includes('cdi') || query.includes('cdd')) {
      navigate('/dashboard/contrats', { state: { searchQuery: query } });
    } else if (query.includes('congé') || query.includes('conge') || query.includes('vacance')) {
      navigate('/dashboard/conges', { state: { searchQuery: query } });
    } else if (query.includes('absence') || query.includes('absent')) {
      navigate('/dashboard/absences', { state: { searchQuery: query } });
    } else if (query.includes('présence') || query.includes('presence') || query.includes('présent')) {
      navigate('/dashboard/presences', { state: { searchQuery: query } });
    } else if (query.includes('paiement') || query.includes('salaire') || query.includes('pay')) {
      navigate('/dashboard/paiements', { state: { searchQuery: query } });
    } else if (query.includes('bulletin') || query.includes('salaire')) {
      navigate('/dashboard/bulletins', { state: { searchQuery: query } });
    } else if (query.includes('poste') || query.includes('job')) {
      navigate('/dashboard/postes', { state: { searchQuery: query } });
    } else if (query.includes('département') || query.includes('departement') || query.includes('volet')) {
      navigate('/dashboard/departements', { state: { searchQuery: query } });
    } else if (query.includes('utilisateur') || query.includes('user') || query.includes('admin')) {
      navigate('/dashboard/utilisateurs', { state: { searchQuery: query } });
    } else if (query.includes('performance') || query.includes('évaluation') || query.includes('evaluation')) {
      navigate('/dashboard/performances', { state: { searchQuery: query } });
    } else {
      // Par défaut, chercher dans les employés (le plus commun)
      navigate('/dashboard/employes', { state: { searchQuery: query } });
    }
    
    // Fermer la recherche mobile si ouverte
    setSearchOpen(false);
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

  // Badge couleur selon type de notification
  const getNotifBadgeColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };
  
  if (!user) return null;
    
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5' 
          : 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-3.5">
        
        {/* ===== GAUCHE : Trigger Sidebar + Recherche ===== */}
        <div className="flex items-center gap-4 flex-1">
          {/* Sidebar Trigger avec effet moderne */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
            <SidebarTrigger className="relative h-10 w-10 rounded-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-200" />
          </div>
          
          {/* Recherche Desktop avec effet glassmorphism */}
          <div className="hidden md:block w-full max-w-xl">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                {/* Effet glow au focus */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition duration-300"></div>
                
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500">
                    <Search size={18} strokeWidth={2} />
                  </span>
                  <input
                    type="search"
                    placeholder="Rechercher un employé, congé, contrat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-12 py-2.5 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Recherche Mobile avec animation */}
          <button 
            className="md:hidden relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-200 group"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* ===== DROITE : Actions ===== */}
        <div className="flex items-center gap-2">
          
          {/* Bouton Mode Sombre avec animation */}
          <button 
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-950/30 dark:hover:to-orange-950/30 transition-all duration-300 group overflow-hidden"
            title={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            {theme === "light" ? (
              <Moon size={18} className="text-slate-700 dark:text-slate-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            ) : (
              <Sun size={18} className="text-amber-500 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
            )}
          </button>

          {/* Notifications avec badge animé */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-200 group">
                <Bell size={18} className="text-slate-700 dark:text-slate-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-[10px] text-white font-bold shadow-lg shadow-red-500/50 animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                    {/* Cercle d'animation */}
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                  </>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden" align="end">
              {/* En-tête moderne */}
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Notifications</h3>
                    <p className="text-xs text-blue-100">{notifications.length} notification{notifications.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs text-white hover:bg-white/20 hover:text-white border-white/30"
                  >
                    Tout lire
                  </Button>
                )}
              </div>
              
              <div className="max-h-[450px] overflow-y-auto">
                {notificationsError && (
                  <div className="p-4 mx-4 mt-4 text-sm bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                    {notificationsError}
                  </div>
                )}
                {notificationsLoading ? (
                  <div className="p-10 flex flex-col items-center justify-center gap-3 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm">Chargement...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                      <Bell className="h-10 w-10 opacity-50" />
                    </div>
                    <p className="font-medium">Aucune notification</p>
                    <p className="text-xs text-slate-400 mt-1">Vous êtes à jour !</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`relative p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-200 cursor-pointer group ${
                          !notif.lue ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                        }`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        {/* Indicateur non lu */}
                        {!notif.lue && (
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 ${getNotifBadgeColor(notif.type)} rounded-r-full`}></div>
                        )}
                        
                        <div className="flex items-start gap-3 pl-3">
                          <div className={`flex-shrink-0 mt-1 p-2 ${getNotifBadgeColor(notif.type)} bg-opacity-10 rounded-lg`}>
                            <span className="text-xl">{getNotifIcon(notif.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-sm text-slate-900 dark:text-white">{notif.titre}</p>
                              <button
                                onClick={(e) => handleDeleteNotification(notif.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-400">
                                {formatRelativeTime(notif.date_creation)}
                              </span>
                              {!notif.lue && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Séparateur vertical avec gradient */}
          <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>

          {/* Menu Profil Utilisateur moderne */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-200 group">
                <div className="relative">
                  <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-900 shadow-lg group-hover:ring-blue-500/50 transition-all duration-200">
                    {profil.avatar ? (
                      <AvatarImage src={profil.avatar} alt={getNomComplet()} />
                    ) : (
                      <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitiales()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* Indicateur en ligne */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    {getNomComplet()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    {user.role || 'Utilisateur'}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== Barre de recherche Mobile (expandable) avec animation ===== */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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