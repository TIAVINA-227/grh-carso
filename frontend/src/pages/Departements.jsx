import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getDepartements, createDepartement, updateDepartement, deleteDepartement } from "../services/departementService";
import { Building2, Users, TrendingUp, DollarSign, Plus, Edit, Trash2, Eye } from "lucide-react";

export default function Departements() {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ nom_departement: "", responsable: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

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

  const openCreate = () => {
    setEditingId(null);
    setForm({ nom_departement: "", responsable: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({ nom_departement: d.nom_departement || "", responsable: d.responsable || "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        await updateDepartement(editingId, form);
      } else {
        await createDepartement(form);
      }
      setIsDialogOpen(false);
      setForm({ nom_departement: "", responsable: "" });
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await deleteDepartement(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le département");
    }
  };

  const getPourcentagePlein = (employes) => {
    const capacite = 20; // valeur par défaut ou récupérée dynamiquement
    return Math.round((employes / capacite) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Départements</h1>
          </div>
          <Button className="bg-black text-white flex items-center gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Nouveau Département
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <div className="col-span-full py-12 text-center text-gray-500">Chargement des départements...</div>}

          {!loading && departements.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun département trouvé</h3>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" /> Créer un département
              </Button>
            </div>
          )}

          {!loading && departements.map((d) => {
            const pourcentage = getPourcentagePlein(d.employes.length);
            return (
              <Card key={d.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg"><Building2 className="w-5 h-5 text-gray-600" /></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{d.nom_departement}</h3>
                      </div>
                    </div>
                    <Badge className={`px-2 py-1 text-xs ${pourcentage >= 80 ? "bg-black text-white" : "bg-gray-100 text-gray-800"}`}>
                      {pourcentage}% plein
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Effectif</span>
                      <span className="text-sm text-gray-600">{d.employes.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-black h-2 rounded-full transition-all duration-300" style={{ width: `${pourcentage}%` }}></div>
                    </div>
                  </div>

                  {d.responsable && <div className="mb-4"><span className="text-sm text-gray-600">Responsable: </span><span className="text-sm font-medium text-gray-900">{d.responsable}</span></div>}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"><Eye className="w-4 h-4 mr-1" /> Détails</Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(d)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editingId ? 'Modifier le Département' : 'Nouveau Département'}</DialogTitle>
            <DialogDescription className="text-gray-600">{editingId ? 'Modifiez les informations du département' : 'Créez un nouveau département'}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><div className="text-sm text-red-600">{error}</div></div>}

            <div className="space-y-2">
              <Label htmlFor="nom_departement" className="text-sm font-medium text-gray-700">Nom du département *</Label>
              <Input id="nom_departement" value={form.nom_departement} onChange={(e) => setForm({ ...form, nom_departement: e.target.value })} placeholder="Ex: Développement" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable" className="text-sm font-medium text-gray-700">Responsable</Label>
              <Input id="responsable" value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} placeholder="Ex: Jean Dupont" />
            </div>

            <DialogFooter className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Annuler</Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">{editingId ? 'Enregistrer' : 'Créer le département'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
