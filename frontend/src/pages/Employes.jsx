import React, { useEffect, useMemo, useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Topbar from "@/components/topbar";

import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function EmployesPage() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { getEmployes } = await import("@/services/employeService");
        const res = await getEmployes();
        if (mounted) setEmployes(res.data || []);
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

  const filtered = useMemo(() => {
    if (!query) return employes;
    const q = query.toLowerCase();
    return employes.filter(e =>
      `${e.nom} ${e.prenom}`.toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.matricule || '').toLowerCase().includes(q)
    );
  }, [employes, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  useEffect(() => { setPage(1); }, [query]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        <Topbar user={{ name: 'Jean Dupont', avatar: '/avatars/shadcn.jpg' }} />

        <main className="p-4 md:p-6 flex-1">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Employés</h1>
              <p className="text-sm text-gray-500">Liste complète des employés</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom, email ou matricule"
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </header>

          <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>
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
                      {current.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-gray-500">Aucun employé trouvé</td>
                        </tr>
                      ) : (
                        current.map((e) => (
                          <tr key={e.id} className="border-b hover:bg-gray-50">
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

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Affichage {filtered.length} résultats</div>
                  <div className="flex items-center gap-2">
                    <button
                      className={cn('px-2 py-1 rounded-md border', page <= 1 ? 'opacity-50 cursor-not-allowed' : '')}
                      onClick={() => setPage(p => Math.max(1, p-1))}
                      disabled={page <= 1}
                    >Préc</button>
                    <div className="text-sm">{page} / {totalPages}</div>
                    <button
                      className={cn('px-2 py-1 rounded-md border', page >= totalPages ? 'opacity-50 cursor-not-allowed' : '')}
                      onClick={() => setPage(p => Math.min(totalPages, p+1))}
                      disabled={page >= totalPages}
                    >Suiv</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
