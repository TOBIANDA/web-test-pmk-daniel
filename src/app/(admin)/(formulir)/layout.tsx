import AdminLayout from "@/components/adminLayout";

export default function FormulirLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
