//frontend/src/components/login-form.jsx
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import CarsoLogo from "../assets/carso 5.png"
import { toast } from "sonner"

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true) 

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion")
      }

      console.log("✅ Connexion réussie")

      // Sauvegarde utilisateur
      login(data.token, {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.role,
        nom_utilisateur: data.user?.nom_utilisateur,
        prenom_utilisateur: data.user?.prenom_utilisateur,
        premiereConnexion: data.user?.premiereConnexion
      })

      toast.success("Connexion réussie !", {
        description: `Bienvenue ${
          data.user?.prenom_utilisateur ||
          data.user?.nom_utilisateur ||
          data.user?.email
        }`
      })

      // Redirection vers le tableau de bord
      navigate("/dashboard", { replace: true })
    } catch (error) {
      console.error("Erreur login:", error)
      toast.error("Échec de la connexion", {
        description: error.message || "Email ou mot de passe incorrect"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Écran de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* 🖼️ Image à gauche */}
          <div className="bg-muted relative hidden md:block">
            <img
              src={CarsoLogo}
              alt="Carso Logo"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

          {/* 🧾 Formulaire à droite */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenue sur Carso</h1>
                <p className="text-balance text-muted-foreground">
                  Connectez-vous à votre compte
                </p>
              </div>

              <FieldGroup>
                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemple@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </Field>

                {/* Mot de passe */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="mot_de_passe">
                      Mot de passe
                    </FieldLabel>
                    <button
                      type="button"
                      className="text-sm underline-offset-4 hover:underline"
                      onClick={() => toast.info("Fonctionnalité à venir")}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="mot_de_passe"
                      name="mot_de_passe"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.mot_de_passe}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />

                    {/* Icône œil */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </Field>
              </FieldGroup>

              {/* Bouton connexion */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Vous n&apos;avez pas de compte ?{" "}
                <span className="font-medium">
                  Contactez votre administrateur
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        En vous connectant, vous acceptez nos{" "}
        <a href="#">Conditions d&apos;utilisation</a> et notre{" "}
        <a href="#">Politique de confidentialité</a>.
      </div>
    </div>
  )
}
