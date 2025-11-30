import React, { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  Trash2,
  Filter,
  Search,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useNotifications } from "../hooks/useNotifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";

const STATUS_META = {
  success: { 
    label: "Succès", 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    tone: "text-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 shadow-sm",
    badgeClass: "bg-green-100 text-green-800"
  },
  warning: { 
    label: "Attention", 
    icon: <ShieldAlert className="h-4 w-4" />, 
    tone: "text-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 shadow-sm",
    badgeClass: "bg-yellow-100 text-yellow-800"
  },
  error: { 
    label: "Erreur", 
    icon: <ShieldAlert className="h-4 w-4" />, 
    tone: "text-red-600 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 shadow-sm",
    badgeClass: "bg-red-100 text-red-800"
  },
  info: { 
    label: "Info", 
    icon: <Bell className="h-4 w-4" />, 
    tone: "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 shadow-sm",
    badgeClass: "bg-blue-100 text-blue-800"
  },
};

const FILTERS = [
  { value: "all", label: "Toutes" },
  { value: "unread", label: "Non lues" },
  { value: "read", label: "Lues" },
  { value: "alerts", label: "Alertes" },
];

const formatRelativeTime = (value) => {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 60_000) return "À l'instant";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const token = user?.token || localStorage.getItem("token");
  const { socket } = useSocket(user?.id || null);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    reload,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
  } = useNotifications({ userId: user?.id || null, token, socket });

  const [activeFilter, setActiveFilter] = useState("all");
  const [actionId, setActionId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchSearch = 
        notif.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message?.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeFilter === "unread") return !notif.lue && matchSearch;
      if (activeFilter === "read") return notif.lue && matchSearch;
      if (activeFilter === "alerts")
        return ["warning", "error"].includes(notif.type) && matchSearch;
      return matchSearch;
    });
  }, [notifications, activeFilter, searchTerm]);

  const handleMarkOne = async (notif) => {
    if (notif.lue) return;
    setActionId(notif.id);
    try {
      await markOneAsRead(notif.id);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionId(id);
    try {
      await deleteOne(id);
    } finally {
      setActionId(null);
    }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusBadge = (type) => {
    const status = STATUS_META[type] || STATUS_META.info;
    return (
      <Badge className={status.badgeClass}>
        {status.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header moderne */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-cyan-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/30">
                <Bell className="h-8 w-8 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Gérez et consultez toutes les alertes en temps réel
                </p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 transition-colors border border-slate-500/30 text-sm font-medium flex items-center gap-2"
                >
                  <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Rafraîchir
                </button>
                <button
                  onClick={handleMarkAll}
                  disabled={unreadCount === 0 || markingAll}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {markingAll && <Loader2 className="h-4 w-4 animate-spin" />}
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-primary text-primary-foreground">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-primary-foreground/80 text-sm font-medium">Total</p>
                <Bell className="w-8 h-8 text-primary-foreground/80" />
              </div>
              <p className="text-4xl font-bold">{notifications.length}</p>
              <div className="flex items-center gap-1 mt-2 text-primary-foreground/80 text-xs">
                <Bell className="w-3 h-3" />
                <span>Notifications</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white dark:from-amber-600 dark:to-amber-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-amber-100 text-sm font-medium">Non Lues</p>
                <ShieldAlert className="w-8 h-8 text-white/80" />
              </div>
              <p className="text-4xl font-bold">{unreadCount}</p>
              <div className="flex items-center gap-1 mt-2 text-amber-100 text-xs">
                <ShieldAlert className="w-3 h-3" />
                <span>À traiter</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white dark:from-emerald-600 dark:to-emerald-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-emerald-100 text-sm font-medium">Lues</p>
                <CheckCircle2 className="w-8 h-8 text-white/80" />
              </div>
              <p className="text-4xl font-bold">{notifications.length - unreadCount}</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-100 text-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>Traitées</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des notifications */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Notifications
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''} trouvée{filteredNotifications.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre ou message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 pl-10 pr-4 text-base rounded-lg bg-background border border-border"
                />
              </div>
              
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  {FILTERS.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                      {filter.value === "unread" && unreadCount > 0 && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-6" />

            {error && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 dark:bg-red-950/20 px-6 py-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Chargement des notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Bell className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {searchTerm || activeFilter !== "all" 
                      ? "Aucune notification trouvée avec ces filtres" 
                      : "Aucune notification"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || activeFilter !== "all"
                      ? "Essayez de modifier vos critères de recherche"
                      : "Vous n'avez pas encore de notifications"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => {
                  const status = STATUS_META[notif.type] || STATUS_META.info;
                  const busy = actionId === notif.id;
                  
                  return (
                    <div
                      key={notif.id}
                      className={`
                        rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-lg
                        ${notif.lue 
                          ? "bg-white dark:bg-slate-950 border-border" 
                          : "bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent border-blue-200 dark:border-blue-800"
                        }
                      `}
                    >
                      <div className="flex gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${status.tone} transition-transform hover:scale-110 flex-shrink-0`}>
                          {status.icon}
                        </div>

                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1 flex-1 min-w-0">
                              <p className="font-bold text-lg text-foreground">{notif.titre}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                            </div>
                            <div className="text-right text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap">
                              {formatRelativeTime(notif.date_creation)}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Badge 
                              variant={notif.lue ? "secondary" : "default"}
                              className={`${!notif.lue ? 'bg-blue-600 hover:bg-blue-700' : ''} font-semibold`}
                            >
                              {notif.lue ? "Lu" : "Non lu"}
                            </Badge>
                            {getStatusBadge(notif.type)}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {!notif.lue && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleMarkOne(notif)}
                                disabled={busy}
                                className="border-2 hover:bg-blue-100 dark:hover:bg-blue-950/30 hover:border-blue-300 transition-all"
                              >
                                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Marquer comme lu
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(notif.id)}
                              disabled={busy}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-2 border-transparent hover:border-red-200 transition-all"
                            >
                              {busy ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}