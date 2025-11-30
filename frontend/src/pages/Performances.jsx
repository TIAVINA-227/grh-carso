
// frontend/src/pages/Performances.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Award,
  Calendar,
  User,
  Target,
  CheckCircle,
  MessageSquare,
  BarChart3,
  X,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getPerformances, createPerformance, updatePerformance, deletePerformance } from "../services/performanceService";
import { getEmployes } from "../services/employeService";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Performances() {
  const { user } = useAuth();
  const permissions = usePermissions();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employes, setEmployes] = useState([]);
  const [currentEmployeId, setCurrentEmployeId] = useState(null);
  const [selectedEmploye, setSelectedEmploye] = useState("_all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    employeId: "",
    note: "",
    date_eval: new Date().toISOString().split("T")[0],
    resultat: "",
    commentaires: "",
    objectifs: "",
    realisation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, emps] = await Promise.all([getPerformances(), getEmployes()]);
      setList(Array.isArray(data) ? data : data.performances || []);
      setEmployes(Array.isArray(emps) ? emps : emps || []);
      
      // ✅ Trouver l'employé correspondant à l'utilisateur connecté
      if (permissions.isEmploye && user) {
        // Méthode 1: Utiliser employeId si disponible dans user
        if (user.employeId) {
          setCurrentEmployeId(user.employeId);
          console.log('✅ Employé trouvé via user.employeId:', user.employeId);
        } else {
          // Méthode 2: Chercher par email
          const employe = emps.find(emp => 
            emp.email?.toLowerCase() === user.email?.toLowerCase()
          );
          if (employe) {
            setCurrentEmployeId(employe.id);
            console.log('✅ Employé trouvé par email pour les performances:', employe.id, employe.prenom, employe.nom);
          } else {
            console.warn('⚠️ Aucun employé trouvé pour l\'email:', user.email);
          }
        }
      }
    } catch (err) {
      console.error("Erreur chargement performances:", err);
      toast({ title: "Erreur", description: "Impossible de charger les évaluations.", variant: "destructive" });
      setList([]);
      setEmployes([]);
    } finally {
      setLoading(false);
    }
  }, [toast, permissions.isEmploye, user]);

  useEffect(() => {
    load();
  }, [load]);
  
  // ✅ Filtrer les performances selon le rôle et les permissions
  const filteredPerformances = useMemo(() => {
    // Admin et SuperAdmin voient tout
    if (permissions.isSuperAdmin || permissions.isAdmin) {
      return list;
    }
    
    // Employé ne voit que ses propres performances
    if (permissions.isEmploye && currentEmployeId) {
      return list.filter(p => p.employeId === currentEmployeId);
    }
    
    // Par défaut, retourner un tableau vide si l'employé n'est pas trouvé
    return [];
  }, [list, permissions.isSuperAdmin, permissions.isAdmin, permissions.isEmploye, currentEmployeId]);

  const handleSubmit = async () => {
    // ✅ Vérifier les permissions
    if (!permissions.canCreate || !permissions.canCreate('performances')) {
      toast({ title: "Erreur", description: "Vous n'avez pas la permission de créer une évaluation", variant: "destructive" });
      return;
    }
    
    if (!form.employeId || !form.note || !form.date_eval) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    const noteValue = parseInt(form.note, 10);
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
      toast({
        title: "Note invalide",
        description: "La note doit être un nombre entier compris entre 0 et 20.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        employeId: parseInt(form.employeId),
        note: noteValue,
        date_eval: form.date_eval,
        resultat: form.resultat,
        commentaires: form.commentaires,
        objectifs: form.objectifs,
        realisation: form.realisation,
      };

      if (editingId) {
        // ✅ Vérifier les permissions pour l'édition
        if (!permissions.canEdit || !permissions.canEdit('performances')) {
          toast({ title: "Erreur", description: "Vous n'avez pas la permission de modifier cette évaluation", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        await updatePerformance(editingId, payload);
        toast({ title: "Évaluation modifiée avec succès" });
      } else {
        await createPerformance(payload);
        toast({ title: "Évaluation enregistrée avec succès" });
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setForm({
        employeId: "",
        note: "",
        date_eval: new Date().toISOString().split("T")[0],
        resultat: "",
        commentaires: "",
        objectifs: "",
        realisation: "",
      });
      await load();
    } catch (err) {
      console.error("Erreur création/modification:", err);
      toast({ title: "Erreur", description: "Impossible d'enregistrer l'évaluation", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    // ✅ Vérifier les permissions
    if (!permissions.canDelete || !permissions.canDelete('performances')) {
      toast({ title: "Erreur", description: "Vous n'avez pas la permission de supprimer cette évaluation", variant: "destructive" });
      setConfirmDeleteOpen(false);
      setDeleteId(null);
      return;
    }
    
    try {
      await deletePerformance(deleteId);
      toast({ title: "Évaluation supprimée" });
      await load();
    } catch (err) {
      console.error("Erreur suppression évaluation:", err);
      toast({ title: "Erreur", description: "Impossible de supprimer.", variant: "destructive" });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  // Préparation des données pour le graphique (utiliser filteredPerformances)
  const chartData = filteredPerformances
    .filter((perf) => selectedEmploye === "_all" || `${perf.employeId}` === selectedEmploye)
    .map((perf) => {
      const employe = employes.find((e) => e.id === perf.employeId);
      return {
        ...perf,
        nom: employe ? `${employe.nom} ${employe.prenom}` : `Employé #${perf.employeId}`,
        date: perf.date_eval?.slice(0, 10),
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const stats = {
    total: chartData.length,
    moyenne: chartData.length > 0 ? (chartData.reduce((s, p) => s + p.note, 0) / chartData.length).toFixed(1) : 0,
    meilleure: chartData.length > 0 ? Math.max(...chartData.map((p) => p.note)) : 0,
    derniere: chartData.length > 0 ? chartData[chartData.length - 1].note : 0,
  };

  const getPerformanceColor = (note) => {
    if (note >= 16) return "text-green-600 bg-green-50 border-green-200";
    if (note >= 12) return "text-blue-600 bg-blue-50 border-blue-200";
    if (note >= 10) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPerformanceLabel = (note) => {
    if (note >= 16) return "Excellent";
    if (note >= 12) return "Bien";
    if (note >= 10) return "Satisfaisant";
    return "À améliorer";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {permissions.isEmploye ? 'Mes Performances' : 'Évaluations des Performances'}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {permissions.isEmploye
                    ? 'Consultez vos évaluations de performance'
                    : 'Suivi et analyse des performances de l\'équipe'}
                </p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* ✅ Masquer le select d'employé pour les employés */}
              {(permissions.isSuperAdmin || permissions.isAdmin) && (
                <div className="w-full sm:w-72">
                  <select
                    value={selectedEmploye}
                    onChange={(e) => setSelectedEmploye(e.target.value)}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="_all">Tous les employés</option>
                    {employes.map((e) => (
                      <option key={e.id} value={String(e.id)}>
                        {e.nom} {e.prenom}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {permissions.canCreate && permissions.canCreate("performances") && (
                <button
                  onClick={() => {
                    // ✅ Pré-remplir l'employé si c'est un employé
                    if (permissions.isEmploye && currentEmployeId) {
                      setForm((f) => ({
                        ...f,
                        employeId: String(currentEmployeId),
                      }));
                    }
                    setIsDialogOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle Évaluation
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CARTES DE STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Évaluations</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Note Moyenne</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold">{stats.moyenne}</p>
                    <p className="text-blue-100 text-sm">/20</p>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">Meilleure Note</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold">{stats.meilleure}</p>
                    <p className="text-emerald-100 text-sm">/20</p>
                  </div>
                </div>
                <Award className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">Dernière Note</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold">{stats.derniere}</p>
                    <p className="text-rose-100 text-sm">/20</p>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GRAPHIQUE – VERSION ÉLÉGANTE & LISSE */}
        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                <TrendingUp className="h-7 w-7 text-blue-600" />
                Évolution des Performances
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Suivi fluide et précis des notes au fil du temps
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-muted-foreground">Chargement des données...</p>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                <BarChart3 className="h-20 w-20 text-muted-foreground/30" />
                <div>
                  <p className="text-xl font-medium text-foreground">Aucune évaluation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Créez votre première évaluation pour voir l'évolution
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorNote" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a9bfe3ff" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748b", fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    tick={{ fill: "#64748b", fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{ stroke: "#8b5cf6", strokeWidth: 2, strokeDasharray: "5 5" }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      padding: "12px",
                    }}
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-semibold">
                              <User className="h-4 w-4 text-blue-600" />
                              {d.nom}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">Note :</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getPerformanceColor(d.note)}`}>
                                {d.note}/20 — {getPerformanceLabel(d.note)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {d.date}
                            </div>
                            {d.commentaires && (
                              <p className="text-xs italic text-muted-foreground/80 pt-2 border-t border-border">
                                "{d.commentaires}"
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend verticalAlign="top" height={40} iconType="circle">
                    <span className="font-medium text-foreground">Note de performance</span>
                  </Legend>

                  <Area
                    type="monotoneX"
                    dataKey="note"
                    stroke="#8b5cf6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorNote)"
                    dot={{ fill: "#8b5cf6", r: 6, stroke: "#fff", strokeWidth: 3 }}
                    activeDot={{ r: 9, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 4 }}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* LISTE DES ÉVALUATIONS */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Liste des évaluations
            </h3>
            {chartData.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">Aucune évaluation trouvée.</div>
            ) : (
              <div className="space-y-2">
                {chartData.slice().reverse().map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium text-foreground">{p.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.date} — Note : <span className="font-semibold text-blue-600">{p.note}</span>/20
                      </div>
                      {p.commentaires && <div className="text-sm text-muted-foreground italic mt-1">"{p.commentaires}"</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      {permissions.canEdit && permissions.canEdit("performances") && (
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setForm({
                              employeId: String(p.employeId || ""),
                              note: String(p.note || ""),
                              date_eval: p.date ? String(p.date) : new Date().toISOString().slice(0, 10),
                              resultat: p.resultat || "",
                              commentaires: p.commentaires || "",
                              objectifs: p.objectifs || "",
                              realisation: p.realisation || "",
                            });
                            setIsDialogOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {permissions.canDelete && permissions.canDelete("performances") && (
                        <button
                          onClick={() => {
                            setDeleteId(p.id);
                            setConfirmDeleteOpen(true);
                          }}
                          className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-md hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MODAL AJOUT / MODIFICATION */}
      {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingId(null);
              // ✅ Réinitialiser le formulaire
              setForm({
                employeId: "",
                note: "",
                date_eval: new Date().toISOString().split("T")[0],
                resultat: "",
                commentaires: "",
                objectifs: "",
                realisation: "",
              });
            }
          }}
        >
          <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden border shadow-2xl">
            <div className="bg-primary p-6 text-primary-foreground">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {editingId ? "Modifier l'évaluation" : "Nouvelle évaluation de performance"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 mt-2">
                  {editingId
                    ? "Modifiez les informations et enregistrez les changements."
                    : "Complétez les champs pour créer une nouvelle évaluation."}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="p-6 space-y-5 bg-card max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4 text-blue-600" />
                    Employé *
                  </label>
                  <select
                    value={form.employeId}
                    onChange={(e) => setForm((f) => ({ ...f, employeId: e.target.value }))}
                    disabled={permissions.isEmploye}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Sélectionnez un employé</option>
                    {employes.map((e) => (
                      <option key={e.id} value={String(e.id)}>
                        {e.nom} {e.prenom}
                      </option>
                    ))}
                  </select>
                  {permissions.isEmploye && (
                    <p className="text-xs text-muted-foreground">Vous ne pouvez créer une évaluation que pour vous-même</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Date d'évaluation *
                  </label>
                  <input
                    type="date"
                    value={form.date_eval}
                    onChange={(e) => setForm((f) => ({ ...f, date_eval: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Note de performance (0-20) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={form.note}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (/^\d+$/.test(val) && Number(val) >= 0 && Number(val) <= 20)) {
                        setForm((f) => ({ ...f, note: val }));
                      }
                    }}
                    min={0}
                    max={20}
                    step={1}
                    placeholder="ex: 17"
                    className="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {form.note && (
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getPerformanceColor(parseInt(form.note))}`}>
                      {getPerformanceLabel(parseInt(form.note))}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Target className="h-4 w-4 text-blue-600" />
                  Objectifs fixés
                </label>
                <textarea
                  value={form.objectifs}
                  onChange={(e) => setForm((f) => ({ ...f, objectifs: e.target.value }))}
                  placeholder="Décrivez les objectifs définis pour cette période..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Réalisations
                </label>
                <textarea
                  value={form.realisation}
                  onChange={(e) => setForm((f) => ({ ...f, realisation: e.target.value }))}
                  placeholder="Listez les principales réalisations..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Award className="h-4 w-4 text-blue-600" />
                  Résultat global
                </label>
                <input
                  value={form.resultat}
                  onChange={(e) => setForm((f) => ({ ...f, resultat: e.target.value }))}
                  placeholder="Ex: Objectifs atteints, Dépassement des attentes..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Commentaires
                </label>
                <textarea
                  value={form.commentaires}
                  onChange={(e) => setForm((f) => ({ ...f, commentaires: e.target.value }))}
                  placeholder="Ajoutez vos commentaires et remarques..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 min-h-[100px] resize-none"
                />
              </div>
              <Separator className="my-4" />
              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingId(null);
                  }}
                  className="flex-1 h-12 border-2"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? "Enregistrement..." : editingId ? "Enregistrer" : "Enregistrer l'évaluation"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* CONFIRMATION SUPPRESSION */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action ne peut pas être annulée.
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}