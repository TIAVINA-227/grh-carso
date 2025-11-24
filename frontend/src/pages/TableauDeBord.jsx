import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Briefcase,
  UserCheck,
  Clock,
  Award,
  DollarSign,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import imagecarso from "../assets/imagecarso 2.png";

export default function TableauDeBord() {
  // État pour les données utilisateur
  const [userData, setUserData] = useState({
    nom: "Rakoto",
    prenom: "Jean",
    email: "jean.rakoto@example.com",
    role: "ADMIN",
    avatar: null
  });

  // Données statiques pour les statistiques
  const stats = [
    {
      title: "Total Employés",
      value: "23,541",
      change: "+65%",
      isPositive: true,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Projets",
      value: "12,389",
      change: "-35%",
      isPositive: false,
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    {
      title: "Candidatures",
      value: "17,389",
      change: "+75%",
      isPositive: true,
      icon: FileText,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600"
    },
    {
      title: "Vues d'emploi",
      value: "9,993",
      change: "-25%",
      isPositive: false,
      icon: TrendingUp,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-600"
    }
  ];

  // Données pour le graphique KPI
  const kpiData = [
    { name: 'Jan', value: 45 },
    { name: 'Fév', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Avr', value: 61 },
    { name: 'Mai', value: 55 },
    { name: 'Juin', value: 67 },
    { name: 'Juil', value: 65 },
    { name: 'Août', value: 59 },
    { name: 'Sep', value: 70 },
    { name: 'Oct', value: 68 },
    { name: 'Nov', value: 75 },
    { name: 'Déc', value: 72 }
  ];

  // Données pour le format de travail
  const workFormatData = [
    { name: 'Remote', value: 210, color: '#8b5cf6' },
    { name: 'Hybrid', value: 180, color: '#3b82f6' },
    { name: 'On-site', value: 130, color: '#06b6d4' }
  ];

  // Statut des employés
  const employeeStatus = [
    { 
      id: 1, 
      name: "Aina Rakoto", 
      email: "aina.rakoto@gmail.com", 
      role: "Développeur Full-Stack", 
      status: "Actif",
      avatar: null
    },
    { 
      id: 2, 
      name: "Rova Andria", 
      email: "rova.andria@gmail.com", 
      role: "Designer UI/UX", 
      status: "Actif",
      avatar: null
    },
    { 
      id: 3, 
      name: "Nivo Razaf", 
      email: "nivo.razaf@gmail.com", 
      role: "Chef de Projet", 
      status: "En congé",
      avatar: null
    },
    { 
      id: 4, 
      name: "Faly Randria", 
      email: "faly.randria@gmail.com", 
      role: "Analyste Business", 
      status: "Disponible",
      avatar: null
    }
  ];

  // Planning hebdomadaire
  const scheduleData = [
    {
      date: "02 Juil 24",
      title: "Formation - Onboarding Designer",
      time: "09:00 - 10:00",
      type: "Formation"
    },
    {
      date: "03 Juil 24",
      title: "Meeting UI/UX Designer",
      time: "10:00 - 13:00",
      type: "Réunion"
    },
    {
      date: "04 Juil 24",
      title: "Retro Day - HR Department",
      time: "09:30 - 17:00",
      type: "Événement"
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon Après-midi";
    return "Bonsoir";
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'actif': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'en congé': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'disponible': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'formation': return 'bg-blue-500';
      case 'réunion': return 'bg-purple-500';
      case 'événement': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header avec recherche et notifications */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button size="icon" variant="outline" className="rounded-xl">
              <Bell className="h-5 w-5" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6">
              Inviter
            </Button>
          </div>
        </div>

        {/* Carte de bienvenue avec image */}
        <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Contenu texte */}
              <div className="flex-1 p-8 md:p-10">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                      {getGreeting()}, {userData.prenom}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Bienvenue sur votre tableau de bord de gestion RH
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
                    
                    <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                      <span className="font-semibold mr-1">Rôle:</span> {userData.role}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg shadow-lg">
                      <Users className="h-4 w-4 mr-2" />
                      Voir les employés
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg">
                      <FileText className="h-4 w-4 mr-2" />
                      Rapports
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image décorative */}
              <div className="relative w-full md:w-auto md:flex-shrink-0 overflow-hidden">
                <div className="relative h-64 md:h-80 md:w-80 lg:w-96 flex items-center justify-center">
                  {/* Cercles décoratifs en arrière-plan - Positionnés pour créer un effet derrière l'image */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
                  <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
                  
                  {/* Image principale avec fond transparent */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={imagecarso} 
                      alt="Dashboard Illustration" 
                      className="w-full h-full object-contain drop-shadow-[0_10px_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Image de fallback si l'image n'est pas trouvée
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback si l'image n'existe pas */}
                    <div className="w-full h-full items-center justify-center hidden">
                      <div className="text-center text-white/70">
                        <Users className="h-20 w-20 mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">Image à venir</p>
                        <p className="text-xs mt-2 opacity-70">Placez votre image dans<br/><code className="bg-white/10 px-2 py-1 rounded mt-1 inline-block">/public/images/dashboard-hero.png</code></p>
                      </div>
                    </div>
                  </div>

                  {/* Éléments décoratifs flottants */}
                  <div className="absolute top-8 right-8 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
                  <div className="absolute bottom-16 right-12 w-2 h-2 bg-green-400 rounded-full opacity-60" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-20 right-16 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <Badge variant={stat.isPositive ? "default" : "destructive"} className="rounded-full">
                    {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section principale avec graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Format de travail */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Format de travail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg width="200" height="200" className="transform -rotate-90">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="20"
                      strokeDasharray={`${(210/520) * 502} 502`}
                      strokeLinecap="round"
                    />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="20"
                      strokeDasharray={`${(180/520) * 502} 502`}
                      strokeDashoffset={`-${(210/520) * 502}`}
                      strokeLinecap="round"
                    />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="20"
                      strokeDasharray={`${(130/520) * 502} 502`}
                      strokeDashoffset={`-${((210+180)/520) * 502}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">520</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {workFormatData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KPI de l'équipe */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    KPI Moyenne de l'équipe
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">65.23%</span>
                    <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-0">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +4% last week
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kpiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Section employés et planning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statut des employés */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Statut des Employés
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* En-tête du tableau */}
                <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="col-span-4 text-xs font-semibold text-slate-600 dark:text-slate-400">NOM</div>
                  <div className="col-span-4 text-xs font-semibold text-slate-600 dark:text-slate-400">EMAIL</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-600 dark:text-slate-400">RÔLE</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-600 dark:text-slate-400">STATUT</div>
                </div>
                
                {/* Liste des employés */}
                {employeeStatus.map((employee) => (
                  <div key={employee.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg">
                    <div className="col-span-4 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {employee.name}
                      </span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {employee.email}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {employee.role}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Badge className={`${getStatusColor(employee.status)} border font-medium`}>
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Planning */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Planning
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                01 Juil - 30 Juil 2024
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleData.map((item, index) => (
                  <div key={index} className="relative pl-6 pb-4 border-l-2 border-slate-200 dark:border-slate-700 last:pb-0">
                    <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${getTypeColor(item.type)}`}></div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4 rounded-xl border-dashed">
                Voir le planning complet
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <UserCheck className="h-8 w-8 opacity-80" />
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12%
                </Badge>
              </div>
              <p className="text-sm opacity-90 mb-1">Taux de présence</p>
              <p className="text-3xl font-bold">94.5%</p>
              <Progress value={94.5} className="mt-3 h-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 opacity-80" />
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8%
                </Badge>
              </div>
              <p className="text-sm opacity-90 mb-1">Performance moyenne</p>
              <p className="text-3xl font-bold">87.2%</p>
              <Progress value={87.2} className="mt-3 h-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 opacity-80" />
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  3%
                </Badge>
              </div>
              <p className="text-sm opacity-90 mb-1">Congés en attente</p>
              <p className="text-3xl font-bold">24</p>
              <Progress value={45} className="mt-3 h-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 opacity-80" />
                <Badge className="bg-white/20 text-white border-0">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  15%
                </Badge>
              </div>
              <p className="text-sm opacity-90 mb-1">Salaire moyen</p>
              <p className="text-3xl font-bold">2.4M Ar</p>
              <Progress value={68} className="mt-3 h-2 bg-white/20" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}