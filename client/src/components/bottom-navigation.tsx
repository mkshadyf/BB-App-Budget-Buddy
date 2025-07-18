import { useLocation } from "wouter";
import { Home, ArrowLeftRight, Target, PieChart, Settings, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { path: "/budgets", icon: Target, label: "Budgets" },
  { path: "/assets", icon: Gem, label: "Assets" },
  { path: "/reports", icon: PieChart, label: "Reports" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navigationItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center py-3 px-2 h-auto touch-target rounded-xl transition-all duration-200 ${
                isActive 
                  ? "nav-item-active scale-105 shadow-lg" 
                  : "nav-item-inactive"
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-bounce-subtle' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
