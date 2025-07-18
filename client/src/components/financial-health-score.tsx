import { Heart, TrendingUp, Target, PiggyBank, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface FinancialHealthScoreProps {
  totalIncome: number;
  totalExpenses: number;
  budgetCompliance: number;
  savingsRate: number;
}

export default function FinancialHealthScore({ 
  totalIncome, 
  totalExpenses, 
  budgetCompliance, 
  savingsRate 
}: FinancialHealthScoreProps) {
  
  const calculateHealthScore = () => {
    if (totalIncome === 0) return 0;
    
    // Base score on expense ratio (40% weight)
    const expenseRatio = totalExpenses / totalIncome;
    const expenseScore = Math.max(0, 100 - (expenseRatio * 100));
    
    // Budget compliance score (30% weight)
    const budgetScore = budgetCompliance;
    
    // Savings rate score (30% weight)
    const savingsScore = Math.min(100, Math.max(0, savingsRate * 5)); // 20% savings = 100 points
    
    const totalScore = (expenseScore * 0.4) + (budgetScore * 0.3) + (savingsScore * 0.3);
    return Math.round(totalScore);
  };

  const healthScore = calculateHealthScore();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Poor";
    return "Critical";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getHealthTips = () => {
    const tips = [];
    
    if (totalIncome > 0) {
      const expenseRatio = (totalExpenses / totalIncome) * 100;
      if (expenseRatio > 80) {
        tips.push("Consider reducing expenses to improve your financial health");
      }
    }
    
    if (budgetCompliance < 80) {
      tips.push("Stay within budget limits to maintain financial discipline");
    }
    
    if (savingsRate < 10) {
      tips.push("Aim to save at least 10-20% of your income");
    }
    
    if (tips.length === 0) {
      tips.push("Great job! Keep maintaining your financial discipline");
    }
    
    return tips[0]; // Return first tip
  };

  return (
    <Card className="card-elevated bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Financial Health</span>
          </CardTitle>
          <Badge variant={getScoreBadgeVariant(healthScore)}>
            {getScoreLabel(healthScore)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center">
          <div className={`text-5xl font-bold mb-2 ${getScoreColor(healthScore)}`}>
            {healthScore}
          </div>
          <div className="text-sm text-muted-foreground">Out of 100</div>
          <Progress 
            value={healthScore} 
            className="mt-4 h-3"
            indicatorClassName={healthScore >= 80 ? "bg-success" : healthScore >= 60 ? "bg-warning" : "bg-destructive"}
          />
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-xs text-muted-foreground">Expense Ratio</div>
            <div className="font-semibold">
              {totalIncome > 0 ? `${((totalExpenses / totalIncome) * 100).toFixed(0)}%` : "N/A"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-xs text-muted-foreground">Budget Compliance</div>
            <div className="font-semibold">{budgetCompliance.toFixed(0)}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <PiggyBank className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-xs text-muted-foreground">Savings Rate</div>
            <div className="font-semibold">{savingsRate.toFixed(0)}%</div>
          </div>
        </div>

        {/* Health Tip */}
        <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-foreground mb-1">Health Tip</div>
            <div className="text-xs text-muted-foreground">{getHealthTips()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}