import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Home, Car, Smartphone, Trophy, Package, TrendingUp, Edit, Trash2 } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import AssetManagementModal from "@/components/asset-management-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Asset } from "@shared/schema";

export default function AssetsPage() {
  const [showAssetModal, setShowAssetModal] = useState(false);

  const { data: assets = [], isLoading } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "property": return Home;
      case "vehicle": return Car;
      case "electronics": return Smartphone;
      case "collectibles": return Trophy;
      default: return Package;
    }
  };

  const getTotalValue = () => {
    return assets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
  };

  const getAssetsByType = () => {
    return assets.reduce((acc, asset) => {
      if (!acc[asset.type]) {
        acc[asset.type] = [];
      }
      acc[asset.type].push(asset);
      return acc;
    }, {} as Record<string, Asset[]>);
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      property: "bg-emerald-500",
      vehicle: "bg-blue-500",
      electronics: "bg-purple-500",
      jewelry: "bg-yellow-500",
      collectibles: "bg-pink-500",
      investment: "bg-indigo-500",
      other: "bg-gray-500"
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Assets" />
        <main className="pb-20">
          <section className="px-4 py-6 space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid gap-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </section>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const assetsByType = getAssetsByType();
  const totalValue = getTotalValue();

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="Assets" 
        actions={[
          { icon: Plus, label: "Add Asset", onClick: () => setShowAssetModal(true) },
        ]}
      />
      
      <main className="pb-20">
        {/* Net Worth Summary */}
        <section className="px-4 py-6">
          <Card className="card-elevated gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90">Total Net Worth</h3>
                  <p className="text-3xl font-bold text-white">{formatCurrency(totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-white/80">
                Across {assets.length} asset{assets.length !== 1 ? 's' : ''} in {Object.keys(assetsByType).length} categor{Object.keys(assetsByType).length !== 1 ? 'ies' : 'y'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Assets by Category */}
        {Object.keys(assetsByType).length > 0 ? (
          <section className="px-4 space-y-4">
            {Object.entries(assetsByType).map(([type, typeAssets]) => {
              const Icon = getAssetIcon(type);
              const typeTotal = typeAssets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
              
              return (
                <Card key={type} className="card-elevated">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getTypeColor(type)} rounded-full flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">{type}</CardTitle>
                          <p className="text-sm text-muted-foreground">{formatCurrency(typeTotal)}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {typeAssets.length} item{typeAssets.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {typeAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{asset.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(parseFloat(asset.value), asset.currency)}
                          </p>
                          {asset.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {asset.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </section>
        ) : (
          /* Empty State */
          <section className="px-4 py-12">
            <Card className="card-elevated text-center">
              <CardContent className="py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Assets Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start building your net worth by adding your first asset. Track everything from your home to your bike!
                </p>
                <Button 
                  onClick={() => setShowAssetModal(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Asset
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <BottomNavigation />
      
      <AssetManagementModal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
      />
    </div>
  );
}