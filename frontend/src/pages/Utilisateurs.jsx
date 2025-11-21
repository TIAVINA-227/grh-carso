// // frontend/src/pages/Utilisateurs.jsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Pencil, Trash2, UserPlus, Search, AlertCircle, Users, Plus, Edit, Eye, CheckCircle, Clock, Shield } from 'lucide-react';
import { toast } from "sonner";
import {
  getUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
} from "../services/utilisateurService";
import { usePermissions } from "../hooks/usePermissions";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

export default function UtilisateursPage() {
  const permissions = usePermissions();
  
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  // Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Formulaires
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "exemplemdp123",
    nom_utilisateur: "",
    role: "SUPER_ADMIN",
  });

  //statistiques
  const stats = {
    total: utilisateurs.length,
  };
  
  const [editingUser, setEditingUser] = useState(null);

  // Charger les utilisateurs
  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const chargerUtilisateurs = async () => {
    try {
      setLoading(true);
      const data = await getUtilisateurs();
      setUtilisateurs(data.utilisateurs || data || []);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };


  const ajouterUtilisateur = async (e) => {
    e.preventDefault();
    
    if (!permissions.canCreate('utilisateurs')) {
      toast.error("Vous n'avez pas la permission de créer des utilisateurs");
      return;
    }

    try {
      const utilisateurData = {
        nom_utilisateur: newUser.nom_utilisateur || newUser.email,
        prenom_utilisateur: newUser.prenom,
        email: newUser.email,
        mot_de_passe: newUser.mot_de_passe,
        role: newUser.role,
        statut: "ACTIF",
      };

      const user = await createUtilisateur(utilisateurData);
      setUtilisateurs([...utilisateurs, user]);
      setShowAddModal(false);
      
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "exemplemdp123",
        nom_utilisateur: "",
        role: "SUPER_ADMIN",
      });

      toast.success("✅ Utilisateur ajouté", {
        description: `${user.prenom_utilisateur || user.nom_utilisateur} a été ajouté avec succès.`,
      });
    } catch (error) {
      console.error("Erreur création utilisateur:", error);
      toast.error("Échec de la création", {
        description: error.message || "Une erreur est survenue",
      });
    }
  };

    // Ouvrir le dialog en mode création
  const openCreateDialog = () => {
    resetForm();
    setShowAddModal(true);
  };
 
  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewUser({ 
      nom: "",
      prenom: "",
      email: "",
      mot_de_passe: "exemplemdp123",
      nom_utilisateur: "",
      role: "SUPER_ADMIN",
    });
  };



  const modifierUtilisateur = async (e) => {
    e.preventDefault();
    
    if (!permissions.canUpdate('utilisateurs')) {
      toast.error("Vous n'avez pas la permission de modifier des utilisateurs");
      return;
    }

    try {
      const dataToUpdate = {
        nom_utilisateur: editingUser.nom_utilisateur,
        prenom_utilisateur: editingUser.prenom_utilisateur,
        email: editingUser.email,
        role: editingUser.role,
      };

      const updated = await updateUtilisateur(editingUser.id, dataToUpdate);
      setUtilisateurs(
        utilisateurs.map((u) => (u.id === editingUser.id ? updated : u))
      );
      setShowEditModal(false);
      setEditingUser(null);

      toast.success("✅ Mise à jour réussie", {
        description: `${updated.prenom_utilisateur || updated.nom_utilisateur} a été modifié.`,
      });
    } catch (error) {
      console.error("Erreur modification utilisateur:", error);
      toast.error("Échec de la modification", {
        description: error.message || "Une erreur est survenue",
      });
    }
  };


  const confirmerSuppression = async () => {
    if (!permissions.canDelete('utilisateurs')) {
      toast.error("Vous n'avez pas la permission de supprimer des utilisateurs");
      return;
    }

    try {
      await deleteUtilisateur(userToDelete);
      setUtilisateurs(utilisateurs.filter((u) => u.id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
      toast.success("🗑️ Utilisateur supprimé");
    } catch (error) {
      console.error("Erreur suppression utilisateur:", error);
      toast.error("Échec de la suppression", {
        description: error.message || "Une erreur est survenue",
      });
    }
  };

  const requestDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const ouvrirModaleModification = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSelectUser = (id) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedUsers(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === utilisateurs.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(utilisateurs.map((u) => u.id)));
    }
  };

  const filteredUsers = utilisateurs.filter(
    (u) =>
      u.nom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.prenom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!permissions.canAccess('utilisateurs')) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès refusé</AlertTitle>
          <AlertDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header moderne */}
        <div className="relative overflow-hidden rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-cyan-500/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl shadow-blue-500/30">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Gestion des Utilisateurs
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                   Gérez les comptes et permissions des utilisateurs</p>
              </div>
            </div>
            <Separator className="my-4 bg-border/40" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {stats.total} utilisateur{stats.total > 1 ? 's' : ''} au total
              </div>
              <div className="flex items-center gap-2">
                {/* Bouton Nouvelle demande - visible pour tous les rôles qui peuvent créer OU pour les employés */}
                {permissions.canCreate('utilisateurs') && (
                  <button
                    onClick={openCreateDialog}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                      Nouvelle Utilisateur 
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-primary text-primary-foreground">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-primary-foreground/80 text-sm font-medium">Total Utilisateurs</p>
                <Users className="w-8 h-8 text-primary-foreground/80" />
              </div>
              <p className="text-4xl font-bold">{utilisateurs.length}</p>
              <div className="flex items-center gap-1 mt-2 text-primary-foreground/80 text-xs">
                <Users className="w-3 h-3" />
                <span>Actifs</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white dark:from-emerald-600 dark:to-emerald-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-emerald-100 text-sm font-medium">Administrateurs</p>
                <Shield className="w-8 h-8 text-white/80" />
              </div>
              <p className="text-4xl font-bold">{utilisateurs.filter(u => u.role === "ADMIN").length}</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-100 text-xs">
                <Shield className="w-3 h-3" />
                <span>Admins</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm font-medium">Super Admin</p>
                <Shield className="w-8 h-8 text-white/80" />
              </div>
              <p className="text-4xl font-bold">{utilisateurs.filter(u => u.role === "SUPER_ADMIN").length}</p>
              <div className="flex items-center gap-1 mt-2 text-blue-100 text-xs">
                <Shield className="w-3 h-3" />
                <span>Super Admins</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
          <CardHeader className="border-b bg-muted/50 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Liste des Utilisateurs</h2>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input h-11 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>

            <Separator className="my-6" />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-12 px-4 py-4">
                      <Checkbox
                        checked={selectedUsers.size === utilisateurs.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="px-4 py-4 font-semibold text-foreground">ID</TableHead>
                    <TableHead className="px-4 py-4 font-semibold text-foreground">Utilisateur</TableHead>
                    <TableHead className="px-4 py-4 font-semibold text-foreground">Email</TableHead>
                    <TableHead className="px-4 py-4 font-semibold text-foreground">Rôle</TableHead>
                    <TableHead className="px-4 py-4 font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="6" className="text-center py-8">
                        <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow
                        key={u.id}
                        data-state={selectedUsers.has(u.id) && "selected"}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="px-4 py-4">
                          <Checkbox
                            checked={selectedUsers.has(u.id)}
                            onCheckedChange={() => handleSelectUser(u.id)}
                            aria-label="Select user"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                          {u.id}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                              <AvatarImage src={u.avatar || "/avatars/shadcn.jpg"} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {u.prenom_utilisateur?.[0] || u.nom_utilisateur?.[0]}
                                {u.nom_utilisateur?.[1] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                              {u.prenom_utilisateur || u.nom_utilisateur}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-foreground">
                          {u.email}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <Badge
                            variant={
                              u.role === "SUPER_ADMIN"
                                ? "destructive"
                                : u.role === "ADMIN"
                                ? "default"
                                : "outline"
                            }
                            className="font-medium"
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex gap-2">
                            {permissions.canEdit('utilisateurs') && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => ouvrirModaleModification(u)}
                                className="hover:bg-primary/10 hover:text-primary transition"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            )}
                            {permissions.canDelete('utilisateurs') && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => requestDelete(u.id)}
                                className="hover:opacity-90 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[450px] border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="h-4 w-4 text-primary" />
              </div>
              Ajouter un utilisateur
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={ajouterUtilisateur} className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-foreground">Prénom</Label>
              <Input
                value={newUser.prenom}
                onChange={(e) =>
                  setNewUser({ ...newUser, prenom: e.target.value })
                }
                placeholder="Jean"
                required
                className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-foreground">Nom</Label>
              <Input
                value={newUser.nom}
                onChange={(e) =>
                  setNewUser({ ...newUser, nom: e.target.value })
                }
                placeholder="Dupont"
                required
                className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-foreground">Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="jean@example.com"
                required
                className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-foreground">Rôle</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  <SelectItem value="SUPER_ADMIN">🔐 Super Admin</SelectItem>
                  <SelectItem value="ADMIN">👤 Admin</SelectItem>
                  <SelectItem value="EMPLOYE">👥 Employé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Créer l'utilisateur
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[450px] border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              Modifier l'utilisateur
            </DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={modifierUtilisateur} className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Nom d'utilisateur</Label>
                <Input
                  value={editingUser.nom_utilisateur}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      nom_utilisateur: e.target.value,
                    })
                  }
                  required
                  className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Prénom</Label>
                <Input
                  value={editingUser.prenom_utilisateur || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      prenom_utilisateur: e.target.value,
                    })
                  }
                  className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Email</Label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                  className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">Rôle</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger className="mt-1.5 bg-input border border-border focus:ring-2 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    <SelectItem value="SUPER_ADMIN">🔐 Super Admin</SelectItem>
                    <SelectItem value="ADMIN">👤 Admin</SelectItem>
                    <SelectItem value="EMPLOYE">👥 Employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-2 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
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
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button 
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmerSuppression}
              className="hover:opacity-90"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
