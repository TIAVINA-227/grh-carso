import { useEffect, useState } from "react";
import { Plus, Trash2, DollarSign, CreditCard, Calendar, User, TrendingUp, Banknote, CheckCircle2, X, Edit2 } from "lucide-react";
import * as paiementService from "../services/paiementService";
import * as employeService from "../services/employeService";

export default function Paiments() {
  const [paiements, setPaiements] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    montant: "",
    mode_paiement: "Espèces",
    periode_debut: "",
    periode_fin: "",
    employeId: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedPaiements, setSelectedPaiements] = useState(new Set());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [paiementsData, employesData] = await Promise.all([
          paiementService.getPaiements(),
          employeService.getEmployes()
        ]);
        setPaiements(paiementsData);
        setEmployes(employesData);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        showToast("Erreur lors du chargement des données", 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeId || !form.montant || !form.periode_debut || !form.periode_fin) {
      showToast("Veuillez remplir tous les champs obligatoires", 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        employeId: parseInt(form.employeId),
        montant: parseFloat(form.montant),
        mode_paiement: form.mode_paiement,
        periode_debut: new Date(form.periode_debut).toISOString(),
        periode_fin: new Date(form.periode_fin).toISOString(),
        date_paiement: new Date().toISOString()
      };

      if (editingId) {
        // Mise à jour
        await paiementService.updatePaiement(editingId, payload);
        showToast("Paiement modifié avec succès !");
        setEditingId(null);
      } else {
        // Création
        await paiementService.createPaiement(payload);
        showToast("Paiement ajouté avec succès !");
      }

      // Recharger les données
      const paiementsData = await paiementService.getPaiements();
      setPaiements(paiementsData);
      
      setIsDialogOpen(false);
      setForm({ montant: "", mode_paiement: "Espèces", periode_debut: '', periode_fin: '', employeId: '' });
    } catch (err) {
      console.error("Erreur:", err);
      showToast(err.message || "Erreur lors du paiement", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (paiement) => {
    setEditingId(paiement.id);
    setForm({
      employeId: paiement.employeId.toString(),
      montant: paiement.montant.toString(),
      mode_paiement: paiement.mode_paiement,
      periode_debut: paiement.periode_debut?.split('T')[0] || '',
      periode_fin: paiement.periode_fin?.split('T')[0] || ''
    });
    setIsDialogOpen(true);
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  }

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    try {
      if (deleteId) {
        await paiementService.deletePaiement(deleteId);
        showToast("Paiement supprimé avec succès");
      } else if (selectedPaiements.size > 0) {
        await Promise.all(Array.from(selectedPaiements).map(id => 
          paiementService.deletePaiement(id)
        ));
        showToast(`${selectedPaiements.size} paiement(s) supprimé(s)`);
        setSelectedPaiements(new Set());
      }
      
      // Recharger les données
      const paiementsData = await paiementService.getPaiements();
      setPaiements(paiementsData);
      
      setDeleteId(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      showToast(err.message || "Erreur lors de la suppression", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPaiement = (id) => {
    setSelectedPaiements(prev => {
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
      setSelectedPaiements(new Set(paiements.map(item => item.id)));
    } else {
      setSelectedPaiements(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedPaiements.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  // Calculer les statistiques
  const stats = {
    total: paiements.reduce((sum, p) => sum + p.montant, 0),
    count: paiements.length,
    moyenne: paiements.length > 0 ? paiements.reduce((sum, p) => sum + p.montant, 0) / paiements.length : 0,
    moisCourant: paiements.filter(p => {
      const date = new Date(p.date_paiement);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + p.montant, 0)
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'Virement': return <CreditCard className="h-4 w-4" />;
      case 'Chèque': return <Banknote className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getModeColor = (mode) => {
    switch(mode) {
      case 'Virement': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Chèque': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white animate-[slideIn_0.3s_ease-out]`}>
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestion des Paiements</h1>
              <p className="text-sm text-slate-500">Suivi et gestion des paiements de salaires</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau Paiement
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4" />
              Total Payé
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.total.toLocaleString('fr-FR')} Ar
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4" />
              Nombre de Paiements
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.count}</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" />
              Montant Moyen
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4" />
              Ce Mois
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.moisCourant.toLocaleString('fr-FR')} Ar
            </div>
          </div>
        </div>

        {/* Barre de sélection */}
        {selectedPaiements.size > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                {selectedPaiements.size}
              </div>
              <div className="text-sm font-medium text-blue-800">
                paiement(s) sélectionné(s)
              </div>
            </div>
            <button
              onClick={requestDeleteSelected}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer la sélection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPaiements.size === paiements.length && paiements.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date Paiement
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className="text-slate-500">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : paiements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <DollarSign className="h-12 w-12 text-slate-300" />
                        <p className="text-slate-500">Aucun paiement trouvé</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paiements.map(p => {
                    const employe = employes.find(e => e.id === p.employeId);
                    const isSelected = selectedPaiements.has(p.id);
                    return (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectPaiement(p.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                              <User className="h-4 w-4 text-slate-600" />
                            </div>
                            <span className="font-medium text-slate-900">
                              {employe ? `${employe.nom} ${employe.prenom}` : `Employé #${p.employeId}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-600">
                            {p.montant.toLocaleString('fr-FR')} Ar
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getModeColor(p.mode_paiement)}`}>
                            {getModeIcon(p.mode_paiement)}
                            {p.mode_paiement}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            {p.periode_debut?.slice(0,10)}
                            <span className="text-slate-400">→</span>
                            {p.periode_fin?.slice(0,10)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(p.date_paiement).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4"/>
                            </button>
                            <button
                              onClick={() => requestDelete(p.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal d'ajout */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                    {editingId ? 'Modifier le Paiement' : 'Nouveau Paiement'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {editingId ? 'Mettez à jour les informations du paiement' : 'Enregistrez un paiement de salaire pour un employé'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingId(null);
                    setForm({ montant: "", mode_paiement: "Espèces", periode_debut: '', periode_fin: '', employeId: '' });
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4 text-blue-600" />
                  Employé *
                </label>
                <select
                  required
                  value={form.employeId}
                  onChange={e => setForm(f => ({ ...f, employeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un employé...</option>
                  {employes.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.nom} {e.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Montant (Ar) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.montant}
                  onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
                  placeholder="Ex: 2500000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Mode de paiement *
                </label>
                <select
                  value={form.mode_paiement}
                  onChange={e => setForm(f => ({ ...f, mode_paiement: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Espèces</option>
                  <option>Virement</option>
                  <option>Chèque</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Période début *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.periode_debut}
                    onChange={e => setForm(f => ({ ...f, periode_debut: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Période fin *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.periode_fin}
                    onChange={e => setForm(f => ({ ...f, periode_fin: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                  setForm({ montant: "", mode_paiement: "Espèces", periode_debut: '', periode_fin: '', employeId: '' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {submitting ? (editingId ? "Modification..." : "Enregistrement...") : (editingId ? "Modifier le paiement" : "Ajouter le paiement")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="p-6">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-900 mb-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Confirmer la suppression
              </h3>
              <p className="text-sm text-slate-600">
                {selectedPaiements.size > 0
                  ? `Êtes-vous sûr de vouloir supprimer ${selectedPaiements.size} paiement(s) ? Cette opération est irréversible.`
                  : "Êtes-vous sûr de vouloir supprimer ce paiement ? Cette opération est irréversible."}
              </p>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}