import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  UtensilsCrossed, 
  Car, 
  Gamepad2, 
  Zap, 
  ShoppingBag, 
  Heart, 
  GraduationCap, 
  DollarSign,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Transaction } from "@shared/schema";

const categoryIcons = {
  food: UtensilsCrossed,
  transport: Car,
  entertainment: Gamepad2,
  utilities: Zap,
  shopping: ShoppingBag,
  healthcare: Heart,
  education: GraduationCap,
  income: DollarSign,
  other: MoreHorizontal,
};

const categoryColors = {
  food: "bg-red-100 text-red-600",
  transport: "bg-blue-100 text-blue-600",
  entertainment: "bg-purple-100 text-purple-600",
  utilities: "bg-yellow-100 text-yellow-600",
  shopping: "bg-pink-100 text-pink-600",
  healthcare: "bg-green-100 text-green-600",
  education: "bg-indigo-100 text-indigo-600",
  income: "bg-green-100 text-green-600",
  other: "bg-gray-100 text-gray-600",
};

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const [isSwipedRight, setIsSwipedRight] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const Icon = categoryIcons[transaction.category as keyof typeof categoryIcons] || MoreHorizontal;
  const colorClass = categoryColors[transaction.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-600";

  const deleteTransactionMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/transactions/${transaction.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const handleSwipe = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      if (diff > 80) {
        setIsSwipedRight(true);
      } else if (diff < -20) {
        setIsSwipedRight(false);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatAmount = (amount: string, type: string) => {
    const prefix = type === "income" ? "+" : "-";
    return `${prefix}$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete Button (shown when swiped) */}
      {isSwipedRight && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          <Button
            variant="destructive"
            size="sm"
            className="h-full rounded-none px-6"
            onClick={() => deleteTransactionMutation.mutate()}
            disabled={deleteTransactionMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Transaction Content */}
      <div
        className={`p-4 hover:bg-muted/50 transition-all duration-200 ${
          isSwipedRight ? "transform translate-x-[-80px]" : ""
        }`}
        onTouchStart={handleSwipe}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">
                {transaction.description}
              </span>
              <span className={`font-semibold ${
                transaction.type === "income" ? "income-color" : "expense-color"
              }`}>
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground capitalize">
                {transaction.category.replace("_", " ")}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
