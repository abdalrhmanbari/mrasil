import React from "react";
import { FileText, Package, Shield } from "lucide-react";

export function OrderSummaryAndFragileTips({ values }: { values: any }) {
  return (
    <>
      {/* ملخص الطلب */}
      <div className="bg-white rounded-2xl shadow border border-[#e5eaf2] mt-8 p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
            <span className="inline-block"><FileText className="w-5 h-5 text-[#1a365d]" /></span>
            ملخص الطلب
          </h2>
          {values.orderId && (
            <span className="bg-blue-50 text-blue-600 font-bold rounded-full px-4 py-1 text-sm">
              رقم الطلب: <span className="font-bold">{values.orderId}</span>
            </span>
          )}
        </div>
        <div className="divide-y divide-[#f3f6fa]">
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">من</span>
            <span className="text-[#1a365d]">{values.shipper_city || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">إلى</span>
            <span className="text-[#1a365d]">{values.recipient_city || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">نوع الشحنة</span>
            <span className="text-[#1a365d]">{values.shipmentType || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">حجم الطرد</span>
            <span className="text-[#1a365d]">{values.dimension_length && values.dimension_width && values.dimension_high ? `${values.dimension_length} × ${values.dimension_width} × ${values.dimension_high}` : "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">الوزن</span>
            <span className="text-[#1a365d]">{values.weight ? `${values.weight} كجم` : "-"}</span>
          </div>
        </div>
      </div>

      {/* نصائح للشحنات القابلة للكسر */}
      <div className="mt-8 rounded-2xl border border-[#e5eaf2] bg-[#f8fafc] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#f59e42] text-2xl"><Package className="w-6 h-6" /></span>
          <span className="font-bold text-[#1a365d] text-lg">نصائح للشحنات القابلة للكسر</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#f59e42] text-xl"><FileText className="w-5 h-5" /></span>
          <span className="font-bold text-[#1a365d] text-base">كيف تحمي شحنتك القابلة للكسر؟</span>
        </div>
        <ol className="space-y-2 mb-4">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">1</span>
            <span className="text-[#1a365d]">استخدم تغليف مناسب مثل الفقاعات الهوائية أو الفلين لحماية المحتويات الهشة</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">2</span>
            <span className="text-[#1a365d]">ضع علامة "قابل للكسر" بشكل واضح على جميع جوانب الطرد</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">3</span>
            <span className="text-[#1a365d]">اختر خدمة الشحن المميزة للتعامل مع الشحنات الحساسة بعناية إضافية</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">4</span>
            <span className="text-[#1a365d]">نوصي بشدة بإضافة تأمين الشحنة لتغطية أي أضرار محتملة أثناء النقل</span>
          </li>
        </ol>
        <div className="bg-[#f3f7fa] text-[#f59e42] rounded-xl px-4 py-3 flex items-center gap-2 mt-2">
          <span><Shield className="w-5 h-5" /></span>
          <span className="font-bold">يمكنك إضافة تأمين على الشحنة من خلال الفرع كل ماعليك فعله عند تسليم الشحنة أخبرهم أنك تريد التأمين عليها.</span>
        </div>
      </div>
    </>
  );
} 