import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Target, Edit, Trash2 } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import BudgetProgress from "@/components/budget-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBudgetSchema, categories } from "@shared/schema";
import type { Budget, InsertBudget } from "@shared/schema";

export default function Budgets() {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: budgets = [], isLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const form = useForm<InsertBudget>({
    resolver: zodResolver(insertBudgetSchema),
    defaultValues: {
      category: "",
      amount: "",
      period: "monthly",
    },
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: InsertBudget) => {
      const response = await apiRequest("POST", "/api/budgets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
      form.reset();
      setShowAddBudget(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget",
        variant: "destructive",
      });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Budget deleted",
        description: "The budget has been removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete budget",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBudget) => {
    createBudgetMutation.mutate(data);
  };

  const handleDeleteBudget = (budget: Budget) => {
    if (window.confirm(`Are you sure you want to delete the ${budget.category} budget?`)) {
      deleteBudgetMutation.mutate(budget.id);
    }
  };

  const availableCategories = categories.filter(
    category => category !== "income" && !budgets.some(budget => budget.category === category)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Budgets" />
        <main className="pb-20">
          <section className="px-4 py-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </section>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Budgets" />

      <main className="pb-20">
        {/* Add Budget Button */}
        <section className="px-4 py-6">
          <Button
            onClick={() => setShowAddBudget(true)}
            disabled={availableCategories.length === 0}
            className="w-full bg-primary text-primary-foreground h-12 button-touch"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Budget
          </Button>
          {availableCategories.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              All categories already have budgets
            </p>
          )}
        </section>

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <BudgetProgress budget={budget} />
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteBudget(budget)}
                          disabled={deleteBudgetMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Summary Stats */}
        {budgets.length > 0 && (
          <section className="px-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="card-elevated">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {budgets.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Budgets</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                      {budgets.filter(b => parseFloat(b.spent) > parseFloat(b.amount)).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Over Budget</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Empty State */}
        {budgets.length === 0 && (
          <section className="px-4 mb-6">
            <Card className="card-elevated">
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No budgets yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create budgets to track your spending and reach your financial goals.
                </p>
                <Button
                  onClick={() => setShowAddBudget(true)}
                  className="bg-primary text-primary-foreground button-touch"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Budget
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <BottomNavigation />

      {/* Add Budget Modal */}
      <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
        <DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 rounded-t-2xl border-0">
          <DialogHeader className="pb-6 border-b">
            <DialogTitle className="text-lg font-semibold">Create Budget</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8 text-lg h-12"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 touch-target"
                  onClick={() => setShowAddBudget(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 touch-target bg-primary hover:bg-primary/90"
                  disabled={createBudgetMutation.isPending}
                >
                  {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
