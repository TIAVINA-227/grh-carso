import React from 'react';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Clock } from 'lucide-react'; // Icônes populaires (ex: lucide-react)

// Mappage simple pour les icônes basées sur le titre
const iconMap = {
  'Total Employés': Users,
  "Présents Aujourd'hui": Clock,
  'Absences': Calendar,
  'Performance Moyenne': TrendingUp, // Icône par défaut, peut être affinée
  'Congés en Attente': Calendar,
  'Masse Salariale': DollarSign,
};

const StatsCard = ({ title, value, change, period, type }) => {
  const IconComponent = iconMap[title] || Users; // Récupère l'icône, ou Users par défaut
  
  const changeColor = type === 'up' 
    ? 'text-green-600 bg-green-50' 
    : 'text-red-600 bg-red-50';

  const ChangeIcon = type === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <IconComponent className="h-5 w-5 text-gray-400" />
      </div>
      
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      
      <div className="flex items-center text-xs font-medium">
        <span className={`flex items-center px-2 py-0.5 rounded-full mr-2 ${changeColor}`}>
          <ChangeIcon className="h-3 w-3 mr-1" />
          {change}
        </span>
        <span className="text-gray-500">{period}</span>
      </div>
    </div>
  );
};

export default StatsCard;