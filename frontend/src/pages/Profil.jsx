// // frontend/src/pages/Profil.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
// import { Badge } from "../components/ui/badge";
// import { toast } from "sonner";
// import { 
//   Camera, 
//   Palette, 
//   Save, 
//   Edit, 
//   Mail, 
//   Phone, 
//   Calendar, 
//   MapPin,
//   User,
//   Briefcase
// } from "lucide-react";

// const COULEURS_COUVERTURE = [
//   { nom: "Bleu", valeur: "#125dd6ff" },
//   { nom: "Violet", valeur: "#8B5CF6" },
//   { nom: "Rose", valeur: "#EC4899" },
//   { nom: "Orange", valeur: "#F97316" },
//   { nom: "Vert", valeur: "#10B981" },
//   { nom: "Indigo", valeur: "#6366F1" },
//   { nom: "Rouge", valeur: "#EF4444" },
//   { nom: "Cyan", valeur: "#06B6D4" },
// ];

// export default function ProfilPage() {
//   const { user, updateUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showColorPicker, setShowColorPicker] = useState(false);
  
//   const [profil, setProfil] = useState({
//     nom_utilisateur: "",
//     prenom_utilisateur: "",
//     email: "",
//     telephone: "",
//     bio: "",
//     date_naissance: "",
//     adresse: "",
//     ville: "",
//     pays: "",
//     avatar: null,
//     photo_couverture: "#3B82F6"
//   });

//   // Charger les données du profil
//   useEffect(() => {
//     if (user) {
//       fetchProfil();
//     }
//   }, [user]);

//   const fetchProfil = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setProfil({
//           nom_utilisateur: data.nom_utilisateur || "",
//           prenom_utilisateur: data.prenom_utilisateur || "",
//           email: data.email || "",
//           telephone: data.telephone || "",
//           bio: data.bio || "",
//           date_naissance: data.date_naissance ? data.date_naissance.split('T')[0] : "",
//           adresse: data.adresse || "",
//           ville: data.ville || "",
//           pays: data.pays || "",
//           avatar: data.avatar || null,
//           photo_couverture: data.photo_couverture || "#3B82F6"
//         });
//       }
//     } catch (error) {
//       console.error("Erreur chargement profil:", error);
//       toast.error("Impossible de charger le profil");
//     }
//   };

//   const handleChange = (e) => {
//     setProfil({
//       ...profil,
//       [e.target.name]: e.target.value
//     });
//   };
  
//   // ✅ Fonction pour compresser l'image
// const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = (e) => {
//       const img = new Image();
      
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         let width = img.width;
//         let height = img.height;
        
//         // Calculer les nouvelles dimensions
//         if (width > height) {
//           if (width > maxWidth) {
//             height = Math.round((height * maxWidth) / width);
//             width = maxWidth;
//           }
//         } else {
//           if (height > maxHeight) {
//             width = Math.round((width * maxHeight) / height);
//             height = maxHeight;
//           }
//         }
        
//         canvas.width = width;
//         canvas.height = height;
        
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, width, height);
        
//         // Convertir en base64 avec compression
//         const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
//         resolve(compressedBase64);
//       };
      
//       img.onerror = reject;
//       img.src = e.target.result;
//     };
    
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };

// // ✅ Modifier handleAvatarChange : compresser localement puis uploader au backend (Cloudinary)
// const handleAvatarChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   // Vérifier le type
//   if (!file.type.startsWith('image/')) {
//     toast.error('Veuillez sélectionner une image');
//     return;
//   }

//   // Vérifier la taille brute (max 10MB)
//   if (file.size > 10 * 1024 * 1024) {
//     toast.error("L'image ne doit pas dépasser 10MB");
//     return;
//   }

//   try {
//     // Compresser l'image localement
//     toast.info('Compression de l\'image...');
//     const compressedDataUrl = await compressImage(file, 400, 400, 0.8);

//     // Convertir dataURL en Blob
//     const blob = await (await fetch(compressedDataUrl)).blob();

//     // Préparer le FormData pour l'upload
//     const formData = new FormData();
//     formData.append('avatar', blob, file.name);

//     // Appeler l'API d'upload (Cloudinary)
//     toast.info('Upload de l\'image...');
//     const res = await fetch('http://localhost:5000/api/upload/avatar', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${user?.token}`
//       },
//       body: formData
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       console.error('Upload retour erreur:', result);
//       throw new Error(result.message || 'Erreur lors de l\'upload');
//     }

//     // Résultat attendu: { success: true, url, public_id }
//     setProfil(prev => ({ ...prev, avatar: result.url }));
//     toast.success('Image uploadée avec succès');

//   } catch (error) {
//     console.error('Erreur upload avatar:', error);
//     toast.error("Erreur lors de l'upload de l'image");
//   }
// };

//   const handleCouvertureChange = (couleur) => {
//     setProfil(prev => ({
//       ...prev,
//       photo_couverture: couleur
//     }));
//     setShowColorPicker(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`
//         },
//         body: JSON.stringify(profil)
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         // Mettre à jour le contexte utilisateur
//         updateUser({
//           nom_utilisateur: data.utilisateur.nom_utilisateur,
//           prenom_utilisateur: data.utilisateur.prenom_utilisateur,
//           avatar: data.utilisateur.avatar
//         });

//         toast.success("✅ Profil mis à jour", {
//           description: "Vos informations ont été enregistrées"
//         });
        
//         setIsEditing(false);
//         fetchProfil(); // Recharger pour être sûr
//       } else {
//         throw new Error("Erreur lors de la mise à jour");
//       }
//     } catch (error) {
//       console.error("Erreur mise à jour profil:", error);
//       toast.error("❌ Erreur", {
//         description: "Impossible de mettre à jour le profil"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initiales pour l'avatar
//   const getInitiales = () => {
//     const prenom = profil.prenom_utilisateur || "";
//     const nom = profil.nom_utilisateur || "";
//     return `${prenom[0] || ''}${nom[0] || ''}`.toUpperCase();
//   };

  

//   return (
//     <div className="p-8 bg-gradient-to-br from-background to-muted dark:from-slate-950 dark:to-slate-900 min-h-screen">
//       {/* En-tête avec photo de couverture */}
//       <div className="relative mb-8">
//         <div 
//           className="h-48 rounded-t-xl relative overflow-hidden"
//           style={{ backgroundColor: profil.photo_couverture }}
//         >
//           {/* Bouton changement de couleur */}
//           {isEditing && (
//             <Button
//               variant="secondary"
//               size="sm"
//               className="absolute top-4 right-4"
//               onClick={() => setShowColorPicker(!showColorPicker)}
//             >
//               <Palette className="w-4 h-4 mr-2" />
//               Changer la couleur
//             </Button>
//           )}

//           {/* Sélecteur de couleur */}
//           {showColorPicker && (
//             <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 grid grid-cols-4 gap-2">
//               {COULEURS_COUVERTURE.map((couleur) => (
//                 <button
//                   key={couleur.valeur}
//                   className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
//                   style={{ backgroundColor: couleur.valeur }}
//                   onClick={() => handleCouvertureChange(couleur.valeur)}
//                   title={couleur.nom}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Avatar et infos principales */}
//         <div className="px-8 -mt-16">
//           <div className="flex items-end gap-6">
//             {/* Avatar */}
//             <div className="relative">
//               <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
//                 {profil.avatar ? (
//                   <AvatarImage src={profil.avatar} alt="Photo de profil" />
//                 ) : (
//                   <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
//                     {getInitiales()}
//                   </AvatarFallback>
//                 )}
//               </Avatar>

//               {/* Bouton upload photo */}
//               {isEditing && (
//                 <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
//                   <Camera className="w-5 h-5 text-gray-600" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                     className="hidden"
//                   />
//                 </label>
//               )}
//             </div>

//             {/* Nom et rôle */}
//             <div className="mb-0">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {profil.prenom_utilisateur} {profil.nom_utilisateur}
//               </h1>
//               <div className="flex items-center gap-2 mt-2">
//                 <Badge variant={user.role === "SUPER_ADMIN" ? "destructive" : user.role === "ADMIN" ? "default" : "outline"}>
//                   {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role === "ADMIN" ? "Admin" : "Employé"}
//                 </Badge>
//                 {profil.email && (
//                   <span className="text-sm text-gray-500 flex items-center gap-1">
//                     <Mail className="w-4 h-4" />
//                     {profil.email}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Bouton édition */}
//             <div className="ml-auto mb-4">
//               {!isEditing ? (
//                 <Button onClick={() => setIsEditing(true)}>
//                   <Edit className="w-4 h-4 mr-2" />
//                   Modifier le profil
//                 </Button>
//               ) : (
//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => {
//                     setIsEditing(false);
//                     fetchProfil();
//                   }}>
//                     Annuler
//                   </Button>
//                   <Button onClick={handleSubmit} disabled={loading}>
//                     <Save className="w-4 h-4 mr-2" />
//                     {loading ? "Enregistrement..." : "Enregistrer"}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Formulaire d'édition */}
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Colonne gauche - Informations personnelles */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="w-5 h-5" />
//                   Informations personnelles
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="prenom_utilisateur">Prénom</Label>
//                     <Input
//                       id="prenom_utilisateur"
//                       name="prenom_utilisateur"
//                       value={profil.prenom_utilisateur}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="nom_utilisateur">Nom</Label>
//                     <Input
//                       id="nom_utilisateur"
//                       name="nom_utilisateur"
//                       value={profil.nom_utilisateur}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="bio">Biographie</Label>
//                   <Textarea
//                     id="bio"
//                     name="bio"
//                     value={profil.bio}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     placeholder="Parlez un peu de vous..."
//                     rows={4}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="telephone" className="flex items-center gap-2">
//                       <Phone className="w-4 h-4" />
//                       Téléphone
//                     </Label>
//                     <Input
//                       id="telephone"
//                       name="telephone"
//                       type="tel"
//                       value={profil.telephone}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                       placeholder="+261 34 00 000 00"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="date_naissance" className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4" />
//                       Date de naissance
//                     </Label>
//                     <Input
//                       id="date_naissance"
//                       name="date_naissance"
//                       type="date"
//                       value={profil.date_naissance}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <MapPin className="w-5 h-5" />
//                   Adresse
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="adresse">Adresse complète</Label>
//                   <Input
//                     id="adresse"
//                     name="adresse"
//                     value={profil.adresse}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     placeholder="123 Rue Example"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="ville">Ville</Label>
//                     <Input
//                       id="ville"
//                       name="ville"
//                       value={profil.ville}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                       placeholder="Antsirabe"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="pays">Pays</Label>
//                     <Input
//                       id="pays"
//                       name="pays"
//                       value={profil.pays}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                       placeholder="Madagascar"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Colonne droite - Statistiques et infos */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5" />
//                   Informations du compte
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label className="text-sm text-gray-500">Email</Label>
//                   <p className="font-medium">{profil.email}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-gray-500">Rôle</Label>
//                   <p className="font-medium">{user.role}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-gray-500">Statut</Label>
//                   <Badge variant="outline" className="mt-1">
//                     Actif
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Actions rapides</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button variant="outline" className="w-full justify-start">
//                   <Edit className="w-4 h-4 mr-2" />
//                   Changer le mot de passe
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Mail className="w-4 h-4 mr-2" />
//                   Notifications
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// frontend/src/pages/Profil.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { 
  Camera, 
  Palette, 
  Save, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  User,
  Briefcase,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

const COULEURS_COUVERTURE = [
  { nom: "Bleu", valeur: "#125dd6ff" },
  { nom: "Violet", valeur: "#8B5CF6" },
  { nom: "Rose", valeur: "#EC4899" },
  { nom: "Orange", valeur: "#F97316" },
  { nom: "Vert", valeur: "#10B981" },
  { nom: "Indigo", valeur: "#6366F1" },
  { nom: "Rouge", valeur: "#EF4444" },
  { nom: "Cyan", valeur: "#06B6D4" },
];

export default function ProfilPage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // États pour le dialogue de changement de mot de passe
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    ancien: false,
    nouveau: false,
    confirmation: false
  });
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmationMotDePasse: ""
  });
  
  const [profil, setProfil] = useState({
    nom_utilisateur: "",
    prenom_utilisateur: "",
    email: "",
    telephone: "",
    bio: "",
    date_naissance: "",
    adresse: "",
    ville: "",
    pays: "",
    avatar: null,
    photo_couverture: "#3B82F6"
  });

  // Charger les données du profil
  useEffect(() => {
    if (user) {
      fetchProfil();
    }
  }, [user]);

  const fetchProfil = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfil({
          nom_utilisateur: data.nom_utilisateur || "",
          prenom_utilisateur: data.prenom_utilisateur || "",
          email: data.email || "",
          telephone: data.telephone || "",
          bio: data.bio || "",
          date_naissance: data.date_naissance ? data.date_naissance.split('T')[0] : "",
          adresse: data.adresse || "",
          ville: data.ville || "",
          pays: data.pays || "",
          avatar: data.avatar || null,
          photo_couverture: data.photo_couverture || "#3B82F6"
        });
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      toast.error("Impossible de charger le profil");
    }
  };

  const handleChange = (e) => {
    setProfil({
      ...profil,
      [e.target.name]: e.target.value
    });
  };
  
  // Fonction pour compresser l'image
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 10MB");
      return;
    }

    try {
      toast.info('Compression de l\'image...');
      const compressedDataUrl = await compressImage(file, 400, 400, 0.8);

      const blob = await (await fetch(compressedDataUrl)).blob();

      const formData = new FormData();
      formData.append('avatar', blob, file.name);

      toast.info('Upload de l\'image...');
      const res = await fetch('http://localhost:5000/api/upload/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`
        },
        body: formData
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Upload retour erreur:', result);
        throw new Error(result.message || 'Erreur lors de l\'upload');
      }

      setProfil(prev => ({ ...prev, avatar: result.url }));
      toast.success('Image uploadée avec succès');

    } catch (error) {
      console.error('Erreur upload avatar:', error);
      toast.error("Erreur lors de l'upload de l'image");
    }
  };

  const handleCouvertureChange = (couleur) => {
    setProfil(prev => ({
      ...prev,
      photo_couverture: couleur
    }));
    setShowColorPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(profil)
      });

      if (response.ok) {
        const data = await response.json();
        
        updateUser({
          nom_utilisateur: data.utilisateur.nom_utilisateur,
          prenom_utilisateur: data.utilisateur.prenom_utilisateur,
          avatar: data.utilisateur.avatar
        });

        toast.success("✅ Profil mis à jour", {
          description: "Vos informations ont été enregistrées"
        });
        
        setIsEditing(false);
        fetchProfil();
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      toast.error("❌ Erreur", {
        description: "Impossible de mettre à jour le profil"
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion du changement de mot de passe
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordForm = () => {
    if (!passwordData.ancienMotDePasse) {
      toast.error("Veuillez saisir votre ancien mot de passe");
      return false;
    }
    
    if (!passwordData.nouveauMotDePasse) {
      toast.error("Veuillez saisir un nouveau mot de passe");
      return false;
    }
    
    if (passwordData.nouveauMotDePasse.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    
    if (passwordData.nouveauMotDePasse !== passwordData.confirmationMotDePasse) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }
    
    if (passwordData.ancienMotDePasse === passwordData.nouveauMotDePasse) {
      toast.error("Le nouveau mot de passe doit être différent de l'ancien");
      return false;
    }
    
    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setPasswordLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ancienMotDePasse: passwordData.ancienMotDePasse,
          nouveauMotDePasse: passwordData.nouveauMotDePasse
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Mot de passe modifié", {
          description: "Votre mot de passe a été changé avec succès"
        });
        
        // Réinitialiser le formulaire et fermer le dialogue
        setPasswordData({
          ancienMotDePasse: "",
          nouveauMotDePasse: "",
          confirmationMotDePasse: ""
        });
        setShowPasswordDialog(false);
      } else {
        toast.error("❌ Erreur", {
          description: data.message || "Mot de passe incorrect ou erreur serveur"
        });
      }
    } catch (error) {
      console.error("Erreur changement mot de passe:", error);
      toast.error("❌ Erreur", {
        description: "Impossible de changer le mot de passe"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitiales = () => {
    const prenom = profil.prenom_utilisateur || "";
    const nom = profil.nom_utilisateur || "";
    return `${prenom[0] || ''}${nom[0] || ''}`.toUpperCase();
  };

  return (
    <Card className="border shadow-2xl rounded-2xl overflow-hidden bg-card backdrop-blur-xl">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-muted dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* En-tête avec photo de couverture */}
      <div className="relative mb-8">
        <div 
          className="h-48 rounded-t-xl relative overflow-hidden"
          style={{ backgroundColor: profil.photo_couverture }}
        >
          {isEditing && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="w-4 h-4 mr-2" />
              Changer la couleur
            </Button>
          )}

          {showColorPicker && (
            <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 grid grid-cols-4 gap-2">
              {COULEURS_COUVERTURE.map((couleur) => (
                <button
                  key={couleur.valeur}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: couleur.valeur }}
                  onClick={() => handleCouvertureChange(couleur.valeur)}
                  title={couleur.nom}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-8 -mt-16">
          <div className="flex items-end gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                {profil.avatar ? (
                  <AvatarImage src={profil.avatar} alt="Photo de profil" />
                ) : (
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitiales()}
                  </AvatarFallback>
                )}
              </Avatar>

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                {profil.prenom_utilisateur} {profil.nom_utilisateur}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === "SUPER_ADMIN" ? "destructive" : user.role === "ADMIN" ? "default" : "outline"}>
                  {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role === "ADMIN" ? "Admin" : "Employé"}
                </Badge>
                {profil.email && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profil.email}
                  </span>
                )}
              </div>
            </div>

            <div className="ml-auto mb-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    fetchProfil();
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom_utilisateur">Prénom</Label>
                    <Input
                      id="prenom_utilisateur"
                      name="prenom_utilisateur"
                      value={profil.prenom_utilisateur}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom_utilisateur">Nom</Label>
                    <Input
                      id="nom_utilisateur"
                      name="nom_utilisateur"
                      value={profil.nom_utilisateur}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profil.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Parlez un peu de vous..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telephone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={profil.telephone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+261 34 00 000 00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_naissance" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date de naissance
                    </Label>
                    <Input
                      id="date_naissance"
                      name="date_naissance"
                      type="date"
                      value={profil.date_naissance}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="adresse">Adresse complète</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={profil.adresse}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="123 Rue Example"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      name="ville"
                      value={profil.ville}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Antsirabe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pays">Pays</Label>
                    <Input
                      id="pays"
                      name="pays"
                      value={profil.pays}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Madagascar"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Statistiques et infos */}
          <div className="space-y-6">
            <Card className="h-[325px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-medium">{profil.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Rôle</Label>
                  <p className="font-medium">{user.role}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Statut</Label>
                  <Badge variant="outline" className="mt-1">
                    Actif
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="h-[225px]">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
                <Button type="button" variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Dialog de changement de mot de passe */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Changer le mot de passe
            </DialogTitle>
            <DialogDescription>
              Saisissez votre ancien mot de passe puis votre nouveau mot de passe.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
            {/* Ancien mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="ancienMotDePasse">Ancien mot de passe</Label>
              <div className="relative">
                <Input
                  id="ancienMotDePasse"
                  name="ancienMotDePasse"
                  type={showPasswords.ancien ? "text" : "password"}
                  value={passwordData.ancienMotDePasse}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('ancien')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.ancien ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="nouveauMotDePasse">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="nouveauMotDePasse"
                  name="nouveauMotDePasse"
                  type={showPasswords.nouveau ? "text" : "password"}
                  value={passwordData.nouveauMotDePasse}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('nouveau')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.nouveau ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">Minimum 6 caractères</p>
            </div>

            {/* Confirmation mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="confirmationMotDePasse">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmationMotDePasse"
                  name="confirmationMotDePasse"
                  type={showPasswords.confirmation ? "text" : "password"}
                  value={passwordData.confirmationMotDePasse}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmation')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirmation ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordData({
                    ancienMotDePasse: "",
                    nouveauMotDePasse: "",
                    confirmationMotDePasse: ""
                  });
                }}
                disabled={passwordLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>Changement en cours...</>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </Card>
  );
}