import { useLocation } from "wouter";
import { Home, ArrowLeftRight, Target, PieChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { path: "/budgets", icon: Target, label: "Budgets" },
  { path: "/reports", icon: PieChart, label: "Reports" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center py-2 px-3 h-auto touch-target ${
                isActive 
                  ? "text-secondary bg-secondary/10" 
                  : "text-muted-foreground hover:text-secondary hover:bg-secondary/5"
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
