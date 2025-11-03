import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { getPaiements, createPaiement, deletePaiement } from "../services/paiementService";
import { getEmployes } from "../services/employeService";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
import { Checkbox } from "../components/ui/checkbox";

export default function Paiments() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    montant: "",
    mode_paiement: "Espèces",
    periode_debut: "",
    periode_fin: "",
    employeId: ""
  });
  const [employes, setEmployes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedPaiements, setSelectedPaiements] = useState(new Set());

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPaiements();
      setPaiements(data || []);
      const empData = await getEmployes();
      setEmployes(empData.data || empData || []);
    } catch {
      setPaiements([]);
      setEmployes([]);
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
        montant: parseFloat(form.montant),
        mode_paiement: form.mode_paiement,
        periode_debut: form.periode_debut,
        periode_fin: form.periode_fin,
        employeId: parseInt(form.employeId)
      };
      await createPaiement(payload);
      toast.success("Paiement ajouté !");
      setIsDialogOpen(false);
      setForm({ montant: "", mode_paiement: "Espèces", periode_debut: '', periode_fin: '', employeId: '' });
      await load();
    } catch (err) {
      toast.error("Erreur : " + (err.message || "Impossible d'ajouter"));
    } finally {
      setSubmitting(false);
    }
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
        await deletePaiement(deleteId);
        toast.success("Paiement supprimé avec succès.");
      } else if (selectedPaiements.size > 0) {
        await Promise.all(Array.from(selectedPaiements).map(id => deletePaiement(id)));
        toast.success(`${selectedPaiements.size} paiement(s) supprimé(s).`);
        setSelectedPaiements(new Set());
      }
      await load();
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
    setLoading(false);
    setDeleteId(null);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 text-white gap-2"><Plus className="h-4 w-4" /> Nouveau Paiement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau Paiement</DialogTitle>
                <DialogDescription>Enregistrez un paiement de salaire pour un employé.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Employé *</Label>
                  <select required value={form.employeId} onChange={e => setForm(f => ({ ...f, employeId: e.target.value }))} className="w-full px-3 py-2 border rounded-md focus-visible:ring-2">
                    <option value="">Sélectionnez un employé...</option>
                    {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Montant *</Label>
                  <Input type="number" min={0} required value={form.montant} onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} />
                </div>
                <div>
                  <Label>Mode de paiement *</Label>
                  <select value={form.mode_paiement} onChange={e => setForm(f => ({ ...f, mode_paiement: e.target.value }))} className="w-full px-3 py-2 border rounded-md focus-visible:ring-2">
                    <option>Espèces</option>
                    <option>Virement</option>
                    <option>Chèque</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1"><Label>Période début *</Label><Input type="date" required value={form.periode_debut} onChange={e => setForm(f => ({ ...f, periode_debut: e.target.value }))} /></div>
                  <div className="flex-1"><Label>Période fin *</Label><Input type="date" required value={form.periode_fin} onChange={e => setForm(f => ({ ...f, periode_fin: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button type="submit" className="bg-blue-700 text-white" disabled={submitting}>Ajouter</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {selectedPaiements.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3 border border-blue-200">
            <div className="text-sm font-medium text-blue-800">
              {selectedPaiements.size} paiement(s) sélectionné(s).
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPaiements.size === paiements.length && paiements.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Date paiement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {loading ? (<TableRow><TableCell colSpan={7}>Chargement...</TableCell></TableRow>) : paiements.length === 0 ? (<TableRow><TableCell colSpan={7}>Aucun paiement trouvé</TableCell></TableRow>) : (
              paiements.map(p => {
                const employe = employes.find(e => e.id === p.employeId);
                return (
                  <TableRow key={p.id} data-state={selectedPaiements.has(p.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPaiements.has(p.id)}
                        onCheckedChange={() => handleSelectPaiement(p.id)}
                        aria-label="Select paiement"
                      />
                    </TableCell>
                    <TableCell>{employe ? `${employe.nom} ${employe.prenom}` : `Employé #${p.employeId}`}</TableCell>
                    <TableCell>{p.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}</TableCell>
                    <TableCell>{p.mode_paiement}</TableCell>
                    <TableCell>{p.periode_debut?.slice(0,10)} <b>-</b> {p.periode_fin?.slice(0,10)}</TableCell>
                    <TableCell>{new Date(p.date_paiement).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="destructive" onClick={() => requestDelete(p.id)}><Trash2 className="w-4 h-4"/></Button>
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
                {selectedPaiements.size > 0
                  ? `Es-tu sûr de vouloir supprimer ${selectedPaiements.size} paiement(s) ? Cette opération est irréversible.`
                  : "Es-tu sûr de vouloir supprimer ce paiement ? Cette opération est irréversible."}
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