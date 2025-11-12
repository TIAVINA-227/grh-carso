import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getPostes, createPoste, updatePoste, deletePoste } from "../services/posteService";
import { Plus, Briefcase, Edit, Trash2, Eye, Upload } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";

export default function Postes() {
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ intitule: "", description: "", niveau: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedPostes, setSelectedPostes] = useState(new Set());
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPostes();
      setPostes(data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les postes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ intitule: "", description: "", niveau: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ intitule: p.intitule || "", description: p.description || "", niveau: p.niveau || "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updatePoste(editingId, form);
      } else {
        await createPoste(form);
      }
      setIsDialogOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur");
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
        await deletePoste(deleteId);
        toast.success("Poste supprimé avec succès");
      } else if (selectedPostes.size > 0) {
        await Promise.all(Array.from(selectedPostes).map(id => deletePoste(id)));
        toast.success(`${selectedPostes.size} poste(s) supprimé(s)`);
        setSelectedPostes(new Set());
      }
      await load();
    } catch {
      toast.error("Erreur lors de la suppression du poste.");
    }
    setDeleteId(null);
  };

  const handleSelectPoste = (id) => {
    setSelectedPostes(prev => {
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
      setSelectedPostes(new Set(postes.map(item => item.id)));
    } else {
      setSelectedPostes(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedPostes.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  // Fonction pour obtenir la couleur du badge selon le niveau
  const getBadgeColor = (niveau) => {
    const niveauLower = niveau?.toLowerCase() || '';
    if (niveauLower.includes('junior')) return 'bg-teal-500 text-white';
    if (niveauLower.includes('intermediaire')) return 'bg-orange-500 text-white';
    if (niveauLower.includes('senior')) return 'bg-yellow-500 text-black';
    if (niveauLower.includes('direction')) return 'bg-black text-white';
    return 'bg-gray-500 text-white';
  };

  // Fonction pour obtenir le département basé sur l'intitulé
  const getDepartement = (intitule) => {
    const intituleLower = intitule?.toLowerCase() || '';
    if (intituleLower.includes('développeur') || intituleLower.includes('developer')) return 'Développement';
    if (intituleLower.includes('marketing')) return 'Marketing';
    if (intituleLower.includes('commercial') || intituleLower.includes('vente')) return 'Ventes';
    if (intituleLower.includes('rh') || intituleLower.includes('directeur')) return 'Direction';
    if (intituleLower.includes('projet')) return 'Marketing';
    return 'Général';
  };

  // Fonction pour importer un fichier CSV
  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result;
        if (typeof csv !== 'string') {
          toast.error('Erreur de lecture du fichier');
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
            if (row.intitule) {
              await createPoste({
                intitule: row.intitule,
                description: row.description || '',
                niveau: row.niveau || ''
              });
              importedCount++;
            }
          } catch {
            errorCount++;
          }
        }

        toast.success(`${importedCount} poste(s) importé(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
        await load();
      } catch (error) {
        toast.error('Erreur lors de l\'import du fichier');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground dark:text-white">Gestion des Postes</h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">Consultez et gérez les postes de l'entreprise</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="gap-2 h-11 px-4 rounded-lg border-border bg-background hover:bg-muted dark:hover:bg-slate-800" 
              onClick={openImportDialog}
            >
              <Upload className="w-4 h-4" />
              Importer CSV
            </Button>
            <Button 
              className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors" 
              onClick={openCreate}
            >
              <Plus className="w-4 h-4" />
              Nouveau Poste
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileImport}
          className="hidden"
        />

        {selectedPostes.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-md bg-primary/5 dark:bg-blue-900/20 p-3 border border-primary/20 dark:border-blue-800">
            <div className="text-sm font-medium text-primary dark:text-blue-300">
              {selectedPostes.size} poste(s) sélectionné(s).
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={requestDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer la sélection
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground dark:text-gray-400">Chargement des postes...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && postes.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">Aucun poste trouvé</h3>
            <p className="text-muted-foreground dark:text-gray-400 mb-4">Commencez par créer votre premier poste</p>
            <Button onClick={openCreate} className="bg-black dark:bg-white text-white dark:text-black">
              <Plus className="w-4 h-4 mr-2" />
              Créer un poste
            </Button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && postes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full flex items-center p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
              <Checkbox
                id="select-all"
                checked={selectedPostes.size === postes.length && postes.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
              <label htmlFor="select-all" className="ml-3 text-sm font-medium text-foreground dark:text-white cursor-pointer">
                Tout sélectionner
              </label>
            </div>
            {postes.map((poste) => (
              <Card key={poste.id} className={`bg-card dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border-border ${selectedPostes.has(poste.id) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedPostes.has(poste.id)}
                        onCheckedChange={() => handleSelectPoste(poste.id)}
                        aria-label="Select poste"
                        className="mt-1"
                      />
                      <div className="p-2 bg-muted dark:bg-slate-800 rounded-lg">
                        <Briefcase className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground dark:text-white text-lg">{poste.intitule}</h3>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">{getDepartement(poste.intitule)}</p>
                      </div>
                    </div>
                    {poste.niveau && (
                      <Badge className={`${getBadgeColor(poste.niveau)} text-xs px-2 py-1`}>
                        {poste.niveau}
                      </Badge>
                    )}
                  </div>
                  
                  {poste.description && (
                    <p className="text-foreground/70 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {poste.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-muted dark:bg-slate-800 hover:bg-muted/80 dark:hover:bg-slate-700 text-foreground dark:text-white border-border"
                      onClick={() => openEdit(poste)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-muted dark:bg-slate-800 hover:bg-muted/80 dark:hover:bg-slate-700 text-foreground dark:text-white border-border"
                      onClick={() => requestDelete(poste.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground dark:text-white">
              {editingId ? 'Modifier le Poste' : 'Nouveau Poste'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-gray-400">
              {editingId ? 'Modifiez les informations du poste' : 'Créez un nouveau poste dans l\'entreprise'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800 rounded-lg p-3">
                <div className="text-sm text-destructive dark:text-red-400">{error}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="intitule" className="text-sm font-medium text-foreground dark:text-white">
                Intitulé du poste *
              </Label>
              <Input 
                id="intitule"
                value={form.intitule} 
                onChange={(e) => setForm({ ...form, intitule: e.target.value })} 
                placeholder="Ex: Développeur Full Stack"
                className="w-full bg-background dark:bg-slate-900 text-foreground dark:text-white border-border"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="niveau" className="text-sm font-medium text-foreground dark:text-white">
                Niveau
              </Label>
              <select
                id="niveau"
                value={form.niveau}
                onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white"
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Junior">Junior</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Senior">Senior</option>
                <option value="Direction">Direction</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground dark:text-white">
                Description
              </Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez les responsabilités et compétences requises..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white resize-none"
              />
            </div>
            
            <DialogFooter className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black"
              >
                {editingId ? 'Enregistrer' : 'Créer le poste'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground dark:text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
              {selectedPostes.size > 0
                ? `Êtes-vous sûr de vouloir supprimer ${selectedPostes.size} poste(s) ? Cette action est irréversible.`
                : "Êtes-vous sûr de vouloir supprimer ce poste ? Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:text-white">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive dark:bg-red-600 hover:bg-destructive/90 dark:hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
