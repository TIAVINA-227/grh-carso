// frontend/src/components/ChangePasswordModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Check, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

export function ChangePasswordModal({ 
  open, 
  userId, 
  isFirstLogin = false,
  onPasswordChanged 
}) {
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Validation en temps réel
  const validatePassword = (password) => {
    const validationErrors = [];
    
    if (password.length < 8) {
      validationErrors.push("Au moins 8 caractères");
    }
    if (!/[a-z]/.test(password)) {
      validationErrors.push("Au moins une minuscule");
    }
    if (!/[A-Z]/.test(password)) {
      validationErrors.push("Au moins une majuscule");
    }
    if (!/[0-9]/.test(password)) {
      validationErrors.push("Au moins un chiffre");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      validationErrors.push("Au moins un caractère spécial (!@#$%^&*)");
    }
    
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    
    console.log('🔄 Tentative de changement de mot de passe...', {
      userId,
      hasAncienMdp: !!ancienMotDePasse,
      hasNouveauMdp: !!nouveauMotDePasse
    });
    
    // Validation
    if (!ancienMotDePasse || !nouveauMotDePasse || !confirmMotDePasse) {
      setErrors(["Tous les champs sont requis"]);
      return;
    }
    
    if (nouveauMotDePasse !== confirmMotDePasse) {
      setErrors(["Les mots de passe ne correspondent pas"]);
      return;
    }
    
    const validationErrors = validatePassword(nouveauMotDePasse);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/utilisateurs/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ancienMotDePasse,
          nouveauMotDePasse,
        }),
      });
      
      const data = await response.json();
      
      console.log('📥 Réponse serveur:', data);
      
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du changement");
      }
      
      toast.success("✅ Mot de passe modifié", {
        description: "Votre mot de passe a été changé avec succès",
      });
      
      // Réinitialiser le formulaire
      setAncienMotDePasse("");
      setNouveauMotDePasse("");
      setConfirmMotDePasse("");
      
      // Callback
      if (onPasswordChanged) {
        onPasswordChanged();
      }
      
    } catch (error) {
      console.error("❌ Erreur changement mot de passe:", error);
      setErrors([error.message || "Erreur lors du changement de mot de passe"]);
      toast.error("❌ Échec du changement", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = nouveauMotDePasse.length > 0 
    ? validatePassword(nouveauMotDePasse).length 
    : 5;

  return (
    <Dialog open={open} onOpenChange={isFirstLogin ? undefined : () => onPasswordChanged?.()}>
      <DialogContent 
        className="sm:max-w-md"
        // Empêcher la fermeture si première connexion
        onPointerDownOutside={isFirstLogin ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={isFirstLogin ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {isFirstLogin ? "Changement de mot de passe obligatoire" : "Changer mon mot de passe"}
          </DialogTitle>
          <DialogDescription>
            {isFirstLogin ? (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Pour des raisons de sécurité, vous devez changer votre mot de passe temporaire lors de votre première connexion.
                </AlertDescription>
              </Alert>
            ) : (
              "Modifiez votre mot de passe pour sécuriser votre compte."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Ancien mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="ancien-password">
              {isFirstLogin ? "Mot de passe temporaire" : "Ancien mot de passe"}
            </Label>
            <div className="relative">
              <Input
                id="ancien-password"
                type={showPasswords ? "text" : "password"}
                value={ancienMotDePasse}
                onChange={(e) => setAncienMotDePasse(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                required
              />
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="nouveau-password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="nouveau-password"
                type={showPasswords ? "text" : "password"}
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                placeholder="Entrez votre nouveau mot de passe"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Indicateur de force */}
            {nouveauMotDePasse && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < 5 - passwordStrength
                          ? passwordStrength === 0
                            ? "bg-green-500"
                            : passwordStrength <= 2
                            ? "bg-orange-500"
                            : "bg-red-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Force: {
                    passwordStrength === 0 ? "Très fort" :
                    passwordStrength <= 2 ? "Moyen" : "Faible"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type={showPasswords ? "text" : "password"}
              value={confirmMotDePasse}
              onChange={(e) => setConfirmMotDePasse(e.target.value)}
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
            {confirmMotDePasse && nouveauMotDePasse !== confirmMotDePasse && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Les mots de passe ne correspondent pas
              </p>
            )}
            {confirmMotDePasse && nouveauMotDePasse === confirmMotDePasse && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* Erreurs */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            {!isFirstLogin && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onPasswordChanged?.()}
              >
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Changement en cours..." : "Changer le mot de passe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}