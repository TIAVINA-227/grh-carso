import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import CarsoLogo from "../assets/carso1.png"
import { toast } from "sonner"
import { useAuth } from "../hooks/useAuth"


export function LoginForm({ className, ...props }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [nom_utilisateur, setnom_utilisateur] = useState("")
  const [email, setEmail] = useState("")
  const [mot_de_passe, setmot_de_passe] = useState("")
  const [error, setError] = useState("")

  const { setUser } = useAuth();
  const navigate = useNavigate()
// Connexion avec email + mot de passe
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          mot_de_passe: mot_de_passe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Email ou mot de passe incorrect")
        return
      }
      localStorage.setItem("token", data.token);
      // Utilise le context
      setUser(data.user);
      navigate("/dashboard")
      toast.success("Bienvenu, vous êtes connecté avec succès")
    } catch (err) {
      console.error("Erreur lors de la connexion :", err)
      setError("Impossible de se connecter au serveur.")
    }
  }
// Inscription
  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom_utilisateur: nom_utilisateur.trim(),
          email: email.trim().toLowerCase(),
          mot_de_passe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'inscription")
        return
      }

      alert(data.message || "Inscription réussie ! Veuillez vous connecter.")
      setIsSignUp(false)
      setnom_utilisateur("")
      setEmail("")
      setmot_de_passe("")
    } catch (err) {
      console.error("Erreur inscription :", err)
      setError("Impossible de s'inscrire pour le moment.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">Login to your Acme Inc account</p>
              </div>

              {isSignUp && (
                <Field>
                  <FieldLabel htmlFor="username">Nom d'utilisateur</FieldLabel>
                  <Input id="username" value={nom_utilisateur} onChange={(e) => setnom_utilisateur(e.target.value)} type="text" placeholder="Votre nom" />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link to="#" className="ml-auto text-sm underline-offset-2 hover:underline">Forgot your password?</Link>
                </div>
                <Input id="password" type="password" required value={mot_de_passe} onChange={(e) => setmot_de_passe(e.target.value)} />
              </Field>

              <Field>
                <Button type="submit">{isSignUp ? 'Sign up' : 'Login'}</Button>
              </Field>

              {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
              )}

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>

              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">...</Button>
                <Button variant="outline" type="button">...</Button>
                <Button variant="outline" type="button">...</Button>
              </Field>

              <FieldDescription className="text-center">Don't have an account? <Link to="/register">Sign up</Link></FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img src={CarsoLogo} alt="Carso logo" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</FieldDescription>
    </div>
  )
}

export default LoginForm