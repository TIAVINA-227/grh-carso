// //frontend/src/components/login-form.jsx
// import React, { useState } from "react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import { Link, useNavigate } from "react-router-dom"
// import CarsoLogo from "../assets/carso1.png"
// import { toast } from "sonner"
// import { useAuth } from "../hooks/useAuth"


// export function LoginForm({ className, ...props }) {
//   const [isSignUp, setIsSignUp] = useState(false)
//   const [nom_utilisateur, setnom_utilisateur] = useState("")
//   const [email, setEmail] = useState("")
//   const [mot_de_passe, setmot_de_passe] = useState("")
//   const [error, setError] = useState("")

//   const { setUser } = useAuth();
//   const navigate = useNavigate()
// // Connexion avec email + mot de passe
//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setError("")

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email.trim(),
//           mot_de_passe: mot_de_passe,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         setError(data.message || "Email ou mot de passe incorrect")
//         return
//       }
//       localStorage.setItem("token", data.token);
//       // Utilise le context
//       setUser(data.user);
//       navigate("/dashboard")
//       toast.success("Bienvenu, vous êtes connecté avec succès")
//     } catch (err) {
//       console.error("Erreur lors de la connexion :", err)
//       setError("Impossible de se connecter au serveur.")
//     }
//   }
// // Inscription
//   const handleSignUp = async (e) => {
//     e.preventDefault()
//     setError("")

//     try {
//       const response = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           nom_utilisateur: nom_utilisateur.trim(),
//           email: email.trim().toLowerCase(),
//           mot_de_passe,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         setError(data.error || "Erreur lors de l'inscription")
//         return
//       }

//       alert(data.message || "Inscription réussie ! Veuillez vous connecter.")
//       setIsSignUp(false)
//       setnom_utilisateur("")
//       setEmail("")
//       setmot_de_passe("")
//     } catch (err) {
//       console.error("Erreur inscription :", err)
//       setError("Impossible de s'inscrire pour le moment.")
//     }
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="overflow-hidden p-0">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           <form className="p-6 md:p-8" onSubmit={isSignUp ? handleSignUp : handleLogin}>
//             <FieldGroup>
//               <div className="flex flex-col items-center gap-2 text-center">
//                 <h1 className="text-2xl font-bold">Welcome back</h1>
//                 <p className="text-muted-foreground text-balance">Login to your Acme Inc account</p>
//               </div>

//               {isSignUp && (
//                 <Field>
//                   <FieldLabel htmlFor="username">Nom d'utilisateur</FieldLabel>
//                   <Input id="username" value={nom_utilisateur} onChange={(e) => setnom_utilisateur(e.target.value)} type="text" placeholder="Votre nom" />
//                 </Field>
//               )}

//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
//               </Field>

//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Password</FieldLabel>
//                   <Link to="#" className="ml-auto text-sm underline-offset-2 hover:underline">Forgot your password?</Link>
//                 </div>
//                 <Input id="password" type="password" required value={mot_de_passe} onChange={(e) => setmot_de_passe(e.target.value)} />
//               </Field>

//               <Field>
//                 <Button type="submit">{isSignUp ? 'Sign up' : 'Login'}</Button>
//               </Field>

//               {error && (
//                 <div className="text-sm text-red-600 text-center">{error}</div>
//               )}

//               <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>

//               <Field className="grid grid-cols-3 gap-4">
//                 <Button variant="outline" type="button">...</Button>
//                 <Button variant="outline" type="button">...</Button>
//                 <Button variant="outline" type="button">...</Button>
//               </Field>

//               <FieldDescription className="text-center">Don't have an account? <Link to="/register">Sign up</Link></FieldDescription>
//             </FieldGroup>
//           </form>

//           <div className="bg-muted relative hidden md:block">
//             <img src={CarsoLogo} alt="Carso logo" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
//           </div>
//         </CardContent>
//       </Card>

//       <FieldDescription className="px-6 text-center">By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</FieldDescription>
//     </div>
//   )
// }

// export default LoginForm
// frontend/src/components/login-form.jsx
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Field, 
  FieldGroup, 
  FieldLabel 
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { toast } from "sonner"

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
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

      console.log('✅ Réponse login:', data)

      // Utiliser la nouvelle fonction login qui décode le token
      login(data.token, {
        id: data.utilisateur?.id,
        email: data.utilisateur?.email,
        role: data.utilisateur?.role,
        nom_utilisateur: data.utilisateur?.nom_utilisateur,
        prenom_utilisateur: data.utilisateur?.prenom_utilisateur
      })

      toast.success("Connexion réussie !", {
        description: `Bienvenue ${data.utilisateur?.prenom_utilisateur || data.utilisateur?.nom_utilisateur}`
      })

      // Redirection
      setTimeout(() => {
        navigate("/dashboard")
      }, 500)

    } catch (error) {
      console.error("❌ Erreur login:", error)
      toast.error("Échec de la connexion", {
        description: error.message || "Email ou mot de passe incorrect"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenue sur Carso</h1>
                <p className="text-balance text-muted-foreground">
                  Connectez-vous à votre compte
                </p>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="mot_de_passe">Mot de passe</FieldLabel>
                    <button
                      type="button"
                      className="text-sm underline-offset-4 hover:underline"
                      onClick={() => toast.info("Fonctionnalité à venir")}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <Input
                    id="mot_de_passe"
                    name="mot_de_passe"
                    type="password"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </Field>
              </FieldGroup>

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

          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
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