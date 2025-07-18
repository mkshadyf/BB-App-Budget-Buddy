import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Transaction } from "@shared/schema";

interface SpendingTrendsProps {
  transactions: Transaction[];
}

export default function SpendingTrends({ transactions }: SpendingTrendsProps) {
  const generateTrendData = () => {
    const now = new Date();
    const trends = [];
    
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd && t.type === "expense";
      });
      
      const weekTotal = weekTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      trends.push({
        period: `Week ${i + 1}`,
        amount: weekTotal,
        transactions: weekTransactions.length,
        isCurrentWeek: i === 0
      });
    }
    
    return trends;
  };

  const trendData = generateTrendData();
  const maxAmount = Math.max(...trendData.map(t => t.amount));
  const currentWeekSpending = trendData[trendData.length - 1]?.amount || 0;
  const previousWeekSpending = trendData[trendData.length - 2]?.amount || 0;
  
  const weeklyChange = previousWeekSpending > 0 
    ? ((currentWeekSpending - previousWeekSpending) / previousWeekSpending) * 100
    : 0;

  const formatPeriod = (period: string) => {
    const weekNum = period.split(' ')[1];
    return `W${weekNum}`;
  };

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            <span>Spending Trends</span>
          </CardTitle>
          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
            weeklyChange >= 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
          }`}>
            {weeklyChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(weeklyChange).toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendData.map((trend, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    trend.isCurrentWeek ? "bg-secondary" : "bg-muted-foreground"
                  }`} />
                  <span className={`text-sm font-medium ${
                    trend.isCurrentWeek ? "text-secondary" : "text-muted-foreground"
                  }`}>
                    {formatPeriod(trend.period)}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    trend.isCurrentWeek ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    ${trend.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trend.transactions} transactions
                  </div>
                </div>
              </div>
              <Progress 
                value={maxAmount > 0 ? (trend.amount / maxAmount) * 100 : 0} 
                className="h-2"
                indicatorClassName={trend.isCurrentWeek ? "bg-secondary" : "bg-muted-foreground"}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">This Week</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${currentWeekSpending.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            {weeklyChange >= 0 ? "↑" : "↓"} {Math.abs(weeklyChange).toFixed(1)}% from last week
          </div>
        </div>
      </CardContent>
    </Card>
  );
}