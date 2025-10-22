import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getConges, createConge, updateConge, deleteConge } from "../services/congeService";
import { CalendarDays, User, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Umbrella, Filter } from "lucide-react";

export default function Conges() {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ 
    employeId: "", 
    type_conge: "Congés payés", 
    date_debut: new Date().toISOString().split('T')[0], 
    date_fin: new Date().toISOString().split('T')[0], 
    statut: "SOUMIS"
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous les statuts");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getConges();
      setConges(data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les congés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ 
      employeId: "", 
      type_conge: "Congés payés", 
      date_debut: new Date().toISOString().split('T')[0], 
      date_fin: new Date().toISOString().split('T')[0], 
      statut: "SOUMIS"
    });
    setIsDialogOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ 
      employeId: c.employeId || "", 
      type_conge: c.type_conge || "Congés payés", 
      date_debut: c.date_debut ? new Date(c.date_debut).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      date_fin: c.date_fin ? new Date(c.date_fin).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      statut: c.statut || "SOUMIS"
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateConge(editingId, form);
      } else {
        await createConge(form);
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
      await deleteConge(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le congé");
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateConge(id, { statut: "APPROUVE" });
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible d'approuver le congé");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateConge(id, { statut: "REJETE" });
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de refuser le congé");
    }
  };

  // Calculer les statistiques
  const stats = {
    total: conges.length,
    attente: conges.filter(c => c.statut === "SOUMIS").length,
    approuves: conges.filter(c => c.statut === "APPROUVE").length,
    joursTotaux: conges.reduce((total, c) => {
      if (c.date_debut && c.date_fin) {
        const debut = new Date(c.date_debut);
        const fin = new Date(c.date_fin);
        const diffTime = Math.abs(fin - debut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return total + diffDays;
      }
      return total;
    }, 0),
  };

  const colorStatut = (statut) => {
    switch (statut) {
      case "APPROUVE": return "bg-yellow-400 text-black";
      case "SOUMIS": return "bg-teal-500 text-white";
      case "REJETE": return "bg-red-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "APPROUVE": return <CheckCircle className="w-4 h-4" />;
      case "SOUMIS": return <Clock className="w-4 h-4" />;
      case "REJETE": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Congés payés": return "bg-orange-100 text-orange-800";
      case "RTT": return "bg-blue-100 text-blue-800";
      case "Congé maladie": return "bg-red-100 text-red-800";
      case "Congé maternité": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateDays = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filtrer les congés selon le statut
  const filteredConges = filterStatus === "Tous les statuts" 
    ? conges 
    : conges.filter(c => c.statut === filterStatus.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
            <p className="text-sm text-gray-600 mt-1">Gérez les demandes de congés et suivez les soldes</p>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2" 
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Demander un Congé
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Demandes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Ce mois</p>
                </div>
                <CalendarDays className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-3xl font-bold text-teal-500">{stats.attente}</p>
                  <p className="text-xs text-gray-500">À traiter</p>
                </div>
                <Clock className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvées</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.approuves}</p>
                  <p className="text-xs text-gray-500">Validées</p>
                </div>
                <CheckCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jours Totaux</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.joursTotaux}</p>
                  <p className="text-xs text-gray-500">Demandés</p>
                </div>
                <Umbrella className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des congés */}
        <div className="bg-white rounded-lg shadow-sm border-0 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Demandes de Congés</h2>
              <p className="text-sm text-gray-600">{filteredConges.length} demande(s) trouvée(s)</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="Tous les statuts">Tous les statuts</option>
                <option value="SOUMIS">En attente</option>
                <option value="APPROUVE">Approuvées</option>
                <option value="REJETE">Refusées</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Chargement des congés...</div>
            </div>
          )}

          {!loading && filteredConges.length === 0 && (
            <div className="text-center py-12">
              <Umbrella className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun congé trouvé</h3>
              <p className="text-gray-500 mb-4">Commencez par demander un congé</p>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Demander un congé
              </Button>
            </div>
          )}

          {!loading && filteredConges.length > 0 && (
            <div className="space-y-4">
              {filteredConges.map((conge) => (
                <Card key={conge.id} className="bg-gray-50 rounded-lg border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-200 rounded-full">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Employé #{conge.employeId}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {formatDate(conge.date_debut)} - {formatDate(conge.date_fin)} 
                            ({calculateDays(conge.date_debut, conge.date_fin)} jours)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${getTypeColor(conge.type_conge)} text-xs px-2 py-1 flex items-center gap-1`}>
                          <Umbrella className="w-3 h-3" />
                          {conge.type_conge}
                        </Badge>
                        
                        <Badge className={`${colorStatut(conge.statut)} flex items-center gap-1`}>
                          {getStatutIcon(conge.statut)}
                          {conge.statut.toLowerCase()}
                        </Badge>
                        
                        <div className="flex gap-2">
                          {conge.statut === "SOUMIS" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleApprove(conge.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Approuver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReject(conge.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Refuser
                              </Button>
                            </>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEdit(conge)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(conge.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog pour créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Modifier le Congé' : 'Nouveau Congé'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingId ? 'Modifiez les informations du congé' : 'Demandez un nouveau congé'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="employeId" className="text-sm font-medium text-gray-700">
                ID Employé *
              </Label>
              <Input 
                id="employeId"
                type="number"
                value={form.employeId} 
                onChange={(e) => setForm({ ...form, employeId: e.target.value })} 
                placeholder="Ex: 1"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type_conge" className="text-sm font-medium text-gray-700">
                Type de congé *
              </Label>
              <select
                id="type_conge"
                value={form.type_conge}
                onChange={(e) => setForm({ ...form, type_conge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="Congés payés">Congés payés</option>
                <option value="RTT">RTT</option>
                <option value="Congé maladie">Congé maladie</option>
                <option value="Congé maternité">Congé maternité</option>
                <option value="Congé paternité">Congé paternité</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut" className="text-sm font-medium text-gray-700">
                  Date de début *
                </Label>
                <Input 
                  id="date_debut"
                  type="date"
                  value={form.date_debut} 
                  onChange={(e) => setForm({ ...form, date_debut: e.target.value })} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_fin" className="text-sm font-medium text-gray-700">
                  Date de fin *
                </Label>
                <Input 
                  id="date_fin"
                  type="date"
                  value={form.date_fin} 
                  onChange={(e) => setForm({ ...form, date_fin: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statut" className="text-sm font-medium text-gray-700">
                Statut *
              </Label>
              <select
                id="statut"
                value={form.statut}
                onChange={(e) => setForm({ ...form, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="SOUMIS">Soumis</option>
                <option value="APPROUVE">Approuvé</option>
                <option value="REJETE">Rejeté</option>
              </select>
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
                {editingId ? 'Enregistrer' : 'Demander le congé'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
