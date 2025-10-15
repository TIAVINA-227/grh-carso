import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Topbar from "@/components/topbar";

export default function Page() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // lazy import to avoid adding global dependency if service missing
        const { getEmployes } = await import("@/services/employeService");
        const res = await getEmployes();
        if (mounted) setEmployes(res.data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Erreur lors du chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center justify-between p-0">
          <div className="flex-1">
            <Topbar />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
            <h2 className="text-lg font-semibold mb-4">Liste des employés</h2>

            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">ID</th>
                      <th className="py-2">Nom</th>
                      <th className="py-2">Prénom</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Matricule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-muted-foreground">
                          Aucun employé trouvé
                        </td>
                      </tr>
                    ) : (
                      employes.map((e) => (
                        <tr key={e.id} className="border-b">
                          <td className="py-2">{e.id}</td>
                          <td className="py-2">{e.nom}</td>
                          <td className="py-2">{e.prenom}</td>
                          <td className="py-2">{e.email}</td>
                          <td className="py-2">{e.matricule}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
