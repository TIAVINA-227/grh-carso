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
import {
  Trash2,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast"; // ✅ Import du système de toasts

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // ✅ Pour gérer la confirmation
  const { toast } = useToast(); // ✅ Hook pour les notifications

  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: "employe",
  });

  // 🔄 Charger les utilisateurs
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

  // 🗑️ Supprimer un utilisateur (après confirmation)
  const confirmerSuppression = async () => {
    if (!userToDelete) return;
    try {
      await utilisateurService.deleteUtilisateur(userToDelete.id);
      setUtilisateurs((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      toast({
        title: "✅ Suppression réussie",
        description: "L’utilisateur a été supprimé avec succès.",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  // ➕ Ajouter un utilisateur
  const ajouterUtilisateur = async (e) => {
    e.preventDefault();
    try {
      const user = await utilisateurService.createUtilisateur(newUser);
      setUtilisateurs((prev) => [...prev, user]);
      setOpen(false);
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "employe",
      });
      toast({
        title: "✅ Utilisateur ajouté",
        description: `${user.prenom} ${user.nom} a été ajouté avec succès.`,
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "❌ Erreur de suppression",
        description: "Impossible d’ajouter l’utilisateur.",
        variant: "destructive",
      });
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

            {/* ➕ Bouton d’ajout */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-1" /> Ajouter
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-gray-50 text-black border-gray-800">
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations ci-dessous.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={ajouterUtilisateur}
                  className="flex flex-col gap-3 mt-3"
                >
                  <div>
                    <Label>Nom</Label>
                    <Input
                      value={newUser.nom}
                      onChange={(e) =>
                        setNewUser({ ...newUser, nom: e.target.value })
                      }
                      placeholder="Nom"
                      required
                    />
                  </div>
                  <div>
                    <Label>Prénom</Label>
                    <Input
                      value={newUser.prenom}
                      onChange={(e) =>
                        setNewUser({ ...newUser, prenom: e.target.value })
                      }
                      placeholder="Prénom"
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
                      placeholder="exemple@mail.com"
                      required
                    />
                  </div>
                  <div>
                    <Label>Mot de passe</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      placeholder="Mot de passe"
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
                      <SelectTrigger className="bg-gray-200">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employe">Employé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Ajouter
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground flex items-center gap-2">
              <Spinner className="w-5 h-5 animate-spin" />
              Chargement des utilisateurs...
            </p>
          ) : error ? (
            <p className="text-red-500">Erreur : {error}</p>
          ) : utilisateurs.length === 0 ? (
            <p className="text-muted-foreground">Aucun utilisateur trouvé.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utilisateurs.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.avatar || "/avatars/shadcn.jpg"} />
                        <AvatarFallback>
                          {u.prenom?.[0]}
                          {u.nom?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {u.employe?.prenom || "—"} {u.employe?.nom || ""}

                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.role === "superadmin"
                            ? "destructive"
                            : u.role === "admin"
                            ? "default"
                            : "outline"
                        }
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setUserToDelete(u)}
                      >
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

      {/* 🧱 Modale de confirmation de suppression */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-semibold">
                {userToDelete?.prenom} {userToDelete?.nom}
              </span>{" "}
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmerSuppression}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
