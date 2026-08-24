import Sidebar from "@/features/admin/components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      <Sidebar />
      <div className="min-w-0 flex-1 pl-[230px] w-full">
        {children}
      </div>
    </div>
  );
}
