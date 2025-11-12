import { useEffect, useState } from "react";
import { Plus, Trash2, FileText, Calendar, DollarSign, CheckCircle, Clock, Archive, X, TrendingUp, Edit2 } from "lucide-react";
import * as bulletinService from "../services/bulletinService";
import * as paiementService from "../services/paiementService";

function Bulletins() {
  const [list, setList] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [form, setForm] = useState({
    periode: '',
    salaire_brut: '',
    salaire_net: '',
    paiementId: '',
    statut: 'valide',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bulletinsData, paiementsData] = await Promise.all([
          bulletinService.getBulletins(),
          paiementService.getPaiements()
        ]);
        setList(bulletinsData);
        setPaiements(paiementsData);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        showToast("Erreur lors du chargement des données", 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.periode || !form.salaire_brut || !form.salaire_net || !form.paiementId) {
      showToast("Veuillez remplir tous les champs obligatoires", 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      // Extraire mois et année de la date
      const dateObj = new Date(form.periode);
      const mois = dateObj.getMonth() + 1; // getMonth() retourne 0-11
      const annee = dateObj.getFullYear();

      const payload = {
        mois: mois,
        annee: annee,
        salaire_brut: parseFloat(form.salaire_brut),
        salaire_net: parseFloat(form.salaire_net),
        paiementId: parseInt(form.paiementId),
        statut: form.statut
      };

      if (editingId) {
        // Mise à jour
        await bulletinService.updateBulletin(editingId, payload);
        showToast("Bulletin modifié avec succès !");
        setEditingId(null);
      } else {
        // Création
        await bulletinService.createBulletin(payload);
        showToast("Bulletin enregistré avec succès !");
      }

      // Recharger les données
      const bulletinsData = await bulletinService.getBulletins();
      setList(bulletinsData);
      
      setIsDialogOpen(false);
      setForm({ periode: '', salaire_brut: '', salaire_net: '', paiementId: '', statut: 'valide' });
    } catch (err) {
      console.error("Erreur:", err);
      showToast(err.message || "Erreur lors de l'opération", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (bulletin) => {
    setEditingId(bulletin.id);
    // Construire une date au format YYYY-MM-DD (utiliser le 1er du mois)
    const dateStr = `${bulletin.annee}-${String(bulletin.mois).padStart(2, '0')}-01`;
    setForm({
      periode: dateStr,
      salaire_brut: bulletin.salaire_brut.toString(),
      salaire_net: bulletin.salaire_net.toString(),
      paiementId: bulletin.paiementId.toString(),
      statut: bulletin.statut
    });
    setIsDialogOpen(true);
  };

  const requestDelete = (id) => { setDeleteId(id); setConfirmDeleteOpen(true); };
  
  const handleSelectRow = (id) => {
    setSelectedRows(prev => {
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
      setSelectedRows(new Set(list.map(item => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedRows.size > 0) {
      setDeleteId(-1);
      setConfirmDeleteOpen(true);
    }
  };

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    try {
      if (deleteId === -1) {
        await Promise.all(Array.from(selectedRows).map(id => 
          bulletinService.deleteBulletin(id)
        ));
        showToast(`${selectedRows.size} bulletin(s) supprimé(s) avec succès`);
        setSelectedRows(new Set());
      } else {
        await bulletinService.deleteBulletin(deleteId);
        showToast("Bulletin supprimé avec succès");
      }
      
      // Recharger les données
      const bulletinsData = await bulletinService.getBulletins();
      setList(bulletinsData);
      
      setDeleteId(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      showToast(err.message || "Erreur lors de la suppression", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Statistiques
  const stats = {
    total: list.length,
    valides: list.filter(b => b.statut === 'valide').length,
    brouillons: list.filter(b => b.statut === 'brouillon').length,
    totalBrut: list.reduce((sum, b) => sum + b.salaire_brut, 0)
  };

  const getStatusIcon = (statut) => {
    switch(statut) {
      case 'valide': return <CheckCircle className="h-4 w-4" />;
      case 'brouillon': return <Clock className="h-4 w-4" />;
      case 'archivé': return <Archive className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'valide': return 'bg-green-50 text-green-700 border-green-200';
      case 'brouillon': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'archivé': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getMoisNom = (mois) => {
    const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return moisNoms[mois - 1] || mois;
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground dark:text-white">Bulletins de Paie</h1>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Gestion et suivi des bulletins de salaire</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau Bulletin
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" />
              Total Bulletins
            </div>
            <div className="text-2xl font-bold text-foreground dark:text-white">{stats.total}</div>
          </div>

          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4" />
              Validés
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.valides}</div>
          </div>

          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              Brouillons
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.brouillons}</div>
          </div>

          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" />
              Total Brut
            </div>
            <div className="text-xl font-bold text-blue-600">
              {stats.totalBrut.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
            </div>
          </div>
        </div>

        {/* Barre de sélection */}
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                {selectedRows.size}
              </div>
              <div className="text-sm font-medium text-blue-800">
                bulletin(s) sélectionné(s)
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
                      checked={selectedRows.size === list.length && list.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Salaire Brut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Salaire Net
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className="text-slate-500">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="h-12 w-12 text-slate-300" />
                        <p className="text-slate-500">Aucun bulletin trouvé</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  list.map(b => {
                    const paiement = paiements.find(p => p.id === b.paiementId);
                    const isSelected = selectedRows.has(b.id);
                    return (
                      <tr 
                        key={b.id} 
                        className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(b.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900">#{b.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-slate-700">
                              {getMoisNom(b.mois)} {b.annee}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">
                            {b.salaire_brut?.toLocaleString('fr-FR')} Ar
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-600">
                            {b.salaire_net?.toLocaleString('fr-FR')} Ar
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {paiement ? `${paiement.montant.toLocaleString('fr-FR')} Ar` : `#${b.paiementId}`}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(b.statut)}`}>
                            {getStatusIcon(b.statut)}
                            {b.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(b)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4"/>
                            </button>
                            <button
                              onClick={() => requestDelete(b.id)}
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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out] border border-blue-100">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Modifier le bulletin' : 'Créer un nouveau bulletin'}</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {editingId ? 'Mettez à jour les informations du bulletin' : 'Saisie d\'un bulletin de paie lié à un paiement'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                  setForm({ periode: '', salaire_brut: '', salaire_net: '', paiementId: '', statut: 'valide' });
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Période de la paie *
                </label>
                <input
                  type="date"
                  value={form.periode}
                  onChange={e => setForm(f => ({ ...f, periode: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Sélectionnez la date du début de la période de paie
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Salaire Brut *</label>
                  <input
                    type="number"
                    value={form.salaire_brut}
                    onChange={e => setForm(f => ({ ...f, salaire_brut: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Salaire Net *</label>
                  <input
                    type="number"
                    value={form.salaire_net}
                    onChange={e => setForm(f => ({ ...f, salaire_net: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Paiement lié *</label>
                <select
                  required
                  value={form.paiementId}
                  onChange={e => setForm(f => ({ ...f, paiementId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionne le paiement...</option>
                  {paiements.map(p => (
                    <option key={p.id} value={p.id}>
                      ID#{p.id} | {p.montant.toLocaleString('fr-FR')} Ar | {new Date(p.date_paiement).toLocaleDateString('fr-FR')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Statut</label>
                <select
                  value={form.statut}
                  onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="valide">Valide</option>
                  <option value="brouillon">Brouillon</option>
                  <option value="archivé">Archivé</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                  setForm({ periode: '', salaire_brut: '', salaire_net: '', paiementId: '', statut: 'valide' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {submitting ? (editingId ? "Modification..." : "Ajout en cours...") : (editingId ? "Modifier" : "Ajouter")}
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
                {deleteId === -1
                  ? `Êtes-vous sûr de vouloir supprimer ${selectedRows.size} bulletins ? Cette opération est irréversible.`
                  : "Êtes-vous sûr de vouloir supprimer ce bulletin ? Cette opération est irréversible."}
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

export default Bulletins;