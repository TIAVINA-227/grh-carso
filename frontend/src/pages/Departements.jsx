import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast"; // ✅ pour les notifications (success / erreur)
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
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter
 } from "../components/ui/alert-dialog"; // ✅ Composants pour le modal de confirmation
import { Checkbox } from "../components/ui/checkbox";

export default function Departements() {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [form, setForm] = useState({ nom_departement: "", responsable: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast(); // ✅ gestion des toasts
  const [selectedDepartements, setSelectedDepartements] = useState(new Set());

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

  useEffect(() => { load(); }, []);

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
      toast({ title: "Erreur lors de l’enregistrement", variant: "destructive" });
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

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Gestion des Départements</h1>
          <Button className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Nouveau Département
          </Button>
        </div>

        {selectedDepartements.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-md bg-primary/5 dark:bg-blue-900/20 p-3 border border-primary/20 dark:border-blue-800">
            <div className="text-sm font-medium text-primary dark:text-blue-300">
              {selectedDepartements.size} département(s) sélectionné(s).
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && departements.length > 0 && (
            <div className="col-span-full flex items-center p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
              <Checkbox
                id="select-all"
                checked={selectedDepartements.size === departements.length && departements.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
              <label htmlFor="select-all" className="ml-3 text-sm font-medium text-foreground dark:text-white cursor-pointer">
                Tout sélectionner
              </label>
            </div>
          )}
          {loading && (
            <div className="col-span-full py-12 text-center text-muted-foreground dark:text-gray-400">
              Chargement des départements...
            </div>
          )}

          {!loading && departements.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">
                Aucun département trouvé
              </h3>
              <Button onClick={openCreate} className="bg-black dark:bg-white text-white dark:text-black">
                <Plus className="w-4 h-4 mr-2" /> Créer un département
              </Button>
            </div>
          )}

          {!loading &&
            departements.map((d) => {
              const pourcentage = getPourcentagePlein(d.employes?.length || 0);
              return (
                <Card
                  key={d.id}
                  className={`bg-card dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border-border ${selectedDepartements.has(d.id) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedDepartements.has(d.id)}
                          onCheckedChange={() => handleSelectDepartement(d.id)}
                          aria-label="Select departement"
                          className="mt-1"
                        />
                        <div className="p-2 bg-muted dark:bg-slate-800 rounded-lg">
                          <Building2 className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground dark:text-white text-lg">
                            {d.nom_departement}
                          </h3>
                        </div>
                      </div>
                      <Badge
                        className={`px-2 py-1 text-xs ${
                          pourcentage >= 80
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-muted dark:bg-slate-800 text-foreground dark:text-gray-300"
                        }`}
                      >
                        {pourcentage}% plein
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground dark:text-white">
                          Effectif
                        </span>
                        <span className="text-sm text-muted-foreground dark:text-gray-400">
                          {d.employes?.length || 0}
                        </span>
                      </div>
                      <div className="w-full bg-muted dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pourcentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {d.responsable && (
                      <div className="mb-4">
                        <span className="text-sm text-muted-foreground dark:text-gray-400">Responsable: </span>
                        <span className="text-sm font-medium text-foreground dark:text-white">
                          {d.responsable}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-muted dark:bg-slate-800 hover:bg-muted/80 dark:hover:bg-slate-700 text-foreground dark:text-white border-border"
                        onClick={() => openDetails(d)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(d)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => requestDelete(d.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* ✅ Modal Ajout / Modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-white">
              {editingId ? "Modifier le Département" : "Nouveau Département"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-foreground dark:text-white">Nom du département</Label>
              <Input
                value={form.nom_departement}
                onChange={(e) =>
                  setForm({ ...form, nom_departement: e.target.value })
                }
                className="bg-background dark:bg-slate-900 text-foreground dark:text-white border-border"
                required
              />
            </div>
            <div>
              <Label className="text-foreground dark:text-white">Responsable</Label>
              <Input
                value={form.responsable}
                onChange={(e) =>
                  setForm({ ...form, responsable: e.target.value })
                }
                className="bg-background dark:bg-slate-900 text-foreground dark:text-white border-border"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
                {editingId ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✅ Modal Détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-white">Détails du département</DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-gray-400">
                {editingId
                  ? "Modifiez les informations du département existant."
                  : "Remplissez le formulaire pour créer un nouveau département."}
              </DialogDescription>
          </DialogHeader>
          {selectedDepartement && (
            <div className="space-y-3">
              <p className="text-foreground dark:text-white"><strong>Nom :</strong> {selectedDepartement.nom_departement}</p>
              <p className="text-foreground dark:text-white"><strong>Responsable :</strong> {selectedDepartement.responsable}</p>
              <p className="text-foreground dark:text-white"><strong>Employés :</strong></p>
              {selectedDepartement.employes?.length > 0 ? (
                <ul className="list-disc pl-6 text-foreground dark:text-white">
                  {selectedDepartement.employes.map((emp) => (
                    <li key={emp.id}>{emp.nom} {emp.prenom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground dark:text-gray-400 text-sm">Aucun employé dans ce département.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Modal de confirmation suppression */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground dark:text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
              {selectedDepartements.size > 0
                ? `Êtes-vous sûr de vouloir supprimer ${selectedDepartements.size} département(s) ? Cette action est irréversible.`
                : "Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Annuler</Button>
            <Button className="bg-red-600 text-white" onClick={confirmDelete}>Supprimer</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
