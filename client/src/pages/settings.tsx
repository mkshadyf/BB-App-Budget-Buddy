import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Settings as SettingsIcon, 
  Download, 
  Trash2, 
  Globe, 
  Bell, 
  Palette, 
  Info,
  ChevronRight,
  Shield,
  HelpCircle
} from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import DataManagementModal from "@/components/data-management-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertSettingsSchema } from "@shared/schema";
import type { Settings, InsertSettings } from "@shared/schema";

export default function Settings() {
  const [showDataManagement, setShowDataManagement] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<InsertSettings>({
    resolver: zodResolver(insertSettingsSchema),
    values: settings ? {
      currency: settings.currency,
      theme: settings.theme,
      notifications: settings.notifications,
    } : undefined,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: InsertSettings) => {
      const response = await apiRequest("PUT", "/api/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSettings) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Settings" />
        <main className="pb-20">
          <section className="px-4 py-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </section>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Settings" />

      <main className="pb-20">
        {/* App Preferences */}
        <section className="px-4 py-6">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                <span>App Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-muted-foreground" />
                            <FormLabel className="text-base font-medium">Currency</FormLabel>
                          </div>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-24 h-10">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                              <SelectItem value="AUD">AUD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Palette className="w-5 h-5 text-muted-foreground" />
                            <FormLabel className="text-base font-medium">Theme</FormLabel>
                          </div>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-28 h-10">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <FormLabel className="text-base font-medium">Notifications</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={updateSettingsMutation.isPending}
                    className="w-full h-12 bg-primary text-primary-foreground button-touch"
                  >
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {/* Data Management */}
        <section className="px-4 mb-6">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5 text-secondary" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 justify-between button-touch"
                onClick={() => setShowDataManagement(true)}
              >
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-secondary" />
                  <span>Export & Backup</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Your financial data is stored locally on your device for complete privacy. 
                  Export your data regularly to create backups.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* About */}
        <section className="px-4 mb-6">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Info className="w-5 h-5 text-warning" />
                <span>About</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <SettingsIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">BB - BudgetBuddy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Personal Finance Management
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Version 1.0.0</p>
                  <p>Built with privacy in mind</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Info className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Terms of Service</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="px-4 mb-6">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-xs font-medium text-foreground">100% Private</div>
                  <div className="text-xs text-muted-foreground">Local storage only</div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Download className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-xs font-medium text-foreground">Export Ready</div>
                  <div className="text-xs text-muted-foreground">Excel backup</div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mx-auto">
                    <SettingsIcon className="w-5 h-5 text-warning" />
                  </div>
                  <div className="text-xs font-medium text-foreground">AI Powered</div>
                  <div className="text-xs text-muted-foreground">Smart insights</div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
                    <Globe className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-xs font-medium text-foreground">Mobile First</div>
                  <div className="text-xs text-muted-foreground">Touch optimized</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNavigation />

      <DataManagementModal
        isOpen={showDataManagement}
        onClose={() => setShowDataManagement(false)}
      />
    </div>
  );
}
