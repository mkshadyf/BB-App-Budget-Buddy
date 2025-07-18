import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export default function FloatingActionButton({ onClick, className = "" }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 z-40 button-floating animate-float ${className}`}
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}