import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast"; // ✅ Import toast
import { getPresences, createPresence, updatePresence, deletePresence } from "../services/presenceService";
import { getEmployes } from "../services/employeService";
import { CalendarDays, Clock, User, Plus, Download, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Presences() {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employes, setEmployes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // ✅ Modale de suppression
  const [presenceToDelete, setPresenceToDelete] = useState(null);
  const [form, setForm] = useState({ 
    employeId: "", 
    date_jour: new Date().toISOString(),
    statut: "PRESENT", 
    heures_travaillees: 8,
    justification: "" 
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const { toast } = useToast(); // ✅ Hook toast

  // Met à jour automatiquement la date + heure toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDate(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Charger les présences
  const load = async () => {
    setLoading(true);
    try {
      const data = await getPresences();
      const empData = await getEmployes();
      const today = new Date().toISOString().split("T")[0];
      const todayPresences = (data || []).filter(
        (p) => p.date_jour && p.date_jour.split("T")[0] === today
      );
      setPresences(todayPresences);
      setEmployes(empData || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les présences");
      toast({
        title: "Erreur ❌",
        description: "Impossible de charger les présences.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Ouvrir la création
  const openCreate = () => {
    setEditingId(null);
    setForm({ 
      employeId: "", 
      date_jour: new Date().toISOString(),
      statut: "PRESENT", 
      heures_travaillees: 8,
      justification: "" 
    });
    setIsDialogOpen(true);
  };

  // Ouvrir l’édition
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ 
      employeId: p.employeId || "", 
      date_jour: p.date_jour ? new Date(p.date_jour).toISOString() : new Date().toISOString(),
      statut: p.statut || "PRESENT", 
      heures_travaillees: p.heures_travaillees || 8,
      justification: p.justification || "" 
    });
    setIsDialogOpen(true);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const updatedForm = { ...form, date_jour: new Date().toISOString() };

    try {
      if (editingId) {
        await updatePresence(editingId, updatedForm);
        toast({
          title: "Présence mise à jour ✅",
          description: "Les informations ont été modifiées avec succès.",
          className: "bg-green-600 text-white",
        });
      } else {
        await createPresence(updatedForm);
        toast({
          title: "Présence enregistrée ✅",
          description: "Nouvelle présence ajoutée avec succès.",
          className: "bg-green-600 text-white",
        });
      }
      setIsDialogOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur");
      toast({
        title: "Erreur ❌",
        description: "Impossible d'enregistrer la présence.",
        className: "bg-red-600 text-white",
      });
    }
  };

  // ✅ Prépare la suppression avec modale
  const confirmDelete = (id) => {
    setPresenceToDelete(id);
    setConfirmDialogOpen(true);
  };

  // ✅ Suppression réelle
  const handleDelete = async () => {
    if (!presenceToDelete) return;
    try {
      await deletePresence(presenceToDelete);
      toast({
        title: "Présence supprimée ✅",
        description: "L'enregistrement a été supprimé avec succès.",
        className: "bg-green-600 text-white",
      });
      await load();
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur ❌",
        description: "Impossible de supprimer la présence.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setConfirmDialogOpen(false);
      setPresenceToDelete(null);
    }
  };

  // // Statistiques
  // const stats = {
  //   presents: presences.filter(p => p.statut === "PRESENT").length,
  //   absents: presences.filter(p => p.statut === "ABSENT").length,
  //   retards: presences.filter(p => p.statut === "RETARD").length,
  //   taux: presences.length > 0 ? Math.round((presences.filter(p => p.statut === "PRESENT").length / presences.length) * 100) : 0,
  // };

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

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
              {formatDateTime(selectedDate)}
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-900 text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button 
              className="bg-blue-700 hover:bg-blue-900 text-white flex items-center gap-2" 
              onClick={openCreate}
            >
              <Plus className="w-4 h-4" />
              Nouvelle Présence
            </Button>
          </div>
        </div>

        {/* Liste des présences */}
        <div className="bg-white rounded-lg shadow-sm border-0 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Présences du {formatDateTime(selectedDate)}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12 text-gray-500">
              Chargement des présences...
            </div>
          ) : presences.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune présence trouvée</h3>
              <p className="text-gray-500 mb-4">Commencez par enregistrer une présence</p>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Enregistrer une présence
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {presences.map((presence) => (
                <Card key={presence.id} className="bg-gray-50 rounded-lg border-0">
                  <CardContent className="p-4 flex items-center justify-between">
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
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {formatDateTime(presence.date_jour)}
                        </p>
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
                        <Button variant="outline" size="sm" onClick={() => openEdit(presence)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDelete(presence.id)} // ✅ Modale
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog principal */}
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="employeId">Employé *</Label>
              <select
                id="employeId"
                value={form.employeId}
                onChange={(e) => setForm({ ...form, employeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">-- Sélectionner un employé --</option>
                {employes.map(e => (
                  <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_jour">Date et heure du pointage</Label>
              <Input
                id="date_jour"
                type="datetime-local"
                value={new Date(form.date_jour).toISOString().slice(0,16)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut *</Label>
              <select
                id="statut"
                value={form.statut}
                onChange={(e) => setForm({ ...form, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="PRESENT">Présent</option>
                <option value="ABSENT">Absent</option>
                <option value="RETARD">Retard</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heures_travaillees">Heures travaillées</Label>
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
              <Label htmlFor="justification">Justification</Label>
              <textarea
                id="justification"
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
                placeholder="Justification si nécessaire..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            <DialogFooter className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">
                {editingId ? 'Enregistrer' : 'Créer la présence'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✅ Modale de confirmation de suppression */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Confirmation de suppression
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette présence ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
