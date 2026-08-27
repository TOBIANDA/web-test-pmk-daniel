import DashboardPageMain from "@/features/admin/pages/dashboard/dashboardPageMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Panel kendali utama pengelolaan informasi dan pelayanan PMK Daniel FILKOM Universitas Brawijaya.",
};

export default function DashboardPage() {
  return <DashboardPageMain />;
}