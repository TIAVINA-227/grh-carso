// //frontend/src/pages/Paiments.jsx
// import { useEffect, useState } from "react";
// import { Plus, Trash2, DollarSign, CreditCard, Calendar, CalendarDays, User, TrendingUp, Banknote, CheckCircle2, X, Edit2, Upload, FileSpreadsheet, ChevronDown, FileText, AlertCircle, Wallet, Wallet2 } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { pdf } from '@react-pdf/renderer';
// import PaiementsPDFDocument from '../exportPdf/PaiementsPDFDocument';
// import * as paiementService from "../services/paiementService";
// import * as employeService from "../services/employeService";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,   DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// export default function Paiments() {
//   const [paiements, setPaiements] = useState([]);
//   const [employes, setEmployes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState(null);
//   const [form, setForm] = useState({
//   montant: "",
//   mode_paiement: "Espèces",
//   periode_debut: '',
//   periode_fin: '',
//   employeId: '',
//   date_paiement: new Date().toISOString().split('T')[0],
//   statut: "payé"
// });
//   const [submitting, setSubmitting] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [selectedPaiements, setSelectedPaiements] = useState(new Set());
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [paiementsData, employesData] = await Promise.all([
//           paiementService.getPaiements(),
//           employeService.getEmployes()
//         ]);
//         setPaiements(paiementsData);
//         setEmployes(employesData);
//       } catch (err) {
//         console.error("Erreur lors du chargement:", err);
//         showToast("Erreur lors du chargement des données", 'error');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   const exportToPDF = async () => {
//     try {
//       const blob = await pdf(<PaiementsPDFDocument paiements={paiements} employes={employes} />).toBlob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a'); a.href = url; a.download = `paiements_${new Date().toISOString().slice(0,10)}.pdf`; a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) { console.error(err); }
//   };

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.employeId || !form.montant || !form.periode_debut || !form.periode_fin) {
//       showToast("Veuillez remplir tous les champs obligatoires", 'error');
//       return;
//     }
    
//     setSubmitting(true);
//     try {
//       const payload = {
//         employeId: parseInt(form.employeId),
//         montant: parseFloat(form.montant),
//         mode_paiement: form.mode_paiement,
//         periode_debut: new Date(form.periode_debut).toISOString(),
//         periode_fin: new Date(form.periode_fin).toISOString(),
//         date_paiement: new Date().toISOString()
//       };

//       if (editingId) {
//         // Mise à jour
//         await paiementService.updatePaiement(editingId, payload);
//         showToast("Paiement modifié avec succès !");
//         setEditingId(null);
//       } else {
//         // Création
//         await paiementService.createPaiement(payload);
//         showToast("Paiement ajouté avec succès !");
//       }

//       // Recharger les données
//       const paiementsData = await paiementService.getPaiements();
//       setPaiements(paiementsData);
      
//       setIsDialogOpen(false);
//       setForm({ montant: "", mode_paiement: "Espèces", periode_debut: '', periode_fin: '', employeId: '' });
//     } catch (err) {
//       console.error("Erreur:", err);
//       showToast(err.message || "Erreur lors du paiement", 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (paiement) => {
//     setEditingId(paiement.id);
//     setForm({
//       employeId: paiement.employeId.toString(),
//       montant: paiement.montant.toString(),
//       mode_paiement: paiement.mode_paiement,
//       periode_debut: paiement.periode_debut?.split('T')[0] || '',
//       periode_fin: paiement.periode_fin?.split('T')[0] || ''
//     });
//     setIsDialogOpen(true);
//   };

//   const requestDelete = (id) => {
//     setDeleteId(id);
//     setConfirmDeleteOpen(true);
//   }

//   const confirmDelete = async () => {
//     setConfirmDeleteOpen(false);
//     setLoading(true);
//     try {
//       if (deleteId) {
//         await paiementService.deletePaiement(deleteId);
//         showToast("Paiement supprimé avec succès");
//       } else if (selectedPaiements.size > 0) {
//         await Promise.all(Array.from(selectedPaiements).map(id => 
//           paiementService.deletePaiement(id)
//         ));
//         showToast(`${selectedPaiements.size} paiement(s) supprimé(s)`);
//         setSelectedPaiements(new Set());
//       }
      
//       // Recharger les données
//       const paiementsData = await paiementService.getPaiements();
//       setPaiements(paiementsData);
      
//       setDeleteId(null);
//     } catch (err) {
//       console.error("Erreur lors de la suppression:", err);
//       showToast(err.message || "Erreur lors de la suppression", 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectPaiement = (id) => {
//     setSelectedPaiements(prev => {
//       const newSelection = new Set(prev);
//       if (newSelection.has(id)) {
//         newSelection.delete(id);
//       } else {
//         newSelection.add(id);
//       }
//       return newSelection;
//     });
//   };

//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedPaiements(new Set(paiements.map(item => item.id)));
//     } else {
//       setSelectedPaiements(new Set());
//     }
//   };

//   const requestDeleteSelected = () => {
//     if (selectedPaiements.size > 0) {
//       setDeleteId(null);
//       setConfirmDeleteOpen(true);
//     }
//   };
//   const closeDialog = () => {
//   setIsDialogOpen(false);
//   setEditingId(null);
//   setForm({ 
//     montant: "", 
//     mode_paiement: "Espèces", 
//     periode_debut: '', 
//     periode_fin: '', 
//     employeId: '',
//     date_paiement: new Date().toISOString().split('T')[0],
//     statut: "payé"
//   });
// };

//   // Calculer les statistiques
//   const stats = {
//     total: paiements.reduce((sum, p) => sum + p.montant, 0),
//     count: paiements.length,
//     moyenne: paiements.length > 0 ? paiements.reduce((sum, p) => sum + p.montant, 0) / paiements.length : 0,
//     moisCourant: paiements.filter(p => {
//       const date = new Date(p.date_paiement);
//       const now = new Date();
//       return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
//     }).reduce((sum, p) => sum + p.montant, 0)
//   };

//   const getModeIcon = (mode) => {
//     switch(mode) {
//       case 'Virement': return <CreditCard className="h-4 w-4" />;
//       case 'Chèque': return <Banknote className="h-4 w-4" />;
//       default: return <DollarSign className="h-4 w-4" />;
//     }
//   };

//   const getModeColor = (mode) => {
//     switch(mode) {
//       case 'Virement': return 'bg-blue-50 text-blue-700 border-blue-200';
//       case 'Chèque': return 'bg-purple-50 text-purple-700 border-purple-200';
//       default: return 'bg-blue-50 text-blue-700 border-blue-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
//       {/* Toast notification */}
//       {toast && (
//         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
//           toast.type === 'success' ? 'bg-blue-600' : 'bg-red-600'
//         } text-white animate-[slideIn_0.3s_ease-out]`}>
//           {toast.message}
//         </div>
//       )}

//       <div className="mx-auto max-w-7xl space-y-6">
//         {/* Modern Header */}
//         <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-500/10"></div>
//           <div className="relative">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-600 shadow-2xl shadow-blue-500/30">
//                 <DollarSign className="h-8 w-8 text-white" />
//               </div>
//               <div className="flex-1">
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 bg-clip-text text-transparent">
//                   Gestion des Paiements
//                 </h1>
//                 <p className="text-sm text-muted-foreground mt-2">Suivi et gestion des paiements de salaires</p>
//               </div>
//             </div>
//             <Separator className="my-4 bg-border/40" />
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div className="text-sm text-muted-foreground">
//                 {stats.count} paiement{stats.count > 1 ? 's' : ''} au total
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={exportToPDF}
//                   className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
//                 >
//                   <Upload className="h-4 w-4" />
//                   Exporter PDF
//                 </button>

//                 <button
//                   onClick={() => setIsDialogOpen(true)}
//                   className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Nouveau Paiement
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Statistiques modernes */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-blue-100 text-sm font-medium mb-2">Total Payé</p>
//                   <p className="text-2xl font-bold">
//                     {stats.total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
//                   </p>
//                 </div>
//                 <DollarSign className="h-8 w-8 text-blue-200" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-blue-100 text-sm font-medium mb-2">Nombre de Paiements</p>
//                   <p className="text-3xl font-bold">{stats.count}</p>
//                 </div>
//                 <CheckCircle2 className="h-8 w-8 text-blue-200" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-cyan-100 text-sm font-medium mb-2">Montant Moyen</p>
//                   <p className="text-2xl font-bold">
//                     {stats.moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
//                   </p>
//                 </div>
//                 <TrendingUp className="h-8 w-8 text-cyan-200" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
//             <CardContent className="p-6 relative">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-rose-100 text-sm font-medium mb-2">Ce Mois</p>
//                   <p className="text-2xl font-bold">
//                     {stats.moisCourant.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
//                   </p>
//                 </div>
//                 <Calendar className="h-8 w-8 text-rose-200" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Barre de sélection */}
//         {selectedPaiements.size > 0 && (
//           <div className="flex items-center justify-between rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
//                 {selectedPaiements.size}
//               </div>
//               <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                 paiement(s) sélectionné(s)
//               </div>
//             </div>
//             <button
//               onClick={requestDeleteSelected}
//               className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
//             >
//               <Trash2 className="h-4 w-4" />
//               Supprimer la sélection
//             </button>
//           </div>
//         )}

//         {/* Liste des paiements */}
//         <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
//           <div className="bg-muted/50 p-6 border-b">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
//                     <Wallet2 className="w-5 h-5 text-primary-foreground" />
//                   </div>
//                   Liste des Paiements
//                 </h2>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {paiements.length} paiement{paiements.length > 1 ? 's' : ''} trouvé{paiements.length > 1 ? 's' : ''}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <CardContent className="p-6">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-muted/50 border-b border-border">
//                   <tr>
//                     <th className="px-6 py-4 text-left">
//                       <input
//                         type="checkbox"
//                         checked={selectedPaiements.size === paiements.length && paiements.length > 0}
//                         onChange={(e) => handleSelectAll(e.target.checked)}
//                         className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
//                       />
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
//                       Employé
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
//                       Montant
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
//                       Mode
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
//                       Période
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
//                       Date Paiement
//                     </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center gap-3">
//                         <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//                         <p className="text-slate-500">Chargement...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : paiements.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center gap-3">
//                         <DollarSign className="h-12 w-12 text-slate-300" />
//                         <p className="text-slate-500">Aucun paiement trouvé</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   paiements.map(p => {
//                     const employe = employes.find(e => e.id === p.employeId);
//                     const isSelected = selectedPaiements.has(p.id);
//                     return (
//                       <tr 
//                         key={p.id} 
//                         className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
//                       >
//                         <td className="px-6 py-4">
//                           <input
//                             type="checkbox"
//                             checked={isSelected}
//                             onChange={() => handleSelectPaiement(p.id)}
//                             className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                           />
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
//                               <User className="h-4 w-4 text-slate-600" />
//                             </div>
//                             <span className="font-medium text-slate-900">
//                               {employe ? `${employe.nom} ${employe.prenom}` : `Employé #${p.employeId}`}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="font-semibold text-blue-600">
//                             {p.montant.toLocaleString('fr-FR')} Ar
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getModeColor(p.mode_paiement)}`}>
//                             {getModeIcon(p.mode_paiement)}
//                             {p.mode_paiement}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-slate-600">
//                           <div className="flex items-center gap-1">
//                             {p.periode_debut?.slice(0,10)}
//                             <span className="text-slate-400">→</span>
//                             {p.periode_fin?.slice(0,10)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-slate-600">
//                           {new Date(p.date_paiement).toLocaleDateString('fr-FR')}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleEdit(p)}
//                               className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Modifier"
//                             >
//                               <Edit2 className="w-4 h-4"/>
//                             </button>
//                             <button
//                               onClick={() => requestDelete(p.id)}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                               title="Supprimer"
//                             >
//                               <Trash2 className="w-4 h-4"/>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//             </CardContent>
//         </Card>
//       </div>

//      {/* Modal d'ajout/modification */}
// {/* Modal d'ajout/modification */}
// <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
//   <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border border-border bg-card shadow-2xl">
//     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
//       <DialogHeader>
//         <DialogTitle className="text-2xl font-bold flex items-center gap-3">
//           <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center">
//             {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//           </div>
//           {editingId ? "Modifier le paiement" : "Nouveau paiement"}
//         </DialogTitle>
//         <DialogDescription className="text-blue-50/90">
//           {editingId
//             ? "Mettez à jour les informations du paiement sélectionné."
//             : "Enregistrez un paiement de salaire pour un employé."}
//         </DialogDescription>
//       </DialogHeader>
//     </div>

//     <form onSubmit={handleSubmit} className="p-6 space-y-5">
//       {error && (
//         <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-4 text-sm text-red-600 dark:text-red-300 flex items-center gap-3">
//           <AlertCircle className="h-5 w-5" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Employé */}
//       <div className="space-y-2">
//         <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
//           <User className="h-4 w-4 text-blue-600" />
//           Employé *
//         </label>
//         <select
//           required
//           value={form.employeId}
//           onChange={e => setForm(f => ({ ...f, employeId: e.target.value }))}
//           className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Sélectionnez un employé...</option>
//           {employes.map(e => (
//             <option key={e.id} value={e.id}>
//               {e.nom} {e.prenom}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Montant */}
//       <div className="space-y-2">
//         <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
//           <DollarSign className="h-4 w-4 text-blue-600" />
//           Montant (Ar) *
//         </label>
//         <input
//           type="number"
//           min={0}
//           required
//           value={form.montant}
//           onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
//           placeholder="Ex: 2500000"
//           className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Mode de paiement */}
//       <div className="space-y-2">
//         <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
//           <CreditCard className="h-4 w-4 text-blue-600" />
//           Mode de paiement *
//         </label>
//         <select
//           value={form.mode_paiement}
//           onChange={e => setForm(f => ({ ...f, mode_paiement: e.target.value }))}
//           className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="Espèces">Espèces</option>
//           <option value="Virement">Virement</option>
//           <option value="Chèque">Chèque</option>
//         </select>
//       </div>

//       {/* Période */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
//             <Calendar className="h-4 w-4 text-blue-600" />
//             Période début *
//           </label>
//           <input
//             type="date"
//             required
//             value={form.periode_debut}
//             onChange={e => setForm(f => ({ ...f, periode_debut: e.target.value }))}
//             className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
//             <Calendar className="h-4 w-4 text-blue-600" />
//             Période fin *
//           </label>
//           <input
//             type="date"
//             required
//             value={form.periode_fin}
//             onChange={e => setForm(f => ({ ...f, periode_fin: e.target.value }))}
//             className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Date de paiement */}
//       <div className="space-y-2">
//         <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
//           <CalendarDays className="h-4 w-4 text-blue-600" />
//           Date de paiement *
//         </label>
//         <input
//           type="date"
//           required
//           value={form.date_paiement}
//           onChange={e => setForm(f => ({ ...f, date_paiement: e.target.value }))}
//           className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Statut */}
//       <div className="space-y-2">
//         <label className="text-sm font-semibold text-foreground">Statut</label>
//         <select
//           value={form.statut}
//           onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}
//           className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="payé">Payé</option>
//           <option value="en_attente">En attente</option>
//           <option value="annulé">Annulé</option>
//         </select>
//       </div>

//       <DialogFooter className="pt-4 flex-col sm:flex-row gap-3 sm:gap-2">
//         <Button
//           type="button"
//           variant="outline"
//           className="w-full sm:flex-1"
//           onClick={closeDialog}
//         >
//           Annuler
//         </Button>
//         <Button
//           type="submit"
//           disabled={submitting}
//           className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           {submitting ? 
//             (editingId ? "Modification..." : "Enregistrement...") : 
//             (editingId ? "Modifier" : "Ajouter le paiement")
//           }
//         </Button>
//       </DialogFooter>
//     </form>
//   </DialogContent>
// </Dialog>

//       <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
//         <DialogContent className="sm:max-w-[400px] border border-border bg-card">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
//               <div className="p-2 rounded-lg bg-destructive/10">
//                 <AlertCircle className="h-4 w-4 text-destructive" />
//               </div>
//               Confirmer la suppression
//             </DialogTitle>
//           </DialogHeader>
//           <p className="text-muted-foreground">
//             {selectedPaiements.size > 0
//               ? `Êtes-vous sûr de vouloir supprimer ${selectedPaiements.size} paiement(s) ? Cette action ne peut pas être annulée.`
//               : "Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action ne peut pas être annulée."}
//           </p>
//           <DialogFooter className="gap-2 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => setConfirmDeleteOpen(false)}
//             >
//               Annuler
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={confirmDelete}
//               className="hover:opacity-90"
//             >
//               Supprimer
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

// // // frontend/src/pages/Paiements.jsx
// // import { useEffect, useState } from "react";
// // import { Plus, Trash2, DollarSign, CreditCard, Calendar, CalendarDays, User, TrendingUp, Banknote, CheckCircle2, Edit2, Upload, AlertCircle, Wallet2 } from "lucide-react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { pdf } from '@react-pdf/renderer';
// // import PaiementsPDFDocument from '../exportPdf/PaiementsPDFDocument';
// // import * as paiementService from "../services/paiementService";
// // import * as employeService from "../services/employeService";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { usePermissions } from "../hooks/usePermissions";

// // export default function Paiments() {
// //   const permissions = usePermissions();
// //   const currentUser = permissions.user;
  
// //   const [paiements, setPaiements] = useState([]);
// //   const [employes, setEmployes] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //   const [editingId, setEditingId] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [form, setForm] = useState({
// //     montant: "",
// //     mode_paiement: "Espèces",
// //     periode_debut: '',
// //     periode_fin: '',
// //     employeId: '',
// //     date_paiement: new Date().toISOString().split('T')[0],
// //     statut: "payé"
// //   });
// //   const [submitting, setSubmitting] = useState(false);
// //   const [deleteId, setDeleteId] = useState(null);
// //   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
// //   const [selectedPaiements, setSelectedPaiements] = useState(new Set());
// //   const [toast, setToast] = useState(null);

// //   useEffect(() => {
// //     const loadData = async () => {
// //       setLoading(true);
// //       try {
// //         const [paiementsData, employesData] = await Promise.all([
// //           paiementService.getPaiements(),
// //           employeService.getEmployes()
// //         ]);
// //         setPaiements(paiementsData);
// //         setEmployes(employesData);
// //       } catch (err) {
// //         console.error("Erreur lors du chargement:", err);
// //         showToast("Erreur lors du chargement des données", 'error');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadData();
// //   }, []);

// //   // ✅ FILTRAGE SELON LES PERMISSIONS
// //   const filteredPaiements = paiements.filter(p => {
// //     // Admin voit tout
// //     if (permissions.isSuperAdmin || permissions.isAdmin) {
// //       return true;
// //     }
    
// //     // Employé ne voit que ses propres paiements
// //     if (permissions.isEmploye) {
// //       return p.employe?.utilisateur?.id === currentUser?.id;
// //     }
    
// //     return false;
// //   });

// //   // ✅ FONCTION POUR OBTENIR LES INITIALES
// //   const getInitiales = (utilisateur) => {
// //     if (!utilisateur) return "U";
// //     const prenom = utilisateur.prenom_utilisateur || "";
// //     const nom = utilisateur.nom_utilisateur || "";
// //     return `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase() || "U";
// //   };

// //   const exportToPDF = async () => {
// //     try {
// //       const blob = await pdf(<PaiementsPDFDocument paiements={filteredPaiements} employes={employes} />).toBlob();
// //       const url = URL.createObjectURL(blob);
// //       const a = document.createElement('a'); 
// //       a.href = url; 
// //       a.download = `paiements_${new Date().toISOString().slice(0,10)}.pdf`; 
// //       a.click();
// //       URL.revokeObjectURL(url);
// //     } catch (err) { 
// //       console.error(err); 
// //     }
// //   };

// //   const showToast = (message, type = 'success') => {
// //     setToast({ message, type });
// //     setTimeout(() => setToast(null), 3000);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!permissions.canCreate('paiements') && !editingId) {
// //       showToast("Vous n'avez pas la permission de créer un paiement", 'error');
// //       return;
// //     }
    
// //     if (!permissions.canEdit('paiements') && editingId) {
// //       showToast("Vous n'avez pas la permission de modifier", 'error');
// //       return;
// //     }
    
// //     if (!form.employeId || !form.montant || !form.periode_debut || !form.periode_fin) {
// //       showToast("Veuillez remplir tous les champs obligatoires", 'error');
// //       return;
// //     }
    
// //     setSubmitting(true);
// //     try {
// //       const payload = {
// //         employeId: parseInt(form.employeId),
// //         montant: parseFloat(form.montant),
// //         mode_paiement: form.mode_paiement,
// //         periode_debut: new Date(form.periode_debut).toISOString(),
// //         periode_fin: new Date(form.periode_fin).toISOString(),
// //         date_paiement: new Date().toISOString()
// //       };

// //       if (editingId) {
// //         await paiementService.updatePaiement(editingId, payload);
// //         showToast("Paiement modifié avec succès !");
// //         setEditingId(null);
// //       } else {
// //         await paiementService.createPaiement(payload);
// //         showToast("Paiement ajouté avec succès !");
// //       }

// //       const paiementsData = await paiementService.getPaiements();
// //       setPaiements(paiementsData);
      
// //       setIsDialogOpen(false);
// //       setForm({ montant: "", mode_paiement: "Espèces", periode_debut: '', periode_fin: '', employeId: '', date_paiement: new Date().toISOString().split('T')[0], statut: "payé" });
// //     } catch (err) {
// //       console.error("Erreur:", err);
// //       showToast(err.message || "Erreur lors du paiement", 'error');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleEdit = (paiement) => {
// //     if (!permissions.canEdit('paiements')) {
// //       showToast("Vous n'avez pas la permission de modifier", 'error');
// //       return;
// //     }
    
// //     setEditingId(paiement.id);
// //     setForm({
// //       employeId: paiement.employeId.toString(),
// //       montant: paiement.montant.toString(),
// //       mode_paiement: paiement.mode_paiement,
// //       periode_debut: paiement.periode_debut?.split('T')[0] || '',
// //       periode_fin: paiement.periode_fin?.split('T')[0] || '',
// //       date_paiement: paiement.date_paiement?.split('T')[0] || new Date().toISOString().split('T')[0],
// //       statut: "payé"
// //     });
// //     setIsDialogOpen(true);
// //   };

// //   const requestDelete = (id) => {
// //     if (!permissions.canDelete('paiements')) {
// //       showToast("Vous n'avez pas la permission de supprimer", 'error');
// //       return;
// //     }
// //     setDeleteId(id);
// //     setConfirmDeleteOpen(true);
// //   };

// //   const confirmDelete = async () => {
// //     setConfirmDeleteOpen(false);
// //     setLoading(true);
// //     try {
// //       if (deleteId) {
// //         await paiementService.deletePaiement(deleteId);
// //         showToast("Paiement supprimé avec succès");
// //       } else if (selectedPaiements.size > 0) {
// //         await Promise.all(Array.from(selectedPaiements).map(id => 
// //           paiementService.deletePaiement(id)
// //         ));
// //         showToast(`${selectedPaiements.size} paiement(s) supprimé(s)`);
// //         setSelectedPaiements(new Set());
// //       }
      
// //       const paiementsData = await paiementService.getPaiements();
// //       setPaiements(paiementsData);
      
// //       setDeleteId(null);
// //     } catch (err) {
// //       console.error("Erreur lors de la suppression:", err);
// //       showToast(err.message || "Erreur lors de la suppression", 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSelectPaiement = (id) => {
// //     setSelectedPaiements(prev => {
// //       const newSelection = new Set(prev);
// //       if (newSelection.has(id)) {
// //         newSelection.delete(id);
// //       } else {
// //         newSelection.add(id);
// //       }
// //       return newSelection;
// //     });
// //   };

// //   const handleSelectAll = (checked) => {
// //     if (checked) {
// //       setSelectedPaiements(new Set(filteredPaiements.map(item => item.id)));
// //     } else {
// //       setSelectedPaiements(new Set());
// //     }
// //   };

// //   const requestDeleteSelected = () => {
// //     if (selectedPaiements.size > 0) {
// //       setDeleteId(null);
// //       setConfirmDeleteOpen(true);
// //     }
// //   };

// //   const closeDialog = () => {
// //     setIsDialogOpen(false);
// //     setEditingId(null);
// //     setForm({ 
// //       montant: "", 
// //       mode_paiement: "Espèces", 
// //       periode_debut: '', 
// //       periode_fin: '', 
// //       employeId: '',
// //       date_paiement: new Date().toISOString().split('T')[0],
// //       statut: "payé"
// //     });
// //   };

// //   // Calculer les statistiques
// //   const stats = {
// //     total: filteredPaiements.reduce((sum, p) => sum + p.montant, 0),
// //     count: filteredPaiements.length,
// //     moyenne: filteredPaiements.length > 0 ? filteredPaiements.reduce((sum, p) => sum + p.montant, 0) / filteredPaiements.length : 0,
// //     moisCourant: filteredPaiements.filter(p => {
// //       const date = new Date(p.date_paiement);
// //       const now = new Date();
// //       return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
// //     }).reduce((sum, p) => sum + p.montant, 0)
// //   };

// //   const getModeIcon = (mode) => {
// //     switch(mode) {
// //       case 'Virement': return <CreditCard className="h-4 w-4" />;
// //       case 'Chèque': return <Banknote className="h-4 w-4" />;
// //       default: return <DollarSign className="h-4 w-4" />;
// //     }
// //   };

// //   const getModeColor = (mode) => {
// //     switch(mode) {
// //       case 'Virement': return 'bg-blue-50 text-blue-700 border-blue-200';
// //       case 'Chèque': return 'bg-purple-50 text-purple-700 border-purple-200';
// //       default: return 'bg-green-50 text-green-700 border-green-200';
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
// //       {/* Toast notification */}
// //       {toast && (
// //         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
// //           toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
// //         } text-white animate-[slideIn_0.3s_ease-out]`}>
// //           {toast.message}
// //         </div>
// //       )}

// //       <div className="mx-auto max-w-7xl space-y-6">
// //         {/* Modern Header */}
// //         <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
// //           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-teal-500/10"></div>
// //           <div className="relative">
// //             <div className="flex items-center gap-4 mb-6">
// //               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-600 shadow-2xl shadow-blue-500/30">
// //                 <DollarSign className="h-8 w-8 text-white" />
// //               </div>
// //               <div className="flex-1">
// //                 <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
// //                   {permissions.isEmploye ? 'Mes Paiements' : 'Gestion des Paiements'}
// //                 </h1>
// //                 <p className="text-sm text-muted-foreground mt-2">
// //                   {permissions.isEmploye 
// //                     ? 'Consultez l\'historique de vos paiements de salaire'
// //                     : 'Suivi et gestion des paiements de salaires'}
// //                 </p>
// //               </div>
// //             </div>
// //             <Separator className="my-4 bg-border/40" />
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //               <div className="text-sm text-muted-foreground">
// //                 {stats.count} paiement{stats.count > 1 ? 's' : ''} au total
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 {(permissions.isSuperAdmin || permissions.isAdmin) && (
// //                   <>
// //                     <button
// //                       onClick={exportToPDF}
// //                       className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
// //                     >
// //                       <Upload className="h-4 w-4" />
// //                       Exporter PDF
// //                     </button>

// //                     <button
// //                       onClick={() => setIsDialogOpen(true)}
// //                       className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
// //                     >
// //                       <Plus className="h-4 w-4" />
// //                       Nouveau Paiement
// //                     </button>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Statistiques modernes */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
// //             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
// //             <CardContent className="p-6 relative">
// //               <div className="flex items-start justify-between">
// //                 <div>
// //                   <p className="text-blue-100 text-sm font-medium mb-2">Total Payé</p>
// //                   <p className="text-2xl font-bold">
// //                     {stats.total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
// //                   </p>
// //                 </div>
// //                 <DollarSign className="h-8 w-8 text-blue-200" />
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
// //             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
// //             <CardContent className="p-6 relative">
// //               <div className="flex items-start justify-between">
// //                 <div>
// //                   <p className="text-blue-100 text-sm font-medium mb-2">Nombre de Paiements</p>
// //                   <p className="text-3xl font-bold">{stats.count}</p>
// //                 </div>
// //                 <CheckCircle2 className="h-8 w-8 text-blue-200" />
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
// //             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
// //             <CardContent className="p-6 relative">
// //               <div className="flex items-start justify-between">
// //                 <div>
// //                   <p className="text-cyan-100 text-sm font-medium mb-2">Montant Moyen</p>
// //                   <p className="text-2xl font-bold">
// //                     {stats.moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
// //                   </p>
// //                 </div>
// //                 <TrendingUp className="h-8 w-8 text-cyan-200" />
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
// //             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
// //             <CardContent className="p-6 relative">
// //               <div className="flex items-start justify-between">
// //                 <div>
// //                   <p className="text-rose-100 text-sm font-medium mb-2">Ce Mois</p>
// //                   <p className="text-2xl font-bold">
// //                     {stats.moisCourant.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
// //                   </p>
// //                 </div>
// //                 <Calendar className="h-8 w-8 text-rose-200" />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Barre de sélection */}
// //         {selectedPaiements.size > 0 && (permissions.isSuperAdmin || permissions.isAdmin) && (
// //           <div className="flex items-center justify-between rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
// //             <div className="flex items-center gap-3">
// //               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
// //                 {selectedPaiements.size}
// //               </div>
// //               <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
// //                 paiement(s) sélectionné(s)
// //               </div>
// //             </div>
// //             <button
// //               onClick={requestDeleteSelected}
// //               className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
// //             >
// //               <Trash2 className="h-4 w-4" />
// //               Supprimer la sélection
// //             </button>
// //           </div>
// //         )}

// //         {/* Liste des paiements */}
// //         <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
// //           <div className="bg-muted/50 p-6 border-b">
// //             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //               <div>
// //                 <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
// //                   <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
// //                     <Wallet2 className="w-5 h-5 text-primary-foreground" />
// //                   </div>
// //                   Liste des Paiements
// //                 </h2>
// //                 <p className="text-sm text-muted-foreground mt-1">
// //                   {filteredPaiements.length} paiement{filteredPaiements.length > 1 ? 's' : ''} trouvé{filteredPaiements.length > 1 ? 's' : ''}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <CardContent className="p-6">
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-muted/50 border-b border-border">
// //                   <tr>
// //                     {(permissions.isSuperAdmin || permissions.isAdmin) && (
// //                       <th className="px-6 py-4 text-left">
// //                         <input
// //                           type="checkbox"
// //                           checked={selectedPaiements.size === filteredPaiements.length && filteredPaiements.length > 0}
// //                           onChange={(e) => handleSelectAll(e.target.checked)}
// //                           className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
// //                         />
// //                       </th>
// //                     )}
// //                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
// //                       Employé
// //                     </th>
// //                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
// //                       Montant
// //                     </th>
// //                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
// //                       Mode
// //                     </th>
// //                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
// //                       Période
// //                     </th>
// //                     <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
// //                       Date Paiement
// //                     </th>
// //                     {(permissions.isSuperAdmin || permissions.isAdmin) && (
// //                       <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
// //                         Actions
// //                       </th>
// //                     )}
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-border">
// //                   {loading ? (
// //                     <tr>
// //                       <td colSpan={7} className="px-6 py-12 text-center">
// //                         <div className="flex flex-col items-center gap-3">
// //                           <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
// //                           <p className="text-muted-foreground">Chargement...</p>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ) : filteredPaiements.length === 0 ? (
// //                     <tr>
// //                       <td colSpan={7} className="px-6 py-12 text-center">
// //                         <div className="flex flex-col items-center gap-3">
// //                           <DollarSign className="h-12 w-12 text-muted-foreground/30" />
// //                           <p className="text-muted-foreground">Aucun paiement trouvé</p>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     filteredPaiements.map(p => {
// //                       const employe = employes.find(e => e.id === p.employeId);
// //                       const utilisateur = p.employe?.utilisateur || employe?.utilisateur;
// //                       const isSelected = selectedPaiements.has(p.id);
                      
// //                       return (
// //                         <tr 
// //                           key={p.id} 
// //                           className={`hover:bg-muted/50 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
// //                         >
// //                           {(permissions.isSuperAdmin || permissions.isAdmin) && (
// //                             <td className="px-6 py-4">
// //                               <input
// //                                 type="checkbox"
// //                                 checked={isSelected}
// //                                 onChange={() => handleSelectPaiement(p.id)}
// //                                 className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
// //                               />
// //                             </td>
// //                           )}
// //                           <td className="px-6 py-4">
// //                             <div className="flex items-center gap-3">
// //                               {/* ✅ AVATAR AVEC FALLBACK */}
// //                               <Avatar className="h-10 w-10 ring-2 ring-background shadow-lg">
// //                                 {utilisateur?.avatar ? (
// //                                   <AvatarImage 
// //                                     src={utilisateur.avatar} 
// //                                     alt={`${p.employe?.prenom || employe?.prenom} ${p.employe?.nom || employe?.nom}`} 
// //                                   />
// //                                 ) : (
// //                                   <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
// //                                     {getInitiales(utilisateur)}
// //                                   </AvatarFallback>
// //                                 )}
// //                               </Avatar>
                              
// //                               <div>
// //                                 <div className="font-medium text-foreground">
// //                                   {p.employe?.nom || employe?.nom} {p.employe?.prenom || employe?.prenom}
// //                                 </div>
// //                                 <div className="text-xs text-muted-foreground">
// //                                   {utilisateur?.nom_utilisateur || 'Non défini'}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </td>
// //                           <td className="px-6 py-4">
// //                             <span className="font-semibold text-blue-600 dark:text-blue-400">
// //                               {p.montant.toLocaleString('fr-FR')} Ar
// //                             </span>
// //                           </td>
// //                           <td className="px-6 py-4">
// //                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getModeColor(p.mode_paiement)}`}>
// //                               {getModeIcon(p.mode_paiement)}
// //                               {p.mode_paiement}
// //                             </span>
// //                           </td>
// //                           <td className="px-6 py-4 text-sm text-muted-foreground">
// //                             <div className="flex items-center gap-1">
// //                               {p.periode_debut?.slice(0,10)}
// //                               <span className="text-muted-foreground/50">→</span>
// //                               {p.periode_fin?.slice(0,10)}
// //                             </div>
// //                           </td>
// //                           <td className="px-6 py-4 text-sm text-muted-foreground">
// //                             {new Date(p.date_paiement).toLocaleDateString('fr-FR')}
// //                           </td>
// //                           {(permissions.isSuperAdmin || permissions.isAdmin) && (
// //                             <td className="px-6 py-4">
// //                               <div className="flex items-center gap-2">
// //                                 <button
// //                                   onClick={() => handleEdit(p)}
// //                                   className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
// //                                   title="Modifier"
// //                                 >
// //                                   <Edit2 className="w-4 h-4"/>
// //                                 </button>
// //                                 <button
// //                                   onClick={() => requestDelete(p.id)}
// //                                   className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
// //                                   title="Supprimer"
// //                                 >
// //                                   <Trash2 className="w-4 h-4"/>
// //                                 </button>
// //                               </div>
// //                             </td>
// //                           )}
// //                         </tr>
// //                       );
// //                     })
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Modal d'ajout/modification - Identique à ton code original */}
// //       {/* ... (garde ton code existant pour les modals) ... */}
      
// //       <style>{`
// //         @keyframes fadeIn {from { opacity: 0; }
// // to { opacity: 1; }
// // }
// // @keyframes slideUp {
// // from { transform: translateY(20px); opacity: 0; }
// // to { transform: translateY(0); opacity: 1; }
// // }
// // @keyframes slideIn {
// // from { transform: translateX(100%); opacity: 0; }
// // to { transform: translateX(0); opacity: 1; }
// // }
// // `}</style>
// // </div>
// // );
// // }

//frontend/src/pages/Paiments.jsx
import { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, DollarSign, CreditCard, Calendar, CalendarDays, User, TrendingUp, Banknote, CheckCircle2, X, Edit2, Upload, FileSpreadsheet, ChevronDown, FileText, AlertCircle, Wallet, Wallet2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pdf } from '@react-pdf/renderer';
import PaiementsPDFDocument from '../exportPdf/PaiementsPDFDocument';
import * as paiementService from "../services/paiementService";
import * as employeService from "../services/employeService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,   DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";

export default function Paiments() {
  const { user } = useAuth();
  const permissions = usePermissions();
  const [paiements, setPaiements] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEmployeId, setCurrentEmployeId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
  montant: "",
  mode_paiement: "Espèces",
  periode_debut: '',
  periode_fin: '',
  employeId: '',
  date_paiement: new Date().toISOString().split('T')[0],
  statut: "payé"
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
        
        // ✅ Trouver l'employé correspondant à l'utilisateur connecté
        if (permissions.isEmploye && user) {
          // Méthode 1: Utiliser employeId si disponible dans user
          if (user.employeId) {
            setCurrentEmployeId(user.employeId);
            console.log('✅ Employé trouvé via user.employeId:', user.employeId);
          } else {
            // Méthode 2: Chercher par email
            const employe = employesData.find(emp => 
              emp.email?.toLowerCase() === user.email?.toLowerCase()
            );
            if (employe) {
              setCurrentEmployeId(employe.id);
              console.log('✅ Employé trouvé par email pour les paiements:', employe.id, employe.prenom, employe.nom);
            } else {
              console.warn('⚠️ Aucun employé trouvé pour l\'email:', user.email);
            }
          }
        }
        
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
  }, [permissions.isEmploye, user]);
  
  // ✅ Filtrer les paiements selon le rôle et les permissions
  const filteredPaiements = useMemo(() => {
    // Admin et SuperAdmin voient tout
    if (permissions.isSuperAdmin || permissions.isAdmin) {
      return paiements;
    }
    
    // Employé ne voit que ses propres paiements
    if (permissions.isEmploye && currentEmployeId) {
      return paiements.filter(p => p.employeId === currentEmployeId);
    }
    
    // Par défaut, retourner un tableau vide si l'employé n'est pas trouvé
    return [];
  }, [paiements, permissions.isSuperAdmin, permissions.isAdmin, permissions.isEmploye, currentEmployeId]);

  const exportToPDF = async () => {
    try {
      // Utiliser filteredPaiements pour que les employés n'exportent que leurs paiements
      const blob = await pdf(<PaiementsPDFDocument paiements={filteredPaiements} employes={employes} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `paiements_${new Date().toISOString().slice(0,10)}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Vérifier les permissions
    if (!permissions.canCreate('paiements') && !editingId) {
      showToast("Vous n'avez pas la permission de créer un paiement", 'error');
      return;
    }
    
    if (!permissions.canEdit('paiements') && editingId) {
      showToast("Vous n'avez pas la permission de modifier un paiement", 'error');
      return;
    }
    
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
    // ✅ Vérifier les permissions
    if (!permissions.canEdit('paiements')) {
      showToast("Vous n'avez pas la permission de modifier un paiement", 'error');
      return;
    }
    
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
    // ✅ Vérifier les permissions
    if (!permissions.canDelete('paiements')) {
      showToast("Vous n'avez pas la permission de supprimer un paiement", 'error');
      return;
    }
    
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
    // ✅ Utiliser filteredPaiements au lieu de refiltrer
    if (checked) {
      setSelectedPaiements(new Set(filteredPaiements.map(item => item.id)));
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
  const closeDialog = () => {
  setIsDialogOpen(false);
  setEditingId(null);
  setForm({ 
    montant: "", 
    mode_paiement: "Espèces", 
    periode_debut: '', 
    periode_fin: '', 
    employeId: '',
    date_paiement: new Date().toISOString().split('T')[0],
    statut: "payé"
  });
};

  // Calculer les statistiques avec les paiements filtrés
  const stats = {
    total: filteredPaiements.reduce((sum, p) => sum + p.montant, 0),
    count: filteredPaiements.length,
    moyenne: filteredPaiements.length > 0 ? filteredPaiements.reduce((sum, p) => sum + p.montant, 0) / filteredPaiements.length : 0,
    moisCourant: filteredPaiements.filter(p => {
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
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-blue-600' : 'bg-red-600'
        } text-white animate-[slideIn_0.3s_ease-out]`}>
          {toast.message}
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-blue-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-600 shadow-2xl shadow-blue-500/30">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 bg-clip-text text-transparent">
                  {permissions.isEmploye ? 'Mes Paiements' : 'Gestion des Paiements'}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {permissions.isEmploye 
                    ? 'Consultez l\'historique de vos paiements de salaire'
                    : 'Suivi et gestion des paiements de salaires'}
                </p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.count} paiement{stats.count > 1 ? 's' : ''} au total
              </div>
              {(permissions.isSuperAdmin || permissions.isAdmin) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Exporter PDF
                  </button>

                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Nouveau Paiement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques modernes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Total Payé</p>
                  <p className="text-2xl font-bold">
                    {stats.total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Nombre de Paiements</p>
                  <p className="text-3xl font-bold">{stats.count}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium mb-2">Montant Moyen</p>
                  <p className="text-2xl font-bold">
                    {stats.moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">Ce Mois</p>
                  <p className="text-2xl font-bold">
                    {stats.moisCourant.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de sélection */}
        {selectedPaiements.size > 0 && (permissions.isSuperAdmin || permissions.isAdmin) && (
          <div className="flex items-center justify-between rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                {selectedPaiements.size}
              </div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
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

        {/* Liste des paiements */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <div className="bg-muted/50 p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Wallet2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Paiements
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredPaiements.length} paiement{filteredPaiements.length > 1 ? 's' : ''} trouvé{filteredPaiements.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {(permissions.isSuperAdmin || permissions.isAdmin) && (
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPaiements.size === filteredPaiements.length && filteredPaiements.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                      Date Paiement
                    </th>
                    {(permissions.isSuperAdmin || permissions.isAdmin) && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={(permissions.isSuperAdmin || permissions.isAdmin) ? 7 : 6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className="text-slate-500">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPaiements.length === 0 ? (
                  <tr>
                    <td colSpan={(permissions.isSuperAdmin || permissions.isAdmin) ? 7 : 6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <DollarSign className="h-12 w-12 text-slate-300" />
                        <p className="text-slate-500">Aucun paiement trouvé</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPaiements.map(p => {
                    const employe = employes.find(e => e.id === p.employeId);
                    const isSelected = selectedPaiements.has(p.id);
                    return (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        {(permissions.isSuperAdmin || permissions.isAdmin) && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectPaiement(p.id)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                        )}
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
                        {(permissions.isSuperAdmin || permissions.isAdmin) && (
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
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
            </CardContent>
        </Card>
      </div>

     {/* Modal d'ajout/modification */}
{(permissions.isSuperAdmin || permissions.isAdmin) && (
<Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
  <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border border-border bg-card shadow-2xl">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center">
            {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </div>
          {editingId ? "Modifier le paiement" : "Nouveau paiement"}
        </DialogTitle>
        <DialogDescription className="text-blue-50/90">
          {editingId
            ? "Mettez à jour les informations du paiement sélectionné."
            : "Enregistrez un paiement de salaire pour un employé."}
        </DialogDescription>
      </DialogHeader>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-5">

      {/* Employé */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="h-4 w-4 text-blue-600" />
          Employé *
        </label>
        <select
          required
          value={form.employeId}
          onChange={e => setForm(f => ({ ...f, employeId: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionnez un employé...</option>
          {employes.map(e => (
            <option key={e.id} value={e.id}>
              {e.nom} {e.prenom}
            </option>
          ))}
        </select>
      </div>

      {/* Montant */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
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
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mode de paiement */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CreditCard className="h-4 w-4 text-blue-600" />
          Mode de paiement *
        </label>
        <select
          value={form.mode_paiement}
          onChange={e => setForm(f => ({ ...f, mode_paiement: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Espèces">Espèces</option>
          <option value="Virement">Virement</option>
          <option value="Chèque">Chèque</option>
        </select>
      </div>

      {/* Période */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-blue-600" />
            Période début *
          </label>
          <input
            type="date"
            required
            value={form.periode_debut}
            onChange={e => setForm(f => ({ ...f, periode_debut: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-blue-600" />
            Période fin *
          </label>
          <input
            type="date"
            required
            value={form.periode_fin}
            onChange={e => setForm(f => ({ ...f, periode_fin: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Date de paiement */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          Date de paiement *
        </label>
        <input
          type="date"
          required
          value={form.date_paiement}
          onChange={e => setForm(f => ({ ...f, date_paiement: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Statut */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Statut</label>
        <select
          value={form.statut}
          onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="payé">Payé</option>
          <option value="en_attente">En attente</option>
          <option value="annulé">Annulé</option>
        </select>
      </div>

      <DialogFooter className="pt-4 flex-col sm:flex-row gap-3 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:flex-1"
          onClick={closeDialog}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? 
            (editingId ? "Modification..." : "Enregistrement...") : 
            (editingId ? "Modifier" : "Ajouter le paiement")
          }
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
)}

      {(permissions.isSuperAdmin || permissions.isAdmin) && (
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            {selectedPaiements.size > 0
              ? `Êtes-vous sûr de vouloir supprimer ${selectedPaiements.size} paiement(s) ? Cette action ne peut pas être annulée.`
              : "Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action ne peut pas être annulée."}
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="hover:opacity-90"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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