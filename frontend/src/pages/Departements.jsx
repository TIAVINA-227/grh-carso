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
  const [form, setForm] = useState({ 
    nom_departement: "", 
    responsable: ""
  });
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
    setForm({ 
      nom_departement: "", 
      responsable: ""
    });
    setIsDialogOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({ 
      nom_departement: d.nom_departement || "", 
      responsable: d.responsable || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateDepartement(editingId, form);
      } else {
        await createDepartement(form);
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
      await deleteDepartement(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le département");
    }
  };

  // Données simulées pour les statistiques (en attendant l'intégration avec les employés)
  const getDepartementStats = (departement) => {
    // Simulation des données basées sur le nom du département
    const stats = {
      Direction: { employes: 8, capacite: 10, performance: 92, budget: 520 },
      Développement: { employes: 25, capacite: 30, performance: 88, budget: 1125 },
      Marketing: { employes: 15, capacite: 20, performance: 85, budget: 780 },
      Ventes: { employes: 20, capacite: 25, performance: 90, budget: 650 },
      Support: { employes: 12, capacite: 15, performance: 87, budget: 450 },
      RH: { employes: 8, capacite: 10, performance: 89, budget: 320 }
    };
    
    return stats[departement.nom_departement] || { employes: 5, capacite: 10, performance: 80, budget: 200 };
  };

  const getDepartementDescription = (nom) => {
    const descriptions = {
      Direction: "Direction générale",
      Développement: "Équipe de développement",
      Marketing: "Marketing et communication",
      Ventes: "Équipe commerciale",
      Support: "Support client",
      RH: "Ressources humaines"
    };
    return descriptions[nom] || "Département général";
  };

  const getPourcentagePlein = (employes, capacite) => {
    return Math.round((employes / capacite) * 100);
  };

  const getBadgeColor = (pourcentage) => {
    if (pourcentage >= 80) return "bg-black text-white";
    return "bg-gray-100 text-gray-800";
  };

  const formatBudget = (budget) => {
    if (budget >= 1000) {
      return `${(budget / 1000).toFixed(0)}K €`;
    }
    return `${budget}K €`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Départements</h1>
            <p className="text-sm text-gray-600 mt-1">Vue d'ensemble des départements de l'entreprise</p>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2" 
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Nouveau Département
          </Button>
        </div>

        {/* Grille des départements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-500">Chargement des départements...</div>
            </div>
          )}

          {!loading && departements.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun département trouvé</h3>
              <p className="text-gray-500 mb-4">Commencez par créer un nouveau département</p>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Créer un département
              </Button>
            </div>
          )}

          {!loading && departements.length > 0 && departements.map((departement) => {
            const stats = getDepartementStats(departement);
            const pourcentage = getPourcentagePlein(stats.employes, stats.capacite);
            
            return (
              <Card key={departement.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0">
                <CardContent className="p-6">
                  {/* Header de la carte */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{departement.nom_departement}</h3>
                        <p className="text-sm text-gray-500">{getDepartementDescription(departement.nom_departement)}</p>
                      </div>
                    </div>
                    <Badge className={`${getBadgeColor(pourcentage)} text-xs px-2 py-1`}>
                      {pourcentage}% plein
                    </Badge>
                  </div>

                  {/* Barre de progression Effectif */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Effectif</span>
                      <span className="text-sm text-gray-600">{stats.employes}/{stats.capacite}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${pourcentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Statistiques clés */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Employés</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.employes}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Performance</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.performance}%</p>
                    </div>
                  </div>

                  {/* Budget annuel */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Budget annuel</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formatBudget(stats.budget)}</p>
                  </div>

                  {/* Responsable */}
                  {departement.responsable && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-600">Responsable: </span>
                      <span className="text-sm font-medium text-gray-900">{departement.responsable}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEdit(departement)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(departement.id)}
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

      {/* Dialog pour créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Modifier le Département' : 'Nouveau Département'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingId ? 'Modifiez les informations du département' : 'Créez un nouveau département'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="nom_departement" className="text-sm font-medium text-gray-700">
                Nom du département *
              </Label>
              <Input 
                id="nom_departement"
                value={form.nom_departement} 
                onChange={(e) => setForm({ ...form, nom_departement: e.target.value })} 
                placeholder="Ex: Développement"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsable" className="text-sm font-medium text-gray-700">
                Responsable
              </Label>
              <Input 
                id="responsable"
                value={form.responsable} 
                onChange={(e) => setForm({ ...form, responsable: e.target.value })} 
                placeholder="Ex: Jean Dupont"
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
                {editingId ? 'Enregistrer' : 'Créer le département'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
