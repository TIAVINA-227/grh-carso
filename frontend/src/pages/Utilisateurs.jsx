// //frontend/src/pages/Utilisateurs.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
// import { Button } from "../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { Trash2, Pencil, Plus, RefreshCw } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "../components/ui/dialog";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "../components/ui/select";
// import { Spinner } from "@/components/ui/spinner";
// import utilisateurService from "../services/utilisateurService";
// import { useToast } from "@/components/ui/use-toast";
// import { useAuth } from "../hooks/useAuth";
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/alert-dialog";
// import { toast } from "sonner";
// import { Checkbox } from "../components/ui/checkbox";

// export default function UtilisateursPage() {
//   const { user } = useAuth();
//    const permissions = usePermissions();
//   const [utilisateurs, setUtilisateurs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [userToEdit, setUserToEdit] = useState(null);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const { toast } = useToast();
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [selectedUsers, setSelectedUsers] = useState(new Set());

//   const [newUser, setNewUser] = useState({
//     nom: "",
//     prenom: "",
//     email: "",
//     mot_de_passe: "exemplemdp123",
//     nom_utilisateur: "",
//     role: "EMPLOYE",
//   });

//   // Protection accès selon le rôle
//   if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
//     return <div className="p-10 text-center text-lg text-red-700">Vous n'avez pas accès à la gestion des utilisateurs.</div>;
//   }

//   // ✅ Charger la liste
//   const chargerUtilisateurs = async () => {
//     try {
//       setLoading(true);
//       const data = await utilisateurService.getUtilisateurs();
//       setUtilisateurs(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     chargerUtilisateurs();
//   }, []);

//   // ✅ Ajouter
//   const ajouterUtilisateur = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...newUser,
//         nom_utilisateur:
//           newUser.nom_utilisateur?.trim() || newUser.email.trim().toLowerCase(),
//         mot_de_passe: newUser.mot_de_passe?.trim() || "exemplemdp123",
//       };
//       const user = await utilisateurService.createUtilisateur(payload);
//       setUtilisateurs((prev) => [...prev, user]);
//       setOpenAdd(false);
//       setNewUser({ nom: "", prenom: "", email: "", mot_de_passe: "exemplemdp123", nom_utilisateur: "", role: "employe" });
//       toast({
//         title: "✅ Utilisateur ajouté",
//         description: `${user.prenom_utilisateur || user.nom_utilisateur} a été ajouté avec succès.`,
//       });
//     } catch (err) {
//       toast({
//         title: "❌ Erreur",
//         description: err.message ?? "Impossible d’ajouter l’utilisateur.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ✅ Préparer modification
//   const ouvrirModaleModification = (user) => {
//     setUserToEdit(user);
//     setOpenEdit(true);
//   };

//   // ✅ Modifier un utilisateur
//   const modifierUtilisateur = async (e) => {
//     e.preventDefault();
//     try {
//       const updated = await utilisateurService.updateUtilisateur(
//         userToEdit.id,
//         userToEdit
//       );
//       setUtilisateurs((prev) =>
//         prev.map((u) => (u.id === updated.id ? updated : u))
//       );
//       setOpenEdit(false);
//       toast({
//         title: "✅ Mise à jour réussie",
//         description: `${updated.prenom_utilisateur || updated.nom_utilisateur} a été modifié.`,
//       });
//     } catch (err) {
//       toast({
//         title: "❌ Erreur de mise à jour",
//         description: "Impossible de modifier l’utilisateur.",
//         variant: "destructive",
//       });
//     }
//   };

//   const requestDelete = (id) => {
//     setDeleteId(id);
//     setConfirmDeleteOpen(true);
//   };
//   const confirmDelete = async () => {
//     setConfirmDeleteOpen(false);
//     try {
//       if (deleteId) {
//         await utilisateurService.deleteUtilisateur(deleteId);
//         toast.success("Utilisateur supprimé avec succès");
//         setUtilisateurs(prev => prev.filter(u => u.id !== deleteId));
//       } else if (selectedUsers.size > 0) {
//         await Promise.all(Array.from(selectedUsers).map(id => utilisateurService.deleteUtilisateur(id)));
//         toast.success(`${selectedUsers.size} utilisateur(s) supprimé(s)`);
//         setUtilisateurs(prev => prev.filter(u => !selectedUsers.has(u.id)));
//         setSelectedUsers(new Set());
//       }
//     } catch (err) {
//       toast.error("Erreur lors de la suppression.");
//     }
//     setDeleteId(null);
//   };

//   const handleSelectUser = (id) => {
//     setSelectedUsers(prev => {
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
//       setSelectedUsers(new Set(utilisateurs.map(item => item.id)));
//     } else {
//       setSelectedUsers(new Set());
//     }
//   };

//   const requestDeleteSelected = () => {
//     if (selectedUsers.size > 0) {
//       setDeleteId(null);
//       setConfirmDeleteOpen(true);
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen text-gray-900">
//       <Card className="bg-white border-gray-300 shadow-lg">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-semibold flex items-center gap-3">
//             👥 Liste des utilisateurs
//             <Badge variant="secondary">Total : {utilisateurs.length}</Badge>
//           </CardTitle>

//           <div className="flex gap-2">
//             <Button variant="outline" onClick={chargerUtilisateurs}>
//               <RefreshCw className="w-4 h-4 mr-1" /> Actualiser
//             </Button>

//             {/* ➕ Bouton Ajout - Seulement SUPER_ADMIN */}
//             {permissions.canCreate('utilisateurs') && (
//               <Dialog open={openAdd} onOpenChange={setOpenAdd}>
//                 <DialogTrigger asChild>
//                   <Button>
//                     <Plus className="w-4 h-4 mr-1" /> Ajouter
//                   </Button>
//                 </DialogTrigger>
//                 {/* ... contenu du dialog */}
//               </Dialog>
//             )}
//           </div>
//         </CardHeader>

//         <CardContent>
//           {/* Sélection multiple - Seulement SUPER_ADMIN */}
//           {permissions.canDelete('utilisateurs') && selectedUsers.size > 0 && (
//             <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3 border border-blue-200">
//               <div className="text-sm font-medium text-blue-800">
//                 {selectedUsers.size} utilisateur(s) sélectionné(s).
//               </div>
//               <Button
//                 size="sm"
//                 variant="destructive"
//                 onClick={requestDeleteSelected}
//                 className="flex items-center gap-2"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Supprimer la sélection
//               </Button>
//             </div>
//           )}

//           {loading ? (
//             <p className="flex items-center gap-2 text-gray-500">
//               <Spinner className="w-5 h-5 animate-spin" /> Chargement...
//             </p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   {/* Checkbox seulement pour SUPER_ADMIN */}
//                   {permissions.canDelete('utilisateurs') && (
//                     <TableHead className="w-12">
//                       <Checkbox
//                         checked={selectedUsers.size === utilisateurs.length && utilisateurs.length > 0}
//                         onCheckedChange={handleSelectAll}
//                         aria-label="Select all"
//                       />
//                     </TableHead>
//                   )}
//                   <TableHead>ID</TableHead>
//                   <TableHead>Nom complet</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Rôle</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {utilisateurs.map((u) => (
//                   <TableRow key={u.id} data-state={selectedUsers.has(u.id) && "selected"}>
//                     {/* Checkbox seulement pour SUPER_ADMIN */}
//                     {permissions.canDelete('utilisateurs') && (
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedUsers.has(u.id)}
//                           onCheckedChange={() => handleSelectUser(u.id)}
//                           aria-label="Select user"
//                         />
//                       </TableCell>
//                     )}
//                     <TableCell>{u.id}</TableCell>
//                     <TableCell className="flex items-center gap-2">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={u.avatar || "/avatars/shadcn.jpg"} />
//                         <AvatarFallback>
//                           {u.prenom_utilisateur?.[0] || u.nom_utilisateur?.[0]}
//                           {u.nom_utilisateur?.[1] || ''}
//                         </AvatarFallback>
//                       </Avatar>
//                       {u.prenom_utilisateur || u.nom_utilisateur}
//                     </TableCell>
//                     <TableCell>{u.email}</TableCell>
//                     <TableCell>
//                       <Badge variant={u.role === "SUPER_ADMIN" ? "destructive" : u.role === "ADMIN" ? "default" : "outline"}>
//                         {u.role}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="flex gap-2">
//                       {/* Bouton Modifier - SUPER_ADMIN et ADMIN */}
//                       {permissions.canEdit('utilisateurs') && (
//                         <Button 
//                           size="sm" 
//                           variant="outline" 
//                           onClick={() => ouvrirModaleModification(u)}
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </Button>
//                       )}
                      
//                       {/* Bouton Supprimer - Seulement SUPER_ADMIN */}
//                       {permissions.canDelete('utilisateurs') && (
//                         <Button 
//                           size="sm" 
//                           variant="destructive" 
//                           onClick={() => requestDelete(u.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       )}

//                       {/* Si aucune action possible, afficher message */}
//                       {!permissions.canEdit('utilisateurs') && !permissions.canDelete('utilisateurs') && (
//                         <span className="text-sm text-muted-foreground">Lecture seule</span>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* Modales... */}
//     </div>
//   );
// }
// frontend/src/pages/Utilisateurs.jsx
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
import { Pencil, Trash2, UserPlus, Search, AlertCircle } from "lucide-react";
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
      // backend renvoie { success: true, count, utilisateurs }
      setUtilisateurs(data.utilisateurs || data || []);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un utilisateur
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

  // Modifier un utilisateur
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

  // Supprimer un utilisateur
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

  // Gestion de la sélection
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

  // Filtrage
  const filteredUsers = utilisateurs.filter(
    (u) =>
      u.nom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.prenom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vérifier les permissions d'accès
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
    <div className="p-8 bg-gradient-to-br bg-background dark:bg-slate-950 min-h-screen">
      <Card className="bg-card dark:bg-slate-900 border-2 border-blue-50 dark:border-blue-900/30 shadow-xl">
        <CardHeader className="border-b border-border bg-gradient-to-r from-card dark:from-slate-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              Gestion des Utilisateurs
            </CardTitle>
            
            {/* Badge du rôle */}
            <Badge variant={permissions.isSuperAdmin ? "destructive" : "default"}>
              {permissions.isSuperAdmin && "Super Admin"}
              {permissions.isAdmin && "Admin (Lecture seule)"}
            </Badge>
          </div>

          <div className="mt-4 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-500" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background dark:bg-slate-800 text-foreground dark:text-white border-border"
              />
            </div>

            {permissions.canCreate('utilisateurs') && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.size === utilisateurs.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    data-state={selectedUsers.has(u.id) && "selected"}
                  >
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
                          {u.prenom_utilisateur?.[0] || u.nom_utilisateur?.[0]}
                          {u.nom_utilisateur?.[1] || ""}
                        </AvatarFallback>
                      </Avatar>
                      {u.prenom_utilisateur || u.nom_utilisateur}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.role === "SUPER_ADMIN"
                            ? "destructive"
                            : u.role === "ADMIN"
                            ? "default"
                            : "outline"
                        }
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      
                      {permissions.canEdit('utilisateurs') && (
                        <Button size="sm" variant="outline" onClick={() => ouvrirModaleModification(u)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {permissions.canDelete('utilisateurs') && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => requestDelete(u.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={ajouterUtilisateur}>
            <div className="space-y-4">
              <div>
                <Label>Prénom</Label>
                <Input
                  value={newUser.prenom}
                  onChange={(e) =>
                    setNewUser({ ...newUser, prenom: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Nom</Label>
                <Input
                  value={newUser.nom}
                  onChange={(e) =>
                    setNewUser({ ...newUser, nom: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Rôle</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EMPLOYE">Employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Modification */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={modifierUtilisateur}>
              <div className="space-y-4">
                <div>
                  <Label>Nom d'utilisateur</Label>
                  <Input
                    value={editingUser.nom_utilisateur}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        nom_utilisateur: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={editingUser.prenom_utilisateur || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        prenom_utilisateur: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EMPLOYE">Employé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Suppression */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmerSuppression}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}