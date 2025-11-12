// //frontend/src/pages/Employes.jsx
// import { useState, useEffect } from "react"
// import { Search, Download, Filter, MoreHorizontal, ChevronDown, Plus, Trash2 } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
// import UserAvatar from "../components/UserAvatar"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Label } from "../components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../components/ui/dialog"
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
// import { toast } from "sonner"
// import { getEmployes, createEmploye, updateEmploye, deleteEmploye, getDepartements, getPostes } from "../services/employeService"
// import { Checkbox } from "../components/ui/checkbox";
// import { usePermissions } from "../hooks/usePermissions";
// // Imports pour l'export PDF
// import jsPDF from "jspdf";
// import autoTable from 'jspdf-autotable';
// import logoGauche from '../assets/carso1.png';
// import logoDroite from '../assets/carso1.png';


// export default function EmployeeList() {
//   const permissions = usePermissions();
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedDepartment, setSelectedDepartment] = useState("Tous les départements")
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState(null)
//   const [employees, setEmployes] = useState([])
//   const [departements, setDepartements] = useState([])
//   const [postes, setPostes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [formData, setFormData] = useState({
//     nom: "", prenom: "", email: "", telephone: "", date_naissance: "",
//     date_embauche: "", adresse: "", posteId: "", departementId: "",
//   })
//   const [editingId, setEditingId] = useState(null)
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
//   const [selectedEmployees, setSelectedEmployees] = useState(new Set());

//   const [selectedEmployee, setSelectedEmployee] = useState(null)
//   const [profileDialogOpen, setProfileDialogOpen] = useState(false)

//   const toInputDate = (iso) => {
//     if (!iso) return ''
//     try {
//       const d = new Date(iso)
//       if (isNaN(d.getTime())) return ''
//       const yyyy = d.getFullYear()
//       const mm = String(d.getMonth() + 1).padStart(2, '0')
//       const dd = String(d.getDate()).padStart(2, '0')
//       return `${yyyy}-${mm}-${dd}`
//     } catch {
//       return ''
//     }
//   }

//   const loadEmployes = async () => {
//     setLoading(true)
//     try {
//       const data = await getEmployes()
//       setEmployes(data.data || data || [])
//     } catch (err) {
//       console.error('Erreur chargement employés', err)
//       setErrorMessage('Impossible de charger les employés')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadDepartementsAndPostes = async () => {
//     try {
//       const [departementsData, postesData] = await Promise.all([getDepartements(), getPostes()])
//       setDepartements(departementsData || [])
//       setPostes(postesData || [])
//     } catch (err) {
//       console.error('Erreur chargement départements/postes', err)
//     }
//   }

//   useEffect(() => {
//     loadEmployes()
//     loadDepartementsAndPostes()
//   }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)
//     setErrorMessage(null)
//     try {
//       const payload = {
//         nom: formData.nom, prenom: formData.prenom, email: formData.email,
//         telephone: formData.telephone, adresse: formData.adresse,
//         date_embauche: formData.date_embauche ? new Date(formData.date_embauche).toISOString() : null,
//         date_naissance: formData.date_naissance ? new Date(formData.date_naissance).toISOString() : null,
//         posteId: formData.posteId ? Number(formData.posteId) : null,
//         departementId: formData.departementId ? Number(formData.departementId) : null,
//       }

//       if (editingId) {
//         await updateEmploye(editingId, payload)
//         toast.success("Employé modifié avec succès")
//       } else {
//         await createEmploye(payload)
//         toast.success("Nouvel employé ajouté avec succès")
//       }

//       setIsDialogOpen(false)
//       setEditingId(null)
//       setFormData({ nom: "", prenom: "", email: "", telephone: "", date_naissance: "", date_embauche: "", adresse: "", posteId: "", departementId: "" })
//       await loadEmployes()
//     } catch (err) {
//       console.error(err)
//       setErrorMessage(err.message || 'Erreur lors de la création/modification')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteEmploye = async (id) => {
//     setLoading(true)
//     try {
//       await deleteEmploye(id)
//       toast.success("L'employé a été supprimé avec succès")
//       await loadEmployes()
//     } catch (err) {
//       console.error('Erreur suppression employé', err)
//       toast.error("Impossible de supprimer l'employé")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (employee) => {
//     setFormData({
//       nom: employee.nom || '', prenom: employee.prenom || '', email: employee.email || '',
//       telephone: employee.telephone || '', adresse: employee.adresse || '',
//       date_naissance: toInputDate(employee.date_naissance),
//       date_embauche: toInputDate(employee.date_embauche),
//       posteId: employee.posteId ? String(employee.posteId) : '',
//       departementId: employee.departementId ? String(employee.departementId) : '',
//     })
//     setEditingId(employee.id)
//     setIsDialogOpen(true)
//     toast.success("Les informations de l'employé sont prêtes à être modifiées")
//   }

//   const requestDelete = (id) => {
//     setSelectedEmployeeId(id)
//     setConfirmDeleteOpen(true)
//   }

//   const confirmDelete = async () => {
//     setConfirmDeleteOpen(false);
//     setLoading(true);
//     try {
//       if (selectedEmployeeId) {
//         await deleteEmploye(selectedEmployeeId);
//         toast.success("L'employé a été supprimé avec succès");
//       } else if (selectedEmployees.size > 0) {
//         await Promise.all(Array.from(selectedEmployees).map(id => deleteEmploye(id)));
//         toast.success(`${selectedEmployees.size} employé(s) supprimé(s)`);
//         setSelectedEmployees(new Set());
//       }
//       await loadEmployes();
//     } catch (err) {
//       toast.error("Impossible de supprimer");
//     }
//     setLoading(false);
//     setSelectedEmployeeId(null);
//   };

//   const viewProfile = (employee) => {
//     setSelectedEmployee(employee)
//     setProfileDialogOpen(true)
//   }

//   const filteredEmployees = employees.filter(employee => {
//     const matchesSearch = searchQuery === "" ||
//       employee.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       employee.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (employee.matricule || '').toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesDepartment = selectedDepartment === "Tous les départements" ||
//       employee.departement?.nom_departement === selectedDepartment

//     return matchesSearch && matchesDepartment
//   })

//   const handleSelectEmployee = (id) => {
//     setSelectedEmployees(prev => {
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
//       setSelectedEmployees(new Set(filteredEmployees.map(item => item.id)));
//     } else {
//       setSelectedEmployees(new Set());
//     }
//   };

//   const requestDeleteSelected = () => {
//     if (selectedEmployees.size > 0) {
//       setSelectedEmployeeId(null);
//       setConfirmDeleteOpen(true);
//     }
//   };

// const exportToPDF = () => {
//   try {
//     const doc = new jsPDF();

//     // === Import des logos (à remplacer par tes vraies images/base64) ===
//     const imgGauche = logoGauche; // ou chaîne base64
//     const imgDroite = logoDroite; // ou chaîne base64

//     // === Ajout des deux logos ===
//     const logoWidth = 25;   // largeur du logo
//     const logoHeight = 25;  // hauteur du logo

//     // Logo gauche (coin supérieur gauche)
//     doc.addImage(imgGauche, 'PNG', 14, 5, logoWidth, logoHeight);

//     // Logo droit (coin supérieur droit)
//     const pageWidth = doc.internal.pageSize.getWidth();
//     doc.addImage(imgDroite, 'PNG', pageWidth - logoWidth - 14, 5, logoWidth, logoHeight);

//     // === Titre et date ===
//     doc.setFontSize(14);
//     doc.text('Liste des Employés', pageWidth / 2, 15, { align: 'center' });

//     const dateActuelle = new Date();
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     const dateFormatee = dateActuelle.toLocaleDateString('fr-FR', options);
//     const dateFinale = dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1);

//     doc.setFontSize(10);
//     doc.text(`Date : ${dateFinale}`, 14, 35);
//     doc.text(`Total : ${filteredEmployees.length} employé(s)`, 14, 41);

//     const sortedEmployees = [...filteredEmployees].sort((a, b) => a.id - b.id);

//     // === Tableau ===
//     autoTable(doc, {
//       head: [['Matricule', 'Nom', 'Poste', 'Département', 'Email', 'Téléphone']],
//       body: sortedEmployees.map(emp => [
//         formatMatricule(emp.id) || '-',
//         `${emp.nom || ''} ${emp.prenom || ''}`.trim(),
//         emp.poste?.intitule || 'Non assigné',
//         emp.departement?.nom_departement || 'Non assigné',
//         emp.email || '-',
//         emp.telephone || '-'
//       ]),
//       startY: 48,
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontSize: 9,
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: { fillColor: [245, 245, 245] }
//     });

//     doc.save('liste_employes.pdf');
//     toast.success('Export PDF réussi');
//   } catch (error) {
//     console.error('Erreur lors de l\'export PDF:', error);
//     toast.error('Erreur lors de l\'export PDF');
//   }
// };

// // Fonction pour générer un matricule formaté
// const formatMatricule = (id) => {
//   return `EMP${String(id).padStart(3, '0')}`; 
// };


//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Header et bouton Ajouter */}
//         <div className="mb-6 flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
//             <p className="mt-1 text-base text-gray-500">Gérez les informations de vos employés</p>
//           </div>
//           {permissions.canCreate('employes') && (
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button onClick={() => setIsEditing(true)}>
//                   <Plus className="h-4 w-4" /> Nouvel Employé
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>{editingId ? "Modifier l'employé" : "Nouvel employé"}</DialogTitle>
//                   <DialogDescription>{editingId ? "Modifiez les informations de l'employé" : "Ajoutez un nouvel employé à l'entreprise"}</DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2"><Label htmlFor="prenom">Prénom *</Label><Input id="prenom" value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} required /></div>
//                     <div className="space-y-2"><Label htmlFor="nom">Nom *</Label><Input id="nom" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} required /></div>
//                     <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
//                     <div className="space-y-2"><Label htmlFor="telephone">Téléphone *</Label><Input id="telephone" value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} required /></div>
//                     <div className="space-y-2"><Label htmlFor="date_naissance">Date de Naissance *</Label><Input id="date_naissance" type="date" value={formData.date_naissance} onChange={e => setFormData({ ...formData, date_naissance: e.target.value })} required /></div>
//                     <div className="space-y-2"><Label htmlFor="date_embauche">Date d'Embauche *</Label><Input id="date_embauche" type="date" value={formData.date_embauche} onChange={e => setFormData({ ...formData, date_embauche: e.target.value })} required /></div>
//                     <div className="space-y-2">
//                       <Label>Département</Label>
//                       <Select value={formData.departementId} onValueChange={v => setFormData({ ...formData, departementId: v })}>
//                         <SelectTrigger><SelectValue placeholder="Sélectionner un département" /></SelectTrigger>
//                         <SelectContent>{departements.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.nom_departement}</SelectItem>)}</SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Poste</Label>
//                       <Select value={formData.posteId} onValueChange={v => setFormData({ ...formData, posteId: v })}>
//                         <SelectTrigger><SelectValue placeholder="Sélectionner un poste" /></SelectTrigger>
//                         <SelectContent>{postes.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.intitule}</SelectItem>)}</SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2 col-span-2">
//                       <Label>Adresse</Label>
//                       <Input value={formData.adresse} onChange={e => setFormData({ ...formData, adresse: e.target.value })} placeholder="Adresse complète" />
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
//                     <Button type="submit" disabled={submitting}>{editingId ? "Enregistrer" : "Ajouter"}</Button>
//                   </div>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           )}
//         </div>

//         {/* Tableau des employés */}
//         <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
//           <div className="mb-8">
//             <h2 className="text-2xl font-semibold text-gray-900">Liste des Employés</h2>
//             <p className="mt-1 text-sm text-gray-500">{filteredEmployees.length} employé(s) trouvé(s)</p>
//           </div>

//           {selectedEmployees.size > 0 && permissions.canDelete('employes') && (
//             <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3 border border-blue-200">
//               <div className="text-sm font-medium text-blue-800">
//                 {selectedEmployees.size} employé(s) sélectionné(s).
//               </div>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={requestDeleteSelected}
//                     className="flex items-center gap-2"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     Supprimer la sélection
//                   </Button>
//             </div>
//           )}

//           <div className="mb-6 flex items-center gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
//               <Input type="text" placeholder="Rechercher par nom, email, matricule..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 pl-10 pr-4 text-base" />
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="h-12 gap-2 px-4 bg-transparent">
//                   <Filter className="h-4 w-4" /> {selectedDepartment} <ChevronDown className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuItem onClick={() => setSelectedDepartment("Tous les départements")}>Tous les départements</DropdownMenuItem>
//                 {departements.map(d => <DropdownMenuItem key={d.id} onClick={() => setSelectedDepartment(d.nom_departement)}>{d.nom_departement}</DropdownMenuItem>)}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <Button variant="outline" className="h-12 gap-2 px-4 bg-transparent" onClick={exportToPDF}>
//               <Download className="h-4 w-4" /> Exporter
//             </Button>
//           </div>

//           <div className="overflow-hidden rounded-lg border border-gray-200">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {permissions.canDelete('employes') && (
//                     <th className="px-4 py-4 w-12">
//                       <Checkbox
//                         checked={selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0}
//                         onCheckedChange={handleSelectAll}
//                         aria-label="Select all"
//                       />
//                     </th>
//                   )}
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Employé</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Matricule</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Poste</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Département</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Statut</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {loading && <tr><td colSpan={8} className="py-6 text-center">Chargement...</td></tr>}
//                 {!loading && filteredEmployees.length === 0 && <tr><td colSpan={8} className="py-6 text-center">Aucun employé trouvé</td></tr>}
//                 {!loading && filteredEmployees.length > 0 && [...filteredEmployees].sort((a, b) => a.id - b.id).map(employee => (
//                   <tr key={employee.id} className={`hover:bg-gray-50 ${selectedEmployees.has(employee.id) ? 'bg-blue-50' : ''}`}>
//                     {permissions.canDelete('employes') && (
//                       <td className="px-4 py-4">
//                         <Checkbox
//                           checked={selectedEmployees.has(employee.id)}
//                           onCheckedChange={() => handleSelectEmployee(employee.id)}
//                           aria-label="Select employee"
//                         />
//                       </td>
//                     )}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <UserAvatar user={employee} size="md" />
//                         <div
//                           className="min-w-0"
//                         >
//                           <div
//                             role="button"
//                             tabIndex={0}
//                             onClick={() => viewProfile(employee)}
//                             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') viewProfile(employee) }}
//                             className="font-medium text-gray-900 cursor-pointer truncate"
//                             aria-label={`Voir le profil de ${employee.nom || ''} ${employee.prenom || ''}`}
//                           >
//                             {`${employee.nom || ''} ${employee.prenom || ''}`}
//                           </div>
//                           <div className="text-sm text-gray-500 truncate">{employee.telephone}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{formatMatricule(employee.id)}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{employee.poste?.intitule || 'Non assigné'}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{employee.departement?.nom_departement || 'Non assigné'}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
//                     <td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-medium">Actif</span></td>
//                     <td className="px-6 py-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
//                         </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem onClick={() => viewProfile(employee)}>Voir le profil</DropdownMenuItem>
//                               {permissions.canEdit('employes') && (
//                                 <DropdownMenuItem onClick={() => handleEdit(employee)}>Modifier</DropdownMenuItem>
//                               )}
//                               {permissions.canDelete('employes') && (
//                                 <DropdownMenuItem className="text-red-600" onClick={() => requestDelete(employee.id)}>Supprimer</DropdownMenuItem>
//                               )}
//                             </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Dialog Profil Employé */}
//         <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Profil de l'employé</DialogTitle>
//               <DialogDescription>Informations détaillées de l'employé sélectionné</DialogDescription>
//             </DialogHeader>

//             {selectedEmployee && (
//               <div className="space-y-4 mt-4">
//                 <div className="flex items-center gap-4">
//                   <UserAvatar user={selectedEmployee} size="lg" />
//                   <div>
//                     <h3 className="text-xl font-bold">{`${selectedEmployee.nom} ${selectedEmployee.prenom}`}</h3>
//                     <p className="text-sm text-gray-500">{selectedEmployee.poste?.intitule || 'Non assigné'}</p>
//                     <p className="text-sm text-gray-500">{selectedEmployee.departement?.nom_departement || 'Non assigné'}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div><p className="text-sm text-gray-500">Email</p><p className="text-gray-900">{selectedEmployee.email}</p></div>
//                   <div><p className="text-sm text-gray-500">Téléphone</p><p className="text-gray-900">{selectedEmployee.telephone}</p></div>
//                   <div><p className="text-sm text-gray-500">Date de naissance</p><p className="text-gray-900">{selectedEmployee.date_naissance ? new Date(selectedEmployee.date_naissance).toLocaleDateString() : '-'}</p></div>
//                   <div><p className="text-sm text-gray-500">Date d'embauche</p><p className="text-gray-900">{selectedEmployee.date_embauche ? new Date(selectedEmployee.date_embauche).toLocaleDateString() : '-'}</p></div>
//                   <div className="col-span-2"><p className="text-sm text-gray-500">Adresse</p><p className="text-gray-900">{selectedEmployee.adresse || '-'}</p></div>
//                 </div>

//                 <div className="flex justify-end mt-4">
//                   <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>Fermer</Button>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         {/* Confirmation de suppression */}
//         <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
//               <AlertDialogDescription>
//                 {selectedEmployees.size > 0
//                   ? `Êtes-vous sûr de vouloir supprimer ${selectedEmployees.size} employé(s) ? Cette action est irréversible.`
//                   : "Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible."}
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Annuler</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from "react"
import { Search, Download, Filter, MoreHorizontal, ChevronDown, Plus, Trash2, Users } from "lucide-react"
import UserAvatar from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  getEmployes,
  createEmploye,
  updateEmploye,
  deleteEmploye,
  getDepartements,
  getPostes,
} from "@/services/employeService"
import { Checkbox } from "@/components/ui/checkbox"
import { usePermissions } from "@/hooks/usePermissions"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import logoGauche from "@/assets/carso1.png"

export default function EmployeeList() {
  const permissions = usePermissions()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("Tous les départements")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [employees, setEmployes] = useState([])
  const [departements, setDepartements] = useState([])
  const [postes, setPostes] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    date_naissance: "",
    date_embauche: "",
    adresse: "",
    posteId: "",
    departementId: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState(new Set())
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  const toInputDate = (iso) => {
    if (!iso) return ""
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return ""
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const dd = String(d.getDate()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}`
    } catch {
      return ""
    }
  }

  const loadEmployes = async () => {
    setLoading(true)
    try {
      const data = await getEmployes()
      setEmployes(data.data || data || [])
    } catch (err) {
      console.error("Erreur chargement employés", err)
      setErrorMessage("Impossible de charger les employés")
    } finally {
      setLoading(false)
    }
  }

  const loadDepartementsAndPostes = async () => {
    try {
      const [departementsData, postesData] = await Promise.all([getDepartements(), getPostes()])
      setDepartements(departementsData || [])
      setPostes(postesData || [])
    } catch (err) {
      console.error("Erreur chargement départements/postes", err)
    }
  }

  useEffect(() => {
    loadEmployes()
    loadDepartementsAndPostes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        date_embauche: formData.date_embauche ? new Date(formData.date_embauche).toISOString() : null,
        date_naissance: formData.date_naissance ? new Date(formData.date_naissance).toISOString() : null,
        posteId: formData.posteId ? Number(formData.posteId) : null,
        departementId: formData.departementId ? Number(formData.departementId) : null,
      }

      if (editingId) {
        await updateEmploye(editingId, payload)
        toast.success("Employé modifié avec succès")
      } else {
        await createEmploye(payload)
        toast.success("Nouvel employé ajouté avec succès")
      }

      setIsDialogOpen(false)
      setEditingId(null)
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        date_naissance: "",
        date_embauche: "",
        adresse: "",
        posteId: "",
        departementId: "",
      })
      await loadEmployes()
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message || "Erreur lors de la création/modification")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (employee) => {
    setFormData({
      nom: employee.nom || "",
      prenom: employee.prenom || "",
      email: employee.email || "",
      telephone: employee.telephone || "",
      adresse: employee.adresse || "",
      date_naissance: toInputDate(employee.date_naissance),
      date_embauche: toInputDate(employee.date_embauche),
      posteId: employee.posteId ? String(employee.posteId) : "",
      departementId: employee.departementId ? String(employee.departementId) : "",
    })
    setEditingId(employee.id)
    setIsDialogOpen(true)
    toast.success("Les informations de l'employé sont prêtes à être modifiées")
  }

  const requestDelete = (id) => {
    setSelectedEmployeeId(id)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false)
    setLoading(true)
    try {
      if (selectedEmployeeId) {
        await deleteEmploye(selectedEmployeeId)
        toast.success("L'employé a été supprimé avec succès")
      } else if (selectedEmployees.size > 0) {
        await Promise.all(Array.from(selectedEmployees).map((id) => deleteEmploye(id)))
        toast.success(`${selectedEmployees.size} employé(s) supprimé(s)`)
        setSelectedEmployees(new Set())
      }
      await loadEmployes()
    } catch (err) {
      toast.error("Impossible de supprimer")
    }
    setLoading(false)
    setSelectedEmployeeId(null)
  }

  const viewProfile = (employee) => {
    setSelectedEmployee(employee)
    setProfileDialogOpen(true)
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchQuery === "" ||
      employee.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.matricule || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      selectedDepartment === "Tous les départements" || employee.departement?.nom_departement === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  const handleSelectEmployee = (id) => {
    setSelectedEmployees((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      return newSelection
    })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(new Set(filteredEmployees.map((item) => item.id)))
    } else {
      setSelectedEmployees(new Set())
    }
  }

  const requestDeleteSelected = () => {
    if (selectedEmployees.size > 0) {
      setSelectedEmployeeId(null)
      setConfirmDeleteOpen(true)
    }
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF()
      const imgGauche = logoGauche
      const logoWidth = 25
      const logoHeight = 25

      doc.addImage(imgGauche, "PNG", 14, 5, logoWidth, logoHeight)
      const pageWidth = doc.internal.pageSize.getWidth()

      doc.setFontSize(14)
      doc.text("Liste des Employés", pageWidth / 2, 15, { align: "center" })

      const dateActuelle = new Date()
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      const dateFormatee = dateActuelle.toLocaleDateString("fr-FR", options)
      const dateFinale = dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1)

      doc.setFontSize(10)
      doc.text(`Date : ${dateFinale}`, 14, 35)
      doc.text(`Total : ${filteredEmployees.length} employé(s)`, 14, 41)

      const sortedEmployees = [...filteredEmployees].sort((a, b) => a.id - b.id)

      autoTable(doc, {
        head: [["Matricule", "Nom", "Poste", "Département", "Email", "Téléphone"]],
        body: sortedEmployees.map((emp) => [
          formatMatricule(emp.id) || "-",
          `${emp.nom || ""} ${emp.prenom || ""}`.trim(),
          emp.poste?.intitule || "Non assigné",
          emp.departement?.nom_departement || "Non assigné",
          emp.email || "-",
          emp.telephone || "-",
        ]),
        startY: 48,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      })

      doc.save("liste_employes.pdf")
      toast.success("Export PDF réussi")
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error)
      toast.error("Erreur lors de l'export PDF")
    }
  }

  const formatMatricule = (id) => {
    return `EMP${String(id).padStart(3, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600  shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Gestion des Employés</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gérez les informations de vos employés de manière efficace
                </p>
              </div>
            </div>
            {permissions.canCreate("employes") && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 h-11 md:h-auto">
                    <Plus className="h-5 w-5" /> Nouvel Employé
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {editingId ? "Modifier l'employé" : "Nouvel employé"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {editingId
                        ? "Modifiez les informations de l'employé"
                        : "Ajoutez un nouvel employé à l'entreprise"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {errorMessage && (
                      <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{errorMessage}</div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="prenom" className="font-semibold">
                          Prénom *
                        </Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom" className="font-semibold">
                          Nom *
                        </Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone" className="font-semibold">
                          Téléphone *
                        </Label>
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_naissance" className="font-semibold">
                          Date de Naissance *
                        </Label>
                        <Input
                          id="date_naissance"
                          type="date"
                          value={formData.date_naissance}
                          onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_embauche" className="font-semibold">
                          Date d'Embauche *
                        </Label>
                        <Input
                          id="date_embauche"
                          type="date"
                          value={formData.date_embauche}
                          onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })}
                          required
                          className="h-10 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold">Département</Label>
                        <Select
                          value={formData.departementId}
                          onValueChange={(v) => setFormData({ ...formData, departementId: v })}
                        >
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                          <SelectContent>
                            {departements.map((d) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.nom_departement}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold">Poste</Label>
                        <Select
                          value={formData.posteId}
                          onValueChange={(v) => setFormData({ ...formData, posteId: v })}
                        >
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue placeholder="Sélectionner un poste" />
                          </SelectTrigger>
                          <SelectContent>
                            {postes.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.intitule}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label className="font-semibold">Adresse</Label>
                        <Input
                          value={formData.adresse}
                          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                          placeholder="Adresse complète"
                          className="h-10 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setEditingId(null)
                          setFormData({
                            nom: "",
                            prenom: "",
                            email: "",
                            telephone: "",
                            date_naissance: "",
                            date_embauche: "",
                            adresse: "",
                            posteId: "",
                            departementId: "",
                          })
                        }}
                        className="rounded-lg"
                      >
                        Annuler
                      </Button>
                      <Button type="submit" disabled={submitting} className="rounded-lg gap-2">
                        {submitting ? "Traitement..." : editingId ? "Enregistrer" : "Ajouter"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  Liste des Employés
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{filteredEmployees.length} employé(s) trouvé(s)</p>
              </div>
            </div>
          </div>

          {selectedEmployees.size > 0 && permissions.canDelete("employes") && (
            <div className="mx-6 mt-4 flex items-center justify-between rounded-lg bg-primary/5 p-4 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-sm font-medium text-primary">
                {selectedEmployees.size} employé(s) sélectionné(s).
              </div>
              <Button size="sm" variant="destructive" onClick={requestDeleteSelected} className="gap-2 rounded-lg">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          )}

          <div className="p-6 md:p-8 border-b border-border space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, email, matricule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-10 pr-4 text-base rounded-lg bg-background border border-border"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 gap-2 px-4 rounded-lg border-border bg-background hover:bg-muted"
                  >
                    <Filter className="h-4 w-4" />{" "}
                    {selectedDepartment === "Tous les départements" ? "Tous les départements" : selectedDepartment}{" "}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-lg">
                  <DropdownMenuItem onClick={() => setSelectedDepartment("Tous les départements")}>
                    Tous les départements
                  </DropdownMenuItem>
                  {departements.map((d) => (
                    <DropdownMenuItem key={d.id} onClick={() => setSelectedDepartment(d.nom_departement)}>
                      {d.nom_departement}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="h-11 gap-2 px-4 rounded-lg border-border bg-background hover:bg-muted"
                onClick={exportToPDF}
              >
                <Download className="h-4 w-4" /> Exporter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {permissions.canDelete("employes") && (
                    <th className="px-4 md:px-6 py-4 w-12 text-left">
                      <Checkbox
                        checked={selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </th>
                  )}
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Matricule
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="hidden md:table-cell px-4 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Département
                  </th>
                  <th className="hidden lg:table-cell px-4 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 md:px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="inline-flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                        <p className="text-sm text-muted-foreground">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <p className="text-sm text-muted-foreground">Aucun employé trouvé</p>
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredEmployees.length > 0 &&
                  [...filteredEmployees]
                    .sort((a, b) => a.id - b.id)
                    .map((employee) => (
                      <tr key={employee.id} className="hover:bg-muted/50 transition-smooth">
                        {permissions.canDelete("employes") && (
                          <td className="px-4 md:px-6 py-4">
                            <Checkbox
                              checked={selectedEmployees.has(employee.id)}
                              onCheckedChange={() => handleSelectEmployee(employee.id)}
                              aria-label="Select employee"
                            />
                          </td>
                        )}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={employee} size="md" />
                            <div className="min-w-0">
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => viewProfile(employee)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") viewProfile(employee)
                                }}
                                className="font-semibold text-foreground cursor-pointer truncate hover:text-primary transition-colors"
                                aria-label={`Voir le profil de ${employee.nom || ""} ${employee.prenom || ""}`}
                              >
                                {`${employee.nom || ""} ${employee.prenom || ""}`}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">{employee.telephone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-foreground font-medium">
                          {formatMatricule(employee.id)}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-foreground">
                          {employee.poste?.intitule || "Non assigné"}
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 text-sm text-foreground">
                          {employee.departement?.nom_departement || "Non assigné"}
                        </td>
                        <td className="hidden lg:table-cell px-4 md:px-6 py-4 text-sm text-foreground truncate">
                          {employee.email}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-green-100/30 text-green-700 dark:text-green-400 px-3 py-1 text-xs font-semibold border border-green-200 dark:border-green-800">
                            Actif
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-lg">
                              <DropdownMenuItem onClick={() => viewProfile(employee)} className="cursor-pointer">
                                Voir le profil
                              </DropdownMenuItem>
                              {permissions.canEdit("employes") && (
                                <DropdownMenuItem onClick={() => handleEdit(employee)} className="cursor-pointer">
                                  Modifier
                                </DropdownMenuItem>
                              )}
                              {permissions.canDelete("employes") && (
                                <DropdownMenuItem
                                  className="text-destructive cursor-pointer"
                                  onClick={() => requestDelete(employee.id)}
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Profil de l'employé</DialogTitle>
              <DialogDescription>Informations détaillées de l'employé sélectionné</DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-6 mt-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <UserAvatar user={selectedEmployee} size="lg" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{`${selectedEmployee.nom} ${selectedEmployee.prenom}`}</h3>
                    <p className="text-sm text-primary font-semibold">
                      {selectedEmployee.poste?.intitule || "Non assigné"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.departement?.nom_departement || "Non assigné"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="text-foreground font-medium">{selectedEmployee.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Téléphone</p>
                    <p className="text-foreground font-medium">{selectedEmployee.telephone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date de naissance
                    </p>
                    <p className="text-foreground font-medium">
                      {selectedEmployee.date_naissance
                        ? new Date(selectedEmployee.date_naissance).toLocaleDateString("fr-FR")
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date d'embauche
                    </p>
                    <p className="text-foreground font-medium">
                      {selectedEmployee.date_embauche
                        ? new Date(selectedEmployee.date_embauche).toLocaleDateString("fr-FR")
                        : "-"}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adresse</p>
                    <p className="text-foreground font-medium">{selectedEmployee.adresse || "-"}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-border">
                  <Button variant="outline" onClick={() => setProfileDialogOpen(false)} className="rounded-lg">
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                {selectedEmployees.size > 0
                  ? `Êtes-vous sûr de vouloir supprimer ${selectedEmployees.size} employé(s) ? Cette action est irréversible.`
                  : "Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="rounded-lg">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="rounded-lg bg-destructive hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
