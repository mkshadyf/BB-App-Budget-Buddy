import { ArrowUpRight, ArrowDownRight, Activity, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  transactionCount: number;
}

export default function QuickStats({ 
  totalIncome, 
  totalExpenses, 
  netSavings, 
  transactionCount 
}: QuickStatsProps) {
  
  const stats = [
    {
      label: "Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: ArrowUpRight,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      label: "Expenses", 
      value: `$${totalExpenses.toFixed(2)}`,
      icon: ArrowDownRight,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20"
    },
    {
      label: "Net Savings",
      value: `$${netSavings.toFixed(2)}`,
      icon: Activity,
      color: netSavings >= 0 ? "text-success" : "text-warning",
      bgColor: netSavings >= 0 ? "bg-success/10" : "bg-warning/10",
      borderColor: netSavings >= 0 ? "border-success/20" : "border-warning/20"
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      icon: Receipt,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`card-elevated ${stat.bgColor} ${stat.borderColor} border animate-scale-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {stat.label}
                </p>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}