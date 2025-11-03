import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
import { getBulletins, createBulletin, deleteBulletin } from "../services/bulletinService";
import { getPaiements } from "../services/paiementService";
import { Checkbox } from "../components/ui/checkbox";

function Bulletins() {
  const [list, setList] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [form, setForm] = useState({
    mois: '',
    annee: '',
    salaire_brut: '',
    salaire_net: '',
    paiementId: '',
    statut: 'valide',
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getBulletins();
      const pay = await getPaiements();
      setList(data || []);
      setPaiements(pay || []);
    } catch {
      setList([]); setPaiements([])
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        mois: parseInt(form.mois),
        annee: parseInt(form.annee),
        salaire_brut: parseFloat(form.salaire_brut),
        salaire_net: parseFloat(form.salaire_net),
        paiementId: parseInt(form.paiementId),
        statut: form.statut
      };
      await createBulletin(payload);
      toast.success("Bulletin enregistré !");
      setIsDialogOpen(false);
      setForm({ mois: '', annee: '', salaire_brut: '', salaire_net: '', paiementId: '', statut: 'valide' });
      await load();
    } catch {
      toast.error("Erreur : Impossible d'ajouter");
    } finally {
      setSubmitting(false);
    }
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
      // Pour la confirmation, nous pouvons utiliser un seul ID factice ou l'ensemble des ID.
      // Utilisons un ID factice pour déclencher la boîte de dialogue.
      setDeleteId(-1); // ID factice pour indiquer une suppression multiple
      setConfirmDeleteOpen(true);
    }
  };

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    try {
      if (deleteId === -1) { // Suppression multiple
        await Promise.all(Array.from(selectedRows).map(id => deleteBulletin(id)));
        toast.success(`${selectedRows.size} bulletin(s) supprimé(s) avec succès.`);
        setSelectedRows(new Set());
      } else { // Suppression unique
        await deleteBulletin(deleteId);
        toast.success("Bulletin supprimé avec succès.");
      }
      await load();
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
    setLoading(false);
    setDeleteId(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bulletins de paie</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 text-white gap-2"><Plus className="h-4 w-4" /> Nouveau bulletin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{'Nouveau bulletin'}</DialogTitle>
                <DialogDescription>Saisie d'un bulletin de paie lié à un paiement</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Mois *</Label><Input type="number" min={1} max={12} value={form.mois} onChange={e => setForm(f => ({ ...f, mois: e.target.value }))} required /></div>
                <div><Label>Année *</Label><Input type="number" min={2000} max={2100} value={form.annee} onChange={e => setForm(f => ({ ...f, annee: e.target.value }))} required /></div>
                <div><Label>Salaire Brut *</Label><Input type="number" value={form.salaire_brut} onChange={e => setForm(f => ({ ...f, salaire_brut: e.target.value }))} required /></div>
                <div><Label>Salaire Net *</Label><Input type="number" value={form.salaire_net} onChange={e => setForm(f => ({ ...f, salaire_net: e.target.value }))} required /></div>
                <div><Label>Paiement lié *</Label>
                  <select required value={form.paiementId} onChange={e => setForm(f => ({ ...f, paiementId: e.target.value }))} className="w-full px-3 py-2 border rounded-md">
                    <option value=''>Sélectionne le paiement...</option>
                    {paiements.map(p => (
                      <option key={p.id} value={p.id}>ID#{p.id} | {p.montant} MGA | {new Date(p.date_paiement).toLocaleDateString('fr-FR')}</option>
                    ))}
                  </select>
                </div>
                <div><Label>Statut</Label>
                  <select value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))} className="w-full px-3 py-2 border rounded-md">
                    <option value='valide'>Valide</option>
                    <option value='brouillon'>Brouillon</option>
                    <option value='archivé'>Archivé</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button type="submit" className="bg-blue-700 text-white" disabled={submitting}>Ajouter</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {selectedRows.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3 border border-blue-200">
            <div className="text-sm font-medium text-blue-800">
              {selectedRows.size} bulletin(s) sélectionné(s).
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={requestDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer la sélection
            </Button>
          </div>
        )}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.size === list.length && list.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Mois</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Brut</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={9}>Chargement...</TableCell></TableRow>
            ) : list.length === 0 ? (
              <TableRow><TableCell colSpan={9}>Aucun bulletin trouvé</TableCell></TableRow>
            ) : (
              list.map(b => {
                const paiement = paiements.find(p => p.id === b.paiementId);
                return (
                  <TableRow key={b.id} data-state={selectedRows.has(b.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(b.id)}
                        onCheckedChange={() => handleSelectRow(b.id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{b.mois}</TableCell>
                    <TableCell>{b.annee}</TableCell>
                    <TableCell>{b.salaire_brut?.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}</TableCell>
                    <TableCell>{b.salaire_net?.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}</TableCell>
                    <TableCell>{paiement ? `${paiement.montant} MGA` : b.paiementId}</TableCell>
                    <TableCell><Badge variant={b.statut==='valide'?'default':b.statut==='archivé'?'secondary':'outline'}>{b.statut}</Badge></TableCell>
                    <TableCell>
                      <Button size="icon" variant="destructive" onClick={() => requestDelete(b.id)}><Trash2 className="w-4 h-4"/></Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            </TableBody>
          </Table>
        </div>
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteId === -1
                  ? `Es-tu sûr de vouloir supprimer ${selectedRows.size} bulletins ? Cette opération est irréversible.`
                  : "Es-tu sûr de vouloir supprimer ce bulletin ? Cette opération est irréversible."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default Bulletins;
