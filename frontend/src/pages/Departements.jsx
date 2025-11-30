//frontend/src/pages/Departements.jsx
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "../components/ui/use-toast";
import {
  getDepartements,
  createDepartement,
  updateDepartement,
  deleteDepartement,
} from "../services/departementService";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Upload,
  FileUp,
  AlertCircle,
} from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { Separator } from "../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Departements() {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const permissions = usePermissions();
  const [form, setForm] = useState({ nom_departement: "", responsable: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();
  const [selectedDepartements, setSelectedDepartements] = useState(new Set());
  const [importMenuOpen, setImportMenuOpen] = useState(false);

  // Référence pour l'input file CSV
  const csvInputRef = useRef(null);

  // Import CSV pour départements
  const handleCsvDepartementsImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportMenuOpen(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result;
        if (typeof csv !== 'string') {
          toast({
            title: "Erreur",
            description: "Erreur de lecture du fichier",
            variant: "destructive"
          });
          return;
        }

        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        let importedCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          try {
            // Format attendu: nom_departement, responsable
            if (row.nom_departement) {
              await createDepartement({
                nom_departement: row.nom_departement,
                responsable: row.responsable || ''
              });
              importedCount++;
            }
          } catch {
            errorCount++;
          }
        }

        toast({
          title: "Import terminé",
          description: `${importedCount} département(s) importé(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`,
          variant: "success"
        });
        await load();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de l'import du fichier",
          variant: "destructive"
        });
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // Télécharger un modèle CSV
  const downloadCSVTemplate = () => {
    const template = "nom_departement,responsable\nRessources Humaines,Jean Dupont\nComptabilité,Marie Martin\nInformatique,";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modele_departements.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Modèle téléchargé",
      description: "Le fichier modèle CSV a été téléchargé",
      variant: "success"
    });
  };

  // Charger les départements
  const load = async () => {
    setLoading(true);
    try {
      const data = await getDepartements();
      setDepartements(data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les départements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  // Ouvrir le modal d'ajout
  const openCreate = () => {
    setEditingId(null);
    setForm({ nom_departement: "", responsable: "" });
    setIsDialogOpen(true);
  };

  // Ouvrir le modal de modification
  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({
      nom_departement: d.nom_departement || "",
      responsable: d.responsable || "",
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le modal des détails
  const openDetails = (d) => {
    setSelectedDepartement(d);
    setIsDetailsOpen(true);
  };

  // Enregistrer ou modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        await updateDepartement(editingId, form);
        toast({ title: "Département modifié avec succès", variant: "success" });
      } else {
        await createDepartement(form);
        toast({ title: "Département créé avec succès", variant: "success" });
      }
      setIsDialogOpen(false);
      setForm({ nom_departement: "", responsable: "" });
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur");
      toast({ title: "Erreur lors de l'enregistrement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le modal de confirmation avant suppression
  const requestDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  // Supprimer un département
  const confirmDelete = async () => {
    try {
      if (deleteId) {
        await deleteDepartement(deleteId);
        toast({ title: "Suppression effectuée avec succès", variant: "success" });
      } else if (selectedDepartements.size > 0) {
        await Promise.all(Array.from(selectedDepartements).map(id => deleteDepartement(id)));
        toast({ title: `${selectedDepartements.size} département(s) supprimé(s)`, variant: "success" });
        setSelectedDepartements(new Set());
      }
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleSelectDepartement = (id) => {
    setSelectedDepartements(prev => {
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
      setSelectedDepartements(new Set(departements.map(item => item.id)));
    } else {
      setSelectedDepartements(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedDepartements.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  const getPourcentagePlein = (employes) => {
    const capacite = 20;
    return Math.round((employes / capacite) * 100);
  };

  // Statistiques des départements
  const stats = {
    total: departements.length,
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header avec boutons d'action */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-cyan-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/30">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Gestion des Volets
                </h1>
                <p className="text-sm text-muted-foreground mt-2">Consultez et gérez les volets de l'entreprise</p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} département{stats.total > 1 ? 's' : ''} au total
              </div>
              <div className="flex items-center gap-2">
                {/* Bouton Import CSV - Visible pour ceux qui peuvent créer */}
                {(permissions.canCreate('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
                  <>
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCsvDepartementsImport}
                      className="hidden"
                    />
                    <DropdownMenu open={importMenuOpen} onOpenChange={setImportMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Importer
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => csvInputRef.current?.click()}>
                          <FileUp className="mr-2 h-4 w-4" />
                          <span>Importer un fichier CSV</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadCSVTemplate}>
                          <Upload className="mr-2 h-4 w-4" />
                          <span>Télécharger le modèle CSV</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}

                {/* Bouton Nouveau Département - Visible pour tous ceux qui peuvent créer */}
                {(permissions.canCreate('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
                  <button
                    onClick={openCreate}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Nouveau Volet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total des volets</p>
                  <p className="text-3xl font-bold">{departements.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">Total Employés</p>
                  <p className="text-3xl font-bold">{departements.reduce((sum, d) => sum + (d.employes?.length || 0), 0)}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Responsables</p>
                  <p className="text-3xl font-bold">{departements.filter(d => d.responsable).length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de sélection */}
        {selectedDepartements.size > 0 && (permissions.canDelete('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
          <div className="rounded-xl bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedDepartements.size}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedDepartements.size} département{selectedDepartements.size > 1 ? 's' : ''} sélectionné{selectedDepartements.size > 1 ? 's' : ''}
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

        {/* Liste des départements */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Volets
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {departements.length} volet{departements.length > 1 ? 's' : ''} trouvé{departements.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Chargement des départements...</p>
              </div>
            ) : departements.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Aucun département trouvé</h3>
                  <p className="text-muted-foreground">Commencez par créer un nouveau département</p>
                </div>
                {(permissions.canCreate('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
                  <Button 
                    onClick={openCreate} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un département
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                  <Checkbox
                    id="select-all"
                    checked={selectedDepartements.size === departements.length && departements.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-2"
                  />
                  <label htmlFor="select-all" className="text-sm font-semibold text-foreground cursor-pointer">
                    Tout sélectionner ({departements.length} département{departements.length > 1 ? 's' : ''})
                  </label>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {departements.map((d) => {
                    const pourcentage = getPourcentagePlein(d.employes?.length || 0);
                    return (
                      <Card 
                        key={d.id} 
                        className={`group hover:shadow-xl transition-all duration-200 border-2 ${
                          selectedDepartements.has(d.id) 
                            ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' 
                            : 'border-transparent hover:border-border'
                        }`}
                      >
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={selectedDepartements.has(d.id)}
                                onCheckedChange={() => handleSelectDepartement(d.id)}
                                className="border-2 mt-1"
                              />
                              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6 text-primary-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-foreground truncate">
                                  {d.nom_departement}
                                </h3>
                                <p className="text-sm text-muted-foreground">Département</p>
                              </div>
                            </div>
                            <Badge className={`${pourcentage >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} text-xs px-3 py-1 font-semibold border`}>
                              {pourcentage}% occupé
                            </Badge>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground">Effectif</p>
                              <p className="font-semibold text-foreground">{d.employes?.length || 0} employés</p>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                                style={{ width: `${pourcentage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {d.responsable && (
                            <div className="text-sm">
                              <p className="text-muted-foreground">Responsable</p>
                              <p className="font-medium text-foreground">{d.responsable}</p>
                            </div>
                          )}
                          
                          <Separator />
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openDetails(d)}
                              className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                            {(permissions.canUpdate('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEdit(d)}
                                className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                            )}
                            {(permissions.canDelete('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => requestDelete(d.id)}
                                className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Supprimer
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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
                {editingId ? 'Modifier le Département' : 'Nouveau Département'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 mt-2">
                {editingId ? 'Modifiez les informations du département ci-dessous' : 'Créez un nouveau département'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-card">
            <div className="space-y-2">
              <Label htmlFor="nom_departement" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Nom du département <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="nom_departement"
                value={form.nom_departement} 
                onChange={(e) => setForm({ ...form, nom_departement: e.target.value })} 
                placeholder="Ex: Ressources Humaines"
                className="h-12 border-2 focus:border-primary transition-colors"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Responsable
              </Label>
              <Input 
                id="responsable"
                value={form.responsable} 
                onChange={(e) => setForm({ ...form, responsable: e.target.value })} 
                placeholder="Nom du responsable"
                className="h-12 border-2 focus:border-primary transition-colors"
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
                    Créer le département
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border shadow-2xl">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-6 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                Détails du Département
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 mt-2">
                Informations complètes du département
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedDepartement && (
            <div className="p-6 space-y-6 bg-card max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <Building2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedDepartement.nom_departement}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Département</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDepartement.responsable && (
                    <div className="space-y-1 p-4 rounded-lg bg-muted/30 border">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                        <Users className="w-3 h-3" />
                        Responsable
                      </div>
                      <p className="text-foreground font-medium">{selectedDepartement.responsable}</p>
                    </div>
                  )}
                  
                  <div className="space-y-1 p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                      <Users className="w-3 h-3" />
                      Effectif
                    </div>
                    <p className="text-foreground font-medium">{selectedDepartement.employes?.length || 0} employés</p>
                  </div>
                </div>
              </div>

              <Separator />

              {selectedDepartement.employes && selectedDepartement.employes.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Employés du département
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedDepartement.employes.map((emp) => (
                      <div key={emp.id} className="p-3 rounded-lg bg-muted/30 border flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {emp.prenom?.[0]}{emp.nom?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{emp.nom} {emp.prenom}</p>
                          <p className="text-xs text-muted-foreground">{emp.poste?.intitule || 'Poste non assigné'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                  className="flex-1 h-12 border-2"
                >
                  Fermer
                </Button>
                {(permissions.canUpdate('Departements') || permissions.isAdmin || permissions.isSuperAdmin) && (
                  <Button 
                    onClick={() => {
                      setIsDetailsOpen(false);
                      openEdit(selectedDepartement);
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
            {selectedDepartements.size > 0
              ? `Êtes-vous sûr de vouloir supprimer ${selectedDepartements.size} département${selectedDepartements.size > 1 ? 's' : ''} ? Cette action ne peut pas être annulée.`
              : "Êtes-vous sûr de vouloir supprimer ce département ? Cette action ne peut pas être annulée."}
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