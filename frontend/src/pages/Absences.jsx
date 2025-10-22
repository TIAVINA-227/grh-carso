import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getAbsences, createAbsence, updateAbsence, deleteAbsence } from "../services/absenceService";
import { CalendarDays, User, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, FileText, Filter } from "lucide-react";

export default function Absences() {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ 
    employeId: "", 
    date_debut: new Date().toISOString().split('T')[0], 
    date_fin: new Date().toISOString().split('T')[0], 
    type_absence: "Maladie",
    justification: "",
    piece_jointe: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tous les statuts");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAbsences();
      setAbsences(data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les absences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ 
      employeId: "", 
      date_debut: new Date().toISOString().split('T')[0], 
      date_fin: new Date().toISOString().split('T')[0], 
      type_absence: "Maladie",
      justification: "",
      piece_jointe: ""
    });
    setIsDialogOpen(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ 
      employeId: a.employeId || "", 
      date_debut: a.date_debut ? new Date(a.date_debut).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      date_fin: a.date_fin ? new Date(a.date_fin).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      type_absence: a.type_absence || "Maladie",
      justification: a.justification || "",
      piece_jointe: a.piece_jointe || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateAbsence(editingId, form);
      } else {
        await createAbsence(form);
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
      await deleteAbsence(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'absence");
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateAbsence(id, { statut: "APPROUVE" });
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible d'approuver l'absence");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateAbsence(id, { statut: "REJETE" });
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de refuser l'absence");
    }
  };

  // Calculer les statistiques
  const stats = {
    total: absences.length,
    attente: absences.filter(a => a.statut === "SOUMIS").length,
    approuvees: absences.filter(a => a.statut === "APPROUVE").length,
    refusees: absences.filter(a => a.statut === "REJETE").length,
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

  const getTypeColor = (type) => {
    switch (type) {
      case "Maladie": return "bg-green-100 text-green-800";
      case "Personnel": return "bg-gray-100 text-gray-800";
      case "Congé": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrer les absences selon le statut
  const filteredAbsences = filterStatus === "Tous les statuts" 
    ? absences 
    : absences.filter(a => a.statut === filterStatus.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Absences</h1>
            <p className="text-sm text-gray-600 mt-1">Suivez et gérez les absences des employés</p>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2" 
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Déclarer une Absence
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Absences</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Ce mois</p>
                </div>
                <FileText className="w-8 h-8 text-gray-500" />
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
                  <p className="text-3xl font-bold text-yellow-500">{stats.approuvees}</p>
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
                  <p className="text-sm font-medium text-gray-600">Refusées</p>
                  <p className="text-3xl font-bold text-red-500">{stats.refusees}</p>
                  <p className="text-xs text-gray-500">Non validées</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des absences */}
        <div className="bg-white rounded-lg shadow-sm border-0 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Liste des Absences</h2>
              <p className="text-sm text-gray-600">{filteredAbsences.length} absence(s) trouvée(s)</p>
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
              <div className="text-gray-500">Chargement des absences...</div>
            </div>
          )}

          {!loading && filteredAbsences.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune absence trouvée</h3>
              <p className="text-gray-500 mb-4">Commencez par déclarer une absence</p>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Déclarer une absence
              </Button>
            </div>
          )}

          {!loading && filteredAbsences.length > 0 && (
            <div className="space-y-4">
              {filteredAbsences.map((absence) => (
                <Card key={absence.id} className="bg-gray-50 rounded-lg border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-200 rounded-full">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Employé #{absence.employeId}</h3>
                          <p className="text-sm text-gray-600">{absence.justification}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {formatDate(absence.date_debut)} - {formatDate(absence.date_fin)} 
                            ({calculateDays(absence.date_debut, absence.date_fin)} jours)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${getTypeColor(absence.type_absence)} text-xs px-2 py-1`}>
                          {absence.type_absence}
                        </Badge>
                        
                        {absence.piece_jointe && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                            Justificatif
                          </Badge>
                        )}
                        
                        <Badge className={`${colorStatut(absence.statut)} flex items-center gap-1`}>
                          {getStatutIcon(absence.statut)}
                          {(absence.statut || "inconnu").toLowerCase()}

                        </Badge>
                        
                        <div className="flex gap-2">
                          {absence.statut === "SOUMIS" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleApprove(absence.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Approuver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReject(absence.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Refuser
                              </Button>
                            </>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEdit(absence)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(absence.id)}
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
              {editingId ? 'Modifier l\'Absence' : 'Nouvelle Absence'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingId ? 'Modifiez les informations de l\'absence' : 'Déclarez une nouvelle absence'}
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
              <Label htmlFor="type_absence" className="text-sm font-medium text-gray-700">
                Type d'absence *
              </Label>
              <select
                id="type_absence"
                value={form.type_absence}
                onChange={(e) => setForm({ ...form, type_absence: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="Maladie">Maladie</option>
                <option value="Personnel">Personnel</option>
                <option value="Congé">Congé</option>
                <option value="Formation">Formation</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="justification" className="text-sm font-medium text-gray-700">
                Justification *
              </Label>
              <textarea
                id="justification"
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
                placeholder="Décrivez la raison de l'absence..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="piece_jointe" className="text-sm font-medium text-gray-700">
                Pièce jointe
              </Label>
              <Input 
                id="piece_jointe"
                value={form.piece_jointe} 
                onChange={(e) => setForm({ ...form, piece_jointe: e.target.value })} 
                placeholder="URL ou nom du fichier"
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
                {editingId ? 'Enregistrer' : 'Déclarer l\'absence'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
