import { cn } from "@/lib/utils"

export function FullscreenLoader({ label = "Chargement...", className }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </div>
  )
}