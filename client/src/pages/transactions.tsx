import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter, Search } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import AddTransactionModal from "@/components/add-transaction-modal";
import TransactionItem from "@/components/transaction-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@shared/schema";
import { categories } from "@shared/schema";

export default function Transactions() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Transactions" />
        <main className="pb-20">
          <section className="px-4 py-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
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
      <MobileHeader title="Transactions" />

      <main className="pb-20">
        {/* Search and Filters */}
        <section className="px-4 py-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowAddTransaction(true)}
            className="w-full bg-primary text-primary-foreground h-12 button-touch"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Transaction
          </Button>
        </section>

        {/* Transactions List */}
        <section className="px-4 mb-6">
          {filteredTransactions.length > 0 ? (
            <Card className="card-elevated">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-lg">
                  {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-elevated">
              <CardContent className="text-center py-12">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || selectedCategory !== "all" || selectedType !== "all" 
                    ? "No matching transactions" 
                    : "No transactions yet"
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== "all" || selectedType !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start tracking your finances by adding your first transaction."
                  }
                </p>
                <Button
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-primary text-primary-foreground button-touch"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <BottomNavigation />

      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
      />
    </div>
  );
}
