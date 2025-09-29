import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "default" | "success" | "warning" | "info";
  trend?: "up" | "down" | "stable";
}

const StatCard = ({ title, value, subtitle, icon: Icon, color = "default", trend }: StatCardProps) => {
  const colorClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600"
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-emerald-600" />,
    down: <TrendingDown className="h-4 w-4 text-red-600" />,
    stable: <Minus className="h-4 w-4 text-gray-600" />
  };

  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    stable: "text-gray-600"
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {trend && trendIcons[trend]}
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
            {subtitle && (
              <p className={`text-sm font-medium ${trend ? trendColors[trend] : "text-muted-foreground"}`}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl shadow-sm ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;