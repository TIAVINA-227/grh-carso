// frontend/src/pages/Sessions.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { 
  Clock, 
  LogIn, 
  LogOut, 
  User, 
  Calendar, 
  TrendingUp, 
  Activity,
  RefreshCw,
  Filter,
  Download,
  Globe,
  Monitor,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";
import * as sessionService from "../services/sessionService";
import * as utilisateurService from "../services/utilisateurService";

export default function Sessions() {
  const { user } = useAuth();
  const permissions = usePermissions();
  const [sessions, setSessions] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadSessions = useCallback(async () => {
    try {
      let sessionsData;
      
      if (permissions.isSuperAdmin || permissions.isAdmin) {
        // Admins voient toutes les sessions
        const result = await sessionService.getAllSessions({ limit: 200 });
        sessionsData = result.sessions || [];
      } else {
        // Employés voient seulement leurs sessions
        sessionsData = await sessionService.getSessionsByUser(user?.id, { limit: 200 });
        sessionsData = sessionsData.sessions || sessionsData;
      }
      
      setSessions(sessionsData);
    } catch (err) {
      console.error("Erreur lors du chargement des sessions:", err);
      showToast("Erreur lors du chargement des sessions", 'error');
    }
  }, [permissions.isSuperAdmin, permissions.isAdmin, user, showToast]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Charger les utilisateurs si admin
        if (permissions.isSuperAdmin || permissions.isAdmin) {
          const utilisateursData = await utilisateurService.getUtilisateurs();
          // L'API retourne { success: true, count: ..., utilisateurs: [...] }
          // ou directement un tableau selon l'implémentation
          const utilisateursArray = Array.isArray(utilisateursData) 
            ? utilisateursData 
            : (utilisateursData?.utilisateurs || utilisateursData?.data || []);
          setUtilisateurs(utilisateursArray);
        }

        // Charger les sessions
        await loadSessions();
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setToast({ message: "Erreur lors du chargement des données", type: 'error' });
        setTimeout(() => setToast(null), 3000);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [permissions.isSuperAdmin, permissions.isAdmin, user, loadSessions]);

  // Filtrer les sessions selon le rôle et l'utilisateur sélectionné
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Filtrer par utilisateur si sélectionné (pour les admins)
    if (selectedUtilisateur && (permissions.isSuperAdmin || permissions.isAdmin)) {
      filtered = filtered.filter(s => s.utilisateurId === parseInt(selectedUtilisateur));
    }

    return filtered;
  }, [sessions, selectedUtilisateur, permissions.isSuperAdmin, permissions.isAdmin]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const sessionsAujourdhui = filteredSessions.filter(s => {
      const date = new Date(s.heure_connexion);
      const aujourdhui = new Date();
      return date.toDateString() === aujourdhui.toDateString();
    }).length;

    const dureeTotale = filteredSessions
      .filter(s => s.duree_minutes)
      .reduce((sum, s) => sum + s.duree_minutes, 0);

    const dureeMoyenne = filteredSessions.filter(s => s.duree_minutes).length > 0
      ? dureeTotale / filteredSessions.filter(s => s.duree_minutes).length
      : 0;

    const sessionsActives = filteredSessions.filter(s => !s.heure_deconnexion).length;

    return {
      total: totalSessions,
      aujourdhui: sessionsAujourdhui,
      dureeTotale: Math.round(dureeTotale),
      dureeMoyenne: Math.round(dureeMoyenne),
      actives: sessionsActives,
    };
  }, [filteredSessions]);

  // Formater la durée
  const formatDuree = (minutes) => {
    if (!minutes) return "En cours...";
    if (minutes < 60) return `${minutes} min`;
    const heures = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${heures}h ${mins}min` : `${heures}h`;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtenir le nom de l'utilisateur
  const getUtilisateurName = (session) => {
    if (session.utilisateur) {
      return `${session.utilisateur.prenom_utilisateur || ''} ${session.utilisateur.nom_utilisateur || ''}`.trim() || session.utilisateur.email;
    }
    return `Utilisateur #${session.utilisateurId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-blue-600' : 'bg-red-600'
        } text-white animate-[slideIn_0.3s_ease-out]`}>
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-600 shadow-2xl shadow-blue-500/30">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 bg-clip-text text-transparent">
                  {permissions.isEmploye ? 'Mes Sessions' : 'Historique des Sessions'}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {permissions.isEmploye 
                    ? 'Consultez l\'historique de vos connexions et déconnexions'
                    : 'Suivi des connexions et déconnexions de tous les utilisateurs'}
                </p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} session{stats.total > 1 ? 's' : ''} au total
              </div>
              <div className="flex items-center gap-2">
                {(permissions.isSuperAdmin || permissions.isAdmin) && (
                  <select
                    value={selectedUtilisateur || ''}
                    onChange={(e) => setSelectedUtilisateur(e.target.value || null)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Tous les utilisateurs</option>
                    {Array.isArray(utilisateurs) && utilisateurs.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.prenom_utilisateur || ''} {u.nom_utilisateur || ''} ({u.email})
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={loadSessions}
                  className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques modernes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Sessions</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium mb-2">Aujourd'hui</p>
                  <p className="text-3xl font-bold">{stats.aujourdhui}</p>
                </div>
                <Calendar className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Durée Totale</p>
                  <p className="text-2xl font-bold">{formatDuree(stats.dureeTotale)}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium mb-2">Durée Moyenne</p>
                  <p className="text-2xl font-bold">{formatDuree(stats.dureeMoyenne)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium mb-2">Sessions Actives</p>
                  <p className="text-3xl font-bold">{stats.actives}</p>
                </div>
                <LogIn className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des sessions */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Sessions
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredSessions.length} session{filteredSessions.length > 1 ? 's' : ''} trouvée{filteredSessions.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {(permissions.isSuperAdmin || permissions.isAdmin) && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Utilisateur
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Connexion
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Déconnexion
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Statut
                    </th>
                    {(permissions.isSuperAdmin || permissions.isAdmin) && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        IP / Device
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={(permissions.isSuperAdmin || permissions.isAdmin) ? 6 : 4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                          <p className="text-slate-500">Chargement...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={(permissions.isSuperAdmin || permissions.isAdmin) ? 6 : 4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Activity className="h-12 w-12 text-slate-300" />
                          <p className="text-slate-500">Aucune session trouvée</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map(session => (
                      <tr 
                        key={session.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {(permissions.isSuperAdmin || permissions.isAdmin) && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                <User className="h-4 w-4 text-slate-600" />
                              </div>
                              <span className="font-medium text-slate-900">
                                {getUtilisateurName(session)}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <LogIn className="h-4 w-4 text-green-600" />
                            {formatDate(session.heure_connexion)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {session.heure_deconnexion ? (
                            <div className="flex items-center gap-2">
                              <LogOut className="h-4 w-4 text-red-600" />
                              {formatDate(session.heure_deconnexion)}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">En cours...</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-600">
                            {formatDuree(session.duree_minutes)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            session.heure_deconnexion 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            {session.heure_deconnexion ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                Terminée
                              </>
                            ) : (
                              <>
                                <Activity className="h-3 w-3" />
                                Active
                              </>
                            )}
                          </span>
                        </td>
                        {(permissions.isSuperAdmin || permissions.isAdmin) && (
                          <td className="px-6 py-4 text-xs text-slate-500">
                            <div className="space-y-1">
                              {session.ip_address && (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {session.ip_address}
                                </div>
                              )}
                              {session.user_agent && (
                                <div className="flex items-center gap-1 truncate max-w-xs">
                                  <Monitor className="h-3 w-3" />
                                  <span className="truncate" title={session.user_agent}>
                                    {session.user_agent.substring(0, 50)}...
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
