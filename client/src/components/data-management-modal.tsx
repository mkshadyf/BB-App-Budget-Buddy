import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Download, Trash2, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { exportToExcel } from "@/lib/export";

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataManagementModal({ isOpen, onClose }: DataManagementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/export");
      return response.json();
    },
    onSuccess: (data) => {
      exportToExcel(data);
      toast({
        title: "Export Successful",
        description: "Your financial data has been exported to Excel",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
    },
  });

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/clear-data");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Data Cleared",
        description: "All your financial data has been cleared",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Clear Failed",
        description: error.message || "Failed to clear data",
        variant: "destructive",
      });
    },
  });

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearDataMutation.mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 rounded-t-2xl border-0">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <DialogTitle className="text-lg font-semibold">Data Management</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="touch-target">
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Export Data Section */}
          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Download className="text-secondary w-5 h-5" />
              <h3 className="font-semibold text-foreground">Export Data</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download your financial data as an Excel file for backup or analysis.
            </p>
            <Button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              className="w-full h-12 bg-secondary hover:bg-secondary/90 touch-target"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {exportMutation.isPending ? "Exporting..." : "Export to Excel"}
            </Button>
          </div>

          {/* Clear Data Section */}
          <div className="bg-destructive/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Trash2 className="text-destructive w-5 h-5" />
              <h3 className="font-semibold text-foreground">Clear All Data</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete all your financial data. This action cannot be undone.
            </p>
            <Alert className="mb-4 border-warning/20 bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                Warning: This will permanently delete all transactions, budgets, and settings.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleClearData}
              disabled={clearDataMutation.isPending}
              variant="destructive"
              className="w-full h-12 touch-target"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {clearDataMutation.isPending ? "Clearing..." : "Clear All Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
