// // frontend/src/pages/Utilisateurs.jsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Pencil, Trash2, UserPlus, Search, AlertCircle, Users } from 'lucide-react';
import { toast } from "sonner";
import {
  getUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
} from "../services/utilisateurService";
import { usePermissions } from "../hooks/usePermissions";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

export default function UtilisateursPage() {
  const permissions = usePermissions();
  
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Gestion des Utilisateurs
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les utilisateurs et leurs permissions
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-lg border border-border bg-card">
        <CardHeader className="border-b border-border bg-gradient-to-r from-background/50 to-transparent pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Badge 
              variant={permissions.isSuperAdmin ? "destructive" : "default"}
              className="w-fit"
            >
              {permissions.isSuperAdmin ? "🔐 Super Admin" : "👤 Admin (Lecture)"}
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition"
              />
            </div>

            {permissions.canCreate('utilisateurs') && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all hover:shadow-lg whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block h-8 w-8 border-4 border-border border-t-primary rounded-full"></div>
              <p className="text-muted-foreground mt-3">Chargement des utilisateurs...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          ) : (
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
                  {filteredUsers.map((u) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
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
  );
}
