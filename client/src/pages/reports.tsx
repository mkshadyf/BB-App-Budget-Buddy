import { useQuery } from "@tanstack/react-query";
import { BarChart3, PieChart, TrendingUp, DollarSign } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction, Budget } from "@shared/schema";

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categorySpending: Record<string, number>;
  budgetStatus: Array<Budget & { percentageUsed: number; remaining: number }>;
}

export default function Reports() {
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: analytics, isLoading: loadingAnalytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  const isLoading = loadingTransactions || loadingAnalytics;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Reports" />
        <main className="pb-20">
          <section className="px-4 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </section>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const categorySpendingArray = Object.entries(analytics?.categorySpending || {})
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const totalCategorySpending = categorySpendingArray.reduce((sum, item) => sum + item.amount, 0);

  const currentMonth = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Reports" />

      <main className="pb-20">
        {/* Summary Cards */}
        <section className="px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="card-elevated">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Income</span>
                </div>
                <div className="text-xl font-bold text-primary mt-1">
                  ${analytics?.totalIncome?.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
                  <span className="text-xs font-medium text-muted-foreground">Expenses</span>
                </div>
                <div className="text-xl font-bold text-destructive mt-1">
                  ${analytics?.totalExpenses?.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="text-xs font-medium text-muted-foreground">Net Savings</span>
                </div>
                <div className={`text-xl font-bold mt-1 ${
                  (analytics?.netSavings || 0) >= 0 ? "text-success" : "text-destructive"
                }`}>
                  ${analytics?.netSavings?.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-medium text-muted-foreground">Transactions</span>
                </div>
                <div className="text-xl font-bold text-secondary mt-1">
                  {transactions.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Spending by Category */}
        {categorySpendingArray.length > 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-lg">Spending by Category</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{currentMonth}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySpendingArray.map((item, index) => {
                  const percentage = (item.amount / totalCategorySpending) * 100;
                  const colors = [
                    "bg-primary",
                    "bg-secondary", 
                    "bg-warning",
                    "bg-destructive",
                    "bg-success",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-indigo-500"
                  ];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">
                          {item.category.replace("_", " ")}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ${item.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        indicatorClassName={colorClass}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Budget Performance */}
        {analytics?.budgetStatus && analytics.budgetStatus.length > 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Budget Performance</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{currentMonth}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.budgetStatus.map((budget) => (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {budget.category.replace("_", " ")}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${parseFloat(budget.spent).toFixed(2)} / ${parseFloat(budget.amount).toFixed(2)}
                        </div>
                        <div className={`text-xs ${
                          budget.percentageUsed > 100 ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {budget.percentageUsed.toFixed(1)}% used
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(budget.percentageUsed, 100)} 
                      className="h-2"
                      indicatorClassName={
                        budget.percentageUsed > 100 ? "bg-destructive" :
                        budget.percentageUsed > 80 ? "bg-warning" : "bg-success"
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Empty State */}
        {transactions.length === 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No data to report
                </h3>
                <p className="text-muted-foreground">
                  Add some transactions to see your financial reports and analytics.
                </p>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
