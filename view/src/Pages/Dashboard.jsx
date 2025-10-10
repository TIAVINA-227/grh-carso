import React from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import StatsCard from '../Components/StatCards';
import ActivityCard from '../Components/ActivityCard';
// Importer d'autres composants de graphique ici si vous les créez

const dashboardData = {
  stats: [
    { title: 'Total Employés', value: '124', change: '+12%', period: 'vs mois dernier', type: 'up' },
    { title: "Présents Aujourd'hui", value: '118', change: '95%', period: 'taux de présence', type: 'up' },
    { title: 'Absences', value: '6', change: '-3%', period: 'vs semaine dernière', type: 'down' },
    { title: 'Performance Moyenne', value: '87%', change: '+5%', period: 'vs trimestre dernier', type: 'up' },
    { title: 'Congés en Attente', value: '8', change: '3 nouveaux', period: 'cette semaine', type: 'up' },
    { title: 'Masse Salariale', value: '€485K', change: '+2%', period: 'vs mois dernier', type: 'up' },
  ],
  // ... Données pour les graphiques, activités, etc.
};

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-20 pl-45">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-4 md:p-6 flex-1">
          {/* Section d'accueil */}
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">Bienvenue, Tiavina</h1>
            <p className="text-gray-500">Voici un aperçu de votre entreprise</p>
          </header>

          {/* Cartes de Statistiques (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardData.stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Graphiques et activités (Deux colonnes) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne 1 : Graphiques (2/3 de la largeur sur grand écran) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Graphique 1 : Présences de la Semaine (Simulé) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Présences de la Semaine</h2>
                <p className="text-sm text-gray-500 mb-6">Suivi quotidien des présences et absences</p>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
                  {/* Placeholder pour le Graphique en barres */}
                  <span className="text-sm">Placeholder Graphique en Barres</span>
                </div>
              </div>

              {/* Graphique 2 : Vue par Département (Simulé) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Vue par Département</h2>
                <p className="text-sm text-gray-500 mb-6">Effectifs actuels par département</p>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
                  {/* Placeholder pour le Graphique en Barres ou Circulaire */}
                  <span className="text-sm">Placeholder Graphique par Département</span>
                </div>
              </div>

            </div>
            
            {/* Colonne 2 : Activité/Congés (1/3 de la largeur sur grand écran) */}
            <div className="lg:col-span-1 space-y-6">
              <ActivityCard 
                title="Activité Récente" 
                subtitle="Les dernières actions dans le système"
                type="activity"
              />
              <ActivityCard 
                title="Congés à Venir" 
                subtitle="Prochaines absences planifiées"
                type="conges"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;