// frontend/src/pages/Conges.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  getConges, 
  createConge, 
  updateConge, 
  deleteConge,
  getSoldeConges
} from "../services/congeService";
import { usePermissions } from "../hooks/usePermissions";
import { getEmployes } from "../services/employeService";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import CongesPDFDocument from "../exportPdf/CongesPDFDocument.jsx";
import logoDroite from "../assets/carso 1.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "@/components/ui/checkbox"

import {
  Calendar,
  Upload,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Users,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../components/ui/badge";
// ... reste des imports (Card, Button, etc.)

export default function CongesPage() {
  const { user } = useAuth();
  const permissions = usePermissions();
  
  // États
  const [conges, setConges] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_loadingEmployes, setLoadingEmployes] = useState(false);
  const [_error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [selectedConges, setSelectedConges] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // ID de l'employé connecté
  const [currentEmployeId, setCurrentEmployeId] = useState(null);
 // État pour le solde de congés
  const [soldeConges, setSoldeConges] = useState(null);
  
  const [formData, setFormData] = useState({
    type_conge: "",
    date_debut: "",
    date_fin: "",
    motif: "",
    statut: "SOUMIS",
    employeId: ""
  });

  // Fonction pour charger les employés
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
          setFormData(prev => ({ ...prev, employeId: employe.id.toString() }));
        }
      }
    } catch (err) {
      console.error("Erreur chargement employés:", err);
      toast.error("Erreur", { 
        description: "Impossible de charger les employés" 
      });
    } finally {
      setLoadingEmployes(false);
    }
  };

  // Fonction async pour charger les congés
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getConges();
      setConges(data);
      console.log('Congés chargés:', data.length);
    } catch (err) {
      console.error("Erreur chargement:", err);
      setError(err.message);
      toast.error("Erreur de chargement", {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // 1️⃣ Premier useEffect : Charger congés et employés au montage
  useEffect(() => {
    load();
    loadEmployes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Fonction pour charger le solde (réutilisable avec useCallback)
  const loadSolde = useCallback(async () => {
    if (permissions.isEmploye && currentEmployeId) {
      try {
        console.log('🔄 Chargement du solde pour employé:', currentEmployeId);
        const solde = await getSoldeConges(currentEmployeId);
        setSoldeConges(solde);
        console.log('✅ Solde chargé:', solde);
      } catch (err) {
        console.error("❌ Erreur chargement solde:", err);
        // Ne pas afficher d'erreur toast pour éviter le spam
      }
    }
  }, [permissions.isEmploye, currentEmployeId]);

  // 2️⃣ Deuxième useEffect : Charger le solde quand currentEmployeId change
  useEffect(() => {
    loadSolde();
  }, [loadSolde]);

  // Fonction async de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      toast.error("Erreur", { description: "Utilisateur non connecté" });
      return;
    }

    if (!formData.employeId) {
      toast.error("Erreur", { description: "Veuillez sélectionner un employé" });
      return;
    }

    try {
      const payload = {
        ...formData,
        utilisateurId: user.id,
        employeId: parseInt(formData.employeId),
        statut: permissions.isEmploye ? "SOUMIS" : formData.statut
      };

      console.log('Payload envoyé:', payload);

      if (editing && current) {
        await updateConge(current.id, payload);
        toast.success("Congé mis à jour");
      } else {
        await createConge(payload);
        toast.success(
          permissions.isEmploye 
            ? "Demande de congé envoyée avec succès" 
            : "Congé créé avec succès"
        );
      }
      
      setIsDialogOpen(false);
      resetForm();
      await load();
      // ✅ Recharger le solde après création/modification
      await loadSolde();
      
    } catch (err) {
      console.error("Erreur soumission:", err);
      toast.error("Erreur", { description: err.message });
    }
  };

  // Ouvrir le dialog en mode édition
  const openEditDialog = (conge) => {
    if (permissions.isEmploye && conge.statut !== "SOUMIS") {
      toast.error("Vous ne pouvez modifier que les demandes en attente");
      return;
    }

    setFormData({
      type_conge: conge.type_conge || "",
      date_debut: conge.date_debut?.split('T')[0] || "",
      date_fin: conge.date_fin?.split('T')[0] || "",
      motif: conge.motif || "",
      statut: conge.statut || "SOUMIS",
      employeId: conge.employeId?.toString() || ""
    });
    setCurrent(conge);
    setEditing(true);
    setIsDialogOpen(true);
  };

  // Ouvrir le dialog en mode création
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      type_conge: "",
      date_debut: "",
      date_fin: "",
      motif: "",
      statut: "SOUMIS",
      employeId: permissions.isEmploye ? currentEmployeId?.toString() || "" : ""
    });
    setEditing(false);
    setCurrent(null);
  };


  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sélection de congés
  const handleSelectConge = (id) => {
    const newSelected = new Set(selectedConges);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedConges(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedConges(new Set(filteredConges.map(c => c.id)));
    } else {
      setSelectedConges(new Set());
    }
  };

  // Suppression
  const requestDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const requestDeleteSelected = () => {
    if (selectedConges.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    try {
      if (deleteId) {
        await deleteConge(deleteId);
        toast.success("Congé supprimé");
      } else if (selectedConges.size > 0) {
        await Promise.all(Array.from(selectedConges).map(id => deleteConge(id)));
        toast.success(`${selectedConges.size} congé(s) supprimé(s)`);
        setSelectedConges(new Set());
      }
      await load();
      // ✅ Recharger le solde après suppression (peut libérer des jours si c'était un congé annuel approuvé)
      await loadSolde();
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error("Erreur", { description: err.message });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  // 🔹 Approuver un congé
  const handleApprove = async (id) => {
    try {
      await updateConge(id, { statut: "APPROUVE" });
      toast.success("Congé approuvé");
      await load();
      // ✅ Recharger le solde après approbation (affecte le solde si c'est un congé annuel)
      await loadSolde();
    } catch (err) {
      console.error("Erreur approbation:", err);
      toast.error("Erreur", { description: err.message });
    }
  };

  // 🔹 Refuser un congé
  const handleReject = async (id) => {
    try {
      await updateConge(id, { statut: "REJETE" });
      toast.success("Congé refusé");
      await load();
      // ✅ Recharger le solde après refus (peut libérer des jours si c'était un congé annuel approuvé)
      await loadSolde();
    } catch (err) {
      console.error("Erreur refus:", err);
      toast.error("Erreur", { description: err.message });
    }
  };

  // Exporter en PDF
  const exportToPDF = async () => {
    if (conges.length === 0) {
      toast.warning("Aucune donnée à exporter");
      return;
    }

    try {
      toast.info("Génération du PDF en cours...");

      const blob = await pdf(
        <CongesPDFDocument
          conges={conges}
          employes={employes}
          logoUrl={logoDroite}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'liste_conges.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export PDF réussi");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Badge de statut
  const getStatusBadge = (statut) => {
    const config = {
      SOUMIS: { label: "Soumis", className: "bg-yellow-100 text-yellow-800" },
      APPROUVE: { label: "Approuvé", className: "bg-green-100 text-green-800" },
      REJETE: { label: "Refusé", className: "bg-red-100 text-red-800" },
      EN_ATTENTE: { label: "En attente", className: "bg-gray-100 text-gray-800" }
    };
    
    const config_style = config[statut] || config.SOUMIS;
    
    return (
      <Badge className={config_style.className}>
        {config_style.label}
      </Badge>
    );
  };

  // Statistiques
  const stats = {
    total: conges.length,
  };

  // 🔹 Filtrage avec support rôle employé
  const filteredConges = conges.filter(conge => {
    // Si employé, ne voir QUE ses propres congés
    if (permissions.isEmploye && currentEmployeId) {
      if (conge.employeId !== currentEmployeId) return false;
    }

    const matchSearch = 
      conge.type_conge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conge.employe?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conge.employe?.prenom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatut = filterStatut === "tous" || conge.statut === filterStatut;
    
    return matchSearch && matchStatut;
  });

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
                  {permissions.isEmploye ? "Mes Demandes de Congés" : "Gestion des Congés"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {permissions.isEmploye ? "Soumettez et suivez vos demandes de congés" : "Gérez les demandes et approbations de congés"}e</p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} congé{stats.total > 1 ? 's' : ''} au total
              </div>
              <div className="flex items-center gap-2">
                {/* Bouton Export - visible pour tous les rôles qui peuvent voir les congés */}
                {(permissions.canView('conges') || permissions.isEmploye) && (
                  <button 
                    onClick={exportToPDF} 
                    className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors border border-emerald-500/30 text-sm font-medium flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Exporter PDF
                  </button>
                )}
                {/* Bouton Nouvelle demande - visible pour tous les rôles qui peuvent créer OU pour les employés */}
                {(permissions.canCreate('conges') || permissions.canRequest('conges') || permissions.isEmploye) && (
                  <button
                    onClick={openCreateDialog}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    {permissions.isEmploye ? "Nouvelle Demande" : "Nouveau Congé"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 💼 Carte du solde de congés - uniquement pour les employés */}
        {permissions.isEmploye && soldeConges && (
          <Card className="col-span-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl">
            <CardContent className="p-6">

              <div className="flex items-center justify-between">
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Votre Solde de Congés Annuels
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Année {new Date().getFullYear()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-5xl font-bold text-primary">
                    {soldeConges.soldeRestant}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    sur {soldeConges.soldeTotal} jours
                  </p>
                </div>

              </div>

              <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(soldeConges.joursUtilises / soldeConges.soldeTotal) * 100}%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{soldeConges.joursUtilises} jours utilisés</span>
                <span className="font-semibold text-primary">
                  {soldeConges.soldeRestant} jours disponibles
                </span>
              </div>

            </CardContent>
          </Card>
        )}


        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Congés</p>
                  <p className="text-3xl font-bold">{filteredConges.length}</p>
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
                  <p className="text-blue-100 text-sm font-medium mb-2">En Attente</p>
                  <p className="text-3xl font-bold">{filteredConges.filter(c => c.statut === "SOUMIS").length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">Approuvés</p>
                  <p className="text-3xl font-bold">{filteredConges.filter(c => c.statut === "APPROUVE").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">Refusés</p>
                  <p className="text-3xl font-bold">{filteredConges.filter(c => c.statut === "REJETE").length}</p>
                </div>
                <XCircle className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de sélection */}
        {selectedConges.size > 0 && permissions.canDelete("conges") && !permissions.isEmploye && (
          <div className="rounded-xl bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedConges.size}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedConges.size} congé{selectedConges.size > 1 ? 's' : ''} sélectionné{selectedConges.size > 1 ? 's' : ''}
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
                Supprimer
              </Button>
            </div>
          </div>
        )}

        {/* Liste des congés */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Congés
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredConges.length} congé{filteredConges.length > 1 ? 's' : ''} trouvé{filteredConges.length > 1 ? 's' : ''}
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
                  placeholder="Rechercher par type ou employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 pl-10 pr-4 text-base rounded-lg bg-background border border-border"
                />
              </div>
              
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="SOUMIS">Soumis</SelectItem>
                  <SelectItem value="APPROUVE">Approuvé</SelectItem>
                  <SelectItem value="REJETE">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-6" />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Chargement des congés...</p>
              </div>
            ) : filteredConges.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {searchTerm || filterStatut !== "tous" 
                      ? "Aucun congé trouvé avec ces filtres" 
                      : permissions.isEmploye
                        ? "Vous n'avez pas encore de demande de congé"
                        : "Aucun congé enregistré"}
                  </h3>
                  <p className="text-muted-foreground">
                    {permissions.isEmploye 
                      ? "Faites votre première demande de congé"
                      : "Commencez par créer votre premier congé"}
                  </p>
                </div>
                <Button 
                  onClick={openCreateDialog} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {permissions.isEmploye ? "Faire une demande" : "Créer un congé"}
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b">
                      {!permissions.isEmploye && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedConges.size === filteredConges.length && filteredConges.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                      )}
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Employé</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Date début</TableHead>
                      <TableHead className="font-semibold">Date fin</TableHead>
                      <TableHead className="font-semibold">Durée</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="font-semibold">Motif</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConges.map((conge) => {
                      const dateDebut = new Date(conge.date_debut);
                      const dateFin = new Date(conge.date_fin);
                      const dureeJours = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
                      
                      return (
                        <TableRow 
                          key={conge.id}
                          className="hover:bg-muted/50 transition-colors"
                          data-state={selectedConges.has(conge.id) && "selected"}
                        >
                          {!permissions.isEmploye && (
                            <TableCell>
                              <Checkbox
                                checked={selectedConges.has(conge.id)}
                                onCheckedChange={() => handleSelectConge(conge.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell className="font-medium text-muted-foreground">
                            #{conge.id}
                          </TableCell>
                         
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                                {conge.employe?.prenom?.[0]}{conge.employe?.nom?.[0]}
                              </div>
                              <span>
                                {conge.employe ? 
                                  `${conge.employe.prenom} ${conge.employe.nom}` : 
                                  'N/A'
                                }
                              </span>
                            </div>
                          </TableCell>
                           <TableCell className="font-medium">
                            {conge.type_conge}
                          </TableCell>
                          <TableCell>{formatDate(conge.date_debut)}</TableCell>
                          <TableCell>{formatDate(conge.date_fin)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {dureeJours} jour{dureeJours > 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(conge.statut)}</TableCell>
                          <TableCell className="max-w-xs">
                            <span className="truncate block" title={conge.motif}>
                              {conge.motif || '-'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {conge.statut === "SOUMIS" && 
                               (permissions.isAdmin || permissions.isSuperAdmin) && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleApprove(conge.id)}
                                    className="hover:bg-green-50"
                                    title="Approuver"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleReject(conge.id)}
                                    className="hover:bg-red-50"
                                    title="Refuser"
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              
                              {permissions.canUpdate("conges") && 
                               (!permissions.isEmploye || conge.statut === "SOUMIS") && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditDialog(conge)}
                                  className="hover:bg-blue-50"
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                              
                              {permissions.canDelete("conges") && !permissions.isEmploye && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => requestDelete(conge.id)}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border shadow-2xl">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  {editing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                {editing ? 'Modifier le congé' : 'Nouvelle demande de congé'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 mt-2">
                {editing ? 'Modifiez les informations du congé' : 'Créez une demande de congé'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-card max-h-[60vh] overflow-y-auto">

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
                  value={formData.employeId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employeId: value }))}
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

            
            {/* Type de congé */}
            <div className="space-y-2">
              <Label htmlFor="type_conge" className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Type de congé <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type_conge}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type_conge: value }))}
                required
              >
                <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder="Sélectionner un type de congé" />
                </SelectTrigger>
               <SelectContent>
                <SelectItem value="Congé annuel">Congé annuel (30j/an)</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie (15j/an)</SelectItem>
                <SelectItem value="Congé maternité">Congé maternité (98j)</SelectItem>
                <SelectItem value="Congé paternité">Congé paternité (10j)</SelectItem>
                <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                <SelectItem value="Événement familial - Mariage">Mariage (3j)</SelectItem>
                <SelectItem value="Événement familial - Décès">Décès (3j)</SelectItem>
                <SelectItem value="Événement familial - Naissance">Naissance (3j)</SelectItem>
                <SelectItem value="RTT">RTT (12j/an)</SelectItem>
                <SelectItem value="Formation">Formation</SelectItem>
              </SelectContent>
              </Select>
            </div>


            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut" className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date début <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date_debut"
                  name="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={handleChange}
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_fin" className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date fin <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date_fin"
                  name="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={handleChange}
                  min={formData.date_debut}
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Calcul de la durée */}
            {formData.date_debut && formData.date_fin && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                <p className="text-sm text-primary">
                  📅 Durée: <strong>
                    {Math.ceil((new Date(formData.date_fin) - new Date(formData.date_debut)) / (1000 * 60 * 60 * 24)) + 1}
                  </strong> jour(s)
                </p>
              </div>
            )}

            {/* Statut - Uniquement pour Admin/SuperAdmin */}
            {!permissions.isEmploye && (
              <div className="space-y-2">
                <Label htmlFor="statut" className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Statut
                </Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, statut: value }))}
                >
                  <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOUMIS">Soumis</SelectItem>
                    <SelectItem value="APPROUVE">✅ Approuvé</SelectItem>
                    <SelectItem value="REJETE">❌ Refusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Motif */}
            <div className="space-y-2">
              <Label htmlFor="motif" className="font-semibold">
                Motif {permissions.isEmploye && "(optionnel)"}
              </Label>
              <Textarea
                id="motif"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                placeholder="Précisez le motif du congé..."
                rows={4}
                className="resize-none border-2 focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Ajoutez des détails supplémentaires si nécessaire
              </p>
            </div>

            <Separator className="my-6" />

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }} 
                className="flex-1 h-12 border-2"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                {editing ? "Mettre à jour" : "Envoyer la demande"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
            {selectedConges.size > 0
              ? `Êtes-vous sûr de vouloir supprimer ${selectedConges.size} congé${selectedConges.size > 1 ? 's' : ''} ? Cette action ne peut pas être annulée.`
              : "Êtes-vous sûr de vouloir supprimer ce congé ? Cette action ne peut pas être annulée."}
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
