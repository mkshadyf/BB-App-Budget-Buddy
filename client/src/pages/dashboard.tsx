import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Target, Download, TrendingUp, ArrowUp, ArrowDown, Bot, Lightbulb, TrendingDown } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import AddTransactionModal from "@/components/add-transaction-modal";
import AIAssistantModal from "@/components/ai-assistant-modal";
import DataManagementModal from "@/components/data-management-modal";
import BudgetCreationModal from "@/components/budget-creation-modal";
import AssetManagementModal from "@/components/asset-management-modal";
import TransactionItem from "@/components/transaction-item";
import BudgetProgress from "@/components/budget-progress";
import FinancialHealthScore from "@/components/financial-health-score";
import QuickStats from "@/components/quick-stats";
import SpendingTrends from "@/components/spending-trends";
import FloatingActionButton from "@/components/floating-action-button";
import BrokeState from "@/components/broke-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction, Budget } from "@shared/schema";

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categorySpending: Record<string, number>;
  budgetStatus: Array<Budget & { percentageUsed: number; remaining: number }>;
}

interface AIInsight {
  type: "alert" | "tip" | "achievement" | "warning";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export default function Dashboard() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showBudgetCreation, setShowBudgetCreation] = useState(false);
  const [showAssetManagement, setShowAssetManagement] = useState(false);

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: budgets = [], isLoading: loadingBudgets } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: assets = [], isLoading: loadingAssets } = useQuery<any[]>({
    queryKey: ["/api/assets"],
  });

  const { data: analytics, isLoading: loadingAnalytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  const { data: insights = [] } = useQuery<AIInsight[]>({
    queryKey: ["/api/ai/insights"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const recentTransactions = transactions.slice(0, 5);
  const isLoading = loadingTransactions || loadingBudgets || loadingAnalytics || loadingAssets;
  
  // Check if user has any financial data
  const hasTransactions = transactions.length > 0;
  const hasBudgets = budgets.length > 0;
  const hasAssets = assets.length > 0;
  const hasAnyData = hasTransactions || hasBudgets || hasAssets;

  // Calculate financial health metrics
  const calculateBudgetCompliance = () => {
    if (budgets.length === 0) return 100;
    const compliantBudgets = budgets.filter(b => parseFloat(b.spent) <= parseFloat(b.amount));
    return (compliantBudgets.length / budgets.length) * 100;
  };

  const calculateSavingsRate = () => {
    if (!analytics?.totalIncome || analytics.totalIncome === 0) return 0;
    return (analytics.netSavings / analytics.totalIncome) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <main className="pb-20">
          <section className="px-4 py-6 space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </section>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  // Show broke state if user has no financial data
  if (!hasAnyData) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader 
          onAIClick={() => setShowAIAssistant(true)}
          onSettingsClick={() => setShowDataManagement(true)}
        />
        <main className="pb-20">
          <section className="px-4 py-6">
            <BrokeState
              onAddTransaction={() => setShowAddTransaction(true)}
              onCreateBudget={() => setShowBudgetCreation(true)}
              onAddAsset={() => setShowAssetManagement(true)}
              hasTransactions={hasTransactions}
              hasBudgets={hasBudgets}
              hasAssets={hasAssets}
            />
          </section>
        </main>
        <BottomNavigation />
        
        {/* Modals */}
        <AddTransactionModal
          isOpen={showAddTransaction}
          onClose={() => setShowAddTransaction(false)}
        />
        <BudgetCreationModal
          isOpen={showBudgetCreation}
          onClose={() => setShowBudgetCreation(false)}
        />
        <AssetManagementModal
          isOpen={showAssetManagement}
          onClose={() => setShowAssetManagement(false)}
        />
        <AIAssistantModal
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
        />
        <DataManagementModal
          isOpen={showDataManagement}
          onClose={() => setShowDataManagement(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader
        onAIClick={() => setShowAIAssistant(true)}
        onSettingsClick={() => setShowDataManagement(true)}
      />

      <main className="pb-20">
        {/* Financial Health Score */}
        <section className="px-4 py-6">
          <FinancialHealthScore
            totalIncome={analytics?.totalIncome || 0}
            totalExpenses={analytics?.totalExpenses || 0}
            budgetCompliance={calculateBudgetCompliance()}
            savingsRate={calculateSavingsRate()}
          />
        </section>

        {/* Quick Stats */}
        <section className="px-4 mb-6">
          <QuickStats
            totalIncome={analytics?.totalIncome || 0}
            totalExpenses={analytics?.totalExpenses || 0}
            netSavings={analytics?.netSavings || 0}
            transactionCount={transactions.length}
          />
        </section>

        {/* Spending Trends */}
        {transactions.length > 0 && (
          <section className="px-4 mb-6">
            <SpendingTrends transactions={transactions} />
          </section>
        )}

        {/* Quick Actions */}
        <section className="px-4 mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              onClick={() => setShowBudgetCreation(true)}
              className="flex-shrink-0 btn-outline-secondary px-6 py-3 h-auto min-w-max button-touch"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
            <Button
              onClick={() => setShowDataManagement(true)}
              className="flex-shrink-0 btn-outline-warning px-6 py-3 h-auto min-w-max button-touch"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </section>

        {/* Budget Progress */}
        {budgets.length > 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Budget Overview</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgets.map((budget) => (
                  <BudgetProgress key={budget.id} budget={budget} />
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-secondary">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* AI Assistant Insights */}
        {insights.length > 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated gradient-primary text-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Bot className="text-white w-4 h-4" />
                  </div>
                  <CardTitle className="text-lg text-white">AI Assistant Insights</CardTitle>
                </div>
                <div className="space-y-3">
                  {insights.slice(0, 2).map((insight, index) => (
                    <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="text-warning w-4 h-4 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium mb-1">{insight.title}</p>
                          <p className="text-xs text-white/80">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setShowAIAssistant(true)}
                  variant="secondary"
                  className="mt-4 w-full button-touch"
                >
                  Chat with AI Assistant
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Empty State */}
        {transactions.length === 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardContent className="text-center py-12">
                <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No transactions yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking your finances by adding your first transaction.
                </p>
                <Button
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-primary text-primary-foreground button-touch"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Transaction
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <BottomNavigation />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowAddTransaction(true)} />

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
      />
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
      <DataManagementModal
        isOpen={showDataManagement}
        onClose={() => setShowDataManagement(false)}
      />
      <BudgetCreationModal
        isOpen={showBudgetCreation}
        onClose={() => setShowBudgetCreation(false)}
        existingBudgets={budgets}
      />
      <AssetManagementModal
        isOpen={showAssetManagement}
        onClose={() => setShowAssetManagement(false)}
      />
    </div>
  );
}
