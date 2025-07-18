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
    <header className="bg-card/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg premium-button">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-primary">BudgetBuddy</h1>
            <p className="text-xs text-muted-foreground">Your Finance Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onAIClick && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target w-12 h-12 rounded-xl glass-button hover:bg-secondary/10"
              onClick={onAIClick}
            >
              <Bot className="text-secondary w-5 h-5" />
            </Button>
          )}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target w-12 h-12 rounded-xl glass-button hover:bg-primary/10"
              onClick={onSettingsClick}
            >
              <Settings className="text-primary w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
