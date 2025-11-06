//frontend/src/components/topbar.jsx
import React from "react";
import { Sun, Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Topbar({ user = { name: "Jean Dupont", avatar: "/avatars/shadcn.jpg" } }) {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger variant="outline" 
          className=" bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"/>
          <div className="w-full max-w-lg">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={16} />
              </span>
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-xl border border-border px-10 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 rounded-md hover:bg-muted/50 transition-colors">
            <Sun size={18} />
          </button>
          <button className="relative p-2 rounded-md hover:bg-muted/50 transition-colors">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse" />
          </button>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs font-medium">
                {user.name?.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline-block text-sm font-medium">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
