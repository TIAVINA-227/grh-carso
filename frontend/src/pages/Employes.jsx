import { useState, useEffect } from "react"
import { Search, Download, Filter, MoreHorizontal, ChevronDown, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu"
import {
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "../components/ui/dialog"
import { 
  getEmployes, 
  createEmploye, 
  updateEmploye, 
  deleteEmploye, 
  getDepartements, 
  getPostes 
} from "../services/employeService"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../components/ui/alert-dialog"
import { toast } from "sonner"

export default function EmployeeList() {
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
  const [confirmEditOpen, setConfirmEditOpen] = useState(false)
  const [selectedEmployeeEdit, setSelectedEmployeeEdit] = useState(null)

  const toInputDate = (iso) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return ''
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    } catch {
      return ''
    }
  }

  const loadEmployes = async () => {
    setLoading(true)
    try {
      const data = await getEmployes()
      setEmployes(data.data || data || [])
    } catch (err) {
      console.error('Erreur chargement employés', err)
      setErrorMessage('Impossible de charger les employés')
    } finally {
      setLoading(false)
    }
  }

  const loadDepartementsAndPostes = async () => {
    try {
      const [departementsData, postesData] = await Promise.all([
        getDepartements(),
        getPostes()
      ])
      setDepartements(departementsData || [])
      setPostes(postesData || [])
    } catch (err) {
      console.error('Erreur chargement départements/postes', err)
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
      } else {
        await createEmploye(payload)
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
      setErrorMessage(err.message || 'Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEmploye = async (id) => {
    setLoading(true)
    try {
      await deleteEmploye(id)
      await loadEmployes()
    } catch (err) {
      console.error('Erreur suppression employé', err)
      setErrorMessage("Impossible de supprimer l'employé")
    } finally {
      setLoading(false)
    }
    localStorage.removeItem("editingEmployeeId")
    toast.success("L'employé a été supprimé avec succès")
    
  }

  const handleEdit = (employee) => {
    setFormData({
      nom: employee.nom || '',
      prenom: employee.prenom || '',
      email: employee.email || '',
      telephone: employee.telephone || '',
      adresse: employee.adresse || '',
      date_naissance: toInputDate(employee.date_naissance),
      date_embauche: toInputDate(employee.date_embauche),
      posteId: employee.posteId ? String(employee.posteId) : '',
      departementId: employee.departementId ? String(employee.departementId) : '',
    })
    setEditingId(employee.id)
    setIsDialogOpen(true)

    localStorage.setItem("editingEmployeeId", employee.id)
    toast.success("Les informations de l'employé sont prêtes à être modifiées")
  }

  const requestDelete = (id) => {
    setSelectedEmployeeId(id)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedEmployeeId) return
    setConfirmDeleteOpen(false)
    await handleDeleteEmploye(selectedEmployeeId)
    setSelectedEmployeeId(null)
  }

  const requestEdit = (employee) => {
    setSelectedEmployeeEdit(employee)
    setConfirmEditOpen(true)
  }

  const confirmEdit = () => {
    if (!selectedEmployeeEdit) return
    handleEdit(selectedEmployeeEdit)
    setConfirmEditOpen(false)
    setSelectedEmployeeEdit(null)
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchQuery === "" ||
      employee.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.matricule.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = selectedDepartment === "Tous les départements" ||
      employee.departement?.nom_departement === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="mt-1 text-base text-gray-500">Gérez les informations de vos employés</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white gap-2">
                <Plus className="h-4 w-4" />
                Nouvel Employé
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Modifier l'employé" : "Nouvel employé"}</DialogTitle>
                <DialogDescription>{editingId ? "Modifiez les informations de l'employé" : "Ajoutez un nouvel employé à l'entreprise"}</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input id="prenom" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input id="nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input id="telephone" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_naissance">Date de Naissance *</Label>
                    <Input id="date_naissance" type="date" value={formData.date_naissance} onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_embauche">Date d'Embauche *</Label>
                    <Input id="date_embauche" type="date" value={formData.date_embauche} onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departement">Département</Label>
                    <Select value={formData.departementId} onValueChange={(value) => setFormData({ ...formData, departementId: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un département" /></SelectTrigger>
                      <SelectContent>
                        {departements.map((dept) => <SelectItem key={dept.id} value={String(dept.id)}>{dept.nom_departement}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poste">Poste</Label>
                    <Select value={formData.posteId} onValueChange={(value) => setFormData({ ...formData, posteId: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un poste" /></SelectTrigger>
                      <SelectContent>
                        {postes.map((poste) => <SelectItem key={poste.id} value={String(poste.id)}>{poste.intitule}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input id="adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} placeholder="Adresse complète" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={submitting}>{editingId ? "Enregistrer" : "Ajouter"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tableau des employés */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Liste des Employés</h2>
            <p className="mt-1 text-sm text-gray-500">{filteredEmployees.length} employé(s) trouvé(s)</p>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input type="text" placeholder="Rechercher par nom, email, matricule..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-12 pl-10 pr-4 text-base" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 gap-2 px-4 bg-transparent">
                  <Filter className="h-4 w-4" />
                  {selectedDepartment}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setSelectedDepartment("Tous les départements")}>Tous les départements</DropdownMenuItem>
                {departements.map((dept) => (
                  <DropdownMenuItem key={dept.id} onClick={() => setSelectedDepartment(dept.nom_departement)}>
                    {dept.nom_departement}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="h-12 gap-2 px-4 bg-transparent">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Employé</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Matricule</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Poste</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Département</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading && <tr><td colSpan={7} className="py-6 text-center">Chargement...</td></tr>}
                {!loading && filteredEmployees.length === 0 && <tr><td colSpan={7} className="py-6 text-center">Aucun employé trouvé</td></tr>}
                {!loading && filteredEmployees.length > 0 && filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={`${employee.nom} ${employee.prenom}`} />
                          <AvatarFallback>{`${employee.nom || ''} ${employee.prenom || ''}`.trim().split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{`${employee.nom || ''} ${employee.prenom || ''}`}</div>
                          <div className="text-sm text-gray-500">{employee.telephone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.matricule}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.poste?.intitule || 'Non assigné'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.departement?.nom_departement || 'Non assigné'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-medium">Actif</span>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => requestEdit(employee)}>Modifier</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => requestDelete(employee.id)}>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AlertDialogs */}
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>Voulez-vous vraiment supprimer cet employé ? Cette action est irréversible.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={confirmEditOpen} onOpenChange={setConfirmEditOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
              <AlertDialogDescription>Voulez-vous modifier les informations de cet employé ?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmEdit} className="bg-black text-white hover:bg-gray-800">Modifier</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}
