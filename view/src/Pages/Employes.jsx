import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const Employes = () => {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/employes');
        if (!res.ok) throw new Error(`Erreur API ${res.status}`);
        const data = await res.json();
        if (mounted) setEmployes(data.data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || 'Erreur lors du chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-4 md:p-6 flex-1">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Employés</h1>
              <p className="text-sm text-gray-500">Liste complète des employés</p>
            </div>
          </header>

          <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 px-2">ID</th>
                      <th className="py-2 px-2">Nom</th>
                      <th className="py-2 px-2">Prénom</th>
                      <th className="py-2 px-2">Email</th>
                      <th className="py-2 px-2">Matricule</th>
                      <th className="py-2 px-2">Téléphone</th>
                      <th className="py-2 px-2">Date embauche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-500">Aucun employé trouvé</td>
                      </tr>
                    ) : (
                      employes.map((e) => (
                        <tr key={e.id} className="border-b">
                          <td className="py-2 px-2">{e.id}</td>
                          <td className="py-2 px-2">{e.nom}</td>
                          <td className="py-2 px-2">{e.prenom}</td>
                          <td className="py-2 px-2">{e.email}</td>
                          <td className="py-2 px-2">{e.matricule}</td>
                          <td className="py-2 px-2">{e.telephone}</td>
                          <td className="py-2 px-2">{e.date_embauche ? new Date(e.date_embauche).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Employes;
