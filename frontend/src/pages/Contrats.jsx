
//frontend/src/ pages/Contrats.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { getContrats, createContrat, updateContrat, deleteContrat } from "../services/contratService";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../hooks/useAuth";
import { getEmployes } from "../services/employeService";
import { FileText, User, Plus, Edit, Trash2, Calendar, DollarSign, Eye, Activity, Briefcase, TrendingUp, Clock, Upload, FileSpreadsheet, ChevronDown, Mail, Phone, MapPin, Building2, AlertCircle } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import ContratsPDFDocument from "../exportPDF/ContratsPDFDocument";
import { useToast } from "../components/ui/use-toast";
import { Checkbox } from "../components/ui/checkbox";

export default function Contrats() {
  const { user } = useAuth();
  const permissions = usePermissions();
  const [contrats, setContrats] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEmployeId, setCurrentEmployeId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ 
    employeId: "", 
    type_contrat: "CDI", 
    date_debut: new Date().toISOString().split('T')[0], 
    date_fin: "",
    salaire_base: "",
    statut: "ACTIF"
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedContrats, setSelectedContrats] = useState(new Set());
  const [importMenuOpen, setImportMenuOpen] = useState(false);
  const csvInputRef = useRef(null);
  
  // États pour le modal de détails
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getContrats();
      const empData = await getEmployes();
      
      // ✅ Trouver l'employé correspondant à l'utilisateur connecté
      if (permissions.isEmploye && user) {
        // Méthode 1: Utiliser employeId si disponible dans user
        if (user.employeId) {
          setCurrentEmployeId(user.employeId);
          console.log('✅ Employé trouvé via user.employeId:', user.employeId);
        } else {
          // Méthode 2: Chercher par email
          const employe = empData.find(emp => 
            emp.email?.toLowerCase() === user.email?.toLowerCase()
          );
          if (employe) {
            setCurrentEmployeId(employe.id);
            console.log('✅ Employé trouvé par email pour les contrats:', employe.id, employe.prenom, employe.nom);
          } else {
            console.warn('⚠️ Aucun employé trouvé pour l\'email:', user.email);
          }
        }
      }
      
      setContrats(data || []);
      // S'assurer que les employés ont bien leurs relations (poste et departement)
      setEmployes(empData || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les contrats ou employés");
      toast({
        title: "Erreur ❌",
        description: "Impossible de charger les contrats.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { 
    load(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions.isEmploye, user]);
  
  // ✅ Filtrer les contrats selon le rôle et les permissions
  const filteredContrats = useMemo(() => {
    // Admin et SuperAdmin voient tout
    if (permissions.isSuperAdmin || permissions.isAdmin) {
      return contrats;
    }
    
    // Employé ne voit que son propre contrat
    if (permissions.isEmploye && currentEmployeId) {
      return contrats.filter(c => c.employeId === currentEmployeId);
    }
    
    // Par défaut, retourner un tableau vide si l'employé n'est pas trouvé
    return [];
  }, [contrats, permissions.isSuperAdmin, permissions.isAdmin, permissions.isEmploye, currentEmployeId]);

  const handleCsvContratsImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportMenuOpen(false);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result;
        if (typeof csv !== 'string') return;
        const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        let imported = 0; let errors = 0;
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((h, idx) => row[h] = values[idx] || '');
          try {
            if (row.employeid) {
              await createContrat({
                employeId: parseInt(row.employeid),
                type_contrat: row.type_contrat || 'CDI',
                date_debut: row.date_debut || new Date().toISOString(),
                date_fin: row.date_fin || null,
                salaire_base: row.salaire_base ? parseFloat(row.salaire_base) : 0,
                statut: row.statut || 'ACTIF'
              });
              imported++;
            }
          } catch (err) { console.error(err); errors++; }
        }
        toast({ title: `Import terminé`, description: `${imported} contrat(s) importé(s)${errors ? `, ${errors} erreur(s)` : ''}` });
        await load();
      } catch (err) { console.error(err); }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const exportToPDF = async () => {
    try {
      const blob = await pdf(<ContratsPDFDocument contrats={filteredContrats} employes={employes} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrats_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ 
      employeId: "", 
      type_contrat: "CDI", 
      date_debut: new Date().toISOString().split('T')[0], 
      date_fin: "",
      salaire_base: "",
      statut: "ACTIF"
    });
    setIsDialogOpen(true);
  };

  const openEdit = (c) => {
    // ✅ Vérifier les permissions
    if (!permissions.canEdit('contrats')) {
      toast({
        title: "Erreur ❌",
        description: "Vous n'avez pas la permission de modifier un contrat",
        className: "bg-red-600 text-white",
      });
      return;
    }
    
    setEditingId(c.id);
    setForm({ 
      employeId: c.employeId || "", 
      type_contrat: c.type_contrat || "CDI", 
      date_debut: c.date_debut ? new Date(c.date_debut).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      date_fin: c.date_fin ? new Date(c.date_fin).toISOString().split('T')[0] : "",
      salaire_base: c.salaire_base || "",
      statut: c.statut || "ACTIF"
    });
    setIsDialogOpen(true);
  };

  // Fonction pour ouvrir le modal de détails
  const openDetails = (contrat) => {
    setSelectedContrat(contrat);
    setDetailsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // ✅ Vérifier les permissions
    if (!permissions.canCreate('contrats') && !editingId) {
      toast({
        title: "Erreur ❌",
        description: "Vous n'avez pas la permission de créer un contrat",
        className: "bg-red-600 text-white",
      });
      return;
    }
    
    if (!permissions.canEdit('contrats') && editingId) {
      toast({
        title: "Erreur ❌",
        description: "Vous n'avez pas la permission de modifier un contrat",
        className: "bg-red-600 text-white",
      });
      return;
    }
    
    if (!form.employeId) return setError("Veuillez sélectionner un employé valide");
    try {
      if (editingId) {
        await updateContrat(editingId, form);
        toast({
          title: "Contrat mis à jour ✅",
          description: "Les informations ont été modifiées avec succès.",
          className: "bg-green-600 text-white",
        });
      } else {
        await createContrat(form);
        toast({
          title: "Contrat créé ✅",
          description: "Nouveau contrat ajouté avec succès.",
          className: "bg-green-600 text-white",
        });
      }
      setIsDialogOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur");
      toast({
        title: "Erreur ❌",
        description: "Impossible d'enregistrer le contrat.",
        className: "bg-red-600 text-white",
      });
    }
  };

  const requestDelete = (id) => {
    // ✅ Vérifier les permissions
    if (!permissions.canDelete('contrats')) {
      toast({
        title: "Erreur ❌",
        description: "Vous n'avez pas la permission de supprimer un contrat",
        className: "bg-red-600 text-white",
      });
      return;
    }
    
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    try {
      if (deleteId) {
        await deleteContrat(deleteId);
        toast({ 
          title: "Contrat supprimé ✅", 
          description: "Le contrat a été supprimé avec succès.",
          className: "bg-green-600 text-white",
        });
      } else if (selectedContrats.size > 0) {
        await Promise.all(Array.from(selectedContrats).map(id => deleteContrat(id)));
        toast({ 
          title: `${selectedContrats.size} contrat(s) supprimé(s) ✅`,
          className: "bg-green-600 text-white",
        });
        setSelectedContrats(new Set());
      }
      await load();
    } catch (err) {
      console.error(err);
      toast({ 
        title: "Erreur ❌", 
        description: "Impossible de supprimer le contrat.",
        className: "bg-red-600 text-white",
      });
    }
    setDeleteId(null);
  };

  const handleSelectContrat = (id) => {
    setSelectedContrats(prev => {
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
    // ✅ Utiliser filteredContrats au lieu de refiltrer
    if (checked) {
      setSelectedContrats(new Set(filteredContrats.map(item => item.id)));
    } else {
      setSelectedContrats(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedContrats.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  // Statistiques avec les contrats filtrés
  const stats = {
    total: filteredContrats.length,
    actifs: filteredContrats.filter(c => c.statut === "ACTIF").length,
    termines: filteredContrats.filter(c => c.statut === "TERMINE").length,
    cdi: filteredContrats.filter(c => c.type_contrat === "CDI").length,
    cdd: filteredContrats.filter(c => c.type_contrat === "CDD").length,
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "CDI": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "CDD": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "Stage": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "Freelance": return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      default: return "bg-muted text-muted-foreground border";
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "ACTIF": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "TERMINE": return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
      default: return "bg-muted text-muted-foreground border";
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR');

  const formatSalary = (salary) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
  }).format(salary);

  // Fonction pour obtenir les informations de l'employé
  const getEmployeeInfo = (employeId) => {
    return employes.find(e => e.id === employeId);
  };

  // Nouveau loader réutilisable pour uniformiser l'apparence des loaders
  const PageLoader = ({ message = "Chargement..." }) => (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header moderne */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5"></div>
          
          <div className="relative space-y-6">
            {/* Titre et description */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/30">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                  {permissions.isEmploye ? 'Mon Contrat' : 'Gestion des Contrats'}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {permissions.isEmploye 
                    ? 'Consultez les informations de votre contrat de travail'
                    : 'Consultez et gérez les contrats de travail'}
                </p>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Actions et statistiques */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} contrat{stats.total > 1 ? 's' : ''} au total
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap items-center gap-2">
                {/* ✅ Bouton Exporter PDF - accessible à tous (employés exportent leur contrat) */}
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Exporter PDF
                </button>

                {/* ✅ Boutons de création/modification - seulement pour admins */}
                {(permissions.isSuperAdmin || permissions.isAdmin) && permissions.canCreate && permissions.canCreate('contrats') && (
                  <>
                    {/* Bouton Nouveau Contrat */}
                    <button
                      onClick={openCreate}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Nouveau Contrat
                    </button>
                    
                    {/* Input file caché */}
                    <input 
                      ref={csvInputRef} 
                      type="file" 
                      accept=".csv" 
                      onChange={handleCsvContratsImport} 
                      className="hidden" 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Contrats</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">Actifs</p>
                  <p className="text-3xl font-bold">{stats.actifs}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">CDI</p>
                  <p className="text-3xl font-bold">{stats.cdi}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">CDD</p>
                  <p className="text-3xl font-bold">{stats.cdd}</p>
                </div>
                <Calendar className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de sélection */}
        {permissions.canDelete('contrats') && selectedContrats.size > 0 && (
          <div className="rounded-xl bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedContrats.size}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedContrats.size} contrat{selectedContrats.size > 1 ? 's' : ''} sélectionné{selectedContrats.size > 1 ? 's' : ''}
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

        {/* Liste des contrats */}
        
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Partie gauche - Titre */}
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Contrats
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredContrats.length} contrat{filteredContrats.length > 1 ? 's' : ''} trouvé{filteredContrats.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Partie droite - Bouton Import */}
              {(permissions.isSuperAdmin || permissions.isAdmin) && permissions.canCreate && permissions.canCreate('contrats') && (
                <div className="relative">
                  <button
                    onClick={() => setImportMenuOpen(!importMenuOpen)}
                    className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 transition-colors border border-green-500/30 text-sm font-medium flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Importer CSV
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${importMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {importMenuOpen && (
                    <>
                      {/* Overlay pour fermer le menu */}
                      <div 
                        className="fixed inset-0 z-[100]" 
                        onClick={() => setImportMenuOpen(false)} 
                      />
                      
                      {/* Menu déroulant */}
                      <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-card rounded-lg shadow-2xl border border-border z-[101]">
                        <div 
                          onClick={() => {
                            csvInputRef.current?.click();
                            setImportMenuOpen(false);
                          }} 
                          className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer transition-colors rounded-lg"
                        >
                          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground">
                              Import CSV
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Importer des contrats
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            {loading ? (
              <PageLoader message="Chargement des contrats..." />
            ) : filteredContrats.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Aucun contrat trouvé</h3>
                  <p className="text-muted-foreground">Commencez par créer un nouveau contrat</p>
                </div>
                {permissions.canCreate('contrats') && (
                  <Button 
                    onClick={openCreate} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un contrat
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {permissions.canDelete('contrats') && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                    <Checkbox
                      id="select-all"
                      checked={selectedContrats.size === filteredContrats.length && filteredContrats.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-2"
                    />
                    <label htmlFor="select-all" className="text-sm font-semibold text-foreground cursor-pointer">
                      Tout sélectionner ({filteredContrats.length} contrat{filteredContrats.length > 1 ? 's' : ''})
                    </label>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContrats.map((contrat) => (
                    <Card 
                      key={contrat.id} 
                      className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                        selectedContrats.has(contrat.id) 
                          ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {permissions.canDelete('contrats') && (
                              <Checkbox
                                checked={selectedContrats.has(contrat.id)}
                                onCheckedChange={() => handleSelectContrat(contrat.id)}
                                className="border-2 mt-1"
                              />
                            )}
                            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <User className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-foreground truncate">
                                {(() => {
                                  const emp = employes.find(e => e.id === contrat.employeId);
                                  return emp ? `${emp.nom} ${emp.prenom}` : `Employé #${contrat.employeId}`;
                                })()}
                              </h3>
                              <p className="text-sm text-muted-foreground">Contrat de travail</p>
                            </div>
                          </div>
                          <Badge className={`${getTypeColor(contrat.type_contrat)} text-xs px-3 py-1 font-semibold border`}>
                            {contrat.type_contrat}
                          </Badge>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Début: <span className="font-medium text-foreground">{formatDate(contrat.date_debut)}</span></span>
                          </div>
                          {contrat.date_fin && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 text-destructive" />
                              <span>Fin: <span className="font-medium text-foreground">{formatDate(contrat.date_fin)}</span></span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-accent text-primary" />
                            <span className="font-semibold text-foreground">{formatSalary(contrat.salaire_base)}/mois</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <Badge className={`${getStatutColor(contrat.statut)} text-xs px-3 py-1 font-semibold border`}>
                            {contrat.statut.toLowerCase()}
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openDetails(contrat)}
                              className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {permissions.canEdit('contrats') && (
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openEdit(contrat)}
                                className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {permissions.canDelete('contrats') && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => requestDelete(contrat.id)}
                                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
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

      {/* Dialog Détails du Contrat */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border shadow-2xl">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-6 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                Détails du Contrat
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 mt-2">
                Informations complètes du contrat de travail
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedContrat && (
            <div className="p-6 space-y-6 bg-card max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Informations de l'employé */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp ? `${emp.nom} ${emp.prenom}` : `Employé #${selectedContrat.employeId}`;
                      })()}
                    </h3>
                    <p className="text-sm text-primary font-semibold">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp?.poste?.intitule || 'Poste non assigné';
                      })()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp?.departement?.nom_departement || 'Département non assigné';
                      })()}
                    </p>
                  </div>
                  <div>
                    <Badge className={`${getTypeColor(selectedContrat.type_contrat)} text-sm px-4 py-2 font-semibold border`}>
                      {selectedContrat.type_contrat}
                    </Badge>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                      <Mail className="w-3 h-3" />
                      Email
                    </div>
                    <p className="text-foreground font-medium">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp?.email || '-';
                      })()}
                    </p>
                  </div>

                  <div className="space-y-1 p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                      <Phone className="w-3 h-3" />
                      Téléphone
                    </div>
                    <p className="text-foreground font-medium">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp?.telephone || '-';
                      })()}
                    </p>
                  </div>

                  <div className="space-y-1 p-4 rounded-lg bg-muted/30 border md:col-span-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                      <MapPin className="w-3 h-3" />
                      Adresse
                    </div>
                    <p className="text-foreground font-medium">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp?.adresse || '-';
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informations du contrat */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Informations du Contrat
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wide">
                      <Calendar className="w-3 h-3" />
                      Date de début
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {formatDate(selectedContrat.date_debut)}
                    </p>
                  </div>

                  <div className="space-y-1 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-semibold uppercase tracking-wide">
                      <Calendar className="w-3 h-3" />
                      Date de fin
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {selectedContrat.date_fin ? formatDate(selectedContrat.date_fin) : 'Indéterminée'}
                    </p>
                  </div>

                  <div className="space-y-1 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wide">
                      <DollarSign className="w-3 h-3" />
                      Salaire de base
                    </div>
                    <p className="text-foreground font-bold text-xl">
                      {formatSalary(selectedContrat.salaire_base)}
                    </p>
                    <p className="text-xs text-muted-foreground">Par mois</p>
                  </div>

                  <div className="space-y-1 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide">
                      <Activity className="w-3 h-3" />
                      Statut du contrat
                    </div>
                    <Badge className={`${getStatutColor(selectedContrat.statut)} text-sm px-3 py-1.5 font-semibold border mt-2`}>
                      {selectedContrat.statut}
                    </Badge>
                  </div>

                  <div className="space-y-1 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 md:col-span-2">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-semibold uppercase tracking-wide">
                      <Building2 className="w-3 h-3" />
                      Département
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {(() => {
                        const emp = getEmployeeInfo(selectedContrat.employeId);
                        return emp?.departement?.nom_departement || 'Non assigné';
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Durée du contrat */}
              <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Durée du contrat
                </h4>
                <p className="text-foreground">
                  {(() => {
                    if (!selectedContrat.date_fin) {
                      const debut = new Date(selectedContrat.date_debut);
                      const maintenant = new Date();
                      const mois = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24 * 30));
                      return `${mois} mois (En cours)`;
                    }
                    const debut = new Date(selectedContrat.date_debut);
                    const fin = new Date(selectedContrat.date_fin);
                    const mois = Math.floor((fin - debut) / (1000 * 60 * 60 * 24 * 30));
                    return `${mois} mois`;
                  })()}
                </p>
              </div>

              <DialogFooter className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDetailsDialogOpen(false)}
                  className="flex-1 h-12 border-2"
                >
                  Fermer
                </Button>
                {permissions.canEdit('contrats') && (
                  <Button 
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      openEdit(selectedContrat);
                    }}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog créer/modifier */}
      {(permissions.canCreate('contrats') || permissions.canEdit('contrats')) && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border shadow-2xl">
            <div className="bg-primary p-6 text-primary-foreground">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  {editingId ? 'Modifier le Contrat' : 'Nouveau Contrat'}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 mt-2">
                  {editingId ? 'Modifiez les informations du contrat ci-dessous' : 'Créez un nouveau contrat de travail'}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-card">
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive rounded-lg p-4 flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-destructive">Erreur</p>
                    <p className="text-sm text-destructive/80 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="employeId" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Employé <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.employeId.toString()}
                  onValueChange={(value) => setForm({ ...form, employeId: parseInt(value) })}
                >
                  <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employes.map(e => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {e.nom[0]}{e.prenom[0]}
                          </div>
                          <span>{e.nom} {e.prenom}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_contrat" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-accent" />
                  Type de contrat <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.type_contrat}
                  onValueChange={(value) => setForm({ ...form, type_contrat: value })}
                >
                  <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI - Contrat à Durée Indéterminée</SelectItem>
                    <SelectItem value="CDD">CDD - Contrat à Durée Déterminée</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Freelance">Freelance / Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_debut" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
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
                    <Calendar className="w-4 h-4 text-rose-500" />
                    Date de fin
                  </Label>
                  <Input 
                    id="date_fin" 
                    type="date" 
                    value={form.date_fin} 
                    onChange={(e) => setForm({ ...form, date_fin: e.target.value })} 
                    className="h-12 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaire_base" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  Salaire de base (Ar/mois) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="salaire_base" 
                  type="number" 
                  value={form.salaire_base} 
                  onChange={(e) => setForm({ ...form, salaire_base: parseFloat(e.target.value) })} 
                  placeholder="500000" 
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required 
                />
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
                    <SelectItem value="ACTIF">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span>Actif</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TERMINE">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                        <span>Terminé</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                      Créer le contrat
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {permissions.canDelete('contrats') && (
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
              {selectedContrats.size > 0
                ? `Êtes-vous sûr de vouloir supprimer ${selectedContrats.size} contrat${selectedContrats.size > 1 ? 's' : ''} ? Cette action ne peut pas être annulée.`
                : "Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action ne peut pas être annulée."}
            </p>
            <DialogFooter className="gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1 hover:opacity-90"
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}