import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
import { getPerformances, createPerformance, deletePerformance } from "../services/performanceService";
import { getEmployes } from "../services/employeService";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";

export default function Performances() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employes, setEmployes] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState('_all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    employeId: '',
    note: '',
    date_eval: new Date().toISOString().split("T")[0],
    resultat: '',
    commentaires: '',
    objectifs: '',
    realisation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPerformances();
      const emps = await getEmployes();
      setList(data || []);
      setEmployes(emps.data || emps || []);
    } catch {
      setList([]);
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
        ...form, note: parseInt(form.note), employeId: parseInt(form.employeId), date_eval: form.date_eval
      };
      await createPerformance(payload);
      toast.success("Évaluation enregistrée !");
      setIsDialogOpen(false);
      setForm({ employeId: '', note: '', date_eval: new Date().toISOString().split("T")[0], resultat: '', commentaires: '', objectifs: '', realisation: '', });
      await load();
    } catch {
      toast.error("Erreur : Impossible d'ajouter");
    } finally {
      setSubmitting(false);
    }
  };

  const requestDelete = (id) => { setDeleteId(id); setConfirmDeleteOpen(true); };
  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    try {
      await deletePerformance(deleteId);
      toast.success("Évaluation supprimée avec succès.");
      await load();
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
    setLoading(false);
    setDeleteId(null);
  };

  // Préparer les données pour recharts
  let chartData = list
    .filter((perf) => selectedEmploye === '_all' || !selectedEmploye || `${perf.employeId}` === `${selectedEmploye}`)
    .map((perf, i) => {
      const employe = employes.find(e => e.id === perf.employeId);
      return {
        ...perf,
        index: i + 1,
        nom: employe ? employe.nom + ' ' + employe.prenom : `Employé #${perf.employeId}`,
        date: perf.date_eval?.slice(0, 10),
      };
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Évaluations des Performances</h1>
          <div className="flex items-center gap-4">
            <Select value={selectedEmploye} onValueChange={setSelectedEmploye}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Voir tout le monde" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tous les employés</SelectItem>
                {employes.map(e => (
                  <SelectItem value={String(e.id)} key={e.id}>{e.nom} {e.prenom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-700 text-white gap-2"><Plus className="h-4 w-4" /> Nouvelle Évaluation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{'Nouvelle Évaluation'}</DialogTitle>
                  <DialogDescription>Saisissez l'évaluation annuelle (objectifs, commentaire...)</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label>Employé *</Label>
                    <select required value={form.employeId} onChange={e => setForm(f => ({ ...f, employeId: e.target.value }))} className="w-full px-3 py-2 border rounded-md">
                      <option value="">Sélectionnez un employé...</option>
                      {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
                    </select>
                  </div>
                  <div><Label>Date *</Label><Input type="date" value={form.date_eval} onChange={e => setForm(f => ({ ...f, date_eval: e.target.value }))} required /></div>
                  <div><Label>Note (0-20) *</Label><Input type="number" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} min={0} max={20} required /></div>
                  <div><Label>Objectifs</Label><Input value={form.objectifs} onChange={e => setForm(f => ({ ...f, objectifs: e.target.value }))} /></div>
                  <div><Label>Réalisations</Label><Input value={form.realisation} onChange={e => setForm(f => ({ ...f, realisation: e.target.value }))} /></div>
                  <div><Label>Résultat</Label><Input value={form.resultat} onChange={e => setForm(f => ({ ...f, resultat: e.target.value }))} /></div>
                  <div><Label>Commentaires</Label><Input value={form.commentaires} onChange={e => setForm(f => ({ ...f, commentaires: e.target.value }))} /></div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                    <Button type="submit" className="bg-blue-700 text-white" disabled={submitting}>Ajouter</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 min-h-[400px]">
          {loading ? (
            <div className='p-8 text-center text-gray-400'>Chargement...</div>
          ) : chartData.length === 0 ? (
            <div className='p-8 text-center text-gray-400'>Aucune donnée</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNote" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.12} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  angle={-30}
                  textAnchor='end'
                  minTickGap={10}
                  tick={{ fontSize: 13 }}
                />
                <YAxis dataKey="note" domain={[0, 20]} tick={{ fontSize: 13 }}/>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <Tooltip wrapperStyle={{ zIndex: 9999 }} content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return <div className="bg-white border rounded shadow p-2">
                      <div><b>{d.nom}</b></div>
                      <div>Note : <b>{d.note}</b> /20</div>
                      <div>Date : {d.date}</div>
                      {d.commentaires && <div className='text-xs text-gray-500'>"{d.commentaires}"</div>}
                    </div>
                  }
                  return null;
                }} />
                <Legend verticalAlign="top" height={38} />
                <Area
                  type="monotone"
                  dataKey="note"
                  name="Note de performance"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorNote)"
                  activeDot={{ r: 6 }}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>Es-tu sûr de vouloir supprimer cette évaluation ? Cette opération est irréversible.</AlertDialogDescription>
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
