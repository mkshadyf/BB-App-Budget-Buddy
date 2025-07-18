import { Wallet, Bot, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title?: string;
  onAIClick?: () => void;
  onSettingsClick?: () => void;
}

export default function MobileHeader({ 
  title = "BB - BudgetBuddy", 
  onAIClick, 
  onSettingsClick 
}: MobileHeaderProps) {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {onAIClick && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={onAIClick}
            >
              <Bot className="text-secondary w-5 h-5" />
            </Button>
          )}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={onSettingsClick}
            >
              <Settings className="text-muted-foreground w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
