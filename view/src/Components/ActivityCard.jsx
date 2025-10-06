import React from 'react';
import { User, Clock, CheckCircle } from 'lucide-react'; 

const ActivityCard = ({ title, subtitle, type }) => {
  // Données simulées (doivent venir d'une API)
  const data = type === 'activity' ? [
    { name: 'Sophie Martin', action: 'a demandé un congé', tag: 'congé', time: 'il y a 2h', statusColor: 'bg-blue-100 text-blue-800' },
    { name: 'Tiavina', action: 'a approuvé une absence', tag: 'absence', time: 'il y a 4h', statusColor: 'bg-yellow-100 text-yellow-800' },
    { name: 'Marie Dubois', action: 'a soumis son bulletin', tag: 'bulletin', time: 'il y a 8h', statusColor: 'bg-green-100 text-green-800' },
  ] : [
    { name: 'Sophie Martin', detail: 'Congés payés', date: '15 Jan - 20 Jan' },
    { name: 'Pierre Lefebvre', detail: 'Congés maladie', date: '22 Jan - 25 Jan' },
    { name: 'Marie Dubois', detail: 'Congés payés', date: '28 Jan - 02 Fév' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

      <ul className="space-y-4">
        {data.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.name}</p>
              
              {type === 'activity' ? (
                // Vue Activité
                <p className="text-sm text-gray-600">
                  {item.action} 
                  <span className={`inline-flex items-center px-2 py-0.5 ml-2 rounded text-xs font-medium ${item.statusColor}`}>
                    {item.tag}
                  </span>
                </p>
              ) : (
                // Vue Congés
                <p className="text-sm text-gray-600">{item.detail}</p>
              )}
            </div>

            {type === 'activity' ? (
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{item.time}</span>
            ) : (
              <span className="text-sm font-medium text-gray-700 flex-shrink-0 ml-2">{item.date}</span>
            )}
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700">
         Voir tout...
      </button>
    </div>
  );
};

export default ActivityCard;