import { PiggyBank, AlertTriangle, TrendingDown, Plus, Target, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BrokeStateProps {
  onAddTransaction: () => void;
  onCreateBudget: () => void;
  onAddAsset: () => void;
  hasTransactions: boolean;
  hasBudgets: boolean;
  hasAssets: boolean;
}

export default function BrokeState({
  onAddTransaction,
  onCreateBudget,
  onAddAsset,
  hasTransactions,
  hasBudgets,
  hasAssets
}: BrokeStateProps) {
  
  const getMissingItems = () => {
    const missing = [];
    if (!hasTransactions) missing.push("transactions");
    if (!hasBudgets) missing.push("budgets");
    if (!hasAssets) missing.push("assets");
    return missing;
  };

  const missingItems = getMissingItems();
  const isTotallyBroke = missingItems.length === 3;

  if (isTotallyBroke) {
    return (
      <Card className="card-elevated bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <PiggyBank className="w-16 h-16 text-destructive animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive-foreground" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl text-destructive mb-2">
            You're Financially Invisible! 💸
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            No transactions, no budgets, no assets = No financial data to analyze
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-destructive/10 rounded-lg">
            <TrendingDown className="w-8 h-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-destructive mb-1">Reality Check</h3>
            <p className="text-sm text-muted-foreground">
              Without data, your financial health score is 0/100. Time to start tracking!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-center">Get Started in 3 Steps:</h4>
            
            <div className="grid gap-3">
              <Button
                onClick={onAddTransaction}
                className="w-full btn-primary-gradient h-12 text-left flex items-center justify-start space-x-3 text-white"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full text-white">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Add Your First Transaction</div>
                  <div className="text-xs opacity-80 text-white">Track income or expenses</div>
                </div>
                <Plus className="w-5 h-5 text-white" />
              </Button>

              <Button
                onClick={onCreateBudget}
                className="w-full btn-outline-secondary h-12 text-left flex items-center justify-start space-x-3"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-secondary/20 rounded-full text-secondary">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Create a Budget</div>
                  <div className="text-xs opacity-80">Set spending limits</div>
                </div>
                <Target className="w-5 h-5" />
              </Button>

              <Button
                onClick={onAddAsset}
                className="w-full btn-outline-success h-12 text-left flex items-center justify-start space-x-3"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-success/20 rounded-full text-success">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Add Your Assets</div>
                  <div className="text-xs opacity-80">Track your net worth</div>
                </div>
                <DollarSign className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Start with just one transaction - even a $5 coffee purchase. 
              Small steps lead to big financial insights!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Partial broke state - missing some data
  return (
    <Card className="card-elevated bg-gradient-to-br from-warning/5 to-secondary/5 border-warning/20">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <PiggyBank className="w-12 h-12 text-warning" />
        </div>
        <CardTitle className="text-xl text-warning mb-2">
          Your Financial Picture is Incomplete
        </CardTitle>
        <p className="text-muted-foreground">
          Missing: {missingItems.join(", ")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {missingItems.map(item => (
            <Badge key={item} variant="secondary" className="bg-warning/10 text-warning">
              Missing {item}
            </Badge>
          ))}
        </div>
        
        <div className="grid gap-2">
          {!hasTransactions && (
            <Button
              onClick={onAddTransaction}
              size="sm"
              className="w-full btn-primary-gradient text-white"
            >
              <Plus className="w-4 h-4 mr-2 text-white" />
              Add Transaction
            </Button>
          )}
          {!hasBudgets && (
            <Button
              onClick={onCreateBudget}
              size="sm"
              className="w-full btn-outline-secondary"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          )}
          {!hasAssets && (
            <Button
              onClick={onAddAsset}
              size="sm"
              className="w-full btn-outline-success"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Add Assets
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}