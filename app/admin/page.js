import { AdminDashboard } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "后台内容台 | 安心田"
};

export default function AdminPage() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <AdminDashboard />
      </div>
    </section>
  );
}
