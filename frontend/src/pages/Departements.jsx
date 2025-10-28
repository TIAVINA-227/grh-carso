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
      await deleteDepartement(deleteId);
      toast({ title: "Suppression effectuée avec succès", variant: "success" });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const getPourcentagePlein = (employes) => {
    const capacite = 20;
    return Math.round((employes / capacite) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Départements</h1>
          <Button className="bg-blue-700 hover:bg-blue-900 flex items-center gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Nouveau Département
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full py-12 text-center text-gray-500">
              Chargement des départements...
            </div>
          )}

          {!loading && departements.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun département trouvé
              </h3>
              <Button onClick={openCreate} className="bg-black text-white">
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
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {d.nom_departement}
                          </h3>
                        </div>
                      </div>
                      <Badge
                        className={`px-2 py-1 text-xs ${
                          pourcentage >= 80
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pourcentage}% plein
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Effectif
                        </span>
                        <span className="text-sm text-gray-600">
                          {d.employes?.length || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-black h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pourcentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {d.responsable && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Responsable: </span>
                        <span className="text-sm font-medium text-gray-900">
                          {d.responsable}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Modifier le Département" : "Nouveau Département"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Nom du département</Label>
              <Input
                value={form.nom_departement}
                onChange={(e) =>
                  setForm({ ...form, nom_departement: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Responsable</Label>
              <Input
                value={form.responsable}
                onChange={(e) =>
                  setForm({ ...form, responsable: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-black text-white">
                {editingId ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✅ Modal Détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du département</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Modifiez les informations du département existant."
                  : "Remplissez le formulaire pour créer un nouveau département."}
              </DialogDescription>
          </DialogHeader>
          {selectedDepartement && (
            <div className="space-y-3">
              <p><strong>Nom :</strong> {selectedDepartement.nom_departement}</p>
              <p><strong>Responsable :</strong> {selectedDepartement.responsable}</p>
              <p><strong>Employés :</strong></p>
              {selectedDepartement.employes?.length > 0 ? (
                <ul className="list-disc pl-6">
                  {selectedDepartement.employes.map((emp) => (
                    <li key={emp.id}>{emp.nom} {emp.prenom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Aucun employé dans ce département.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Modal de confirmation suppression */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce département ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-red-600 text-white" onClick={confirmDelete}>
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
