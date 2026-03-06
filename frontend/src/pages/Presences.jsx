// frontend/src/pages/Presences.jsx - VERSION CORRIGÉE COMPLÈTE
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { getPresences, createPresence, updatePresence, deletePresence } from "../services/presenceService";
import { getEmployes } from "../services/employeService";
import { 
  CalendarDays,
  Calendar,
  Clock, 
  User, 
  Plus,  
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Activity,
  Upload,
} from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { usePermissions } from "../hooks/usePermissions";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../hooks/useAuth.jsx";
import { pdf } from '@react-pdf/renderer';
import PresencesPDFDocument from "../exportPdf/PresencesPDFDocument.jsx";
import logoGauche from "../assets/carso 1.png";

export default function Presences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const permissions = usePermissions();

  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employes, setEmployes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [presenceView, setPresenceView] = useState('today');
  const [presenceToDelete, setPresenceToDelete] = useState(null);
  
  const [form, setForm] = useState({ 
    employeId: "", 
    date_jour: new Date().toISOString(),
    statut: "PRESENT", 
    heures_travaillees: 8,
    justification: "" 
  });

  const [loadingEmployes, setLoadingEmployes] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [selectedPresences, setSelectedPresences] = useState(new Set());
  const [currentEmployeId, setCurrentEmployeId] = useState(null);

  // Fonction pour charger les employés
  const loadEmployes = async () => {
    try {
      setLoadingEmployes(true);
      const data = await getEmployes();
      setEmployes(data);
      console.log('Employés chargés:', data.length);
      
      if (permissions.isEmploye && user) {
        const employe = data.find(emp => emp.email === user.email);
        if (employe) {
          setCurrentEmployeId(employe.id);
          setForm(prev => ({ ...prev, employeId: employe.id.toString() }));
          console.log(' Employé auto-sélectionné:', employe.id);
        }
      }
    } catch (err) {
      console.error("Erreur chargement employés:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les employés",
        className: "bg-red-600 text-white",
      });
    } finally {
      setLoadingEmployes(false);
    }
  };

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDate(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fonction de chargement des présences
  const load = async (period = 'today') => {
    setLoading(true);
    setPresenceView(period);
    setSelectedPresences(new Set());
    
    try {
      const data = await getPresences({ period });
      const empData = await getEmployes();
      
      let filteredData = data || [];
      
      if (period === 'today') {
        const today = new Date().toISOString().split("T")[0];
        filteredData = filteredData.filter(
          (p) => p.date_jour && p.date_jour.split("T")[0] === today
        );
      }
      
      setPresences(filteredData);
      setEmployes(empData || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les présences");
      toast({
        title: "Erreur ❌",
        description: "Impossible de charger les présences.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load('today'); 
    loadEmployes();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    
    const initialEmployeId = permissions.isEmploye && currentEmployeId 
      ? currentEmployeId.toString() 
      : "";
    
    setForm({ 
      employeId: initialEmployeId, 
      date_jour: new Date().toISOString(),
      statut: "PRESENT", 
      heures_travaillees: 8,
      justification: "" 
    });
    setIsDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ 
      employeId: p.employeId ? p.employeId.toString() : "", 
      date_jour: p.date_jour ? new Date(p.date_jour).toISOString() : new Date().toISOString(),
      statut: p.statut || "PRESENT", 
      heures_travaillees: p.heures_travaillees || 8,
      justification: p.justification || "" 
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    console.log('📤 Form avant envoi:', form);
    console.log('👤 EmployeId:', form.employeId);
    
    if (!form.employeId) {
      const errorMsg = "Veuillez sélectionner un employé";
      setError(errorMsg);
      toast({
        title: "Erreur ❌",
        description: errorMsg,
        className: "bg-red-600 text-white",
      });
      return;
    }

    const updatedForm = { 
      ...form, 
      date_jour: new Date().toISOString(),
      employeId: Number(form.employeId),
      heures_travaillees: Number(form.heures_travaillees) || 0
    };
    
    console.log('📤 Données envoyées au backend:', updatedForm);

    try {
      if (editingId) {
        await updatePresence(editingId, updatedForm);
        toast({
          title: "Présence mise à jour ",
          description: "Les informations ont été modifiées avec succès.",
          className: "bg-green-600 text-white",
        });
      } else {
        await createPresence(updatedForm);
        toast({
          title: "Présence enregistrée ",
          description: "Nouvelle présence ajoutée avec succès.",
          className: "bg-green-600 text-white",
        });
      }
      setIsDialogOpen(false);
      await load(presenceView);
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      setError(err.message || "Erreur lors de l'enregistrement");
      toast({
        title: "Erreur ❌",
        description: err.message || "Impossible d'enregistrer la présence.",
        className: "bg-red-600 text-white",
      });
    }
  };

  const confirmDelete = (id) => {
    setPresenceToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (presenceToDelete) {
        await deletePresence(presenceToDelete);
        toast({
          title: "Présence supprimée ",
          description: "L'enregistrement a été supprimé avec succès.",
          className: "bg-green-600 text-white",
        });
      } else if (selectedPresences.size > 0) {
        await Promise.all(Array.from(selectedPresences).map(id => deletePresence(id)));
        toast({
          title: `${selectedPresences.size} présence(s) supprimée(s) `,
          className: "bg-green-600 text-white",
        });
        setSelectedPresences(new Set());
      }
      await load(presenceView);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur ❌",
        description: "Impossible de supprimer.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setConfirmDialogOpen(false);
      setPresenceToDelete(null);
    }
  };

  const handleSelectPresence = (id) => {
    setSelectedPresences(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPresences(new Set(presences.map(item => item.id)));
    } else {
      setSelectedPresences(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedPresences.size > 0) {
      setPresenceToDelete(null);
      setConfirmDialogOpen(true);
    }
  };

  //  STATISTIQUES CORRIGÉES POUR LES PRÉSENCES
  const calculateStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filtrer présences du jour
    const presencesAujourdhui = presences.filter(p => 
      p.date_jour && p.date_jour.split("T")[0] === today
    );

    // Filtrer présences du mois
    const presencesDuMois = presences.filter(p => {
      if (!p.date_jour) return false;
      const date = new Date(p.date_jour);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Calculer les présents du jour
    const presentsDuJour = presencesAujourdhui.filter(p => p.statut === "PRESENT").length;
    const totalEmployesDuJour = presencesAujourdhui.length;

    // Calculer les présents du mois
    const presentsDuMois = presencesDuMois.filter(p => p.statut === "PRESENT").length;
    const totalEmployesDuMois = presencesDuMois.length;

    // Calculer les taux de présence
    const tauxJour = totalEmployesDuJour > 0 
      ? Math.round((presentsDuJour / totalEmployesDuJour) * 100) 
      : 0;

    const tauxMois = totalEmployesDuMois > 0 
      ? Math.round((presentsDuMois / totalEmployesDuMois) * 100) 
      : 0;

    return {
      // Totaux
      totalAujourdhui: presencesAujourdhui.length,
      totalMois: presencesDuMois.length,
      
      // Présents
      presentsDuJour,
      presentsDuMois,
      
      // Absents et retards
      absentsDuJour: presencesAujourdhui.filter(p => p.statut === "ABSENT").length,
      absentsDuMois: presencesDuMois.filter(p => p.statut === "ABSENT").length,
      retardsDuJour: presencesAujourdhui.filter(p => p.statut === "RETARD").length,
      retardsDuMois: presencesDuMois.filter(p => p.statut === "RETARD").length,
      
      // Taux de présence
      tauxJour,
      tauxMois,
      
      // Total général
      total: presences.length,
    };
  };

  const stats = calculateStats();

  const colorStatut = (statut) => {
    switch (statut) {
      case "PRESENT": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "RETARD": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "ABSENT": return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "PRESENT": return <CheckCircle className="w-4 h-4" />;
      case "RETARD": return <AlertCircle className="w-4 h-4" />;
      case "ABSENT": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const exportToPDF = async () => {
    if (presences.length === 0) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Aucune présence n'est enregistrée.",
        className: "bg-yellow-500 text-white",
      });
      return;
    }

    try {
      toast({
        title: "Génération du PDF en cours...",
        className: "bg-blue-600 text-white",
      });

      const blob = await pdf(
        <PresencesPDFDocument
          presences={presences}
          employes={employes}
          logoUrl={logoGauche}
          selectedDate={selectedDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `liste_presences_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF généré ",
        description: "Le fichier PDF de la liste des présences a été téléchargé.",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur lors de l'export",
        description: "Impossible de générer le PDF",
        className: "bg-red-600 text-white",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header moderne avec glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-cyan-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/30">
                <CalendarDays className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Gestion des Présences
                </h1>
                <p className="text-sm text-muted-foreground mt-2">Suivez les présences quotidiennes en temps réel</p>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 backdrop-blur-sm border border-border shadow-sm">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {formatDateTime(selectedDate)}
                </span>
              </div>
            </div>
            
            <Separator className="my-4 bg-border/40" />
                  
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} présence{stats.total > 1 ? 's' : ''} 
                {presenceView === 'today' ? " aujourd'hui" : presenceView === 'month' ? ' ce mois' : ' affichées'}
              </div>

              <div className="flex items-center gap-2">
                {(permissions.canView('presences') || permissions.isEmploye) && (
                  <button 
                    onClick={exportToPDF} 
                    className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Exporter PDF
                  </button>
                )}
                {(permissions.canCreate('presences') || permissions.canRequest('presences') || permissions.isEmploye) && (
                  <button
                    onClick={openCreate}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Nouvelle Présence
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={presenceView === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => load('today')}
              >
                Présences d'aujourd'hui
              </Button>
              <Button
                variant={presenceView === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => load('month')}
              >
                Présences du mois
              </Button>
            </div>
          </div>
        </div>

        {/*  CARTES STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Présences Aujourd'hui</p>
                  <p className="text-3xl font-bold">{stats.totalAujourdhui}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Présences Ce Mois</p>
                  <p className="text-3xl font-bold">{stats.totalMois}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Taux Aujourd'hui</p>
                  <p className="text-3xl font-bold">{stats.tauxJour}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">Taux Ce Mois</p>
                  <p className="text-3xl font-bold">{stats.tauxMois}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de sélection */}
        {selectedPresences.size > 0 && (
          <div className="rounded-xl bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedPresences.size}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedPresences.size} Présence{selectedPresences.size > 1 ? 's' : ''} sélectionnée{selectedPresences.size > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur supprimer pour effacer la sélection
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={requestDeleteSelected}
                className="shadow-lg hover:shadow-xl transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer la sélection
              </Button>
            </div>
          </div>
        )}

        {/* Liste des présences modernisée */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Présences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {presences.length} présence{presences.length > 1 ? 's' : ''} enregistrée{presences.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Chargement des présences...</p>
              </div>
            ) : presences.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Aucune présence trouvée</h3>
                  <p className="text-muted-foreground">Commencez par enregistrer une présence</p>
                </div>
                <Button 
                  onClick={openCreate} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Enregistrer une présence
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                  <Checkbox
                    id="select-all"
                    checked={selectedPresences.size === presences.length && presences.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-2"
                  />
                  <label htmlFor="select-all" className="text-sm font-semibold text-foreground cursor-pointer">
                    Tout sélectionner ({presences.length} présence{presences.length > 1 ? 's' : ''})
                  </label>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {presences.map((presence) => (
                    <Card 
                      key={presence.id} 
                      className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                        selectedPresences.has(presence.id) 
                          ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {permissions.canDelete('presences') && (
                              <Checkbox
                                checked={selectedPresences.has(presence.id)}
                                onCheckedChange={() => handleSelectPresence(presence.id)}
                                className="border-2 mt-1"
                              />
                            )}
                            
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                              <User className="w-7 h-7 text-primary-foreground" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-foreground truncate">
                                {(() => {
                                  const emp = employes.find(e => e.id === presence.employeId);
                                  return emp ? `${emp.nom} ${emp.prenom}` : `Employé #${presence.employeId}`;
                                })()}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <CalendarDays className="w-4 h-4 text-primary" />
                                  {formatDateTime(presence.date_jour)}
                                </p>
                                {presence.heures_travaillees && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {presence.heures_travaillees}h
                                  </Badge>
                                )}
                              </div>
                              {presence.justification && (
                                <p className="text-sm text-muted-foreground italic mt-2 p-2 bg-muted/50 rounded-lg border-l-4 border-primary">
                                  "{presence.justification}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                            <Badge className={`${colorStatut(presence.statut)} flex items-center gap-2 px-4 py-2 text-sm font-semibold border shadow-sm`}>
                              {getStatutIcon(presence.statut)}
                              {presence.statut}
                            </Badge>
                            
                            <div className="flex gap-2">
                              {permissions.canUpdate('presences') && (
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => openEdit(presence)}
                                  className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {permissions.canDelete('presences') && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => confirmDelete(presence.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border shadow-2xl">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                {editingId ? 'Modifier la Présence' : 'Nouvelle Présence'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 mt-2">
                {editingId ? 'Modifiez les informations de présence ci-dessous' : 'Enregistrez une nouvelle présence'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-card">
            {error && (
              <div className="bg-destructive/10 border-l-4 border-destructive rounded-lg p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">Erreur</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Employé */}
            <div className="space-y-2">
              <Label htmlFor="employeId" className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Employé <span className="text-destructive">*</span>
              </Label>
              
              {permissions.isEmploye && currentEmployeId ? (
                <div className="p-3 border border-border rounded-md bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                      {employes.find(e => e.id === currentEmployeId)?.prenom?.[0]}
                      {employes.find(e => e.id === currentEmployeId)?.nom?.[0]}
                    </div>
                    <span className="font-medium">
                      {employes.find(e => e.id === currentEmployeId)?.prenom}{' '}
                      {employes.find(e => e.id === currentEmployeId)?.nom}
                    </span>
                  </div>
                </div>
              ) : (
                <Select
                  value={form.employeId}
                  onValueChange={(value) => {
                    console.log(' Employé sélectionné:', value);
                    setForm(prev => ({ ...prev, employeId: value }));
                  }}
                  required
                >
                  <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employes.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.prenom} {emp.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_jour" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-accent" />
                Date et heure du pointage
              </Label>
              <div className="relative">
                <Input
                  id="date_jour"
                  type="datetime-local"
                  value={new Date(form.date_jour).toISOString().slice(0,16)}
                  readOnly
                  className="h-12 border-2 bg-muted cursor-not-allowed"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Statut <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.statut}
                onValueChange={(value) => setForm({ ...form, statut: value })}
              >
                <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>Présent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ABSENT">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Absent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="RETARD">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Retard</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heures_travaillees" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Heures travaillées
              </Label>
              <Input
                id="heures_travaillees"
                type="number"
                step="0.25"
                value={form.heures_travaillees}
                onChange={(e) => setForm({ ...form, heures_travaillees: parseFloat(e.target.value) })}
                placeholder="8"
                className="h-12 border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                Justification
              </Label>
              <Textarea
                id="justification"
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
                placeholder="Entrez une justification si nécessaire..."
                rows={4}
                className="border-2 focus:border-primary transition-colors resize-none"
              />
            </div>

            <Separator className="my-6" />

            <DialogFooter className="flex gap-3 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)} 
                className="flex-1 h-12 border-2 hover:bg-muted transition-all"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                {editingId ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Mettre à jour
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la présence
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
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
            {selectedPresences.size > 0
              ? `Êtes-vous sûr de vouloir supprimer ${selectedPresences.size} présence${selectedPresences.size > 1 ? 's' : ''} ? Cette action ne peut pas être annulée.`
              : "Êtes-vous sûr de vouloir supprimer cette présence ? Cette action ne peut pas être annulée."}
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="hover:opacity-90"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}