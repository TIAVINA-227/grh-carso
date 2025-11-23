// //frontend/src/pages/Employes.jsx
import { useState, useEffect } from "react";
import { Search, Download, Filter, MoreHorizontal, ChevronDown, Plus, Trash2, Users, DollarSign, Upload, AlertCircle } from "lucide-react";

import { pdf } from '@react-pdf/renderer';
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getEmployes,
  createEmploye,
  updateEmploye,
  deleteEmploye,
  getDepartements,
  getPostes,
} from "@/services/employeService";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from "@/hooks/usePermissions";
import EmployeePDFDocument from "@/exportPdf/EmployeePDFDocument.jsx";
import logoDroite from "@/assets/carso 1.png";

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
    } catch {
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

    // Calculer les statistiques
  const stats = {
    total: employees.reduce((sum, p) => sum + p.montant, 0),
    count: employees.length,
    moyenne: employees.length > 0 ? employees.reduce((sum, p) => sum + p.montant, 0) / employees.length : 0,
    moisCourant: employees.filter(p => {
      const date = new Date(p.date_paiement);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + p.montant, 0)
  };
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

  const exportToPDF = async () => {
    try {
      toast.info("Génération du PDF en cours...")
      
      // Trier les employés par ID
      const sortedEmployees = [...filteredEmployees].sort((a, b) => a.id - b.id)

      // Générer le document PDF
      const blob = await pdf(
        <EmployeePDFDocument 
          employees={sortedEmployees} 
          logoUrl={logoDroite}
        />
      ).toBlob()

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'liste_employes.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

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
        {/* Header Section */}
        <div className="mb-8">
          <div className="mx-auto max-w-7xl ">
                    <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-teal-500/10"></div>
                      <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-600 shadow-2xl shadow-blue-500/30">
                            <Users className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                              Gestion des Employés
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2">Gérez les informations de vos employés de manière efficace</p>
                          </div>
                        </div>
                        <Separator className="my-4 bg-border/40" />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            {stats.count} paiement{stats.count > 1 ? 's' : ''} au total
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={exportToPDF}
                              className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Exporter PDF
                            </button>
            
                             {permissions.canCreate && permissions.canCreate('employes') ? (
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                                            >
                                  <Plus className="h-4 w-4" />
                                      Nouvel Employé
                            </button>
                              ) : null}
                          </div>
                        </div>
                      </div>
              {permissions.canCreate("employes") && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {/* <DialogTrigger asChild>
                  <Button className="gap-2 h-11 md:h-auto">
                    <Plus className="h-5 w-5" /> Nouvel Employé
                  </Button>
                </DialogTrigger> */}
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
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="bg-muted/50 p-6 md:p-8 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Liste des Employés
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{filteredEmployees.length} employé{filteredEmployees.length > 1 ? 's' : ''} trouvé{filteredEmployees.length > 1 ? 's' : ''}</p>
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
                  <th className="px-4 md:px-6 py-4">
                    <span className="sr-only">Statut</span>
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
              {selectedEmployees.size > 0
                ? `Êtes-vous sûr de vouloir supprimer ${selectedEmployees.size} employé(s) ? Cette action ne peut pas être annulée.`
                : "Êtes-vous sûr de vouloir supprimer cet employé ? Cette action ne peut pas être annulée."}
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
      </div>
    </div>
  )
}