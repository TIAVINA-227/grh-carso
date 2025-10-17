import React from "react";
import { Sun, Bell, Search} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Topbar({ user = { name: "Jean Dupont", avatar: "/avatars/shadcn.jpg" } }) {


  return (
    <div className="flex items-center justify-between gap-3 p-3">
      <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger />
        <div className="w-full max-w-lg">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Search size={16} /></span>
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-xl border border-border px-10 py-2 text-sm bg-background"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-muted/50">
          <Sun />
        </button>
        <button className="relative p-2 rounded-md hover:bg-muted/50">
          <Bell />
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-xs text-white" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block text-sm">{user.name}</span>
        </div>
      </div>
    </div>
  );
}
