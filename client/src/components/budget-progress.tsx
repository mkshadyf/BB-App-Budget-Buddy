import { Progress } from "@/components/ui/progress";
import type { Budget } from "@shared/schema";

interface BudgetProgressProps {
  budget: Budget;
}

export default function BudgetProgress({ budget }: BudgetProgressProps) {
  const spent = parseFloat(budget.spent);
  const amount = parseFloat(budget.amount);
  const percentage = (spent / amount) * 100;
  const remaining = amount - spent;
  const isOverBudget = spent > amount;

  const getProgressColor = () => {
    if (isOverBudget) return "bg-destructive";
    if (percentage > 80) return "bg-warning";
    return "bg-success";
  };

  const getIndicatorColor = () => {
    if (isOverBudget) return "bg-destructive";
    if (percentage > 80) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="border-b border-border pb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getIndicatorColor()}`} />
          <span className="font-medium text-foreground capitalize">
            {budget.category.replace("_", " ")}
          </span>
        </div>
        <span className={`text-sm font-medium ${
          isOverBudget ? "text-destructive" : "text-foreground"
        }`}>
          ${spent.toFixed(2)} / ${amount.toFixed(2)}
        </span>
      </div>
      
      <Progress 
        value={Math.min(percentage, 100)} 
        className="h-2"
        indicatorClassName={getProgressColor()}
      />
      
      <div className={`mt-1 text-xs ${
        isOverBudget ? "text-destructive" : "text-muted-foreground"
      }`}>
        {isOverBudget 
          ? `$${(spent - amount).toFixed(2)} over budget`
          : `$${remaining.toFixed(2)} remaining`
        }
      </div>
    </div>
  );
}
