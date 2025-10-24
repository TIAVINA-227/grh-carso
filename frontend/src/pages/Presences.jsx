import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getPresences, createPresence, updatePresence, deletePresence } from "../services/presenceService";
import { getEmployes } from "../services/employeService";
import { CalendarDays, Clock, User, Plus, Download, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Presences() {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employes, setEmployes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ 
    employeId: "", 
    date_jour: new Date().toISOString().split('T')[0], 
    statut: "PRESENT", 
    heures_travaillees: 8,
    justification: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPresences();
      setPresences(data || []);
      const empData = await getEmployes();
      setEmployes(empData || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les présences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ 
      employeId: "", 
      date_jour: selectedDate, 
      statut: "PRESENT", 
      heures_travaillees: 8,
      justification: "" 
    });
    setIsDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ 
      employeId: p.employeId || "", 
      date_jour: p.date_jour ? new Date(p.date_jour).toISOString().split('T')[0] : selectedDate, 
      statut: p.statut || "PRESENT", 
      heures_travaillees: p.heures_travaillees || 8,
      justification: p.justification || "" 
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updatePresence(editingId, form);
      } else {
        await createPresence(form);
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
      await deletePresence(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer la présence");
    }
  };

  // Calculer les statistiques
  const stats = {
    presents: presences.filter(p => p.statut === "PRESENT").length,
    absents: presences.filter(p => p.statut === "ABSENT").length,
    retards: presences.filter(p => p.statut === "RETARD").length,
    taux: presences.length > 0 ? Math.round((presences.filter(p => p.statut === "PRESENT").length / presences.length) * 100) : 0,
  };

  const colorStatut = (statut) => {
    switch (statut) {
      case "PRESENT": return "bg-yellow-400 text-black";
      case "RETARD": return "bg-teal-500 text-white";
      case "ABSENT": return "bg-red-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "PRESENT": return <CheckCircle className="w-4 h-4" />;
      case "RETARD": return <AlertCircle className="w-4 h-4" />;
      case "ABSENT": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Présences</h1>
            <p className="text-sm text-gray-600 mt-1">Suivez les présences quotidiennes des employés</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            >
              <CalendarDays className="w-4 h-4" />
              {formatDate(selectedDate)}
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button 
              className="bg-black hover:bg-gray-800 text-white flex items-center gap-2" 
              onClick={openCreate}
            >
              <Plus className="w-4 h-4" />
              Nouvelle Présence
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Présents</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.presents}</p>
                  <p className="text-xs text-gray-500">Employés présents</p>
                </div>
                <CheckCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absents</p>
                  <p className="text-3xl font-bold text-red-500">{stats.absents}</p>
                  <p className="text-xs text-gray-500">Employés absents</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Retards</p>
                  <p className="text-3xl font-bold text-teal-500">{stats.retards}</p>
                  <p className="text-xs text-gray-500">Arrivées tardives</p>
                </div>
                <AlertCircle className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Présence</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.taux}%</p>
                  <p className="text-xs text-gray-500">Aujourd'hui</p>
                </div>
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste détaillée */}
        <div className="bg-white rounded-lg shadow-sm border-0 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Présences du {formatDate(selectedDate)}</h2>
            <p className="text-sm text-gray-600">Liste détaillée des présences</p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Chargement des présences...</div>
            </div>
          )}

          {!loading && presences.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune présence trouvée</h3>
              <p className="text-gray-500 mb-4">Commencez par enregistrer une présence</p>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Enregistrer une présence
              </Button>
            </div>
          )}

          {!loading && presences.length > 0 && (
            <div className="space-y-4">
              {presences.map((presence) => (
                <Card key={presence.id} className="bg-gray-50 rounded-lg border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-200 rounded-full">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                        {(() => {
                          const emp = employes.find(e => e.id === presence.employeId);
                          return emp ? `${emp.nom} ${emp.prenom}` : `Employé #${presence.employeId}`;
                        })()}
                      </h3>
                          {presence.heures_travaillees && (
                            <p className="text-sm text-gray-600">
                              Heures travaillées: {presence.heures_travaillees}h
                            </p>
                          )}
                          {presence.justification && (
                            <p className="text-sm text-gray-500 italic">
                              "{presence.justification}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${colorStatut(presence.statut)} flex items-center gap-1`}>
                          {getStatutIcon(presence.statut)}
                          {presence.statut.toLowerCase()}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEdit(presence)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(presence.id)}
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
              {editingId ? 'Modifier la Présence' : 'Nouvelle Présence'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingId ? 'Modifiez les informations de présence' : 'Enregistrez une nouvelle présence'}
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
             <select
                id="employeId"
                value={form.employeId}
                onChange={(e) => setForm({ ...form, employeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="">-- Sélectionner un employé --</option>
                {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_jour" className="text-sm font-medium text-gray-700">
                Date *
              </Label>
              <Input 
                id="date_jour"
                type="date"
                value={form.date_jour} 
                onChange={(e) => setForm({ ...form, date_jour: e.target.value })} 
                required 
              />
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
                <option value="PRESENT">Présent</option>
                <option value="ABSENT">Absent</option>
                <option value="RETARD">Retard</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heures_travaillees" className="text-sm font-medium text-gray-700">
                Heures travaillées
              </Label>
              <Input 
                id="heures_travaillees"
                type="number"
                step="0.25"
                value={form.heures_travaillees} 
                onChange={(e) => setForm({ ...form, heures_travaillees: parseFloat(e.target.value) })} 
                placeholder="8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="justification" className="text-sm font-medium text-gray-700">
                Justification
              </Label>
              <textarea
                id="justification"
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
                placeholder="Justification si nécessaire..."
                rows={3}
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
                {editingId ? 'Enregistrer' : 'Créer la présence'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
