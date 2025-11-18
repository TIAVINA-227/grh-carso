// frontend/src/pages/Conges.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getConges, createConge, updateConge, deleteConge } from "../services/congeService";
import { usePermissions } from "../hooks/usePermissions";
import { getEmployes } from "../services/employeService";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import CongesPDFDocument from "../exportPdf/CongesPDFDocument.jsx";
import logoDroite from "../assets/carso 1.png";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar,
  Filter,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function CongesPage() {
  const { user } = useAuth();
  const permissions = usePermissions();
  
  // États
  const [conges, setConges] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployes, setLoadingEmployes] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [selectedConges, setSelectedConges] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  
  // 🔹 ID de l'employé connecté
  const [currentEmployeId, setCurrentEmployeId] = useState(null);
  
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
          // Pré-remplir l'ID pour les employés
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

  // Charger au montage
  useEffect(() => {
    load();
    loadEmployes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // 🔹 Pour un employé, forcer le statut à "SOUMIS" (au lieu de EN_ATTENTE)
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
      
    } catch (err) {
      console.error("Erreur soumission:", err);
      toast.error("Erreur", { description: err.message });
    }
  };

  // Fonction async de suppression
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce congé ?")) {
      return;
    }
    
    try {
      await deleteConge(id);
      toast.success("Congé supprimé");
      await load();
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error("Erreur", { description: err.message });
    }
  };

  // Suppression multiple
  const handleDeleteSelected = async () => {
    if (selectedConges.size === 0) {
      toast.error("Aucun congé sélectionné");
      return;
    }

    if (!window.confirm(`Supprimer ${selectedConges.size} congé(s) ?`)) {
      return;
    }

    try {
      for (const id of selectedConges) {
        await deleteConge(id);
      }
      toast.success(`${selectedConges.size} congé(s) supprimé(s)`);
      setSelectedConges(new Set());
      await load();
    } catch (err) {
      console.error("Erreur suppression multiple:", err);
      toast.error("Erreur", { description: err.message });
    }
  };

  // 🔹 Approuver un congé
  const handleApprove = async (id) => {
    try {
      await updateConge(id, { statut: "APPROUVE" });
      toast.success("Congé approuvé");
      await load();
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
    } catch (err) {
      console.error("Erreur refus:", err);
      toast.error("Erreur", { description: err.message });
    }
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

  // Ouvrir le dialog en mode édition
  const openEditDialog = (conge) => {
    // 🔹 Employé peut seulement éditer les congés "SOUMIS"
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

  // Exporter en PDF
  const exportToPDF = async () => {
    if (conges.length === 0) {
      toast.warning("Aucune donnée à exporter");
      return;
    }

    try {
      toast.info("Génération du PDF en cours...");

      // Générer le document PDF
      const blob = await pdf(
        <CongesPDFDocument
          conges={conges}
          employes={employes}
          logoUrl={logoDroite}
        />
      ).toBlob();

      // Créer un lien de téléchargement
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

  const handleSelectAll = () => {
    if (selectedConges.size === filteredConges.length) {
      setSelectedConges(new Set());
    } else {
      setSelectedConges(new Set(filteredConges.map(c => c.id)));
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
      SOUMIS: { variant: "default", label: "Soumis" },
      APPROUVE: { variant: "default", label: "Approuvé", className: "bg-green-500 text-white" },
      REJETE: { variant: "destructive", label: "Refusé" },
      EN_ATTENTE: { variant: "secondary", label: "En attente" }
    };
    
    const { label, className } = config[statut] || config.SOUMIS;
    
    return (
      <Badge className={className}>
        {label}
      </Badge>
    );
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
    <div className="p-8 bg-gradient-to-br from-background to-muted dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <Card className="bg-card dark:bg-slate-900 border-border shadow-lg">
        <CardHeader className="border-b border-border bg-gradient-to-r from-card dark:from-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 dark:bg-blue-700 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground dark:text-white">
                  {permissions.isEmploye ? "Mes Demandes de Congés" : "Gestion des Congés"}
                </CardTitle>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                  {filteredConges.length} congé{filteredConges.length > 1 ? 's' : ''} 
                  {filterStatut !== "tous" && ` (filtre: ${filterStatut})`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* 🔹 Suppression multiple uniquement pour Admin/SuperAdmin */}
              {selectedConges.size > 0 && permissions.canDelete("conges") && !permissions.isEmploye && (
                <Button 
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer ({selectedConges.size})
                </Button>
              )}
              <Button 
                onClick={openCreateDialog}
                className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus className="h-4 w-4" />
                {permissions.isEmploye ? "Nouvelle Demande" : "Nouveau Congé"}
              </Button>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-500" />
              <Input
                placeholder="Rechercher par type ou employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background dark:bg-slate-800 text-foreground dark:text-white border-border"
              />
            </div>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-[200px]">
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
            <Button variant="outline" className="flex items-center gap-2" onClick={exportToPDF}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Erreur</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* État de chargement */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Chargement des congés...</p>
            </div>
          ) : filteredConges.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                {searchTerm || filterStatut !== "tous" 
                  ? "Aucun congé trouvé avec ces filtres" 
                  : permissions.isEmploye
                    ? "Vous n'avez pas encore de demande de congé"
                    : "Aucun congé enregistré"}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {permissions.isEmploye 
                  ? "Faites votre première demande de congé"
                  : "Commencez par créer votre premier congé"}
              </p>
              <Button 
                onClick={openCreateDialog} 
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                {permissions.isEmploye ? "Faire une demande" : "Créer un congé"}
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {/* 🔹 Checkbox uniquement pour Admin/SuperAdmin */}
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
                        className="hover:bg-gray-50 transition-colors"
                        data-state={selectedConges.has(conge.id) && "selected"}
                      >
                        {/* 🔹 Checkbox uniquement pour Admin/SuperAdmin */}
                        {!permissions.isEmploye && (
                          <TableCell>
                            <Checkbox
                              checked={selectedConges.has(conge.id)}
                              onCheckedChange={() => handleSelectConge(conge.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium text-gray-600">
                          #{conge.id}
                        </TableCell>
                       
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
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
                            {/* 🔹 Boutons Approuver/Refuser - Uniquement pour Admin/SuperAdmin sur congés SOUMIS */}
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
                            
                            {/* 🔹 Modifier - Employé uniquement sur SOUMIS */}
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
                            
                            {/* 🔹 Supprimer - Uniquement Admin/SuperAdmin */}
                            {permissions.canDelete("conges") && !permissions.isEmploye && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(conge.id)}
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

      {/* Dialog de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "✏️ Modifier le congé" : permissions.isEmploye ? "📝 Nouvelle demande de congé" : "➕ Créer un nouveau congé"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du congé ci-dessous. Les champs marqués d'un * sont obligatoires.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Type de congé */}
              <div className="grid gap-2">
                <Label htmlFor="type_conge" className="font-semibold">
                  Type de congé <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type_conge"
                  value={formData.type_conge}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type_conge: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de congé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Congé annuel">Congé annuel</SelectItem>
                    <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                    <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                    <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                    <SelectItem value="Congé paternité">Congé paternité</SelectItem>
                    <SelectItem value="RTT">RTT</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 🔹 Select Employé - Différent selon le rôle */}
              <div className="grid gap-2">
                <Label htmlFor="employeId" className="font-semibold">
                  Employé <span className="text-red-500">*</span>
                </Label>
                
                {/* 🔹 Pour EMPLOYÉ : Affichage en lecture seule */}
                {permissions.isEmploye && currentEmployeId ? (
                  <div className="p-3 border border-border rounded-md bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
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
                  /* 🔹 Pour ADMIN/SUPERADMIN : Select avec tous les employés */
                  <>
                    {loadingEmployes ? (
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600">Chargement des employés...</span>
                      </div>
                    ) : employes.length === 0 ? (
                      <div className="p-3 border border-yellow-200 rounded-md bg-yellow-50">
                        <p className="text-sm text-yellow-800 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Aucun employé disponible. Créez d'abord un employé.
                        </p>
                      </div>
                    ) : (
                      <Select
                        name="employeId"
                        value={formData.employeId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, employeId: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un employé" />
                        </SelectTrigger>
                        <SelectContent>
                          {employes.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                                  {emp.prenom?.[0]}{emp.nom?.[0]}
                                </div>
                                <span>
                                  {emp.prenom} {emp.nom}
                                  {emp.matricule && (
                                    <span className="text-gray-500 text-xs ml-2">
                                      ({emp.matricule})
                                    </span>
                                  )}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date_debut" className="font-semibold">
                    Date de début <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_debut"
                    name="date_debut"
                    type="date"
                    value={formData.date_debut}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date_fin" className="font-semibold">
                    Date de fin <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_fin"
                    name="date_fin"
                    type="date"
                    value={formData.date_fin}
                    onChange={handleChange}
                    min={formData.date_debut}
                    required
                  />
                </div>
              </div>

              {/* Calcul de la durée */}
              {formData.date_debut && formData.date_fin && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    📅 Durée: <strong>
                      {Math.ceil((new Date(formData.date_fin) - new Date(formData.date_debut)) / (1000 * 60 * 60 * 24)) + 1}
                    </strong> jour(s)
                  </p>
                </div>
              )}

              {/* 🔹 Statut - Uniquement pour Admin/SuperAdmin */}
              {!permissions.isEmploye && (
                <div className="grid gap-2">
                  <Label htmlFor="statut" className="font-semibold">
                    Statut
                  </Label>
                  <Select
                    name="statut"
                    value={formData.statut}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, statut: value }))}
                  >
                    <SelectTrigger>
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
              <div className="grid gap-2">
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
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Ajoutez des détails supplémentaires si nécessaire
                </p>
              </div>

              {/* 🔹 Message d'information pour les employés */}
              {permissions.isEmploye && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Information importante</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Votre demande sera soumise pour validation par votre responsable. 
                        Le statut sera automatiquement défini sur "Soumis".
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editing ? "Mettre à jour" : permissions.isEmploye ? "Envoyer la demande" : "Créer le congé"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}