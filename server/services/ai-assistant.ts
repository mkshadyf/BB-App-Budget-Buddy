import OpenAI from "openai";
import type { Transaction, Budget } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface FinancialInsight {
  type: "alert" | "tip" | "achievement" | "warning";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface SpendingAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
  trends: Array<{ period: string; amount: number; change: number }>;
}

export class AIFinancialAssistant {
  async generateInsights(
    transactions: Transaction[], 
    budgets: Budget[]
  ): Promise<FinancialInsight[]> {
    try {
      const analysis = this.analyzeFinancialData(transactions, budgets);
      
      const prompt = `
        Analyze the following financial data and provide 2-3 actionable insights:
        
        Financial Summary:
        - Total Income: $${analysis.totalIncome}
        - Total Expenses: $${analysis.totalExpenses}
        - Net Savings: $${analysis.netSavings}
        
        Budget Status:
        ${budgets.map(b => `- ${b.category}: $${b.spent}/$${b.amount} (${((parseFloat(b.spent) / parseFloat(b.amount)) * 100).toFixed(1)}%)`).join('\n')}
        
        Top Spending Categories:
        ${analysis.topCategories.map(c => `- ${c.category}: $${c.amount} (${c.percentage}%)`).join('\n')}
        
        Provide insights in JSON format with this structure:
        {
          "insights": [
            {
              "type": "alert|tip|achievement|warning",
              "title": "Brief title",
              "message": "Actionable advice under 100 words",
              "priority": "high|medium|low"
            }
          ]
        }
        
        Focus on:
        - Budget overruns and recommendations
        - Saving opportunities
        - Spending pattern improvements
        - Achievement recognition for good habits
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a personal finance advisor AI. Provide helpful, actionable financial insights based on user data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.insights || [];
    } catch (error) {
      console.error("Error generating AI insights:", error);
      return [];
    }
  }

  async chatWithAssistant(
    message: string, 
    transactions: Transaction[], 
    budgets: Budget[]
  ): Promise<string> {
    try {
      const analysis = this.analyzeFinancialData(transactions, budgets);
      
      const context = `
        User's Financial Context:
        - Total Income: $${analysis.totalIncome}
        - Total Expenses: $${analysis.totalExpenses}
        - Net Savings: $${analysis.netSavings}
        - Active Budgets: ${budgets.length}
        - Recent Transactions: ${transactions.slice(0, 10).length}
        
        Budget Status:
        ${budgets.map(b => `- ${b.category}: $${b.spent}/$${b.amount}`).join('\n')}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a helpful personal finance assistant AI. Use the financial context provided to give personalized advice. Be friendly, concise, and actionable. Respond in plain text, not JSON.`
          },
          {
            role: "user",
            content: `${context}\n\nUser Question: ${message}`
          }
        ],
        max_tokens: 300
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again.";
    } catch (error) {
      console.error("Error in AI chat:", error);
      return "I'm experiencing technical difficulties. Please try again later.";
    }
  }

  private analyzeFinancialData(transactions: Transaction[], budgets: Budget[]): SpendingAnalysis {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netSavings = totalIncome - totalExpenses;

    // Calculate spending by category
    const categorySpending = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalExpenses) * 100)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      topCategories,
      trends: [] // Simplified for now
    };
  }
}

export const aiAssistant = new AIFinancialAssistant();
