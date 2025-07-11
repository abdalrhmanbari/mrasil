"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Eye,
  Printer,
  ArrowLeft,
  Store,
  ShoppingCart,
} from "lucide-react"

interface V7ShipmentCardProps {
  shipment: {
    _id: string;
    dimension: { high: number; width: number; length: number };
    customerId: { _id: string; firstName: string; lastName: string; email: string };
    orderId: string;
    senderAddress: { full_name: string; mobile: string; city: string; country: string; address: string };
    boxNum: number;
    weight: number;
    orderDescription: string;
    shapmentingType: string;
    shapmentCompany: string;
    shapmentType: string;
    shapmentPrice: number;
    orderSou: string;
    priceaddedtax: number;
    byocPrice: number;
    basepickUpPrice: number;
    profitpickUpPrice: number;
    baseRTOprice: number;
    createdAt: string;
    redboxResponse?: { label: string };
    aramexResponse?: { labelURL: string };
    omniclamaResponse?: { label: string };
    smsaResponse?: { label: string };
    pricing?: Record<string, any>; // Added pricing to the interface
  }
}

export function V7ShipmentCard({ shipment }: V7ShipmentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!shipment || !shipment._id) {
    return null;
  }

  // Helper functions for status, etc. (use dummy logic or map as needed)
  const getStatusIcon = () => <Package className="h-5 w-5 text-violet-500" />
  const getStatusText = () => "جاهز للشحن"
  const getStatusColor = () => "bg-violet-50 text-violet-700 border-violet-200"

  // Carrier details
  const getCarrierDetails = (carrier: string) => {
    const normalizedCarrier = carrier?.toLowerCase().trim()
    const carrierDetails: Record<string, { name: string; logo: string; color: string }> = {
      aramex: { name: "أرامكس", logo: "/carriers/aramex-logo.png", color: "text-red-600" },
      dhl: { name: "دي إتش إل", logo: "/carriers/dhl-logo.png", color: "text-yellow-600" },
      fedex: { name: "فيديكس", logo: "/carriers/fedex-logo.png", color: "text-purple-600" },
      ups: { name: "يو بي إس", logo: "/carriers/ups-logo.png", color: "text-brown-600" },
      smsa: { name: "سمسا", logo: "/carriers/carrier-placeholder.png", color: "text-blue-600" },
      imile: { name: "آي مايل", logo: "/carriers/imile-logo.png", color: "text-green-600" },
      redbox: { name: "ريد بوكس", logo: "/carriers/carrier-placeholder.png", color: "text-pink-600" },
    }
    return carrierDetails[normalizedCarrier] || { name: carrier, logo: "/carriers/carrier-placeholder.png", color: "text-gray-600" }
  }
  const carrierInfo = getCarrierDetails((shipment && shipment.shapmentCompany) ? shipment.shapmentCompany : "unknown")

  // Helper: Get label URL for printing
  const getLabelUrl = () => {
    const company = (shipment.shapmentCompany || '').toLowerCase();
    if (company === 'redbox' && shipment.redboxResponse && shipment.redboxResponse.label) {
      return shipment.redboxResponse.label;
    }
    if (company === 'aramex' && shipment.aramexResponse && shipment.aramexResponse.labelURL) {
      return shipment.aramexResponse.labelURL;
    }
    if (company === 'omniclama' && shipment.omniclamaResponse && shipment.omniclamaResponse.label) {
      return shipment.omniclamaResponse.label;
    }
    if (company === 'smsa' && shipment.smsaResponse && shipment.smsaResponse.label) {
      return shipment.smsaResponse.label;
    }
    // Add more companies as needed
    return null;
  };
  const labelUrl = getLabelUrl();

  return (
    <div
      className={`v7-neu-card-inner rounded-xl p-6 transition-all duration-300 border border-gray-100 w-full min-h-[220px] flex flex-col md:flex-row items-stretch gap-6 bg-white ${isHovered ? "shadow-md transform -translate-y-0.5" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
      style={{ position: 'relative' }}
    >
      {/* Left: Main Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="flex flex-col gap-3 w-full">
          {/* Carrier */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-md px-3 py-1 text-lg font-bold ${carrierInfo.color}`}> 
              <div className="h-7 w-7 ml-2 relative overflow-hidden">
                <Image src={carrierInfo.logo || "/placeholder.svg"} alt={carrierInfo.name} width={28} height={28} className="object-contain" />
                    </div>
                    {carrierInfo.name}
                </span>
              </div>
          {/* Order Number */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-2xl text-[#294D8B] whitespace-nowrap">رقم الشحنة #{shipment._id}</span>
            </div>
          {/* Order ID */}
          <div className="flex items-center gap-3">
            <span className="text-lg text-[#6d6a67]">رقم الطلب: <span className="font-medium ml-2">{shipment.orderId}</span></span>
              </div>
          {/* City/Address */}
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span className="text-lg text-emerald-700 font-medium">{shipment.senderAddress.city}</span>
            <span className="text-lg text-[#294D8B] font-medium">{shipment.senderAddress.address}</span>
          </div>
          {/* Status */}
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-x-3 px-4 py-2 rounded-full text-lg font-bold border ${getStatusColor()} justify-center`}>
              <span className="ml-2">{getStatusIcon()}</span>
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Actions and More/Less */}
      <div className="flex flex-col items-end justify-between min-w-[180px] gap-2">
        <div className="flex flex-col gap-2 w-full">
            <Link href={`/tracking?id=${shipment._id}`} className="w-full" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2">
              <Eye className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                <span className="sr-only sm:not-sr-only">تتبع</span>
              </Button>
            </Link>
            {labelUrl ? (
              <a
                href={labelUrl}
                className="w-full"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
              <Button variant="outline" size="sm" className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2">
                <Printer className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                  <span className="sr-only sm:not-sr-only">طباعة بوالص الشحن</span>
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                size="sm"
              className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2 opacity-50 cursor-not-allowed"
                disabled
              >
              <Printer className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">طباعة بوالص الشحن</span>
              </Button>
            )}
          </div>
        <Button variant="ghost" size="sm" className="text-xs text-[#6d6a67] hover:text-[#3498db] flex items-center gap-x-2 h-7 px-4 mt-2" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "عرض أقل" : "عرض المزيد"}
        </Button>
        </div>
      {/* Expanded Details - 3-column layout, visually extends the card */}
        {isExpanded && (
        <div className="w-full">
          <div className="bg-[#f7fafd] rounded-b-xl shadow-sm p-6 mt-0 w-full max-w-none flex flex-col items-center border-t border-blue-50">
            <div className="w-full flex flex-col md:flex-row md:justify-between gap-8">
              {/* Shipment Details */}
              <div className="flex-1 min-w-[180px]">
                <div className="text-[#294D8B] font-bold mb-2 text-center">تفاصيل الشحنة</div>
                {[
                  ["رقم التتبع", shipment.orderId],
                  ["الوزن", typeof shipment.weight === 'number' ? `${shipment.weight} كجم` : shipment.weight],
                  ["الأبعاد", (typeof shipment.dimension?.length === 'number' && typeof shipment.dimension?.width === 'number' && typeof shipment.dimension?.high === 'number') ? `${shipment.dimension.length} × ${shipment.dimension.width} × ${shipment.dimension.high} سم` : "-"],
                  ["شركة الشحن", shipment.shapmentCompany],
                ].map(([label, value]) => (
                  (typeof value === 'string' || typeof value === 'number') && value !== undefined && value !== null ? (
                    <div key={label} className="flex justify-between items-center text-base py-1">
                      <span className="text-[#6d6a67]">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ) : null
                ))}
              </div>
              {/* Recipient Info */}
              <div className="flex-1 min-w-[180px]">
                <div className="text-[#294D8B] font-bold mb-2 text-center">معلومات المستلم</div>
                {[
                  ["الاسم", `${shipment.customerId?.firstName ?? ''} ${shipment.customerId?.lastName ?? ''}`.trim()],
                  ["البريد الإلكتروني", shipment.customerId?.email],
                ].map(([label, value]) => (
                  (typeof value === 'string' || typeof value === 'number') && value !== undefined && value !== null ? (
                    <div key={label} className="flex justify-between items-center text-base py-1">
                      <span className="text-[#6d6a67]">{label}:</span>
                      <span className="font-medium">{value}</span>
                </div>
                  ) : null
                ))}
              </div>
              {/* Sender Info */}
              <div className="flex-1 min-w-[180px]">
                <div className="text-[#294D8B] font-bold mb-2 text-center">معلومات المرسل</div>
                {[
                  ["الاسم", shipment.senderAddress?.full_name],
                  ["الهاتف", shipment.senderAddress?.mobile],
                  ["العنوان", shipment.senderAddress?.address],
                  ["المدينة", shipment.senderAddress?.city],
                ].map(([label, value]) => (
                  (typeof value === 'string' || typeof value === 'number') && value !== undefined && value !== null ? (
                    <div key={label} className="flex justify-between items-center text-base py-1">
                      <span className="text-[#6d6a67]">{label}:</span>
                      <span className="font-medium">{value}</span>
                </div>
                  ) : null
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                className="border border-blue-300 rounded-xl px-8 py-2 text-[#294D8B] font-bold bg-white hover:bg-blue-50 transition"
                onClick={() => setIsExpanded(false)}
              >
                عرض أقل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
