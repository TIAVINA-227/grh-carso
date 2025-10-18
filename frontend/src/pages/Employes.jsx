
import { useState, useEffect } from "react"
import { Search, Download, Filter, MoreHorizontal, ChevronDown, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogTitle, DialogTrigger, DialogHeader, DialogOverlay, DialogPortal } from "../components/ui/dialog"
import employeService, { getEmployes, createEmploye } from "../services/employeService"


// employees loaded from API

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("Tous les départements")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    date_naissance: "",
    date_embauche: "",
    poste: "",
    departement: "",
    salaire: "",
    statut: "actif",
  })
    // Note: individual inputs use inline onChange handlers. Removed unused handleChange.

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
          date_embauche: formData.date_embauche || null,
          date_naissance: formData.date_naissance || null,
          poste: formData.poste,
          departement: formData.departement,
          salaire: formData.salaire ? Number(formData.salaire) : undefined,
          statut: formData.statut?.toUpperCase?.() || 'ACTIF'
        }

  const res = await createEmploye(payload)
  console.log('Employé créé', res)
        setIsDialogOpen(false)
  // refresh list
  await loadEmployees()
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          date_naissance: "",
          date_embauche: "",
          poste: "",
          departement: "",
          salaire: "",
          statut: "actif",
        })
      } catch (err) {
        console.error(err)
        setErrorMessage(err.message || 'Erreur lors de la création')
      } finally {
        setSubmitting(false)
      }
      }

    // load employees (outside of submit)
    const loadEmployees = async () => {
      setLoading(true)
      try {
        const data = await getEmployes()
        // API returns either { data: [...] } or [...] depending on implementation
        setEmployees(data.data || data || [])
      } catch (err) {
        console.error('Erreur chargement employés', err)
        setErrorMessage('Impossible de charger les employés')
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      loadEmployees()
    }, [])
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page Header with title and "Nouvel Employé" button */}
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
          <DialogTitle>
            {employeService ? "Modifier l'employé" : "Nouvel employé"}
          </DialogTitle>
          <DialogDescription>
            {employeService
              ? "Modifiez les informations de l'employé"
              : "Ajoutez un nouvel employé à l'entreprise"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
               onChange={(e) => setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de Naissance *</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_embauche">Date d'Embauche *</Label>
              <Input
                id="date_embauche"
                type="date"
                value={formData.date_embauche}
                onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })}
                
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departement">Département *</Label>
              <Select
                value={formData.departement}
                onValueChange={(value) => setFormData({ ...formData, departement: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direction">Direction</SelectItem>
                  <SelectItem value="Développement">Développement</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Ventes">Ventes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poste">Poste *</Label>
              <Select value={formData.poste} onValueChange={(value) => setFormData({ ...formData, poste: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Directeur RH">Directeur RH</SelectItem>
                  <SelectItem value="Chef de Projet">Chef de Projet</SelectItem>
                  <SelectItem value="Développeur Frontend">Développeur Frontend</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Ventes">Ventes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaire">Salaire Annuel (€) *</Label>
              <Input
                id="salaire"
                type="number"
                value={formData.salaire}
                onChange={(e) =>
                  setFormData({ ...formData, salaire: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut *</Label>
              <Select className="w-full border border-gray-300 rounded-md p-2"
                id="statut"
                value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="conge">En congé</SelectItem>
                </SelectContent>
                </Select>
              
            </div>
          </div>

         <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>{getEmployes ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Liste des Employés</h2>
            <p className="mt-1 text-sm text-gray-500">{employees.length} employé(s) trouvé(s)</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, email, matricule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10 pr-4 text-base"
              />
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
                <DropdownMenuItem onClick={() => setSelectedDepartment("Tous les départements")}>
                  Tous les départements
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDepartment("Direction")}>Direction</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDepartment("Développement")}>
                  Développement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDepartment("Marketing")}>Marketing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDepartment("Ventes")}>Ventes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="h-12 gap-2 px-4 bg-transparent">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          {/* Table */}
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
                    {loading && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center">Chargement...</td>
                      </tr>
                    )}

                    {!loading && employees.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center">Aucun employé trouvé</td>
                      </tr>
                    )}

                    {!loading && employees.length > 0 && employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={`${employee.nom} ${employee.prenom}`} />
                              <AvatarFallback>
                                {`${employee.nom || ''} ${employee.prenom || ''}`.trim().split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{`${employee.nom || ''} ${employee.prenom || ''}`}</div>
                              <div className="text-sm text-gray-500">{employee.telephone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{employee.matricule}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{employee.poste}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{employee.departement}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                            {employee.statut || employee.status || 'ACTIF'}
                          </span>
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
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
