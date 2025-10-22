// pages/Contrats.jsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getContrats, createContrat, updateContrat, deleteContrat } from "../services/contratService";
import { getEmployes } from "../services/employeService"; // <- nouveau
import { FileText, User, Plus, Edit, Trash2, Calendar, DollarSign, Eye } from "lucide-react";

export default function Contrats() {
  const [contrats, setContrats] = useState([]);
  const [employes, setEmployes] = useState([]); // liste des employés
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ 
    employeId: "", 
    type_contrat: "CDI", 
    date_debut: new Date().toISOString().split('T')[0], 
    date_fin: "",
    salaire_base: "",
    statut: "ACTIF"
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getContrats();
      setContrats(data || []);
      const empData = await getEmployes();
      setEmployes(empData || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les contrats ou employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ 
      employeId: "", 
      type_contrat: "CDI", 
      date_debut: new Date().toISOString().split('T')[0], 
      date_fin: "",
      salaire_base: "",
      statut: "ACTIF"
    });
    setIsDialogOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ 
      employeId: c.employeId || "", 
      type_contrat: c.type_contrat || "CDI", 
      date_debut: c.date_debut ? new Date(c.date_debut).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], 
      date_fin: c.date_fin ? new Date(c.date_fin).toISOString().split('T')[0] : "",
      salaire_base: c.salaire_base || "",
      statut: c.statut || "ACTIF"
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.employeId) return setError("Veuillez sélectionner un employé valide");
    try {
      if (editingId) {
        await updateContrat(editingId, form);
      } else {
        await createContrat(form);
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
      await deleteContrat(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le contrat");
    }
  };

  // Statistiques
  const stats = {
    total: contrats.length,
    actifs: contrats.filter(c => c.statut === "ACTIF").length,
    termines: contrats.filter(c => c.statut === "TERMINE").length,
    cdi: contrats.filter(c => c.type_contrat === "CDI").length,
    cdd: contrats.filter(c => c.type_contrat === "CDD").length,
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "CDI": return "bg-black text-white";
      case "CDD": return "bg-gray-100 text-gray-800";
      case "Stage": return "bg-blue-100 text-blue-800";
      case "Freelance": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "ACTIF": return "bg-green-100 text-green-800";
      case "TERMINE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR');

  const formatSalary = (salary) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(salary);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Contrats</h1>
            <p className="text-sm text-gray-600 mt-1">Consultez et gérez les contrats de travail</p>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2" 
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Nouveau Contrat
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contrats</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Tous types</p>
                </div>
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-3xl font-bold text-green-500">{stats.actifs}</p>
                  <p className="text-xs text-gray-500">En cours</p>
                </div>
                <User className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CDI</p>
                  <p className="text-3xl font-bold text-black">{stats.cdi}</p>
                  <p className="text-xs text-gray-500">Contrats permanents</p>
                </div>
                <FileText className="w-8 h-8 text-black" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-lg shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CDD</p>
                  <p className="text-3xl font-bold text-gray-500">{stats.cdd}</p>
                  <p className="text-xs text-gray-500">Contrats temporaires</p>
                </div>
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des contrats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-500">Chargement des contrats...</div>
            </div>
          )}
          {!loading && contrats.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contrat trouvé</h3>
              <p className="text-gray-500 mb-4">Commencez par créer un nouveau contrat</p>
              <Button onClick={openCreate} className="bg-black text-white">
                <Plus className="w-4 h-4 mr-2" />
                Créer un contrat
              </Button>
            </div>
          )}
          {!loading && contrats.length > 0 && contrats.map((contrat) => (
            <Card key={contrat.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {employes.find(e => e.id === contrat.employeId)?.nom || "Employé #" + contrat.employeId}
                      </h3>
                      <p className="text-sm text-gray-500">Contrat de travail</p>
                    </div>
                  </div>
                  <Badge className={`${getTypeColor(contrat.type_contrat)} text-xs px-2 py-1`}>
                    {contrat.type_contrat}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Début: {formatDate(contrat.date_debut)}</span>
                  </div>
                  {contrat.date_fin && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Fin: {formatDate(contrat.date_fin)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Salaire: {formatSalary(contrat.salaire_base)}/an</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatutColor(contrat.statut)} text-xs px-2 py-1`}>
                    {contrat.statut.toLowerCase()}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                      <Eye className="w-4 h-4 mr-1" /> Détails
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(contrat)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(contrat.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editingId ? 'Modifier le Contrat' : 'Nouveau Contrat'}</DialogTitle>
            <DialogDescription className="text-gray-600">{editingId ? 'Modifiez le contrat' : 'Créez un nouveau contrat'}</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><div className="text-sm text-red-600">{error}</div></div>}
            
            {/* Sélection Employé */}
            <div className="space-y-2">
              <Label htmlFor="employeId" className="text-sm font-medium text-gray-700">Employé *</Label>
              <select
                id="employeId"
                value={form.employeId}
                onChange={(e) => setForm({ ...form, employeId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="">-- Sélectionner un employé --</option>
                {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
              </select>
            </div>

            {/* Type de contrat */}
            <div className="space-y-2">
              <Label htmlFor="type_contrat" className="text-sm font-medium text-gray-700">Type de contrat *</Label>
              <select
                id="type_contrat"
                value={form.type_contrat}
                onChange={(e) => setForm({ ...form, type_contrat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut" className="text-sm font-medium text-gray-700">Date de début *</Label>
                <Input id="date_debut" type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_fin" className="text-sm font-medium text-gray-700">Date de fin</Label>
                <Input id="date_fin" type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaire_base" className="text-sm font-medium text-gray-700">Salaire de base (Ar/mois) *</Label>
              <Input id="salaire_base" type="number" value={form.salaire_base} onChange={(e) => setForm({ ...form, salaire_base: parseFloat(e.target.value) })} placeholder="50000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut" className="text-sm font-medium text-gray-700">Statut *</Label>
              <select id="statut" value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" required>
                <option value="ACTIF">Actif</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>

            <DialogFooter className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Annuler</Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white">{editingId ? 'Enregistrer' : 'Créer le contrat'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
