import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/adminAuth";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export const metadata = {
  title: "Admin Console | OneDot ABM",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login");

  const admin = await getCurrentAdmin();

  if (!admin) {
    if (!isLoginPage) {
      redirect("/admin/login");
    }
    return <>{children}</>;
  }

  // If already authenticated and navigating to login page, send to dashboard
  if (isLoginPage) {
    redirect("/admin/dashboard");
  }

  return <AdminShell currentAdmin={admin}>{children}</AdminShell>;
}
