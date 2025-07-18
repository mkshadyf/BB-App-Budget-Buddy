import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, DollarSign, Home, Car, Smartphone, Trophy, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAssetSchema, assetTypes, currencies } from "@shared/schema";
import type { InsertAsset } from "@shared/schema";

interface AssetManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetManagementModal({ isOpen, onClose }: AssetManagementModalProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAsset>({
    resolver: zodResolver(insertAssetSchema),
    defaultValues: {
      name: "",
      type: "",
      value: "",
      currency: "USD",
      description: "",
      purchaseDate: "",
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: async (data: InsertAsset) => {
      const response = await apiRequest("POST", "/api/assets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Asset added successfully",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add asset",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAsset) => {
    createAssetMutation.mutate(data);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "property": return Home;
      case "vehicle": return Car;
      case "electronics": return Smartphone;
      case "collectibles": return Trophy;
      default: return Package;
    }
  };

  const getAssetExamples = (type: string) => {
    const examples = {
      property: ["House", "Apartment", "Land", "Commercial Building"],
      vehicle: ["Car", "Motorcycle", "Bicycle", "Boat"],
      investment: ["Stocks", "Bonds", "Crypto", "Mutual Funds"],
      electronics: ["Laptop", "Phone", "TV", "Gaming Console"],
      jewelry: ["Watch", "Ring", "Necklace", "Earrings"],
      collectibles: ["Art", "Coins", "Cards", "Antiques"],
      other: ["Furniture", "Tools", "Equipment", "Books"]
    };
    return examples[type as keyof typeof examples] || [];
  };

  const AssetIcon = selectedType ? getAssetIcon(selectedType) : DollarSign;
  const examples = selectedType ? getAssetExamples(selectedType) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 rounded-t-2xl border-0 max-h-[90vh] overflow-y-auto animate-slide-up">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <DialogTitle className="text-lg font-semibold flex items-center space-x-2">
            <AssetIcon className="w-5 h-5 text-success" />
            <span>Add Asset</span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="touch-target">
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const Icon = getAssetIcon(type);
                              return <Icon className="w-4 h-4" />;
                            })()}
                            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {examples.length > 0 && (
              <Card className="bg-muted/50 border-muted">
                <CardContent className="p-4">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Examples: </span>
                    <span className="text-muted-foreground">{examples.join(", ")}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., iPhone 15 Pro, Toyota Camry"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional details about this asset..."
                      className="min-h-[80px]"
                    />
                  </FormControl>
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
                className="flex-1 h-12 touch-target bg-success hover:bg-success/90"
                disabled={createAssetMutation.isPending}
              >
                {createAssetMutation.isPending ? "Adding..." : "Add Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}