import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Target, Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBudgetSchema, categories } from "@shared/schema";
import type { InsertBudget, Budget } from "@shared/schema";

interface BudgetCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingBudgets: Budget[];
}

export default function BudgetCreationModal({ isOpen, onClose, existingBudgets }: BudgetCreationModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBudget) => {
    createBudgetMutation.mutate(data);
  };

  const availableCategories = categories.filter(
    category => category !== "income" && !existingBudgets.some(budget => budget.category === category)
  );

  // Budget recommendations based on category
  const getBudgetRecommendation = (category: string) => {
    const recommendations = {
      food: { min: 300, max: 800, suggestion: "Consider 15-20% of income" },
      transport: { min: 200, max: 600, suggestion: "Include fuel, maintenance, insurance" },
      entertainment: { min: 100, max: 400, suggestion: "Usually 5-10% of income" },
      utilities: { min: 150, max: 350, suggestion: "Water, electricity, internet, phone" },
      shopping: { min: 200, max: 500, suggestion: "Clothing, personal items" },
      healthcare: { min: 100, max: 300, suggestion: "Insurance, medications, checkups" },
      education: { min: 50, max: 500, suggestion: "Books, courses, certifications" },
      other: { min: 100, max: 300, suggestion: "Miscellaneous expenses" },
    };
    return recommendations[category as keyof typeof recommendations];
  };

  const selectedRecommendation = selectedCategory ? getBudgetRecommendation(selectedCategory) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 rounded-t-2xl border-0 max-h-[90vh] overflow-y-auto animate-slide-up">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <DialogTitle className="text-lg font-semibold flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Create Budget</span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="touch-target">
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategory(value);
                    }} 
                    defaultValue={field.value}
                  >
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

            {selectedRecommendation && (
              <Card className="bg-secondary/5 border-secondary/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Calculator className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Budget Recommendation</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedRecommendation.suggestion}
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-success" />
                          <span>Typical: ${selectedRecommendation.min} - ${selectedRecommendation.max}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                        onChange={(e) => {
                          field.onChange(e);
                          setBudgetAmount(e.target.value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {budgetAmount && selectedRecommendation && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {parseFloat(budgetAmount) < selectedRecommendation.min 
                    ? "This seems low for this category" 
                    : parseFloat(budgetAmount) > selectedRecommendation.max 
                    ? "This seems high for this category" 
                    : "This looks reasonable for this category"}
                </span>
              </div>
            )}

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Period</FormLabel>
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
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 touch-target bg-primary hover:bg-primary/90"
                disabled={createBudgetMutation.isPending || availableCategories.length === 0}
              >
                {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}