// //frontend/src/pages/Absences.jsx - VERSION CORRIGÉE
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";
import { getAbsences, createAbsence, updateAbsence, deleteAbsence } from "../services/absenceService";
import { usePermissions } from "../hooks/usePermissions";
import { getEmployes } from "../services/employeService";
import { 
  CalendarDays,
  User, 
  Users,
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Filter, 
  Activity, 
  TrendingDown, 
  AlertCircle, 
  Upload, 
  FileSpreadsheet, 
  ChevronDown,
  Calendar,
} from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import AbsencesPDFDocument from "../exportPDF/AbsencesPDFDocument";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";

export default function Absences() {

  const { user } = useAuth();

  const [absences, setAbsences] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // ✅ UN SEUL ÉTAT FORM (suppression de formData)
  const [form, setForm] = useState({ 
    employeId: "", 
    date_debut: new Date().toISOString().split('T')[0], 
    date_fin: new Date().toISOString().split('T')[0], 
    type_absence: "Maladie",
    justification: "",
    piece_jointe: ""
  });
  
  const [loadingEmployes, setLoadingEmployes] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous les statuts");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedAbsences, setSelectedAbsences] = useState(new Set());
  const [absenceView, setAbsenceView] = useState('active');
  const permissions = usePermissions();

  const [currentEmployeId, setCurrentEmployeId] = useState(null);

  // ✅ Fonction pour charger les employés
  const loadEmployes = async () => {
    try {
      setLoadingEmployes(true);
      const data = await getEmployes();
      setEmployes(data);
      console.log('Employés chargés:', data.length);
      
      // 🔹 Trouver l'employé correspondant à l'utilisateur connecté
      if (permissions.isEmploye && user) {
        const employe = data.find(emp => emp.email === user.email);
        if (employe) {
          setCurrentEmployeId(employe.id);
          // ✅ CORRECTION : utiliser form au lieu de formData
          setForm(prev => ({ ...prev, employeId: employe.id.toString() }));
          console.log('✅ Employé auto-sélectionné:', employe.id);
        }
      }
    } catch (err) {
      console.error("Erreur chargement employés:", err);
      toast.error("Impossible de charger les employés");
    } finally {
      setLoadingEmployes(false);
    }
  };

  const load = async (period = 'active') => {
    setLoading(true);
    setAbsenceView(period);
    setSelectedAbsences(new Set());
    try {
      const data = await getAbsences({ period });
      setAbsences(data || []);
      const empData = await getEmployes();
      setEmployes(empData || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les absences");
      toast.error("Erreur lors du chargement des absences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load('active');
    loadEmployes(); 
  }, []);

  const exportToPDF = async () => {
    try {
      const blob = await pdf(<AbsencesPDFDocument absences={absences} employes={employes} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `absences_${new Date().toISOString().slice(0,10)}.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF exporté avec succès");
    } catch (err) { 
      console.error(err);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  const openCreate = () => {
    setEditingId(null);
    
    // ✅ Si employé connecté, pré-remplir son ID
    const initialEmployeId = permissions.isEmploye && currentEmployeId 
      ? currentEmployeId.toString() 
      : "";
    
    setForm({ 
      employeId: initialEmployeId, 
      date_debut: new Date().toISOString().split('T')[0], 
      date_fin: new Date().toISOString().split('T')[0], 
      type_absence: "Maladie",
      justification: "",
      piece_jointe: ""
    });
    setIsDialogOpen(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ 
      employeId: a.employeId ? a.employeId.toString() : "", 
      date_debut: a.date_debut ? new Date(a.date_debut).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      date_fin: a.date_fin ? new Date(a.date_fin).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      type_absence: a.type_absence || "Maladie",
      justification: a.justification || "",
      piece_jointe: a.piece_jointe || ""
    });
    setIsDialogOpen(true);
  };

  // ✅ CORRECTION MAJEURE : handleSubmit avec validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // ✅ Logs de debug
    console.log('📤 Form avant envoi:', form);
    console.log('👤 EmployeId:', form.employeId);
    
    // ✅ Validation employeId
    if (!form.employeId) {
      const errorMsg = "Veuillez sélectionner un employé";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    const updatedForm = {
      ...form,
      employeId: Number(form.employeId) // ✅ Convertir en nombre
    };
    
    console.log('📤 Données envoyées au backend:', updatedForm);
    
    try {
      if (editingId) {
        await updateAbsence(editingId, updatedForm);
        toast.success("Absence mise à jour avec succès");
      } else {
        await createAbsence(updatedForm);
        toast.success("Absence déclarée avec succès");
      }
      setIsDialogOpen(false);
      await load();
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      setError(err.message || "Erreur");
      toast.error(err.message || "Impossible d'enregistrer l'absence");
    }
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    try {
      if (deleteId) {
        await deleteAbsence(deleteId);
        toast.success("Absence supprimée avec succès");
      } else if (selectedAbsences.size > 0) {
        await Promise.all(Array.from(selectedAbsences).map(id => deleteAbsence(id)));
        toast.success(`${selectedAbsences.size} absence(s) supprimée(s)`);
        setSelectedAbsences(new Set());
      }
      await load();
    } catch (err) {
      toast.error("Erreur lors de la suppression de l'absence");
    }
    setDeleteId(null);
  };

  const handleApprove = async (id) => {
    try {
      await updateAbsence(id, { statut: "APPROUVE" });
      toast.success("Absence approuvée");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'approuver l'absence");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateAbsence(id, { statut: "REJETE" });
      toast.success("Absence refusée");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Impossible de refuser l'absence");
    }
  };

// ... vos imports et état ...

// ✅ DÉPLACER calculateDays ICI (avant les stats)
const calculateDays = (dateDebut, dateFin) => {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const diffTime = Math.abs(fin - debut);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// Ensuite vos stats
const stats = {
  total: absences.length,
  attente: absences.filter(a => a.statut === "SOUMIS").length,
  approuvees: absences.filter(a => a.statut === "APPROUVE").length,
  refusees: absences.filter(a => a.statut === "REJETE").length,
  
  // Vos nouvelles statistiques
  aujourdhui: absences.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date_debut <= today && a.date_fin >= today;
  }).length,
  
  ceMois: absences.filter(a => {
    const now = new Date();
    const absenceDate = new Date(a.date_debut);
    return absenceDate.getMonth() === now.getMonth() && 
           absenceDate.getFullYear() === now.getFullYear();
  }).length,
  
  moyenneDuree: absences.length > 0 
    ? (absences.reduce((total, a) => total + calculateDays(a.date_debut, a.date_fin), 0) / absences.length).toFixed(1)
    : 0,
  
  typePlusFrequent: () => {
    const types = absences.reduce((acc, a) => {
      acc[a.type_absence] = (acc[a.type_absence] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(types).length > 0 
      ? Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b)
      : 'Aucun';
  }
};

  const colorStatut = (statut) => {
    switch (statut) {
      case "APPROUVE": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "SOUMIS": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "REJETE": return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      default: return "bg-muted text-muted-foreground border";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "APPROUVE": return <CheckCircle className="w-4 h-4" />;
      case "SOUMIS": return <Clock className="w-4 h-4" />;
      case "REJETE": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  const getTypeColor = (type) => {
    switch (type) {
      case "Maladie": return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      case "Personnel": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "Congé": return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "Formation": return "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800";
      default: return "bg-muted text-muted-foreground border";
    }
  };

  const filteredAbsences = filterStatus === "Tous les statuts" 
    ? absences 
    : absences.filter(a => a.statut === filterStatus.toUpperCase());

  const handleSelectAbsence = (id) => {
    setSelectedAbsences(prev => {
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
      setSelectedAbsences(new Set(filteredAbsences.map(item => item.id)));
    } else {
      setSelectedAbsences(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedAbsences.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header moderne */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-cyan-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/30">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Gestion des Absences
                </h1>
                <p className="text-sm text-muted-foreground mt-2">Suivez et gérez les absences des employés</p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} absence{stats.total > 1 ? 's' : ''} {absenceView === 'month' ? 'ce mois' : 'en cours'}
              </div>
              <div className="flex items-center gap-2">
                {(permissions.canView('absences') || permissions.isEmploye ) && (
                  <button 
                    onClick={exportToPDF} 
                    className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors border border-emerald-500/30 text-sm font-medium flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Exporter PDF
                  </button>
                )}
                {(permissions.canCreate('absences') || permissions.canRequest('absences') || permissions.isEmploye) && (
                  <button
                    onClick={openCreate}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Déclarer une Absence
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={absenceView === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => load('active')}
              >
                Absences en cours
              </Button>
              <Button
                variant={absenceView === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => load('month')}
              >
                Absences du mois
              </Button>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Carte 1: Absences du jour */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Absences Aujourd'hui</p>
                  <p className="text-3xl font-bold">{stats.aujourdhui}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          {/* Carte 2: Absences du mois */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Absences Ce Mois</p>
                  <p className="text-3xl font-bold">{stats.ceMois}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          {/* Carte 3: Durée moyenne */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">Durée Moyenne</p>
                  <p className="text-3xl font-bold">{stats.moyenneDuree}</p>
                </div>
                <Clock className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          {/* Carte 4: Type le plus fréquent */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">Type Principal</p>
                  <p className="text-3xl font-bold truncate">{stats.typePlusFrequent()}</p>
                </div>
                <Activity className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de sélection */}
        {selectedAbsences.size > 0 && (
          <div className="rounded-xl bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedAbsences.size}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedAbsences.size} absence{selectedAbsences.size > 1 ? 's' : ''} sélectionnée{selectedAbsences.size > 1 ? 's' : ''}
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

        {/* Liste des absences */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Absences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAbsences.length} absence{filteredAbsences.length > 1 ? 's' : ''} trouvée{filteredAbsences.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Chargement des absences...</p>
              </div>
            ) : filteredAbsences.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Aucune absence trouvée</h3>
                  <p className="text-muted-foreground">Commencez par déclarer une absence</p>
                </div>
                <Button 
                  onClick={openCreate} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Déclarer une absence
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                  <Checkbox
                    id="select-all"
                    checked={selectedAbsences.size === filteredAbsences.length && filteredAbsences.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-2"
                  />
                  <label htmlFor="select-all" className="text-sm font-semibold text-foreground cursor-pointer">
                    Tout sélectionner ({filteredAbsences.length} absence{filteredAbsences.length > 1 ? 's' : ''})
                  </label>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {filteredAbsences.map((absence) => (
                    <Card 
                      key={absence.id} 
                      className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                        selectedAbsences.has(absence.id) 
                          ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Checkbox
                              checked={selectedAbsences.has(absence.id)}
                              onCheckedChange={() => handleSelectAbsence(absence.id)}
                              className="border-2 mt-1"
                            />
                            
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                              <User className="w-7 h-7 text-primary-foreground" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-foreground truncate">
                                {(() => {
                                  const emp = employes.find(e => e.id === absence.employeId);
                                  return emp ? `${emp.nom} ${emp.prenom}` : `Employé #${absence.employeId}`;
                                })()}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{absence.justification}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <CalendarDays className="w-4 h-4 text-primary" />
                                  {formatDate(absence.date_debut)} - {formatDate(absence.date_fin)}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {calculateDays(absence.date_debut, absence.date_fin)} jour{calculateDays(absence.date_debut, absence.date_fin) > 1 ? 's' : ''}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={`${getTypeColor(absence.type_absence)} text-xs px-3 py-1 font-semibold border`}>
                                {absence.type_absence}
                              </Badge>
                              
                              {absence.piece_jointe && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 text-xs px-3 py-1 font-semibold border">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Justificatif
                                </Badge>
                              )}
                              
                              <Badge className={`${colorStatut(absence.statut)} flex items-center gap-1.5 px-3 py-1 font-semibold border`}>
                                {getStatutIcon(absence.statut)}
                                {(absence.statut || "inconnu").toLowerCase()}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2">
                              {absence.statut === "SOUMIS" && permissions.canApprove("absences") && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleApprove(absence.id)}
                                    className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 dark:hover:bg-emerald-950/20 transition-all"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approuver
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleReject(absence.id)}
                                    className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-950/20 transition-all"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Refuser
                                  </Button>
                                </>
                              )}
                              
                              {permissions.canUpdate("absences") && (
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => openEdit(absence)}
                                  className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {permissions.canDelete("absences") && (
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => requestDelete(absence.id)}
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
                {editingId ? 'Modifier l\'Absence' : 'Nouvelle Absence'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 mt-2">
                {editingId ? 'Modifiez les informations de l\'absence ci-dessous' : 'Déclarez une nouvelle absence'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-card">
            {error && (
              <div className="bg-destructive/10 border-l-4 border-destructive rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">Erreur</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* ✅ CORRECTION : Employé - utiliser form au lieu de formData */}
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
                    console.log('✅ Employé sélectionné:', value);
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-500" />
                  Date de début <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="date_debut"
                  type="date"
                  value={form.date_debut} 
                  onChange={(e) => setForm({ ...form, date_debut: e.target.value })} 
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_fin" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-rose-500" />
                  Date de fin <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="date_fin"
                  type="date"
                  value={form.date_fin} 
                  onChange={(e) => setForm({ ...form, date_fin: e.target.value })} 
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type_absence" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                Type d'absence <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.type_absence}
                onValueChange={(value) => setForm({ ...form, type_absence: value })}
              >
                <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maladie">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                      <span>Maladie</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Personnel">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Personnel</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Congé">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Congé</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Formation">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                      <span>Formation</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="justification"
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
                placeholder="Décrivez la raison de l'absence..."
                rows={4}
                className="border-2 focus:border-primary transition-colors resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="piece_jointe" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Pièce jointe
              </Label>
              <Input 
                id="piece_jointe"
                value={form.piece_jointe} 
                onChange={(e) => setForm({ ...form, piece_jointe: e.target.value })} 
                placeholder="URL ou nom du fichier"
                className="h-12 border-2 focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">Ajoutez un lien vers le justificatif médical ou autre document</p>
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
                    Déclarer l'absence
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation */}
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
            {selectedAbsences.size > 0
              ? `Êtes-vous sûr de vouloir supprimer ${selectedAbsences.size} absence${selectedAbsences.size > 1 ? 's' : ''} ? Cette action ne peut pas être annulée.`
              : "Êtes-vous sûr de vouloir supprimer cette absence ? Cette action ne peut pas être annulée."}
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
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