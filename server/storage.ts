import { transactions, budgets, settings, type Transaction, type InsertTransaction, type Budget, type InsertBudget, type Settings, type InsertSettings } from "@shared/schema";

export interface IStorage {
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  getTransactionsByCategory(category: string): Promise<Transaction[]>;
  getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]>;

  // Budgets
  getBudgets(): Promise<Budget[]>;
  getBudget(id: number): Promise<Budget | undefined>;
  getBudgetByCategory(category: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  deleteBudget(id: number): Promise<boolean>;
  updateBudgetSpent(category: string, amount: number): Promise<void>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  // Utility
  clearAllData(): Promise<void>;
  exportData(): Promise<{ transactions: Transaction[], budgets: Budget[], settings: Settings }>;
}

export class MemStorage implements IStorage {
  private transactions: Map<number, Transaction>;
  private budgets: Map<number, Budget>;
  private settings: Settings;
  private currentTransactionId: number;
  private currentBudgetId: number;

  constructor() {
    this.transactions = new Map();
    this.budgets = new Map();
    this.settings = {
      id: 1,
      currency: "USD",
      theme: "light",
      notifications: true,
    };
    this.currentTransactionId = 1;
    this.currentBudgetId = 1;
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);

    // Update budget spent amount if it's an expense
    if (insertTransaction.type === "expense") {
      await this.updateBudgetSpent(insertTransaction.category, parseFloat(insertTransaction.amount));
    }

    return transaction;
  }

  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...updateData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const transaction = this.transactions.get(id);
    if (!transaction) return false;

    // Update budget spent amount if it was an expense
    if (transaction.type === "expense") {
      await this.updateBudgetSpent(transaction.category, -parseFloat(transaction.amount));
    }

    return this.transactions.delete(id);
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.date >= startDate && t.date <= endDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async getBudget(id: number): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }

  async getBudgetByCategory(category: string): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(b => b.category === category);
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.currentBudgetId++;
    const budget: Budget = {
      ...insertBudget,
      id,
      spent: "0",
      period: insertBudget.period || "monthly",
      createdAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: number, updateData: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;

    const updatedBudget = { ...budget, ...updateData };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  async deleteBudget(id: number): Promise<boolean> {
    return this.budgets.delete(id);
  }

  async updateBudgetSpent(category: string, amount: number): Promise<void> {
    const budget = await this.getBudgetByCategory(category);
    if (budget) {
      const newSpent = parseFloat(budget.spent) + amount;
      budget.spent = Math.max(0, newSpent).toFixed(2);
      this.budgets.set(budget.id, budget);
    }
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(updateData: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...updateData };
    return this.settings;
  }

  // Utility
  async clearAllData(): Promise<void> {
    this.transactions.clear();
    this.budgets.clear();
    this.settings = {
      id: 1,
      currency: "USD",
      theme: "light",
      notifications: true,
    };
    this.currentTransactionId = 1;
    this.currentBudgetId = 1;
  }

  async exportData(): Promise<{ transactions: Transaction[], budgets: Budget[], settings: Settings }> {
    return {
      transactions: await this.getTransactions(),
      budgets: await this.getBudgets(),
      settings: await this.getSettings(),
    };
  }
}

export const storage = new MemStorage();
