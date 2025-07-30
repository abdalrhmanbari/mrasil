"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FileText, Loader2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useGetSallaAuthUrlQuery, useGetWebhookStatusQuery, useUpdateWebhookMutation } from "@/app/api/sallaApi"
import { toast } from "sonner"
import { useGetZidAuthUrlQuery } from '@/app/api/zedApi'
import { useLazyGetAuthUrlQuery } from "@/app/api/shopifyApi";

export function WebhooksContent() {
  const router = useRouter()
  const [webhookUrl, setWebhookUrl] = useState("")
  const sallaToken = "38c5a910b012dfcbca23913cfb167308602e62fa9edea4c9ac2fa28"
  const manualAuthUrlRef = useRef("")
  const [showInputs, setShowInputs] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [triggerGetAuthUrl, { data: authData, isLoading: isShopifyAuthLoading, error: authError }] = useLazyGetAuthUrlQuery();

  // Get webhook status
  const { data: webhookStatus, isLoading: isLoadingStatus } = useGetWebhookStatusQuery()
  const [updateWebhook, { isLoading: isUpdating }] = useUpdateWebhookMutation()
  const { data: authUrlData, isLoading: isAuthLoading, refetch: getAuthUrl } = useGetSallaAuthUrlQuery()
  const { data: zidAuthData, isLoading: isLoadingZidAuth } = useGetZidAuthUrlQuery()

  // Update local state when webhook status changes
  useEffect(() => {
    if (webhookStatus?.webhookUrl) {
      setWebhookUrl(webhookStatus.webhookUrl)
    }
  }, [webhookStatus])

  // نسخ الرابط
  const copyToken = () => {
    navigator.clipboard.writeText(sallaToken)
    toast.success("تم نسخ الرابط بنجاح")
  }

  // تحديث الرابط
  const handleUpdateWebhook = async () => {
    if (!webhookUrl) {
      toast.error("الرجاء إدخال رابط الويب هوك")
      return
    }

    try {
      await updateWebhook({
        webhookUrl,
        isEnabled: webhookStatus?.isEnabled ?? false,
      }).unwrap()
      toast.success("تم تحديث رابط الويب هوك بنجاح")
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث رابط الويب هوك")
    }
  }

  // Manual trigger for Salla Auth URL
  const handleManualGetAuthUrl = async () => {
    try {
      const result = await getAuthUrl()
      if (result.data?.authUrl) {
        manualAuthUrlRef.current = result.data.authUrl
        window.open(result.data.authUrl, "_blank")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحصول على رابط المصادقة")
    }
  }

  const webhook = { active: webhookStatus?.isEnabled ?? false }

  return (
    <div className="space-y-6 rtl">     
        <h1 className="text-3xl font-bold tracking-tight">توصيل المتاجر</h1>
        <p className="text-muted-foreground text-lg">
          قم بتوصيل متجرك الإلكتروني بمنصة الشحن لإدارة الطلبات والشحنات بشكل تلقائي
        </p>
      

      

      <Card className="v7-neu-card dark:bg-gray-800/50 ">
        <CardHeader>
          {/* <CardTitle className="text-xl dark:text-gray-200">متاجر أخرى</CardTitle>
          <CardDescription className="dark:text-gray-400 text-lg">قم بتوصيل منصات التجارة الإلكترونية الأخرى بمنصة الشحن</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex-1">
              <Card className="v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Image src="/shopify-logo.png" alt="Shopify" width={40} height={40} className="dark:invert" />
                  </div>
                  <h3 className="font-medium dark:text-gray-200 text-lg">Shopify</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 text-center mt-2">قم بتوصيل متجر Shopify الخاص بك</p>
                  {showInputs && (
                    <div className="flex flex-col gap-2 mb-4">
                      <input
                        type="text"
                        className="v7-neu-input text-right"
                        placeholder="الاسم الأول"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        className="v7-neu-input text-right"
                        placeholder="اسم العائلة"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                  )}
                  <Button
                    className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-lg py-2 px-4"
                    disabled={isShopifyAuthLoading}
                    onClick={async () => {
                      if (!showInputs) {
                        setShowInputs(true);
                        return;
                      }
                      if (firstName && lastName) {
                        await triggerGetAuthUrl({ firstName, lastName });
                      }
                    }}
                  >
                    {isShopifyAuthLoading ? "...جاري التوصيل" : "توصيل"}
                  </Button>
                  {authData && authData.authUrl && (
                    <div className="mt-4 text-green-700 text-center break-all">رابط التوثيق: <a href={authData.authUrl} target="_blank" rel="noopener noreferrer" className="underline">{authData.authUrl}</a></div>
                  )}
                  {authError && (
                    <div className="mt-4 text-red-600 text-center">{authError?.data?.error || "حدث خطأ أثناء جلب رابط التوثيق"}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card className="v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Image src="/woocommerce-logo.png" alt="WooCommerce" width={40} height={40} className="dark:invert" />
                  </div>
                  <h3 className="font-medium dark:text-gray-200 text-lg">WooCommerce</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 text-center mt-2">قم بتوصيل متجر WooCommerce الخاص بك</p>
                  <Button className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-lg py-2 px-4">توصيل</Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card className="v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Image src="/Zid.svg" alt="زد" width={40} height={40} className="dark:invert" />
                  </div>
                  <h3 className="font-medium dark:text-gray-200 text-lg">زد</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 text-center mt-2">قم بتوصيل متجر زد الخاص بك</p>
                  <Button
                    className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-lg py-2 px-4"
                    onClick={() => {
                      if (zidAuthData?.authUrl) {
                        window.open(zidAuthData.authUrl, '_blank');
                      }
                    }}
                    disabled={isLoadingZidAuth}
                  >
                    توصيل
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="flex-1">
             <Card className=" v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className=" flex flex-col rounded-full bg-gray-100 dark:bg-gray-700  gap-4 items-center justify-center mb-4">
            <div className="flex items-center gap-3 mb-auto ">
              <Switch 
                checked={webhook.active} 
                onCheckedChange={async (checked) => {
                  try {
                    await updateWebhook({
                      webhookUrl,
                      isEnabled: checked,
                    }).unwrap()
                    toast.success(checked ? "تم تفعيل الويب هوك" : "تم إيقاف الويب هوك")
                  } catch (error) {
                    toast.error("حدث خطأ أثناء تحديث حالة الويب هوك")
                  }
                }} 
                className="scale-150"
                disabled={isUpdating || isLoadingStatus}
              />
              <Badge
                variant="outline"
                className={`text-base ${
                  webhook.active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {webhook.active ? "نشط" : "غير نشط"}
              </Badge>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-6">
                  <h2 className="text-lg ">الربط مع سلة</h2>
                  <div className="w-20 h-20 relative">
                    <div className="v7-neu-card-inner rounded-xl flex items-center justify-center w-full h-full">
                      <Image src="/salla.svg" alt="سلة" width={50} height={50} />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="mb-6 leading-relaxed text-lg">
               
              </p>
              <div className="mb-6 flex justify-center">
                <Button
                  type="button"
                  onClick={handleManualGetAuthUrl}
                  className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-lg py-3 px-6"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? (
                    <Loader2 className="animate-spin h-6 w-6 ml-2" />
                  ) : (
                    <Image src="/salla.svg" alt="سلة" width={20} height={15} className="ml-2" />
                  )}
                  ربط مع سلة
                </Button>
              </div>

              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <label className="block font-medium ">رابط سلة</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyToken}
                      className="h-12 w-12"
                    >
                      <FileText className="h-6 w-6" />
                    </Button>
                    <Input value={sallaToken} readOnly className="font-mono text-base border-gray-200 " />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-sm">Webhook URL</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleUpdateWebhook}
                      className="bg-[#e74c3c] hover:bg-[#c0392b] text-white flex-shrink-0 text-sm py-3 px-6"
                      disabled={isUpdating || isLoadingStatus}
                    >
                      {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                      تحديث
                    </Button>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="font-mono border-gray-200 text-sm h-12"
                      placeholder="أدخل رابط الويب هوك هنا"
                      disabled={isLoadingStatus}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
