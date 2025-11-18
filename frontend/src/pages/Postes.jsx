// //frontend/src/pages/Postes.jsx
// import { useEffect, useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Briefcase, Edit, Trash2, Eye, Upload, FileText, FileSpreadsheet, Download, Search, Calendar, ChevronDown } from "lucide-react";
// import { getPostes, createPoste, updatePoste, deletePoste } from "@/services/posteService";
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
// import { Checkbox } from "@/components/ui/checkbox";

// export default function PostesWithFileStorage() {
//   // États pour les postes
//   const [postes, setPostes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [form, setForm] = useState({ intitule: "", description: "", niveau: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState(null);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [selectedPostes, setSelectedPostes] = useState(new Set());

//   // États pour les fichiers
//   const [files, setFiles] = useState([]);
//   const [filteredFiles, setFilteredFiles] = useState([]);
//   const [importMenuOpen, setImportMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [filesLoading, setFilesLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("postes");
//   const [toast, setToast] = useState(null);

//   const csvInputRef = useRef(null);
//   const pdfInputRef = useRef(null);
//   const docxInputRef = useRef(null);

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//   };

//   const closeToast = () => {
//     setToast(null);
//   };

//   // Auto-fermer le toast après 4 secondes
//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => {
//         setToast(null);
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast]);

//   // Charger les postes au démarrage
//   useEffect(() => {
//     loadPostes();
//     loadFiles();
//   }, []);

//   // Filtrer les fichiers
//   useEffect(() => {
//     let filtered = files;
//     if (filterType !== "all") {
//       filtered = filtered.filter(file => file.type === filterType);
//     }
//     if (searchQuery) {
//       filtered = filtered.filter(file =>
//         file.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     setFilteredFiles(filtered);
//   }, [files, searchQuery, filterType]);

//   // Charger les postes depuis l'API backend
//   const loadPostes = async () => {
//     setLoading(true);
//     try {
//       const data = await getPostes();
//       // getPostes devrait renvoyer un tableau
//       setPostes(Array.isArray(data) ? data : data || []);
//     } catch (err) {
//       console.error('Erreur lors du chargement des postes depuis l\'API', err);
//       showToast("❌ Impossible de charger les postes depuis le serveur", "error");
//       setPostes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les fichiers depuis le stockage
//   // Remplacer les fonctions loadFiles, saveFile et deleteFile par ces versions :

// // Charger les fichiers depuis localStorage
// const loadFiles = async () => {
//   setFilesLoading(true);
//   try {
//     const storedFiles = localStorage.getItem('postes_files');
//     if (storedFiles) {
//       const parsedFiles = JSON.parse(storedFiles);
//       setFiles(parsedFiles.sort((a, b) => b.timestamp - a.timestamp));
//     } else {
//       setFiles([]);
//     }
//   } catch (error) {
//     console.log("Aucun fichier stocké ou erreur de parsing:", error);
//     setFiles([]);
//   } finally {
//     setFilesLoading(false);
//   }
// };

// // Sauvegarder un fichier dans localStorage
// const saveFile = async (fileData) => {
//   try {
//     // Récupérer les fichiers existants
//     const storedFiles = localStorage.getItem('postes_files');
//     const existingFiles = storedFiles ? JSON.parse(storedFiles) : [];
    
//     // Ajouter le nouveau fichier
//     const updatedFiles = [fileData, ...existingFiles];
    
//     // Sauvegarder dans localStorage
//     localStorage.setItem('postes_files', JSON.stringify(updatedFiles));
    
//     return true;
//   } catch (error) {
//     console.error("Erreur lors de la sauvegarde:", error);
    
//     // Si l'erreur est due à la limite de stockage
//     if (error.name === 'QuotaExceededError') {
//       showToast("❌ Espace de stockage insuffisant", "error");
//     }
    
//     return false;
//   }
// };

// // Supprimer un fichier de localStorage
// const deleteFile = async (fileId) => {
//   try {
//     const storedFiles = localStorage.getItem('postes_files');
//     if (storedFiles) {
//       const existingFiles = JSON.parse(storedFiles);
//       const updatedFiles = existingFiles.filter(f => f.id !== fileId);
//       localStorage.setItem('postes_files', JSON.stringify(updatedFiles));
//       setFiles(updatedFiles);
//       showToast("🗑️ Fichier supprimé", "success");
//     }
//   } catch (error) {
//     console.error("Erreur lors de la suppression:", error);
//     showToast("❌ Erreur de suppression", "error");
//   }
// };

//   const openCreate = () => {
//     setEditingId(null);
//     setForm({ intitule: "", description: "", niveau: "" });
//     setIsDialogOpen(true);
//   };

//   const openEdit = (p) => {
//     setEditingId(p.id);
//     setForm({ intitule: p.intitule || "", description: p.description || "", niveau: p.niveau || "" });
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       if (editingId) {
//         await updatePoste(editingId, form);
//         showToast("✅ Poste modifié avec succès", "success");
//       } else {
//         await createPoste(form);
//         showToast("✅ Poste créé avec succès", "success");
//       }
//       setIsDialogOpen(false);
//       await loadPostes();
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Erreur");
//       showToast("❌ Erreur lors de l'enregistrement", "error");
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
//         await deletePoste(deleteId);
//         showToast("🗑️ Poste supprimé avec succès", "success");
//       } else if (selectedPostes.size > 0) {
//         await Promise.all(Array.from(selectedPostes).map(id => deletePoste(id)));
//         showToast(`🗑️ ${selectedPostes.size} poste(s) supprimé(s)`, "success");
//         setSelectedPostes(new Set());
//       }
//       await loadPostes();
//     } catch {
//       showToast("❌ Erreur lors de la suppression", "error");
//     }
//     setDeleteId(null);
//   };

//   const handleSelectPoste = (id) => {
//     setSelectedPostes(prev => {
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
//       setSelectedPostes(new Set(postes.map(item => item.id)));
//     } else {
//       setSelectedPostes(new Set());
//     }
//   };

//   const requestDeleteSelected = () => {
//     if (selectedPostes.size > 0) {
//       setDeleteId(null);
//       setConfirmDeleteOpen(true);
//     }
//   };

//   const getBadgeColor = (niveau) => {
//     const niveauLower = niveau?.toLowerCase() || '';
//     if (niveauLower.includes('junior')) return 'bg-teal-500 text-white';
//     if (niveauLower.includes('intermediaire')) return 'bg-orange-500 text-white';
//     if (niveauLower.includes('senior')) return 'bg-yellow-500 text-black';
//     if (niveauLower.includes('direction')) return 'bg-black text-white';
//     return 'bg-gray-500 text-white';
//   };

//   const getDepartement = (intitule) => {
//     const intituleLower = intitule?.toLowerCase() || '';
//     if (intituleLower.includes('développeur') || intituleLower.includes('developer')) return 'Développement';
//     if (intituleLower.includes('marketing')) return 'Marketing';
//     if (intituleLower.includes('commercial') || intituleLower.includes('vente')) return 'Ventes';
//     if (intituleLower.includes('rh') || intituleLower.includes('directeur')) return 'Direction';
//     if (intituleLower.includes('projet')) return 'Marketing';
//     return 'Général';
//   };

//   // Import CSV pour postes
//   const handleCsvPostesImport = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setImportMenuOpen(false);

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       try {
//         const csv = e.target?.result;
//         if (typeof csv !== 'string') {
//           showToast('❌ Erreur de lecture du fichier', 'error');
//           return;
//         }

//         const lines = csv.split('\n');
//         const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
//         let importedCount = 0;
//         let errorCount = 0;

//         for (let i = 1; i < lines.length; i++) {
//           if (!lines[i].trim()) continue;

//           const values = lines[i].split(',').map(v => v.trim());
//           const row = {};
//           headers.forEach((header, index) => {
//             row[header] = values[index] || '';
//           });

//             try {
//               if (row.intitule) {
//                 await createPoste({
//                   intitule: row.intitule,
//                   description: row.description || '',
//                   niveau: row.niveau || ''
//                 });
//                 importedCount++;
//               }
//             } catch {
//               errorCount++;
//             }
//         }

//         showToast(`✅ ${importedCount} poste(s) importé(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`, 'success');
//         await loadPostes();
//       } catch (error) {
//         showToast('❌ Erreur lors de l\'import du fichier', 'error');
//         console.error(error);
//       }
//     };
//     reader.readAsText(file);
//     event.target.value = "";
//   };

//   // Import fichiers (CSV, PDF, DOCX)
//   const handleFileImport = async (event, fileType) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setImportMenuOpen(false);

//     if (fileType === "csv") {
//       try {
//         const text = await file.text();
//         const newFile = {
//           id: `csv_${Date.now()}`,
//           name: file.name,
//           type: "csv",
//           size: file.size,
//           timestamp: Date.now(),
//           content: text,
//         };
//         const saved = await saveFile(newFile);
//         if (saved) {
//           setFiles([newFile, ...files]);
//           showToast(`✅ Fichier CSV "${file.name}" importé avec succès`, "success");
//         }
//       } catch (error) {
//         showToast("❌ Erreur d'import CSV", "error");
//       }
//     } else if (fileType === "pdf") {
//       if (file.type !== "application/pdf") {
//         showToast("⚠️ Veuillez sélectionner un fichier PDF", "error");
//         event.target.value = "";
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const newFile = {
//           id: `pdf_${Date.now()}`,
//           name: file.name,
//           type: "pdf",
//           size: file.size,
//           timestamp: Date.now(),
//           content: e.target.result,
//         };
//         const saved = await saveFile(newFile);
//         if (saved) {
//           setFiles([newFile, ...files]);
//           showToast(`✅ Fichier PDF "${file.name}" importé avec succès`, "success");
//         }
//       };
//       reader.readAsDataURL(file);
//     } else if (fileType === "docx") {
//       const validTypes = [
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         "application/msword"
//       ];
//       if (!validTypes.includes(file.type)) {
//         showToast("⚠️ Veuillez sélectionner un fichier Word", "error");
//         event.target.value = "";
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const newFile = {
//           id: `docx_${Date.now()}`,
//           name: file.name,
//           type: "docx",
//           size: file.size,
//           timestamp: Date.now(),
//           content: e.target.result,
//         };
//         const saved = await saveFile(newFile);
//         if (saved) {
//           setFiles([newFile, ...files]);
//           showToast(`✅ Fichier Word "${file.name}" importé avec succès`, "success");
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//     event.target.value = "";
//   };

//   const viewFile = (file) => {
//     try {
//       if (file.type === "pdf") {
//         const pdfWindow = window.open();
//         pdfWindow.document.write(`<iframe width='100%' height='100%' src='${file.content}'></iframe>`);
//       } else if (file.type === "docx") {
//         const link = document.createElement("a");
//         link.href = file.content;
//         link.download = file.name;
//         link.click();
//         showToast(`📥 Fichier "${file.name}" téléchargé`, "success");
//       } else if (file.type === "csv") {
//         const blob = new Blob([file.content], { type: "text/csv" });
//         const url = URL.createObjectURL(blob);
//         window.open(url, "_blank");
//       }
//     } catch (error) {
//       showToast("❌ Impossible d'ouvrir le fichier", "error");
//     }
//   };

//   const downloadFile = (file) => {
//     try {
//       const link = document.createElement("a");
//       link.href = file.content;
//       link.download = file.name;
//       link.click();
//       showToast(`✅ Fichier "${file.name}" téléchargé`, "success");
//     } catch (error) {
//       showToast("❌ Erreur de téléchargement", "error");
//     }
//   };

//   const formatSize = (bytes) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
//   };

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString("fr-FR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getFileIcon = (type) => {
//     switch (type) {
//       case "csv":
//         return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
//       case "pdf":
//         return <FileText className="h-8 w-8 text-red-500" />;
//       case "docx":
//         return <FileText className="h-8 w-8 text-blue-500" />;
//       default:
//         return <FileText className="h-8 w-8 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background dark:bg-slate-950 p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Header avec onglets */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-foreground dark:text-white mb-4">
//             Gestion des Postes et Fichiers
//           </h1>
          
//           {/* Onglets */}
//           <div className="flex gap-2 border-b border-border dark:border-slate-700">
//             <button
//               onClick={() => setActiveTab("postes")}
//               className={`px-6 py-3 font-medium transition-colors ${
//                 activeTab === "postes"
//                   ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
//                   : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
//               }`}
//             >
//               <Briefcase className="w-4 h-4 inline mr-2" />
//               Postes ({postes.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("fichiers")}
//               className={`px-6 py-3 font-medium transition-colors ${
//                 activeTab === "fichiers"
//                   ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
//                   : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
//               }`}
//             >
//               <FileText className="w-4 h-4 inline mr-2" />
//               Fichiers ({files.length})
//             </button>
//           </div>
//         </div>

//         {/* Section Postes */}
//         {activeTab === "postes" && (
//           <div>
//             {/* Actions postes */}
//             <div className="mb-6 flex items-center justify-between">
//               <p className="text-sm text-muted-foreground dark:text-gray-400">
//                 Consultez et gérez les postes de l'entreprise
//               </p>
//               <div className="flex gap-2">
//                 <div className="relative">
//                   <Button 
//                     variant="outline"
//                     className="gap-2 border-border dark:border-slate-700"
//                     onClick={() => setImportMenuOpen(!importMenuOpen)}
//                   >
//                     <Upload className="w-4 h-4" />
//                     Importer
//                     <ChevronDown className="w-4 h-4" />
//                   </Button>

//                   {importMenuOpen && (
//                     <>
//                       <div className="fixed inset-0 z-10" onClick={() => setImportMenuOpen(false)} />
//                       <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
//                         <div
//                           onClick={() => csvInputRef.current?.click()}
//                           className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
//                         >
//                           <FileSpreadsheet className="h-5 w-5 text-green-500" />
//                           <div className="text-sm font-medium text-foreground dark:text-white">
//                             Import CSV Postes
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <input
//                     ref={csvInputRef}
//                     type="file"
//                     accept=".csv"
//                     onChange={handleCsvPostesImport}
//                     className="hidden"
//                   />
//                 </div>
                
//                 <Button 
//                   className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
//                   onClick={openCreate}
//                 >
//                   <Plus className="w-4 h-4" />
//                   Nouveau Poste
//                 </Button>
//               </div>
//             </div>

//             {selectedPostes.size > 0 && (
//               <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
//                 <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                   {selectedPostes.size} poste(s) sélectionné(s)
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   onClick={requestDeleteSelected}
//                   className="flex items-center gap-2"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Supprimer
//                 </Button>
//               </div>
//             )}

//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               </div>
//             ) : postes.length === 0 ? (
//               <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg">
//                 <Briefcase className="w-16 h-16 text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">Aucun poste trouvé</h3>
//                 <p className="text-muted-foreground dark:text-gray-400 mb-4">Commencez par créer votre premier poste</p>
//                 <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Créer un poste
//                 </Button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="col-span-full flex items-center p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
//                   <Checkbox
//                     id="select-all"
//                     checked={selectedPostes.size === postes.length && postes.length > 0}
//                     onCheckedChange={handleSelectAll}
//                   />
//                   <label htmlFor="select-all" className="ml-3 text-sm font-medium cursor-pointer">
//                     Tout sélectionner
//                   </label>
//                 </div>
//                 {postes.map((poste) => (
//                   <Card key={poste.id} className={`bg-card dark:bg-slate-900 hover:shadow-lg transition-shadow ${selectedPostes.has(poste.id) ? 'ring-2 ring-blue-500' : ''}`}>
//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                           <Checkbox
//                             checked={selectedPostes.has(poste.id)}
//                             onCheckedChange={() => handleSelectPoste(poste.id)}
//                             className="mt-1"
//                           />
//                           <div className="p-2 bg-muted dark:bg-slate-800 rounded-lg">
//                             <Briefcase className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-foreground dark:text-white text-lg">{poste.intitule}</h3>
//                             <p className="text-sm text-muted-foreground dark:text-gray-400">{getDepartement(poste.intitule)}</p>
//                           </div>
//                         </div>
//                         {poste.niveau && (
//                           <Badge className={`${getBadgeColor(poste.niveau)} text-xs px-2 py-1`}>
//                             {poste.niveau}
//                           </Badge>
//                         )}
//                       </div>
                      
//                       {poste.description && (
//                         <p className="text-foreground/70 dark:text-gray-300 text-sm mb-4 line-clamp-2">
//                           {poste.description}
//                         </p>
//                       )}
                      
//                       <div className="flex gap-2">
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="flex-1"
//                           onClick={() => openEdit(poste)}
//                         >
//                           <Edit className="w-4 h-4 mr-1" />
//                           Modifier
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="flex-1"
//                           onClick={() => requestDelete(poste.id)}
//                         >
//                           <Trash2 className="w-4 h-4 mr-1" />
//                           Supprimer
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Section Fichiers */}
//         {activeTab === "fichiers" && (
//           <div>
//             {/* Actions fichiers */}
//             <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-6">
//               <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//                 <div className="relative">
//                   <Button
//                     onClick={() => setImportMenuOpen(!importMenuOpen)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//                   >
//                     <Upload className="h-4 w-4" />
//                     Importer un fichier
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>

//                   {importMenuOpen && (
//                     <>
//                       <div className="fixed inset-0 z-10" onClick={() => setImportMenuOpen(false)} />
//                       <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
//                         <div
//                           onClick={() => csvInputRef.current?.click()}
//                           className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b dark:border-slate-700"
//                         >
//                           <FileSpreadsheet className="h-5 w-5 text-green-500 mt-1" />
//                           <div>
//                             <div className="font-semibold text-foreground dark:text-white">Fichier CSV</div>
//                             <div className="text-sm text-muted-foreground dark:text-gray-400">
//                               Importer des données tabulaires
//                             </div>
//                           </div>
//                         </div>

//                         <div
//                           onClick={() => pdfInputRef.current?.click()}
//                           className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b dark:border-slate-700"
//                         >
//                           <FileText className="h-5 w-5 text-red-500 mt-1" />
//                           <div>
//                             <div className="font-semibold text-foreground dark:text-white">Fichier PDF</div>
//                             <div className="text-sm text-muted-foreground dark:text-gray-400">
//                               Importer des documents PDF
//                             </div>
//                           </div>
//                         </div>

//                         <div
//                           onClick={() => docxInputRef.current?.click()}
//                           className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
//                         >
//                           <FileText className="h-5 w-5 text-blue-500 mt-1" />
//                           <div>
//                             <div className="font-semibold text-foreground dark:text-white">Fichier Word</div>
//                             <div className="text-sm text-muted-foreground dark:text-gray-400">
//                               Importer des documents .doc/.docx
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <input
//                     ref={csvInputRef}
//                     type="file"
//                     accept=".csv"
//                     onChange={(e) => handleFileImport(e, "csv")}
//                     className="hidden"
//                   />
//                   <input
//                     ref={pdfInputRef}
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) => handleFileImport(e, "pdf")}
//                     className="hidden"
//                   />
//                   <input
//                     ref={docxInputRef}
//                     type="file"
//                     accept=".doc,.docx"
//                     onChange={(e) => handleFileImport(e, "docx")}
//                     className="hidden"
//                   />
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                     <Input
//                       type="text"
//                       placeholder="Rechercher..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="pl-10 w-full sm:w-64"
//                     />
//                   </div>

//                   <select
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                     className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background dark:bg-slate-900 text-foreground dark:text-white"
//                   >
//                     <option value="all">Tous les fichiers</option>
//                     <option value="csv">CSV uniquement</option>
//                     <option value="pdf">PDF uniquement</option>
//                     <option value="docx">Word uniquement</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-foreground dark:text-white">{files.length}</div>
//                   <div className="text-sm text-muted-foreground dark:text-gray-400">Total</div>
//                 </div>
//                 <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                     {files.filter(f => f.type === "csv").length}
//                   </div>
//                   <div className="text-sm text-green-700 dark:text-green-500">CSV</div>
//                 </div>
//                 <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-red-600 dark:text-red-400">
//                     {files.filter(f => f.type === "pdf").length}
//                   </div>
//                   <div className="text-sm text-red-700 dark:text-red-500">PDF</div>
//                 </div>
//                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                     {files.filter(f => f.type === "docx").length}
//                   </div>
//                   <div className="text-sm text-blue-700 dark:text-blue-500">Word</div>
//                 </div>
//               </div>
//             </div>

//             {filesLoading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-4 text-muted-foreground dark:text-gray-400">Chargement des fichiers...</p>
//               </div>
//             ) : filteredFiles.length === 0 ? (
//               <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-12 text-center">
//                 <FileText className="h-16 w-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
//                   Aucun fichier trouvé
//                 </h3>
//                 <p className="text-muted-foreground dark:text-gray-400">
//                   {searchQuery || filterType !== "all"
//                     ? "Aucun fichier ne correspond à vos critères"
//                     : "Commencez par importer des fichiers"}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredFiles.map((file) => (
//                   <Card key={file.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-slate-900">
//                     <CardHeader>
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           {getFileIcon(file.type)}
//                           <div>
//                             <CardTitle className="text-lg line-clamp-1 text-foreground dark:text-white">
//                               {file.name}
//                             </CardTitle>
//                             <CardDescription className="flex items-center gap-2 mt-1">
//                               <span className="uppercase text-xs font-semibold">
//                                 {file.type}
//                               </span>
//                               <span>•</span>
//                               <span>{formatSize(file.size)}</span>
//                             </CardDescription>
//                           </div>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 mb-4">
//                         <Calendar className="h-4 w-4" />
//                         {formatDate(file.timestamp)}
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           onClick={() => viewFile(file)}
//                           variant="outline"
//                           size="sm"
//                           className="flex-1"
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           Voir
//                         </Button>
//                         <Button
//                           onClick={() => downloadFile(file)}
//                           variant="outline"
//                           size="sm"
//                           className="flex-1"
//                         >
//                           <Download className="h-4 w-4 mr-1" />
//                           Télécharger
//                         </Button>
//                         <Button
//                           onClick={() => deleteFile(file.id)}
//                           variant="destructive"
//                           size="sm"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Dialog pour créer/modifier un poste */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] rounded-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-foreground dark:text-white">
//               {editingId ? 'Modifier le Poste' : 'Nouveau Poste'}
//             </DialogTitle>
//             <DialogDescription className="text-muted-foreground dark:text-gray-400">
//               {editingId ? 'Modifiez les informations du poste' : 'Créez un nouveau poste dans l\'entreprise'}
//             </DialogDescription>
//           </DialogHeader>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="bg-destructive/10 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800 rounded-lg p-3">
//                 <div className="text-sm text-destructive dark:text-red-400">{error}</div>
//               </div>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="intitule" className="text-sm font-medium text-foreground dark:text-white">
//                 Intitulé du poste *
//               </Label>
//               <Input 
//                 id="intitule"
//                 value={form.intitule} 
//                 onChange={(e) => setForm({ ...form, intitule: e.target.value })} 
//                 placeholder="Ex: Développeur Full Stack"
//                 className="w-full bg-background dark:bg-slate-900 text-foreground dark:text-white border-border"
//                 required 
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="niveau" className="text-sm font-medium text-foreground dark:text-white">
//                 Niveau
//               </Label>
//               <select
//                 id="niveau"
//                 value={form.niveau}
//                 onChange={(e) => setForm({ ...form, niveau: e.target.value })}
//                 className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white"
//               >
//                 <option value="">Sélectionner un niveau</option>
//                 <option value="Junior">Junior</option>
//                 <option value="Intermédiaire">Intermédiaire</option>
//                 <option value="Senior">Senior</option>
//                 <option value="Direction">Direction</option>
//               </select>
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="description" className="text-sm font-medium text-foreground dark:text-white">
//                 Description
//               </Label>
//               <textarea
//                 id="description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 placeholder="Décrivez les responsabilités et compétences requises..."
//                 rows={4}
//                 className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white resize-none"
//               />
//             </div>
            
//             <DialogFooter className="flex gap-3 pt-4">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setIsDialogOpen(false)}
//                 className="flex-1"
//               >
//                 Annuler
//               </Button>
//               <Button 
//                 type="submit" 
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {editingId ? 'Enregistrer' : 'Créer le poste'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Dialog de confirmation de suppression */}
//       <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
//         <AlertDialogContent className="rounded-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-foreground dark:text-white">Confirmer la suppression</AlertDialogTitle>
//             <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
//               {selectedPostes.size > 0
//                 ? `Êtes-vous sûr de vouloir supprimer ${selectedPostes.size} poste(s) ? Cette action est irréversible.`
//                 : "Êtes-vous sûr de vouloir supprimer ce poste ? Cette action est irréversible."}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="dark:text-white">Annuler</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDelete} className="bg-destructive dark:bg-red-600 hover:bg-destructive/90 dark:hover:bg-red-700">Supprimer</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Toast notification */}
//       {toast && (
//         <div className={`fixed bottom-4 right-4 ${
//           toast.type === "success" ? "bg-green-500" : 
//           toast.type === "error" ? "bg-red-500" : 
//           "bg-blue-500"
//         } text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md animate-in slide-in-from-bottom-5`}>
//           <div className="flex items-start gap-3">
//             <div className="flex-1">{toast.message}</div>
//             <button onClick={closeToast} className="text-white hover:text-gray-200 font-bold">✕</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import { useEffect, useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Plus, 
//   Briefcase, 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Upload, 
//   FileText, 
//   FileSpreadsheet, 
//   Download, 
//   Search, 
//   Calendar, 
//   ChevronDown, 
//   AlertTriangle, 
//   FolderKanban } from "lucide-react";
// import { getPostes, createPoste, updatePoste, deletePoste } from "@/services/posteService";
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/components/ui/use-toast";
// import { Toaster } from "@/components/ui/toaster";

// export default function PostesWithFileStorage() {
//   const { toast } = useToast();
  
//   // États pour les postes
//   const [postes, setPostes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [form, setForm] = useState({ intitule: "", description: "", niveau: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState(null);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [selectedPostes, setSelectedPostes] = useState(new Set());

//   // États pour les fichiers
//   const [files, setFiles] = useState([]);
//   const [filteredFiles, setFilteredFiles] = useState([]);
//   const [importMenuOpen, setImportMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [filesLoading, setFilesLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("postes");
//   const [confirmDeleteFileOpen, setConfirmDeleteFileOpen] = useState(false);
//   const [deleteFileId, setDeleteFileId] = useState(null);
//   const [deleteFileName, setDeleteFileName] = useState("");

//   const csvInputRef = useRef(null);
//   const pdfInputRef = useRef(null);
//   const docxInputRef = useRef(null);

//   // Charger les postes et fichiers au démarrage
//   useEffect(() => {
//     loadPostes();
//     loadFiles();
//   },);

//   // Filtrer les fichiers
//   useEffect(() => {
//     let filtered = files;
//     if (filterType !== "all") {
//       filtered = filtered.filter(file => file.type === filterType);
//     }
//     if (searchQuery) {
//       filtered = filtered.filter(file =>
//         file.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     setFilteredFiles(filtered);
//   }, [files, searchQuery, filterType]);

//   // Charger les fichiers depuis localStorage
//   const loadFiles = async () => {
//     setFilesLoading(true);
//     try {
//       const storedFiles = localStorage.getItem('postes_files');
//       if (storedFiles) {
//         const parsedFiles = JSON.parse(storedFiles);
//         setFiles(parsedFiles.sort((a, b) => b.timestamp - a.timestamp));
//       } else {
//         setFiles([]);
//       }
//     } catch (error) {
//       console.log("Aucun fichier stocké ou erreur de parsing:", error);
//       setFiles([]);
//     } finally {
//       setFilesLoading(false);
//     }
//   };

//   // Sauvegarder un fichier dans localStorage
//   const saveFile = async (fileData) => {
//     try {
//       const storedFiles = localStorage.getItem('postes_files');
//       const existingFiles = storedFiles ? JSON.parse(storedFiles) : [];
//       const updatedFiles = [fileData, ...existingFiles];
//       localStorage.setItem('postes_files', JSON.stringify(updatedFiles));
//       return true;
//     } catch (error) {
//       console.error("Erreur lors de la sauvegarde:", error);
//       if (error.name === 'QuotaExceededError') {
//         toast({
//           variant: "destructive",
//           title: "❌ Espace de stockage insuffisant",
//           description: "Veuillez supprimer des fichiers pour libérer de l'espace.",
//         });
//       }
//       return false;
//     }
//   };

//   // Supprimer un fichier
//   const deleteFile = async (fileId) => {
//     try {
//       const storedFiles = localStorage.getItem('postes_files');
//       if (storedFiles) {
//         const existingFiles = JSON.parse(storedFiles);
//         const updatedFiles = existingFiles.filter(f => f.id !== fileId);
//         localStorage.setItem('postes_files', JSON.stringify(updatedFiles));
//         setFiles(updatedFiles);
//         toast({
//           title: "🗑️ Fichier supprimé",
//           description: "Le fichier a été supprimé avec succès.",
//         });
//       }
//     } catch (error) {
//       console.error("Erreur lors de la suppression:", error);
//       toast({
//         variant: "destructive",
//         title: "❌ Erreur",
//         description: "Impossible de supprimer le fichier.",
//       });
//     }
//   };

//   const requestDeleteFile = (file) => {
//     setDeleteFileId(file.id);
//     setDeleteFileName(file.name);
//     setConfirmDeleteFileOpen(true);
//   };

//   const confirmDeleteFile = async () => {
//     if (deleteFileId) {
//       await deleteFile(deleteFileId);
//       setDeleteFileId(null);
//       setDeleteFileName("");
//     }
//     setConfirmDeleteFileOpen(false);
//   };

//   // Charger les postes depuis l'API backend
//   const loadPostes = async () => {
//     setLoading(true);
//     try {
//       const data = await getPostes();
//       setPostes(Array.isArray(data) ? data : data || []);
//     } catch (err) {
//       console.error('Erreur lors du chargement des postes depuis l\'API', err);
//       toast({
//         variant: "destructive",
//         title: "❌ Erreur",
//         description: "Impossible de charger les postes depuis le serveur",
//       });
//       setPostes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openCreate = () => {
//     setEditingId(null);
//     setForm({ intitule: "", description: "", niveau: "" });
//     setIsDialogOpen(true);
//   };

//   const openEdit = (p) => {
//     setEditingId(p.id);
//     setForm({ intitule: p.intitule || "", description: p.description || "", niveau: p.niveau || "" });
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       if (editingId) {
//         await updatePoste(editingId, form);
//         toast({
//           title: "✅ Succès",
//           description: "Poste modifié avec succès",
//         });
//       } else {
//         await createPoste(form);
//         toast({
//           title: "✅ Succès",
//           description: "Poste créé avec succès",
//         });
//       }
//       setIsDialogOpen(false);
//       await loadPostes();
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Erreur");
//       toast({
//         variant: "destructive",
//         title: "❌ Erreur",
//         description: "Erreur lors de l'enregistrement",
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
//         await deletePoste(deleteId);
//         toast({
//           title: "🗑️ Supprimé",
//           description: "Poste supprimé avec succès",
//         });
//       } else if (selectedPostes.size > 0) {
//         await Promise.all(Array.from(selectedPostes).map(id => deletePoste(id)));
//         toast({
//           title: "🗑️ Supprimés",
//           description: `${selectedPostes.size} poste(s) supprimé(s)`,
//         });
//         setSelectedPostes(new Set());
//       }
//       await loadPostes();
//     } catch {
//       toast({
//         variant: "destructive",
//         title: "❌ Erreur",
//         description: "Erreur lors de la suppression",
//       });
//     }
//     setDeleteId(null);
//   };

//   const handleSelectPoste = (id) => {
//     setSelectedPostes(prev => {
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
//       setSelectedPostes(new Set(postes.map(item => item.id)));
//     } else {
//       setSelectedPostes(new Set());
//     }
//   };

//   const requestDeleteSelected = () => {
//     if (selectedPostes.size > 0) {
//       setDeleteId(null);
//       setConfirmDeleteOpen(true);
//     }
//   };

//   const getBadgeColor = (niveau) => {
//     const niveauLower = niveau?.toLowerCase() || '';
//     if (niveauLower.includes('junior')) return 'bg-teal-500 text-white';
//     if (niveauLower.includes('intermediaire')) return 'bg-orange-500 text-white';
//     if (niveauLower.includes('senior')) return 'bg-yellow-500 text-black';
//     if (niveauLower.includes('direction')) return 'bg-black text-white';
//     return 'bg-gray-500 text-white';
//   };

//   const getDepartement = (intitule) => {
//     const intituleLower = intitule?.toLowerCase() || '';
//     if (intituleLower.includes('développeur') || intituleLower.includes('developer')) return 'Développement';
//     if (intituleLower.includes('marketing')) return 'Marketing';
//     if (intituleLower.includes('commercial') || intituleLower.includes('vente')) return 'Ventes';
//     if (intituleLower.includes('rh') || intituleLower.includes('directeur')) return 'Direction';
//     if (intituleLower.includes('projet')) return 'Marketing';
//     return 'Général';
//   };

//   // Import CSV pour postes
//   const handleCsvPostesImport = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setImportMenuOpen(false);

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       try {
//         const csv = e.target?.result;
//         if (typeof csv !== 'string') {
//           toast({
//             variant: "destructive",
//             title: "❌ Erreur",
//             description: "Erreur de lecture du fichier",
//           });
//           return;
//         }

//         const lines = csv.split('\n');
//         const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
//         let importedCount = 0;
//         let errorCount = 0;

//         for (let i = 1; i < lines.length; i++) {
//           if (!lines[i].trim()) continue;

//           const values = lines[i].split(',').map(v => v.trim());
//           const row = {};
//           headers.forEach((header, index) => {
//             row[header] = values[index] || '';
//           });

//           try {
//             if (row.intitule) {
//               await createPoste({
//                 intitule: row.intitule,
//                 description: row.description || '',
//                 niveau: row.niveau || ''
//               });
//               importedCount++;
//             }
//           } catch {
//             errorCount++;
//           }
//         }

//         toast({
//           title: "✅ Import terminé",
//           description: `${importedCount} poste(s) importé(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`,
//         });
//         await loadPostes();
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "❌ Erreur",
//           description: "Erreur lors de l'import du fichier",
//         });
//         console.error(error);
//       }
//     };
//     reader.readAsText(file);
//     event.target.value = "";
//   };

//   // Import fichiers (CSV, PDF, DOCX)
//   const handleFileImport = async (event, fileType) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setImportMenuOpen(false);

//     if (fileType === "csv") {
//       try {
//         const text = await file.text();
//         const newFile = {
//           id: `csv_${Date.now()}`,
//           name: file.name,
//           type: "csv",
//           size: file.size,
//           timestamp: Date.now(),
//           content: text,
//         };
//         const saved = await saveFile(newFile);
//         if (saved) {
//           setFiles([newFile, ...files]);
//           toast({
//             title: "✅ Import réussi",
//             description: `Fichier CSV "${file.name}" importé avec succès`,
//           });
//         }
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "❌ Erreur",
//           description: "Erreur d'import CSV",
//         });
//       }
//     } else if (fileType === "pdf") {
//       if (file.type !== "application/pdf") {
//         toast({
//           variant: "destructive",
//           title: "⚠️ Type de fichier invalide",
//           description: "Veuillez sélectionner un fichier PDF",
//         });
//         event.target.value = "";
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const newFile = {
//           id: `pdf_${Date.now()}`,
//           name: file.name,
//           type: "pdf",
//           size: file.size,
//           timestamp: Date.now(),
//           content: e.target.result,
//         };
//         const saved = await saveFile(newFile);
//         if (saved) {
//           setFiles([newFile, ...files]);
//           toast({
//             title: "✅ Import réussi",
//             description: `Fichier PDF "${file.name}" importé avec succès`,
//           });
//         }
//       };
//       reader.readAsDataURL(file);
//     } else if (fileType === "docx") {
//       const validTypes = [
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         "application/msword"
//       ];
//       if (!validTypes.includes(file.type)) {
//         toast({
//           variant: "destructive",
//           title: "⚠️ Type de fichier invalide",
//           description: "Veuillez sélectionner un fichier Word",
//         });
//         event.target.value = "";
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const newFile = {
//           id: `docx_${Date.now()}`,
//           name: file.name,
//           type: "docx",
//           size: file.size,
//           timestamp: Date.now(),
//           content: e.target.result,
//         };
//         const saved = await saveFile(newFile);
//         if (saved) {
//           setFiles([newFile, ...files]);
//           toast({
//             title: "✅ Import réussi",
//             description: `Fichier Word "${file.name}" importé avec succès`,
//           });
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//     event.target.value = "";
//   };

//   const viewFile = (file) => {
//     try {
//       if (file.type === "pdf") {
//         const pdfWindow = window.open();
//         pdfWindow.document.write(`<iframe width='100%' height='100%' src='${file.content}'></iframe>`);
//       } else if (file.type === "docx") {
//         const link = document.createElement("a");
//         link.href = file.content;
//         link.download = file.name;
//         link.click();
//         toast({
//           title: "📥 Téléchargement",
//           description: `Fichier "${file.name}" téléchargé`,
//         });
//       } else if (file.type === "csv") {
//         const blob = new Blob([file.content], { type: "text/csv" });
//         const url = URL.createObjectURL(blob);
//         window.open(url, "_blank");
//       }
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "❌ Erreur",
//         description: "Impossible d'ouvrir le fichier",
//       });
//     }
//   };

//   const downloadFile = (file) => {
//     try {
//       const link = document.createElement("a");
//       link.href = file.content;
//       link.download = file.name;
//       link.click();
//       toast({
//         title: "✅ Téléchargement",
//         description: `Fichier "${file.name}" téléchargé`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "❌ Erreur",
//         description: "Erreur de téléchargement",
//       });
//     }
//   };

//   const formatSize = (bytes) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
//   };

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString("fr-FR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getFileIcon = (type) => {
//     switch (type) {
//       case "csv":
//         return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
//       case "pdf":
//         return <FileText className="h-8 w-8 text-red-500" />;
//       case "docx":
//         return <FileText className="h-8 w-8 text-blue-500" />;
//       default:
//         return <FileText className="h-8 w-8 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background dark:bg-slate-950 p-6">
//       <div className="mx-auto max-w-7xl">
//         {/* Header avec titre et icône */}
//         <div className="mb-8 flex items-center gap-4">
//           <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
//             <FolderKanban className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-foreground dark:text-white">
//               Gestion des Postes
//             </h1>
//             <p className="text-muted-foreground dark:text-gray-400">
//               Gérez les informations de vos postes de manière efficace
//             </p>
//           </div>
//         </div>

//         {/* Onglets */}
//         <div className="mb-8">
//           <div className="flex gap-2 border-b border-border dark:border-slate-700">
//             <button
//               onClick={() => setActiveTab("postes")}
//               className={`px-6 py-3 font-medium transition-colors ${
//                 activeTab === "postes"
//                   ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
//                   : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
//               }`}
//             >
//               <Briefcase className="w-4 h-4 inline mr-2" />
//               Postes ({postes.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("fichiers")}
//               className={`px-6 py-3 font-medium transition-colors ${
//                 activeTab === "fichiers"
//                   ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
//                   : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
//               }`}
//             >
//               <FileText className="w-4 h-4 inline mr-2" />
//               Fichiers ({files.length})
//             </button>
//           </div>
//         </div>

//         {/* Section Postes */}
//         {activeTab === "postes" && (
//           <div>
//             <div className="mb-6 flex items-center justify-between">
//               <p className="text-sm text-muted-foreground dark:text-gray-400">
//                 Consultez et gérez les postes de l'entreprise
//               </p>
//               <div className="flex gap-2">
//                 <div className="relative">
//                   <Button 
//                     variant="outline"
//                     className="gap-2 border-border dark:border-slate-700"
//                     onClick={() => setImportMenuOpen(!importMenuOpen)}
//                   >
//                     <Upload className="w-4 h-4" />
//                     Importer
//                     <ChevronDown className="w-4 h-4" />
//                   </Button>

//                   {importMenuOpen && (
//                     <>
//                       <div className="fixed inset-0 z-10" onClick={() => setImportMenuOpen(false)} />
//                       <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
//                         <div
//                           onClick={() => csvInputRef.current?.click()}
//                           className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
//                         >
//                           <FileSpreadsheet className="h-5 w-5 text-green-500" />
//                           <div className="text-sm font-medium text-foreground dark:text-white">
//                             Import CSV Postes
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <input
//                     ref={csvInputRef}
//                     type="file"
//                     accept=".csv"
//                     onChange={handleCsvPostesImport}
//                     className="hidden"
//                   />
//                 </div>
                
//                 <Button 
//                   className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
//                   onClick={openCreate}
//                 >
//                   <Plus className="w-4 h-4" />
//                   Nouveau Poste
//                 </Button>
//               </div>
//             </div>

//             {selectedPostes.size > 0 && (
//               <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
//                 <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                   {selectedPostes.size} poste(s) sélectionné(s)
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   onClick={requestDeleteSelected}
//                   className="flex items-center gap-2"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Supprimer
//                 </Button>
//               </div>
//             )}

//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               </div>
//             ) : postes.length === 0 ? (
//               <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg">
//                 <Briefcase className="w-16 h-16 text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">Aucun poste trouvé</h3>
//                 <p className="text-muted-foreground dark:text-gray-400 mb-4">Commencez par créer votre premier poste</p>
//                 <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Créer un poste
//                 </Button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="col-span-full flex items-center p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
//                   <Checkbox
//                     id="select-all"
//                     checked={selectedPostes.size === postes.length && postes.length > 0}
//                     onCheckedChange={handleSelectAll}
//                   />
//                   <label htmlFor="select-all" className="ml-3 text-sm font-medium cursor-pointer">
//                     Tout sélectionner
//                   </label>
//                 </div>
//                 {postes.map((poste) => (
//                   <Card key={poste.id} className={`bg-card dark:bg-slate-900 hover:shadow-lg transition-shadow ${selectedPostes.has(poste.id) ? 'ring-2 ring-blue-500' : ''}`}>
//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                           <Checkbox
//                             checked={selectedPostes.has(poste.id)}
//                             onCheckedChange={() => handleSelectPoste(poste.id)}
//                             className="mt-1"
//                           />
//                           <div className="p-2 bg-muted dark:bg-slate-800 rounded-lg">
//                             <Briefcase className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-foreground dark:text-white text-lg">{poste.intitule}</h3>
//                             <p className="text-sm text-muted-foreground dark:text-gray-400">{getDepartement(poste.intitule)}</p>
//                           </div>
//                         </div>
//                         {poste.niveau && (
//                           <Badge className={`${getBadgeColor(poste.niveau)} text-xs px-2 py-1`}>
//                             {poste.niveau}
//                           </Badge>
//                         )}
//                       </div>
                      
//                       {poste.description && (
//                         <p className="text-foreground/70 dark:text-gray-300 text-sm mb-4 line-clamp-2">
//                           {poste.description}
//                         </p>
//                       )}
                      
//                       <div className="flex gap-2">
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="flex-1"
//                           onClick={() => openEdit(poste)}
//                         >
//                           <Edit className="w-4 h-4 mr-1" />
//                           Modifier
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="flex-1"
//                           onClick={() => requestDelete(poste.id)}
//                         >
//                           <Trash2 className="w-4 h-4 mr-1" />
//                           Supprimer
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Section Fichiers */}
//         {activeTab === "fichiers" && (
//           <div>
//             <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-6">
//               <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//                 <div className="relative">
//                   <Button
//                     onClick={() => setImportMenuOpen(!importMenuOpen)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//                   >
//                     <Upload className="h-4 w-4" />
//                     Importer un fichier
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>

//                   {importMenuOpen && (
//                     <>
//                       <div className="fixed inset-0 z-10" onClick={() => setImportMenuOpen(false)} />
//                       <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
//                         <div
//                           onClick={() => csvInputRef.current?.click()}
//                           className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b dark:border-slate-700"
//                         >
//                           <FileSpreadsheet className="h-5 w-5 text-green-500 mt-1" />
//                           <div>
//                             <div className="font-semibold text-foreground dark:text-white">Fichier CSV</div>
//                             <div className="text-sm text-muted-foreground dark:text-gray-400">
//                               Importer des données tabulaires
//                             </div>
//                           </div>
//                         </div>

//                         <div
//                           onClick={() => pdfInputRef.current?.click()}
//                           className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b dark:border-slate-700"
//                         >
//                           <FileText className="h-5 w-5 text-red-500 mt-1" />
//                           <div>
//                             <div className="font-semibold text-foreground dark:text-white">Fichier PDF</div>
//                             <div className="text-sm text-muted-foreground dark:text-gray-400">
//                               Importer des documents PDF
//                             </div>
//                           </div>
//                         </div>

//                         <div
//                           onClick={() => docxInputRef.current?.click()}
//                           className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
//                         >
//                           <FileText className="h-5 w-5 text-blue-500 mt-1" />
//                           <div>
//                             <div className="font-semibold text-foreground dark:text-white">Fichier Word</div>
//                             <div className="text-sm text-muted-foreground dark:text-gray-400">
//                               Importer des documents .doc/.docx
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <input
//                     ref={csvInputRef}
//                     type="file"
//                     accept=".csv"
//                     onChange={(e) => handleFileImport(e, "csv")}
//                     className="hidden"
//                   />
//                   <input
//                     ref={pdfInputRef}
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) => handleFileImport(e, "pdf")}
//                     className="hidden"
//                   />
//                   <input
//                     ref={docxInputRef}
//                     type="file"
//                     accept=".doc,.docx"
//                     onChange={(e) => handleFileImport(e, "docx")}
//                     className="hidden"
//                   />
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                     <Input
//                       type="text"
//                       placeholder="Rechercher..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="pl-10 w-full sm:w-64"
//                     />
//                   </div>

//                   <select
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                     className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background dark:bg-slate-900 text-foreground dark:text-white"
//                   >
//                     <option value="all">Tous les fichiers</option>
//                     <option value="csv">CSV uniquement</option>
//                     <option value="pdf">PDF uniquement</option>
//                     <option value="docx">Word uniquement</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-foreground dark:text-white">{files.length}</div>
//                   <div className="text-sm text-muted-foreground dark:text-gray-400">Total</div>
//                 </div>
//                 <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                     {files.filter(f => f.type === "csv").length}
//                   </div>
//                   <div className="text-sm text-green-700 dark:text-green-500">CSV</div>
//                 </div>
//                 <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-red-600 dark:text-red-400">
//                     {files.filter(f => f.type === "pdf").length}
//                   </div>
//                   <div className="text-sm text-red-700 dark:text-red-500">PDF</div>
//                 </div>
//                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                     {files.filter(f => f.type === "docx").length}
//                   </div>
//                   <div className="text-sm text-blue-700 dark:text-blue-500">Word</div>
//                 </div>
//               </div>
//             </div>

//             {filesLoading ? (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-4 text-muted-foreground dark:text-gray-400">Chargement des fichiers...</p>
//               </div>
//             ) : filteredFiles.length === 0 ? (
//               <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-12 text-center">
//                 <FileText className="h-16 w-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
//                   Aucun fichier trouvé
//                 </h3>
//                 <p className="text-muted-foreground dark:text-gray-400">
//                   {searchQuery || filterType !== "all"
//                     ? "Aucun fichier ne correspond à vos critères"
//                     : "Commencez par importer des fichiers"}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredFiles.map((file) => (
//                   <Card key={file.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-slate-900">
//                     <CardHeader>
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center gap-3">
//                           {getFileIcon(file.type)}
//                           <div>
//                             <CardTitle className="text-lg line-clamp-1 text-foreground dark:text-white">
//                               {file.name}
//                             </CardTitle>
//                             <CardDescription className="flex items-center gap-2 mt-1">
//                               <span className="uppercase text-xs font-semibold">
//                                 {file.type}
//                               </span>
//                               <span>•</span>
//                               <span>{formatSize(file.size)}</span>
//                             </CardDescription>
//                           </div>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 mb-4">
//                         <Calendar className="h-4 w-4" />
//                         {formatDate(file.timestamp)}
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           onClick={() => viewFile(file)}
//                           variant="outline"
//                           size="sm"
//                           className="flex-1"
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           Voir
//                         </Button>
//                         <Button
//                           onClick={() => downloadFile(file)}
//                           variant="outline"
//                           size="sm"
//                           className="flex-1"
//                         >
//                           <Download className="h-4 w-4 mr-1" />
//                           Télécharger
//                         </Button>
//                         <Button
//                           onClick={() => requestDeleteFile(file)}
//                           variant="destructive"
//                           size="sm"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Dialog pour créer/modifier un poste */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] rounded-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-foreground dark:text-white">
//               {editingId ? 'Modifier le Poste' : 'Nouveau Poste'}
//             </DialogTitle>
//             <DialogDescription className="text-muted-foreground dark:text-gray-400">
//               {editingId ? 'Modifiez les informations du poste' : 'Créez un nouveau poste dans l\'entreprise'}
//             </DialogDescription>
//           </DialogHeader>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="bg-destructive/10 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800 rounded-lg p-3">
//                 <div className="text-sm text-destructive dark:text-red-400">{error}</div>
//               </div>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="intitule" className="text-sm font-medium text-foreground dark:text-white">
//                 Intitulé du poste *
//               </Label>
//               <Input 
//                 id="intitule"
//                 value={form.intitule} 
//                 onChange={(e) => setForm({ ...form, intitule: e.target.value })} 
//                 placeholder="Ex: Développeur Full Stack"
//                 className="w-full bg-background dark:bg-slate-900 text-foreground dark:text-white border-border"
//                 required 
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="niveau" className="text-sm font-medium text-foreground dark:text-white">
//                 Niveau
//               </Label>
//               <select
//                 id="niveau"
//                 value={form.niveau}
//                 onChange={(e) => setForm({ ...form, niveau: e.target.value })}
//                 className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white"
//               >
//                 <option value="">Sélectionner un niveau</option>
//                 <option value="Junior">Junior</option>
//                 <option value="Intermédiaire">Intermédiaire</option>
//                 <option value="Senior">Senior</option>
//                 <option value="Direction">Direction</option>
//               </select>
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="description" className="text-sm font-medium text-foreground dark:text-white">
//                 Description
//               </Label>
//               <textarea
//                 id="description"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 placeholder="Décrivez les responsabilités et compétences requises..."
//                 rows={4}
//                 className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white resize-none"
//               />
//             </div>
            
//             <DialogFooter className="flex gap-3 pt-4">
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setIsDialogOpen(false)}
//                 className="flex-1"
//               >
//                 Annuler
//               </Button>
//               <Button 
//                 type="submit" 
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {editingId ? 'Enregistrer' : 'Créer le poste'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Dialog de confirmation de suppression des postes */}
//       <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
//         <AlertDialogContent className="rounded-2xl max-w-md">
//           <AlertDialogHeader>
//             <div className="flex items-center gap-4 mb-2">
//               <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
//                 <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
//               </div>
//               <AlertDialogTitle className="text-xl font-bold text-foreground dark:text-white">
//                 Confirmer la suppression
//               </AlertDialogTitle>
//             </div>
//             <AlertDialogDescription className="text-muted-foreground dark:text-gray-400 text-base pt-2">
//               {selectedPostes.size > 0
//                 ? `Vous êtes sur le point de supprimer ${selectedPostes.size} poste(s). Cette action est irréversible et toutes les données associées seront perdues.`
//                 : "Vous êtes sur le point de supprimer ce poste. Cette action est irréversible et toutes les données associées seront perdues."}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="gap-2 sm:gap-2">
//             <AlertDialogCancel className="flex-1 dark:text-white">Annuler</AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={confirmDelete} 
//               className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
//             >
//               Supprimer définitivement
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Dialog de confirmation de suppression des fichiers */}
//       <AlertDialog open={confirmDeleteFileOpen} onOpenChange={setConfirmDeleteFileOpen}>
//         <AlertDialogContent className="rounded-2xl max-w-md">
//           <AlertDialogHeader>
//             <div className="flex items-center gap-4 mb-2">
//               <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
//                 <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
//               </div>
//               <AlertDialogTitle className="text-xl font-bold text-foreground dark:text-white">
//                 Supprimer le fichier
//               </AlertDialogTitle>
//             </div>
//             <AlertDialogDescription className="text-muted-foreground dark:text-gray-400 text-base pt-2">
//               Êtes-vous sûr de vouloir supprimer le fichier <span className="font-semibold text-foreground dark:text-white">"{deleteFileName}"</span> ? Cette action est irréversible.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="gap-2 sm:gap-2">
//             <AlertDialogCancel className="flex-1 dark:text-white">Annuler</AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={confirmDeleteFile} 
//               className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
//             >
//               Supprimer
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Toaster de shadcn */}
//       <Toaster />
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Briefcase, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Calendar, 
  ChevronDown, 
  AlertTriangle, 
  FolderKanban 
} from "lucide-react";
import { getPostes, createPoste, updatePoste, deletePoste } from "@/services/posteService";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function PostesWithFileStorage() {
  // États pour les postes
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ intitule: "", description: "", niveau: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedPostes, setSelectedPostes] = useState(new Set());

  // États pour les fichiers
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [importMenuOpen, setImportMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filesLoading, setFilesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("postes");
  const [confirmDeleteFileOpen, setConfirmDeleteFileOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null);
  const [deleteFileName, setDeleteFileName] = useState("");

  const csvInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const docxInputRef = useRef(null);

  // Charger les postes et fichiers au démarrage
  useEffect(() => {
    loadPostes();
    loadFiles();
  }, []);

  // Filtrer les fichiers
  useEffect(() => {
    let filtered = files;
    if (filterType !== "all") {
      filtered = filtered.filter(file => file.type === filterType);
    }
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredFiles(filtered);
  }, [files, searchQuery, filterType]);

  // Charger les fichiers depuis localStorage
  const loadFiles = async () => {
    setFilesLoading(true);
    try {
      const storedFiles = localStorage.getItem('postes_files');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        setFiles(parsedFiles.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.log("Aucun fichier stocké ou erreur de parsing:", error);
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  // Sauvegarder un fichier dans localStorage
  const saveFile = async (fileData) => {
    try {
      const storedFiles = localStorage.getItem('postes_files');
      const existingFiles = storedFiles ? JSON.parse(storedFiles) : [];
      const updatedFiles = [fileData, ...existingFiles];
      localStorage.setItem('postes_files', JSON.stringify(updatedFiles));
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      if (error.name === 'QuotaExceededError') {
        toast.error("Espace de stockage insuffisant", {
          description: "Veuillez supprimer des fichiers pour libérer de l'espace."
        });
      }
      return false;
    }
  };

  // Supprimer un fichier
  const deleteFile = async (fileId) => {
    try {
      const storedFiles = localStorage.getItem('postes_files');
      if (storedFiles) {
        const existingFiles = JSON.parse(storedFiles);
        const updatedFiles = existingFiles.filter(f => f.id !== fileId);
        localStorage.setItem('postes_files', JSON.stringify(updatedFiles));
        setFiles(updatedFiles);
        toast.success("Fichier supprimé", {
          description: "Le fichier a été supprimé avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur", {
        description: "Impossible de supprimer le fichier."
      });
    }
  };

  const requestDeleteFile = (file) => {
    setDeleteFileId(file.id);
    setDeleteFileName(file.name);
    setConfirmDeleteFileOpen(true);
  };

  const confirmDeleteFile = async () => {
    if (deleteFileId) {
      await deleteFile(deleteFileId);
      setDeleteFileId(null);
      setDeleteFileName("");
    }
    setConfirmDeleteFileOpen(false);
  };

  // Charger les postes depuis l'API backend
  const loadPostes = async () => {
    setLoading(true);
    try {
      const data = await getPostes();
      setPostes(Array.isArray(data) ? data : data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des postes depuis l\'API', err);
      toast.error("Erreur", {
        description: "Impossible de charger les postes depuis le serveur"
      });
      setPostes([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ intitule: "", description: "", niveau: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ intitule: p.intitule || "", description: p.description || "", niveau: p.niveau || "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updatePoste(editingId, form);
        toast.success("Succès", {
          description: "Poste modifié avec succès"
        });
      } else {
        await createPoste(form);
        toast.success("Succès", {
          description: "Poste créé avec succès"
        });
      }
      setIsDialogOpen(false);
      await loadPostes();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur");
      toast.error("Erreur", {
        description: "Erreur lors de l'enregistrement"
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
        await deletePoste(deleteId);
        toast.success("Supprimé", {
          description: "Poste supprimé avec succès"
        });
      } else if (selectedPostes.size > 0) {
        await Promise.all(Array.from(selectedPostes).map(id => deletePoste(id)));
        toast.success("Supprimés", {
          description: `${selectedPostes.size} poste(s) supprimé(s)`
        });
        setSelectedPostes(new Set());
      }
      await loadPostes();
    } catch {
      toast.error("Erreur", {
        description: "Erreur lors de la suppression"
      });
    }
    setDeleteId(null);
  };

  const handleSelectPoste = (id) => {
    setSelectedPostes(prev => {
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
      setSelectedPostes(new Set(postes.map(item => item.id)));
    } else {
      setSelectedPostes(new Set());
    }
  };

  const requestDeleteSelected = () => {
    if (selectedPostes.size > 0) {
      setDeleteId(null);
      setConfirmDeleteOpen(true);
    }
  };

  const getBadgeColor = (niveau) => {
    const niveauLower = niveau?.toLowerCase() || '';
    if (niveauLower.includes('junior')) return 'bg-teal-500 text-white';
    if (niveauLower.includes('intermediaire')) return 'bg-orange-500 text-white';
    if (niveauLower.includes('senior')) return 'bg-yellow-500 text-black';
    if (niveauLower.includes('direction')) return 'bg-black text-white';
    return 'bg-gray-500 text-white';
  };

  const getDepartement = (intitule) => {
    const intituleLower = intitule?.toLowerCase() || '';
    if (intituleLower.includes('développeur') || intituleLower.includes('developer')) return 'Développement';
    if (intituleLower.includes('marketing')) return 'Marketing';
    if (intituleLower.includes('commercial') || intituleLower.includes('vente')) return 'Ventes';
    if (intituleLower.includes('rh') || intituleLower.includes('directeur')) return 'Direction';
    if (intituleLower.includes('projet')) return 'Marketing';
    return 'Général';
  };

  // Import CSV pour postes
  const handleCsvPostesImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportMenuOpen(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result;
        if (typeof csv !== 'string') {
          toast.error("Erreur", {
            description: "Erreur de lecture du fichier"
          });
          return;
        }

        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        let importedCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          try {
            if (row.intitule) {
              await createPoste({
                intitule: row.intitule,
                description: row.description || '',
                niveau: row.niveau || ''
              });
              importedCount++;
            }
          } catch {
            errorCount++;
          }
        }

        toast.success("Import terminé", {
          description: `${importedCount} poste(s) importé(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`
        });
        await loadPostes();
      } catch (error) {
        toast.error("Erreur", {
          description: "Erreur lors de l'import du fichier"
        });
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // Import fichiers (CSV, PDF, DOCX)
  const handleFileImport = async (event, fileType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportMenuOpen(false);

    if (fileType === "csv") {
      try {
        const text = await file.text();
        const newFile = {
          id: `csv_${Date.now()}`,
          name: file.name,
          type: "csv",
          size: file.size,
          timestamp: Date.now(),
          content: text,
        };
        const saved = await saveFile(newFile);
        if (saved) {
          setFiles([newFile, ...files]);
          toast.success("Import réussi", {
            description: `Fichier CSV "${file.name}" importé avec succès`
          });
        }
      } catch (error) {
        toast.error("Erreur", {
          description: "Erreur d'import CSV"
        });
      }
    } else if (fileType === "pdf") {
      if (file.type !== "application/pdf") {
        toast.error("Type de fichier invalide", {
          description: "Veuillez sélectionner un fichier PDF"
        });
        event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newFile = {
          id: `pdf_${Date.now()}`,
          name: file.name,
          type: "pdf",
          size: file.size,
          timestamp: Date.now(),
          content: e.target.result,
        };
        const saved = await saveFile(newFile);
        if (saved) {
          setFiles([newFile, ...files]);
          toast.success("Import réussi", {
            description: `Fichier PDF "${file.name}" importé avec succès`
          });
        }
      };
      reader.readAsDataURL(file);
    } else if (fileType === "docx") {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Type de fichier invalide", {
          description: "Veuillez sélectionner un fichier Word"
        });
        event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newFile = {
          id: `docx_${Date.now()}`,
          name: file.name,
          type: "docx",
          size: file.size,
          timestamp: Date.now(),
          content: e.target.result,
        };
        const saved = await saveFile(newFile);
        if (saved) {
          setFiles([newFile, ...files]);
          toast.success("Import réussi", {
            description: `Fichier Word "${file.name}" importé avec succès`
          });
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const viewFile = (file) => {
    try {
      if (file.type === "pdf") {
        const pdfWindow = window.open();
        pdfWindow.document.write(`<iframe width='100%' height='100%' src='${file.content}'></iframe>`);
      } else if (file.type === "docx") {
        const link = document.createElement("a");
        link.href = file.content;
        link.download = file.name;
        link.click();
        toast.success("Téléchargement", {
          description: `Fichier "${file.name}" téléchargé`
        });
      } else if (file.type === "csv") {
        const blob = new Blob([file.content], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible d'ouvrir le fichier"
      });
    }
  };

  const downloadFile = (file) => {
    try {
      const link = document.createElement("a");
      link.href = file.content;
      link.download = file.name;
      link.click();
      toast.success("Téléchargement", {
        description: `Fichier "${file.name}" téléchargé`
      });
    } catch (error) {
      toast.error("Erreur", {
        description: "Erreur de téléchargement"
      });
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "csv":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "docx":
        return <FileText className="h-8 w-8 text-blue-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header avec titre et icône */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 shadow-lg">
            <FolderKanban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground dark:text-white">
              Gestion des Postes
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Gérez les informations de vos postes de manière efficace
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-border dark:border-slate-700">
            <button
              onClick={() => setActiveTab("postes")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "postes"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Postes ({postes.length})
            </button>
            <button
              onClick={() => setActiveTab("fichiers")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "fichiers"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Fichiers ({files.length})
            </button>
          </div>
        </div>

        {/* Section Postes */}
        {activeTab === "postes" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Consultez et gérez les postes de l'entreprise
              </p>
              <div className="flex gap-2">
                <div className="relative">
                  <Button 
                    variant="outline"
                    className="gap-2 border-border dark:border-slate-700"
                    onClick={() => setImportMenuOpen(!importMenuOpen)}
                  >
                    <Upload className="w-4 h-4" />
                    Importer
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {importMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setImportMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                        <div
                          onClick={() => csvInputRef.current?.click()}
                          className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                        >
                          <FileSpreadsheet className="h-5 w-5 text-green-500" />
                          <div className="text-sm font-medium text-foreground dark:text-white">
                            Import CSV Postes
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvPostesImport}
                    className="hidden"
                  />
                </div>
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
                  onClick={openCreate}
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Poste
                </Button>
              </div>
            </div>

            {selectedPostes.size > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {selectedPostes.size} poste(s) sélectionné(s)
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={requestDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : postes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg">
                <Briefcase className="w-16 h-16 text-muted-foreground dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">Aucun poste trouvé</h3>
                <p className="text-muted-foreground dark:text-gray-400 mb-4">Commencez par créer votre premier poste</p>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un poste
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-full flex items-center p-2 rounded-md hover:bg-muted dark:hover:bg-slate-800">
                  <Checkbox
                    id="select-all"
                    checked={selectedPostes.size === postes.length && postes.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="ml-3 text-sm font-medium cursor-pointer">
                    Tout sélectionner
                  </label>
                </div>
                {postes.map((poste) => (
                  <Card key={poste.id} className={`bg-card dark:bg-slate-900 hover:shadow-lg transition-shadow ${selectedPostes.has(poste.id) ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedPostes.has(poste.id)}
                            onCheckedChange={() => handleSelectPoste(poste.id)}
                            className="mt-1"
                          />
                          <div className="p-2 bg-muted dark:bg-slate-800 rounded-lg">
                            <Briefcase className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground dark:text-white text-lg">{poste.intitule}</h3>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">{getDepartement(poste.intitule)}</p>
                          </div>
                        </div>
                        {poste.niveau && (
                          <Badge className={`${getBadgeColor(poste.niveau)} text-xs px-2 py-1`}>
                            {poste.niveau}
                          </Badge>
                        )}
                      </div>
                      
                      {poste.description && (
                        <p className="text-foreground/70 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {poste.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openEdit(poste)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => requestDelete(poste.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Fichiers */}
        {activeTab === "fichiers" && (
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative">
                  <Button
                    onClick={() => setImportMenuOpen(!importMenuOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Importer un fichier
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {importMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setImportMenuOpen(false)} />
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                        <div
                          onClick={() => csvInputRef.current?.click()}
                          className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b dark:border-slate-700"
                        >
                          <FileSpreadsheet className="h-5 w-5 text-green-500 mt-1" />
                          <div>
                            <div className="font-semibold text-foreground dark:text-white">Fichier CSV</div>
                            <div className="text-sm text-muted-foreground dark:text-gray-400">
                              Importer des données tabulaires
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => pdfInputRef.current?.click()}
                          className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b dark:border-slate-700"
                        >
                          <FileText className="h-5 w-5 text-red-500 mt-1" />
                          <div>
                            <div className="font-semibold text-foreground dark:text-white">Fichier PDF</div>
                            <div className="text-sm text-muted-foreground dark:text-gray-400">
                              Importer des documents PDF
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => docxInputRef.current?.click()}
                          className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                        >
                          <FileText className="h-5 w-5 text-blue-500 mt-1" />
                          <div>
                            <div className="font-semibold text-foreground dark:text-white">Fichier Word</div>
                            <div className="text-sm text-muted-foreground dark:text-gray-400">
                              Importer des documents .doc/.docx
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileImport(e, "csv")}
                    className="hidden"
                  />
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileImport(e, "pdf")}
                    className="hidden"
                  />
                  <input
                    ref={docxInputRef}
                    type="file"
                    accept=".doc,.docx"
                    onChange={(e) => handleFileImport(e, "docx")}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background dark:bg-slate-900 text-foreground dark:text-white"
                  >
                    <option value="all">Tous les fichiers</option>
                    <option value="csv">CSV uniquement</option>
                    <option value="pdf">PDF uniquement</option>
                    <option value="docx">Word uniquement</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground dark:text-white">{files.length}</div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400">Total</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {files.filter(f => f.type === "csv").length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-500">CSV</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {files.filter(f => f.type === "pdf").length}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-500">PDF</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {files.filter(f => f.type === "docx").length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-500">Word</div>
                </div>
              </div>
            </div>

            {filesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground dark:text-gray-400">Chargement des fichiers...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                  Aucun fichier trouvé
                </h3>
                <p className="text-muted-foreground dark:text-gray-400">
                  {searchQuery || filterType !== "all"
                    ? "Aucun fichier ne correspond à vos critères"
                    : "Commencez par importer des fichiers"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-slate-900">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <CardTitle className="text-lg line-clamp-1 text-foreground dark:text-white">
                              {file.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="uppercase text-xs font-semibold">
                                {file.type}
                              </span>
                              <span>•</span>
                              <span>{formatSize(file.size)}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 mb-4">
                        <Calendar className="h-4 w-4" />
                        {formatDate(file.timestamp)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => viewFile(file)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button
                          onClick={() => downloadFile(file)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button
                          onClick={() => requestDeleteFile(file)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog pour créer/modifier un poste */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground dark:text-white">
              {editingId ? 'Modifier le Poste' : 'Nouveau Poste'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-gray-400">
              {editingId ? 'Modifiez les informations du poste' : 'Créez un nouveau poste dans l\'entreprise'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800 rounded-lg p-3">
                <div className="text-sm text-destructive dark:text-red-400">{error}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="intitule" className="text-sm font-medium text-foreground dark:text-white">
                Intitulé du poste *
              </Label>
              <Input 
                id="intitule"
                value={form.intitule} 
                onChange={(e) => setForm({ ...form, intitule: e.target.value })} 
                placeholder="Ex: Développeur Full Stack"
                className="w-full bg-background dark:bg-slate-900 text-foreground dark:text-white border-border"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="niveau" className="text-sm font-medium text-foreground dark:text-white">
                Niveau
              </Label>
              <select
                id="niveau"
                value={form.niveau}
                onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white"
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Junior">Junior</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Senior">Senior</option>
                <option value="Direction">Direction</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground dark:text-white">
                Description
              </Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez les responsabilités et compétences requises..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background dark:bg-slate-900 text-foreground dark:text-white resize-none"
              />
            </div>
            
            <DialogFooter className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Enregistrer' : 'Créer le poste'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression des postes */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-foreground dark:text-white">
                Confirmer la suppression
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground dark:text-gray-400 text-base pt-2">
              {selectedPostes.size > 0
                ? `Vous êtes sur le point de supprimer ${selectedPostes.size} poste(s). Cette action est irréversible et toutes les données associées seront perdues.`
                : "Vous êtes sur le point de supprimer ce poste. Cette action est irréversible et toutes les données associées seront perdues."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 dark:text-white">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmation de suppression des fichiers */}
      <AlertDialog open={confirmDeleteFileOpen} onOpenChange={setConfirmDeleteFileOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-foreground dark:text-white">
                Supprimer le fichier
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground dark:text-gray-400 text-base pt-2">
              Êtes-vous sûr de vouloir supprimer le fichier <span className="font-semibold text-foreground dark:text-white">"{deleteFileName}"</span> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 dark:text-white">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFile} 
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}