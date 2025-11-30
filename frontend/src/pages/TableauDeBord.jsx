//frontend/src/pages/TableauDeBord.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  AlertTriangle,
  Layers
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats, getDashboardUser } from "@/services/dashboardService";
import { toast } from "sonner";
import imagecarso from "../assets/imagecarso 2.png";

export default function TableauDeBord() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // État pour les données utilisateur
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    avatar: null
  });

  // États pour les données dynamiques
  const [stats, setStats] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [employeeStatus, setEmployeeStatus] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [_rawCounts, setRawCounts] = useState({
    totalEmployes: 0,
    totalUtilisateurs: 0,
    totalContrats: 0,
    totalPresences: 0
  });
  const [additionalStats, setAdditionalStats] = useState({
    tauxAbsence: 0,
    performanceMoyenne: 0,
    totalPostes: 0,
    salaireMoyen: 0
  });
  const [showAllModules, setShowAllModules] = useState(false);

  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Charger les données utilisateur
        const userResponse = await getDashboardUser();
        if (userResponse.user) {
          setUserData({
            nom: userResponse.user.nom_utilisateur || "",
            prenom: userResponse.user.prenom_utilisateur || "",
            email: userResponse.user.email || "",
            role: userResponse.user.role || "",
            avatar: userResponse.user.avatar || null
          });
        }

        // Charger les statistiques
        const statsResponse = await getDashboardStats();
        const statsInfo = statsResponse.stats || {};
        setRawCounts(statsInfo);
        
        // Préparer les statistiques principales
        const statsArray = [
          {
            title: "Employés",
            value: statsInfo?.totalEmployes?.toLocaleString() || "0",
            change: statsResponse.statsChange?.totalEmployes || "+0%",
            isPositive: statsResponse.statsChange?.totalEmployes?.startsWith("+") || false,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-600"
          },
          {
            title: "Utilisateurs",
            value: statsInfo?.totalUtilisateurs?.toLocaleString() || "0",
            change: statsResponse.statsChange?.totalUtilisateurs || "+0%",
            isPositive: statsResponse.statsChange?.totalUtilisateurs?.startsWith("+") || false,
            icon: UserCheck,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-500/10",
            iconColor: "text-purple-600"
          },
          {
            title: "Contrats",
            value: statsInfo?.totalContrats?.toLocaleString() || "0",
            change: statsResponse.statsChange?.totalContrats || "+0%",
            isPositive: statsResponse.statsChange?.totalContrats?.startsWith("+") || false,
            icon: Briefcase,
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-600"
          },
          {
            title: "Présences",
            value: statsInfo?.totalPresences?.toLocaleString() || "0",
            change: statsResponse.statsChange?.totalPresences || "+0%",
            isPositive: statsResponse.statsChange?.totalPresences?.startsWith("+") || false,
            icon: Clock,
            color: "from-rose-500 to-rose-600",
            bgColor: "bg-rose-500/10",
            iconColor: "text-rose-600"
          }
        ];
        
        setStats(statsArray);
        setKpiData(statsResponse.kpiData || []);
        setOverviewData(statsResponse.overviewTotals || []);
        setEmployeeStatus(statsResponse.employeeStatus || []);
        setLeaveData(statsResponse.leaves || []);
        setAdditionalStats(statsResponse.additionalStats || {
          tauxAbsence: 0,
          performanceMoyenne: 0,
          totalPostes: 0,
          salaireMoyen: 0
        });
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

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

  // Calculer les valeurs pour le graphique circulaire
  const calculateOverviewChart = () => {
    if (overviewData.length === 0) return { circles: [], total: 0 };
    
    const total = overviewData.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return { circles: [], total: 0 };
    
    const circumference = 2 * Math.PI * 80; // r = 80
    const circles = [];
    let offset = 0;
    
    overviewData.forEach((item) => {
      const percentage = (item.value / total) * 100;
      const dashLength = (item.value / total) * circumference;
      circles.push({
        color: item.color,
        dashLength,
        offset: -offset,
        percentage
      });
      offset += dashLength;
    });
    
    return { circles, total };
  };

  const overviewChart = calculateOverviewChart();
  const visibleOverview = showAllModules ? overviewData : overviewData.slice(0, 5);
  const hasMoreModules = overviewData.length > 5;
  const kpiChartData = kpiData.length > 0 ? kpiData.slice(Math.max(kpiData.length - 8, 0)) : [];
  const radarData = kpiChartData.slice(-6).map((item) => ({
    subject: item.name,
    value: item.value
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Carte de bienvenue avec image */}
        <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Contenu texte */}
              <div className="flex-1 p-6 md:p-8 lg:p-10">
                <div className="space-y-5">
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                      {getGreeting()}, {userData.prenom || userData.nom || "Utilisateur"}! 👋
                    </h1>
                    <p className="text-blue-100 text-base md:text-lg">
                      Bienvenue sur votre tableau de bord de gestion RH
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-1">
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        {new Date().toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="h-5 sm:h-6 w-px bg-white/20 hidden sm:block"></div>
                    
                    <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors text-xs sm:text-sm">
                      <span className="font-semibold mr-1">Rôle:</span> {userData.role || "EMPLOYE"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                    <Button 
                      className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg shadow-lg text-sm sm:text-base"
                      onClick={() => navigate("/dashboard/employes")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Voir les employés
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10 rounded-lg text-sm sm:text-base"
                      onClick={() => navigate("/dashboard/bulletins")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Rapports
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image décorative */}
              <div className="relative w-full md:w-auto md:flex-shrink-0 overflow-hidden">
                <div className="relative h-56 sm:h-64 md:h-80 md:w-80 lg:w-96 flex items-center justify-center">
                  {/* Cercles décoratifs en arrière-plan - Positionnés pour créer un effet derrière l'image */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-36 sm:w-48 h-36 sm:h-48 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
                  <div className="absolute top-1/3 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-purple-400/20 rounded-full blur-xl"></div>
                  
                  {/* Image principale avec fond transparent */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-4">
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
                        <Users className="h-16 sm:h-20 w-16 sm:w-20 mx-auto mb-3 opacity-50" />
                        <p className="text-xs sm:text-sm font-medium">Image à venir</p>
                        <p className="text-[10px] sm:text-xs mt-2 opacity-70">Placez votre image dans<br/><code className="bg-white/10 px-2 py-1 rounded mt-1 inline-block">/public/images/dashboard-hero.png</code></p>
                      </div>
                    </div>
                  </div>

                  {/* Éléments décoratifs flottants */}
                  <div className="absolute top-6 sm:top-8 right-6 sm:right-8 w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
                  <div className="absolute bottom-12 sm:bottom-16 right-8 sm:right-12 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full opacity-60" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-16 sm:top-20 right-12 sm:right-16 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-400 rounded-full opacity-60 animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.length > 0 ? stats.map((stat, index) => {
            // Définir les styles selon l'index pour correspondre au style de Performances.jsx
            const cardStyles = [
              { gradient: "from-blue-600 to-blue-700", labelColor: "text-blue-100", iconColor: "text-blue-200" },
              { gradient: "from-blue-500 to-blue-600", labelColor: "text-blue-100", iconColor: "text-blue-200" },
              { gradient: "from-emerald-500 to-emerald-600", labelColor: "text-emerald-100", iconColor: "text-emerald-200" },
              { gradient: "from-rose-500 to-rose-600", labelColor: "text-rose-100", iconColor: "text-rose-200" }
            ];
            const style = cardStyles[index % cardStyles.length] || cardStyles[0];
            
            return (
              <Card key={index} className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${style.gradient} text-white`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${style.labelColor} text-sm font-medium mb-2`}>{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${style.iconColor}`} />
                  </div>
                </CardContent>
              </Card>
            );
          }) : (
            <div className="col-span-4 text-center py-8 text-slate-500">
              Chargement des statistiques...
            </div>
          )}
        </div>

        {/* Section principale avec graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vue globale des modules */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Vue globale des modules
                </CardTitle>
                {overviewData.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllModules((prev) => !prev)}
                  >
                    {showAllModules ? "Voir moins" : "Voir tout"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg width="200" height="200" className="transform -rotate-90">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    {overviewChart.circles.map((circle, idx) => {
                      const circumference = 2 * Math.PI * 80;
                      return (
                        <circle
                          key={idx}
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke={circle.color}
                          strokeWidth="20"
                          strokeDasharray={`${circle.dashLength} ${circumference}`}
                          strokeDashoffset={circle.offset}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {overviewChart.total}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enregistrements</p>
                  </div>
                </div>
              </div>
              <div className={`space-y-3 ${showAllModules ? '' : 'max-h-64 overflow-hidden'}`}>
                {visibleOverview.length > 0 ? visibleOverview.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white block">{Number(item.value || 0).toLocaleString()}</span>
                      <span className="text-xs text-slate-500">{Number(item.percentage || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    Aucune donnée disponible
                  </div>
                )}
              </div>
              {!showAllModules && hasMoreModules && (
                <p className="text-xs text-slate-500 mt-3">
                  +{overviewData.length - visibleOverview.length} modules supplémentaires
                </p>
              )}
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
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {additionalStats.performanceMoyenne.toFixed(2)}%
                    </span>
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
              <ResponsiveContainer width="100%" height={220}>
                {kpiChartData.length > 0 ? (
                <BarChart data={kpiChartData}>
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
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    Aucune donnée disponible
                  </div>
                )}
              </ResponsiveContainer>
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                  Radar des performances récentes
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  {radarData.length > 0 ? (
                    <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <defs>
                        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <PolarGrid 
                        stroke="#e5e7eb" 
                        strokeWidth={1}
                        radialLines={true}
                        className="dark:stroke-slate-700"
                      />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        stroke="#94a3b8" 
                        fontSize={11}
                        tick={{ fill: '#64748b' }}
                        className="dark:stroke-slate-400"
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 20]}
                        stroke="#94a3b8" 
                        tick={true}
                        tickCount={5}
                        tickFormatter={(value) => value}
                        axisLine={true}
                        fontSize={10}
                        className="dark:stroke-slate-400"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          padding: '8px 12px'
                        }}
                        labelStyle={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '4px'
                        }}
                        formatter={(value) => [`${value}/20`, 'Note']}
                      />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#radarFill)"
                        fillOpacity={0.6}
                        dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 3, stroke: '#fff' }}
                      />
                    </RadarChart>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <TrendingUp className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium">Aucune donnée disponible</p>
                      <p className="text-xs text-slate-400 mt-1">Les performances apparaîtront ici</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600"
                  onClick={() => navigate("/dashboard/employes")}
                >
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
                {employeeStatus.length > 0 ? employeeStatus.map((employee) => (
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
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    Aucun employé trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Planning */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Employés en congé
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/conges")}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Vue temps réel des congés approuvés
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveData.length > 0 ? leaveData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name || "Employé"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getTypeColor(item.type)} text-white border-0 mb-1`}>
                        {item.type}
                      </Badge>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" /> {item.dateRange}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    Aucun employé en congé
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4 rounded-xl border-dashed"
                onClick={() => navigate("/dashboard/conges")}
              >
                Consulter les congés
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-2">Taux d'absence</p>
                  <p className="text-3xl font-bold">{additionalStats.tauxAbsence.toFixed(1)}%</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">Moyenne des performances</p>
                  <p className="text-3xl font-bold">{additionalStats.performanceMoyenne.toFixed(1)}%</p>
                </div>
                <Award className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-2">Total des postes</p>
                  <p className="text-3xl font-bold">{additionalStats.totalPostes}</p>
                </div>
                <Layers className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-2">Salaire moyen</p>
                  <p className="text-3xl font-bold">
                    {additionalStats.salaireMoyen > 0 
                      ? `${(additionalStats.salaireMoyen / 1000000).toFixed(1)}M Ar`
                      : "0 Ar"
                    }
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-rose-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}