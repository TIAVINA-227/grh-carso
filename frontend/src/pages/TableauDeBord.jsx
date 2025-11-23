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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Employés</p>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-blue-100/80 mt-1">Total des employés</p>
              </div>
              <Users className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-2">Contrats</p>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-emerald-100/80 mt-1">Contrats actifs</p>
              </div>
              <FileText className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-2">Congés</p>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-purple-100/80 mt-1">Demandes en attente</p>
              </div>
              <Calendar className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium mb-2">Performances</p>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-rose-100/80 mt-1">Moyenne générale</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
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