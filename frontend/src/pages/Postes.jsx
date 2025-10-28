import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getPostes, createPoste, updatePoste, deletePoste } from "../services/posteService";
import { Plus, Briefcase, Edit, Trash2, Eye } from "lucide-react";

export default function Postes() {
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ intitule: "", description: "", niveau: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      await deletePoste(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le poste");
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Postes</h1>
            <p className="text-sm text-gray-600 mt-1">Consultez et gérez les postes de l'entreprise</p>
          </div>
          <Button 
            className="bg-blue-700 hover:bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors" 
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Nouveau Poste
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Chargement des postes...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && postes.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun poste trouvé</h3>
            <p className="text-gray-500 mb-4">Commencez par créer votre premier poste</p>
            <Button onClick={openCreate} className="bg-black text-white">
              <Plus className="w-4 h-4 mr-2" />
              Créer un poste
            </Button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && postes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postes.map((poste) => (
              <Card key={poste.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{poste.intitule}</h3>
                        <p className="text-sm text-gray-500">{getDepartement(poste.intitule)}</p>
                      </div>
                    </div>
                    {poste.niveau && (
                      <Badge className={`${getBadgeColor(poste.niveau)} text-xs px-2 py-1`}>
                        {poste.niveau}
                      </Badge>
                    )}
                  </div>
                  
                  {poste.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {poste.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      onClick={() => openEdit(poste)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      onClick={() => handleDelete(poste.id)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Modifier le Poste' : 'Nouveau Poste'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingId ? 'Modifiez les informations du poste' : 'Créez un nouveau poste dans l\'entreprise'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="intitule" className="text-sm font-medium text-gray-700">
                Intitulé du poste *
              </Label>
              <Input 
                id="intitule"
                value={form.intitule} 
                onChange={(e) => setForm({ ...form, intitule: e.target.value })} 
                placeholder="Ex: Développeur Full Stack"
                className="w-full"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="niveau" className="text-sm font-medium text-gray-700">
                Niveau
              </Label>
              <select
                id="niveau"
                value={form.niveau}
                onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Junior">Junior</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Senior">Senior</option>
                <option value="Direction">Direction</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez les responsabilités et compétences requises..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
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
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {editingId ? 'Enregistrer' : 'Créer le poste'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
