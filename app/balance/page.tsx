import V7Layout from "@/components/v7/v7-layout"

export default function BalancePage() {
  return (
    <V7Layout>
      <h1 className="text-2xl font-bold mb-6">الرصيد</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-muted-foreground">تفاصيل الرصيد ستظهر هنا</p>
      </div>
    </V7Layout>
  )
}
