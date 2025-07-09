"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Wallet,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Package,
  BarChart3,
  XCircle,
  Eye,
  CheckCircle,
} from "lucide-react"
import { V7StatsCard } from "@/components/v7/v7-stats-card"
import { V7ShipmentCard } from "@/app/shipments/components/v7-shipment-card"
import { V7WelcomeBanner } from "@/components/v7/v7-welcome-banner"
import { V7ShipmentLineChart } from "@/components/v7/charts/shipment-line-chart"
import { V7Content } from "@/components/v7/v7-content"
import { useGetMyWalletQuery } from "@/app/api/walletApi"
import { useGetAllOrdersQuery } from "@/app/api/ordersApi"
import { useGetMyShipmentsQuery } from "@/app/api/shipmentApi"
import { useGetHomePageStatisticsQuery, useGetShipmentStatsQuery } from "@/app/api/homePageApi"
import { useGetShipmentCompanyInfoQuery } from "@/app/api/shipmentCompanyApi"
import RechargeWalletDialog from "@/app/payments/RechargeWalletDialog"

// بيانات وهمية للإحصائيات
const statsData = {
  balance: {
    available: "76.02 ريال",
    lastTransaction: "منذ 3 ساعات",
  },
  orders: {
    today: "12 طلب",
    total: "143 طلب",
    target: "150 طلب",
    percentage: 95,
  },
  shipping: {
    averageCost: "22.00 ريال",
    totalCost: "2,158.00 ريال",
    lastMonth: "1,876.00 ريال",
    percentageChange: 15,
  },
  monthly: {
    totalShipments: {
      value: "77",
      change: "+12%",
      positive: true,
    },
    deliveryTime: {
      value: "1.8",
      change: "-0.3 يوم",
      positive: true,
    },
    customerSatisfaction: {
      value: "96%",
      change: "+2%",
      positive: true,
    },
    deliveryLocations: {
      value: "12 موقع",
      change: "+3",
      positive: true,
    },
    growthRate: {
      value: "15%",
      change: "+3%",
      positive: true,
    },
  },
}

// بيانات وهمية للشحنات الأخيرة
const recentShipments = [
  {
    id: 1003,
    from: "الرياض",
    to: "جدة",
    status: "processing",
    date: "2023/04/25",
    time: "10:30 ص",
    priority: "عادي",
    trackingNumber: "SHP1003456",
    estimatedDelivery: "2023/04/27",
    customer: "شركة الأفق للتجارة",
    items: 3,
    weight: "5.2 كجم",
    cost: "45.00 ريال",
  },
  {
    id: 1002,
    from: "الرياض",
    to: "الدمام",
    status: "transit",
    date: "2023/04/24",
    time: "09:15 ص",
    priority: "سريع",
    trackingNumber: "SHP1002456",
    estimatedDelivery: "2023/04/26",
    customer: "مؤسسة النور",
    items: 1,
    weight: "2.7 كجم",
    cost: "35.50 ريال",
  },
  {
    id: 1001,
    from: "الرياض",
    to: "مكة",
    status: "delivered",
    date: "2023/04/23",
    time: "14:45 م",
    priority: "فائق السرعة",
    trackingNumber: "SHP1001456",
    estimatedDelivery: "2023/04/25",
    customer: "محمد أحمد",
    items: 2,
    weight: "1.5 كجم",
    cost: "60.00 ريال",
  },
  {
    id: 1000,
    from: "الرياض",
    to: "المدينة المنورة",
    status: "delivered",
    date: "2023/04/10",
    time: "11:20 ص",
    priority: "عادي",
    trackingNumber: "SHP1000456",
    estimatedDelivery: "2023/04/12",
    customer: "خالد العلي",
    items: 1,
    weight: "0.8 كجم",
    cost: "28.50 ريال",
  },
  {
    id: 999,
    from: "الرياض",
    to: "الطائف",
    status: "delivered",
    date: "2023/03/29",
    time: "16:45 م",
    priority: "عادي",
    trackingNumber: "SHP0999456",
    estimatedDelivery: "2023/03/31",
    customer: "سارة محمد",
    items: 2,
    weight: "1.2 كجم",
    cost: "32.75 ريال",
  },
]

export function HomeContent({ theme = "light" }: { theme?: "light" | "dark" }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("weekly")
  const [userData, setUserData] = useState({
    name: "أحمد محمد",
    lastLogin: "اليوم، 09:45 ص",
    notifications: 3,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filteredShipments, setFilteredShipments] = useState(recentShipments.slice(0, 3))
  const { data: walletData, isLoading: walletLoading } = useGetMyWalletQuery()
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery()
  const today = new Date()
  const todayOrders = ordersData?.data.filter(order => {
    const createdAt = new Date(order.createdAt)
    return createdAt.getFullYear() === today.getFullYear() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getDate() === today.getDate()
  }) ?? []
  const { data: myShipmentsData, isLoading: myShipmentsLoading } = useGetMyShipmentsQuery({ page: 1, itemsPerPage: 2 })
  const lastTwoShipments = myShipmentsData?.data?.slice(-2) ?? []
  const { data: homeStats, isLoading: statsLoading } = useGetHomePageStatisticsQuery();
  const { data: shipmentStats, isLoading: shipmentStatsLoading } = useGetShipmentStatsQuery();
  const { data: shipmentCompanyInfo, isLoading: shipmentCompanyInfoLoading } = useGetShipmentCompanyInfoQuery();

  const [openRecharge, setOpenRecharge] = useState(false);

  // محاكاة تحميل البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // عند التحميل الأولي، عرض أحدث 3 شحنات
      setFilteredShipments(recentShipments.slice(0, 3))
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <V7Content>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="v7-loading-spinner mb-4"></div>
          <p className="text-[#3498db] text-lg">جاري تحميل لوحة التحكم...</p>
        </div>
      </V7Content>
    )
  }

  return (
    <V7Content>
      <V7WelcomeBanner theme={theme} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 v7-fade-in" style={{ transitionDelay: "0.1s" }}>
        <V7StatsCard
          title="الرصيد الحالي"
          icon={Wallet}
          color="primary"
          theme={theme}
          stats={[
            { label: "الرصيد المتاح", value: walletLoading ? "..." : (walletData?.wallet.balance !== undefined ? walletData.wallet.balance.toString() : "-") },
            { label: "تاريخ الإنشاء", value: walletLoading ? "..." : (walletData?.wallet.createdAt ? new Date(walletData.wallet.createdAt).toLocaleDateString() : "-") },
          ]}
          action={{
            label: "شحن المحفظة الآن",
            onClick: () => setOpenRecharge(true),
          }}
        />

        <V7StatsCard
          title="طلبات اليوم"
          icon={ShoppingBag}
          color="secondary"
          theme={theme}
          stats={[
            { label: "طلبات اليوم", value: ordersLoading ? "..." : todayOrders.length.toString() },
            { label: "جميع الطلبات", value: ordersLoading ? "..." : (ordersData?.data.length?.toString() ?? "-") },
           
          ]}
        />

        <V7StatsCard
          title="إحصائيات الشحن"
          icon={CreditCard}
          color="success"
          theme={theme}
          stats={[
            { label: "إجمالي قيمة الشحنات", value: shipmentStatsLoading ? "..." : (shipmentStats?.totalValue?.toLocaleString() ?? "-") + " ريال" },
            { label: "مجموع تكاليف الشحن", value: shipmentStatsLoading ? "..." : (shipmentStats?.totalShippingCost?.toLocaleString() ?? "-") + " ريال" },
            { label: "شحنات قيد الانتظار", value: shipmentStatsLoading ? "..." : (shipmentStats?.pendingShipments?.toLocaleString() ?? "-") },
            { label: "شحنات تم تسليمها", value: shipmentStatsLoading ? "..." : (shipmentStats?.deliveredShipments?.toLocaleString() ?? "-") },
            { label: "شحنات في الطريق", value: shipmentStatsLoading ? "..." : (shipmentStats?.inTransitShipments?.toLocaleString() ?? "-") },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 v7-fade-in" style={{ transitionDelay: "0.2s" }}>
        <div className="lg:col-span-2">
          <Card className="v7-neu-card overflow-hidden border-none">
            <CardHeader className="pb-0">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-[#294D8B] -mt-1">أسعار الشحن</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {shipmentCompanyInfoLoading ? (
                <div className="text-center p-4">جاري تحميل أسعار الشحن...</div>
              ) : shipmentCompanyInfo && Array.isArray(shipmentCompanyInfo) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Show each company only once */}
                  {Array.from(new Map(shipmentCompanyInfo.map(company => [company.name?.toLowerCase(), company])).values()).map((company, idx) => {
                    // Map company name to logo file
                    const name = company.name?.toLowerCase() || "";
                    let imgSrc = "/placeholder-logo.png";
                    if (name.includes("aramex")) imgSrc = "/Aramex.jpg";
                    else if (name.includes("smsa")) imgSrc = "/smsa_b2c.jpg";
                    else if (name.includes("imile")) imgSrc = "/carriers/imile-logo.png";
                    else if (name.includes("fedex")) imgSrc = "/carriers/fedex-logo.png";
                    else if (name.includes("dhl")) imgSrc = "/carriers/dhl-logo.png";
                    else if (name.includes("ups")) imgSrc = "/carriers/ups-logo.png";
                    else if (name.includes("redbox")) imgSrc = "/RedBox.jpg";
                    else if (name.includes("omniclama")) imgSrc = "/omniclama.png";
                    // Add more mappings as needed
                    return (
                      <div key={company.name + idx} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm">
                        <img src={imgSrc} alt={company.name} className="h-12 mb-2 object-contain" />
                        <div className="font-bold text-[#294D8B] mb-2">{company.name}</div>
                        <div className="w-full">
                          {company.shippingTypes && company.shippingTypes.length > 0 ? (
                            <ul className="text-sm w-full">
                              {company.shippingTypes.map((type, i) => (
                                <li key={type.type + i} className="flex justify-between border-b py-1 last:border-b-0">
                                  <span>{type.type}</span>
                                  <span className="font-bold text-[#3498db]">{type.price} ريال</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-gray-400 text-xs">لا توجد أنواع شحن متاحة</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-4">لا توجد بيانات شركات شحن</div>
              )}
              <div className="mt-4 text-xs text-gray-500 text-center">
                * الأسعار تشمل الضريبة وتختلف حسب الوزن والمسافة
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="v7-neu-card overflow-hidden border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#294D8B]">الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <Package className="h-4 w-4 text-[#294D8B]" />
                </div>
                <span className="text-sm">إجمالي الشحنات</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsLoading ? "..." : homeStats?.totalShipments ?? "-"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm bg-blue-50">
                  <Package className="h-4 w-4 text-[#3498db]" />
                </div>
                <span className="text-sm font-medium">شحنات اليوم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsLoading ? "..." : homeStats?.todaysShipments ?? "-"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
                <span className="text-sm">الشحنات المستلمة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsLoading ? "..." : homeStats?.receivedShipments ?? "-"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <XCircle className="h-4 w-4 text-[#e74c3c]" />
                </div>
                <span className="text-sm">الشحنات الملغاة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsLoading ? "..." : homeStats?.canceledShipments ?? "-"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <BarChart3 className="h-4 w-4 text-[#3498db]" />
                </div>
                <span className="text-sm">معدل النمو</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsLoading ? "..." : (homeStats?.growthRate !== undefined ? `${homeStats.growthRate}%` : "-")}</span>
              </div>
            </div>

            <Button className="mt-2 w-full v7-neu-button" onClick={() => router.push("/reports")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              تقرير مفصل
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="v7-fade-in" style={{ transitionDelay: "0.3s" }}>
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold text-[#3498db]">آخر الشحنات</h2>
        </div>

        <div className="grid gap-4">
          {myShipmentsLoading ? (
            <div className="text-center p-4">جاري تحميل الشحنات...</div>
          ) : lastTwoShipments.length === 0 ? (
            <div className="text-center p-4">لا توجد شحنات حديثة</div>
          ) : (
            lastTwoShipments.map((shipment) => (
              <V7ShipmentCard key={shipment._id} shipment={shipment} />
            ))
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Button className="v7-neu-button" onClick={() => router.push("/shipments")}>
            <Eye className="mr-2 h-4 w-4" />
            عرض جميع الشحنات
          </Button>
        </div>
      </div>
      <RechargeWalletDialog open={openRecharge} onClose={() => setOpenRecharge(false)} />
    </V7Content>
  )
}
