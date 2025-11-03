import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Trash2, Pencil, Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import utilisateurService from "../services/utilisateurService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../hooks/useAuth";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";

export default function UtilisateursPage() {
  const { user } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { toast } = useToast();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "changeme123",
    nom_utilisateur: "",
    role: "employe",
  });

  // Protection accès selon le rôle
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <div className="p-10 text-center text-lg text-red-700">Vous n'avez pas accès à la gestion des utilisateurs.</div>;
  }

  // ✅ Charger la liste
  const chargerUtilisateurs = async () => {
    try {
      setLoading(true);
      const data = await utilisateurService.getUtilisateurs();
      setUtilisateurs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  // ✅ Ajouter
  const ajouterUtilisateur = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newUser,
        nom_utilisateur:
          newUser.nom_utilisateur?.trim() || newUser.email.trim().toLowerCase(),
        mot_de_passe: newUser.mot_de_passe?.trim() || "changeme123",
      };
      const user = await utilisateurService.createUtilisateur(payload);
      setUtilisateurs((prev) => [...prev, user]);
      setOpenAdd(false);
      setNewUser({ nom: "", prenom: "", email: "", mot_de_passe: "changeme123", nom_utilisateur: "", role: "employe" });
      toast({
        title: "✅ Utilisateur ajouté",
        description: `${user.prenom} ${user.nom} a été ajouté avec succès.`,
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: err.message ?? "Impossible d’ajouter l’utilisateur.",
        variant: "destructive",
      });
    }
  };

  // ✅ Préparer modification
  const ouvrirModaleModification = (user) => {
    setUserToEdit(user);
    setOpenEdit(true);
  };

  // ✅ Modifier un utilisateur
  const modifierUtilisateur = async (e) => {
    e.preventDefault();
    try {
      const updated = await utilisateurService.updateUtilisateur(
        userToEdit.id,
        userToEdit
      );
      setUtilisateurs((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      setOpenEdit(false);
      toast({
        title: "✅ Mise à jour réussie",
        description: `${updated.prenom} ${updated.nom} a été modifié.`,
      });
    } catch (err) {
      toast({
        title: "❌ Erreur de mise à jour",
        description: "Impossible de modifier l’utilisateur.",
        variant: "destructive",
      });
    }
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };
  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    try {
      if (deleteId) {
        await utilisateurService.deleteUtilisateur(deleteId);
        toast.success("Utilisateur supprimé avec succès");
        setUtilisateurs(prev => prev.filter(u => u.id !== deleteId));
      } else if (selectedUsers.size > 0) {
        await Promise.all(Array.from(selectedUsers).map(id => utilisateurService.deleteUtilisateur(id)));
        toast.success(`${selectedUsers.size} utilisateur(s) supprimé(s)`);
        setUtilisateurs(prev => prev.filter(u => !selectedUsers.has(u.id)));
        setSelectedUsers(new Set());
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
    setDeleteId(null);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => {
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
      setSelectedUsers(new Set(utilisateurs.map(item => item.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedUsers.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-gray-900">
      <Card className="bg-white border-gray-300 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            👥 Liste des utilisateurs
            <Badge variant="secondary">Total : {utilisateurs.length}</Badge>
          </CardTitle>

          <div className="flex gap-2">
            <Button variant="outline" onClick={chargerUtilisateurs}>
              <RefreshCw className="w-4 h-4 mr-1" /> Actualiser
            </Button>

            {/* ➕ Bouton Ajout */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Ajouter
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-gray-50 text-black border-gray-800">
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                </DialogHeader>

                <form onSubmit={ajouterUtilisateur} className="flex flex-col gap-3 mt-3">
                  <Label>Nom</Label>
                  <Input
                    value={newUser.nom}
                    onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                    required
                  />
                  <Label>Prénom</Label>
                  <Input
                    value={newUser.prenom}
                    onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                    required
                  />
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                  <Label>Identifiant (login)</Label>
                  <Input value={newUser.nom_utilisateur} onChange={e => setNewUser({...newUser, nom_utilisateur: e.target.value})} placeholder={newUser.email} />
                  <Label>Mot de passe initial</Label>
                  <Input type="text" value={newUser.mot_de_passe} onChange={e => setNewUser({...newUser, mot_de_passe: e.target.value})} />
                  <Label>Rôle</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="employe">Employé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="mt-3 bg-blue-600 hover:bg-blue-700">
                    Ajouter
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {selectedUsers.size > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3 border border-blue-200">
              <div className="text-sm font-medium text-blue-800">
                {selectedUsers.size} utilisateur(s) sélectionné(s).
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
          {loading ? (
            <p className="flex items-center gap-2 text-gray-500">
              <Spinner className="w-5 h-5 animate-spin" /> Chargement...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.size === utilisateurs.length && utilisateurs.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utilisateurs.map((u) => (
                  <TableRow key={u.id} data-state={selectedUsers.has(u.id) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(u.id)}
                        onCheckedChange={() => handleSelectUser(u.id)}
                        aria-label="Select user"
                      />
                    </TableCell>
                    <TableCell>{u.id}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.avatar || "/avatars/shadcn.jpg"} />
                        <AvatarFallback>
                          {u.prenom?.[0]}{u.nom?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {u.prenom} {u.nom}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "superadmin" ? "destructive" : u.role === "admin" ? "default" : "outline"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => ouvrirModaleModification(u)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => requestDelete(u.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 🧱 Modale de modification */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-gray-50 text-black border-gray-800">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
          </DialogHeader>

          {userToEdit && (
            <form onSubmit={modifierUtilisateur} className="flex flex-col gap-3 mt-3">
              <Label>Nom</Label>
              <Input
                value={userToEdit.nom}
                onChange={(e) => setUserToEdit({ ...userToEdit, nom: e.target.value })}
              />
              <Label>Prénom</Label>
              <Input
                value={userToEdit.prenom}
                onChange={(e) => setUserToEdit({ ...userToEdit, prenom: e.target.value })}
              />
              <Label>Email</Label>
              <Input
                type="email"
                value={userToEdit.email}
                onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
              />
              <Label>Rôle</Label>
              <Select
                value={userToEdit.role}
                onValueChange={(v) => setUserToEdit({ ...userToEdit, role: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employe">Employé</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="mt-3 bg-green-600 hover:bg-green-700">
                Sauvegarder
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 🧱 Modale de confirmation de suppression */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUsers.size > 0
                ? `Êtes-vous sûr de vouloir supprimer ${selectedUsers.size} utilisateur(s) ? Cette action est irréversible.`
                : "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
