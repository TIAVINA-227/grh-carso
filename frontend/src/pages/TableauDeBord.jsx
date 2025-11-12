// frontend/src/pages/TableauDeBord.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, TrendingUp } from "lucide-react";

export default function TableauDeBord() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user || !user.id) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/utilisateurs/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Fonction pour obtenir le nom complet
  const getFullName = () => {
    if (userData?.nom && userData?.prenom) {
      return `${userData.prenom} ${userData.nom}`;
    }
    if (user?.nom && user?.prenom) {
      return `${user.prenom} ${user.nom}`;
    }
    return user?.email || 'Utilisateur';
  };

  // Fonction pour obtenir le message selon l'heure
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bonne Après-midi";
    return "Bonsoir";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background dark:bg-slate-950 space-y-6">
      {/* Message de bienvenue */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-700 dark:to-blue-900 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {getGreeting()}, {getFullName()} ! 👋
        </h1>
        <p className="text-blue-100 dark:text-blue-200 text-lg">
          Bienvenue sur votre tableau de bord
        </p>
        <p className="text-blue-200 dark:text-blue-300 mt-2">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        {/* Badge rôle */}
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
          <span className="text-sm font-medium">
            Rôle : {user?.role || 'Non défini'}
          </span>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card dark:bg-slate-900 hover:shadow-lg transition-shadow border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
              Employés
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground dark:text-white">--</div>
            <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">Total des employés</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Contrats
            </CardTitle>
            <FileText className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">--</div>
            <p className="text-xs text-gray-500 mt-1">Contrats actifs</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Congés
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">--</div>
            <p className="text-xs text-gray-500 mt-1">En attente</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Performances
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">--</div>
            <p className="text-xs text-gray-500 mt-1">Moyenne générale</p>
          </CardContent>
        </Card>
      </div>

      {/* Informations de profil */}
      <Card>
        <CardHeader>
          <CardTitle>Vos informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">Rôle</span>
            <span className="font-medium capitalize">{user?.role}</span>
          </div>
          {userData?.telephone && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Téléphone</span>
              <span className="font-medium">{userData.telephone}</span>
            </div>
          )}
          {userData?.date_creation && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Membre depuis</span>
              <span className="font-medium">
                {new Date(userData.date_creation).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}