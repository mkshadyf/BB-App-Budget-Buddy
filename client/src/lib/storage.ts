import type { Transaction, Budget, Settings } from "@shared/schema";

export interface LocalStorageData {
  transactions: Transaction[];
  budgets: Budget[];
  settings: Settings;
}

const STORAGE_KEY = "budgetBuddyData";

export const getLocalData = (): LocalStorageData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveLocalData = (data: LocalStorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
};

export const clearLocalData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};
