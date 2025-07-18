import OpenAI from "openai";
import type { Transaction, Budget, Asset, Settings } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface FinancialTipsRequest {
  transactions: Transaction[];
  budgets: Budget[];
  assets: Asset[];
  settings: Settings;
}

export interface FinancialTip {
  id: string;
  title: string;
  description: string;
  category: "budgeting" | "saving" | "investing" | "spending" | "debt" | "emergency";
  priority: "high" | "medium" | "low";
  actionable: boolean;
  estimatedImpact: string;
  timeframe: string;
}

export class EnhancedAITipsService {
  async generateComprehensiveTips(data: FinancialTipsRequest): Promise<FinancialTip[]> {
    try {
      const prompt = this.buildComprehensivePrompt(data);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional financial advisor with expertise in personal finance, budgeting, and wealth building. Analyze the provided financial data and generate practical, actionable tips tailored to the user's specific situation. Focus on realistic advice that can be implemented immediately.

            Return your response as a JSON array of financial tips with the following structure:
            {
              "tips": [
                {
                  "id": "unique_id",
                  "title": "Brief, actionable title",
                  "description": "Detailed explanation with specific steps",
                  "category": "budgeting|saving|investing|spending|debt|emergency",
                  "priority": "high|medium|low",
                  "actionable": true|false,
                  "estimatedImpact": "Estimated financial impact",
                  "timeframe": "How long to see results"
                }
              ]
            }

            Guidelines:
            - Provide 5-8 personalized tips based on the data
            - Make tips specific to their spending patterns and financial situation
            - Include both short-term and long-term recommendations
            - Prioritize high-impact, actionable advice
            - Consider their current net worth and cash flow
            - Address any concerning spending patterns
            - Suggest realistic budget adjustments
            - Recommend appropriate savings strategies`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.tips || [];
    } catch (error) {
      console.error("Error generating AI tips:", error);
      return this.getFallbackTips(data);
    }
  }

  private buildComprehensivePrompt(data: FinancialTipsRequest): string {
    const { transactions, budgets, assets, settings } = data;
    
    // Calculate key metrics
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalAssetValue = assets.reduce((sum, a) => sum + parseFloat(a.value), 0);
    
    const spendingByCategory = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const budgetUtilization = budgets.map(b => ({
      category: b.category,
      budgeted: parseFloat(b.amount),
      spent: parseFloat(b.spent),
      utilization: (parseFloat(b.spent) / parseFloat(b.amount)) * 100
    }));

    return `
FINANCIAL PROFILE ANALYSIS:

INCOME & EXPENSES:
- Total Monthly Income: ${settings.currency} ${totalIncome.toFixed(2)}
- Total Monthly Expenses: ${settings.currency} ${totalExpenses.toFixed(2)}
- Net Cash Flow: ${settings.currency} ${(totalIncome - totalExpenses).toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%

ASSET PORTFOLIO:
- Total Net Worth: ${settings.currency} ${totalAssetValue.toFixed(2)}
- Number of Assets: ${assets.length}
- Asset Types: ${assets.map(a => a.type).join(", ") || "None"}

SPENDING BREAKDOWN:
${Object.entries(spendingByCategory)
  .map(([category, amount]) => `- ${category}: ${settings.currency} ${amount.toFixed(2)}`)
  .join("\n")}

BUDGET PERFORMANCE:
${budgetUtilization.length > 0 
  ? budgetUtilization.map(b => 
      `- ${b.category}: ${b.utilization.toFixed(1)}% used (${settings.currency} ${b.spent.toFixed(2)}/${settings.currency} ${b.budgeted.toFixed(2)})`
    ).join("\n")
  : "- No budgets set"}

RECENT TRANSACTION PATTERNS:
- Total Transactions: ${transactions.length}
- Most Active Categories: ${Object.entries(spendingByCategory)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([category]) => category)
  .join(", ")}

Please analyze this financial profile and provide personalized recommendations for improvement.
    `;
  }

  private getFallbackTips(data: FinancialTipsRequest): FinancialTip[] {
    const fallbackTips: FinancialTip[] = [
      {
        id: "emergency-fund",
        title: "Build Emergency Fund",
        description: "Aim to save 3-6 months of expenses in a high-yield savings account for unexpected costs.",
        category: "emergency",
        priority: "high",
        actionable: true,
        estimatedImpact: "High financial security",
        timeframe: "6-12 months"
      },
      {
        id: "track-expenses",
        title: "Monitor Daily Spending",
        description: "Review your transactions weekly to identify spending patterns and potential savings.",
        category: "budgeting",
        priority: "medium",
        actionable: true,
        estimatedImpact: "5-10% expense reduction",
        timeframe: "1-2 weeks"
      },
      {
        id: "automate-savings",
        title: "Automate Your Savings",
        description: "Set up automatic transfers to savings accounts to build wealth consistently.",
        category: "saving",
        priority: "medium",
        actionable: true,
        estimatedImpact: "Increased savings rate",
        timeframe: "Immediate"
      }
    ];

    // Add specific tips based on data
    const totalExpenses = data.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    if (totalExpenses > 0) {
      const foodExpenses = data.transactions
        .filter(t => t.type === "expense" && t.category === "food")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      if (foodExpenses > totalExpenses * 0.2) {
        fallbackTips.push({
          id: "reduce-food-costs",
          title: "Optimize Food Spending",
          description: "Your food expenses are above 20% of total spending. Consider meal planning and cooking more at home.",
          category: "spending",
          priority: "medium",
          actionable: true,
          estimatedImpact: "10-15% food cost reduction",
          timeframe: "2-4 weeks"
        });
      }
    }

    return fallbackTips;
  }

  async generateQuickTip(data: FinancialTipsRequest): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor. Generate a single, concise financial tip (max 100 words) based on the user's data. Be specific and actionable."
          },
          {
            role: "user",
            content: `Based on ${data.transactions.length} transactions and ${data.budgets.length} budgets, give me one quick financial tip.`
          }
        ],
      });

      return response.choices[0].message.content || "Track your expenses daily to identify spending patterns and opportunities for savings.";
    } catch (error) {
      console.error("Error generating quick tip:", error);
      return "Track your expenses daily to identify spending patterns and opportunities for savings.";
    }
  }
}

export const enhancedAITipsService = new EnhancedAITipsService();