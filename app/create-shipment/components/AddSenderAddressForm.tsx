"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Phone, MapPin, User, Building } from "lucide-react"
import ResponseModal from "../../components/ResponseModal"
import { useGetCustomerMeQuery } from "../../api/customerApi"

const cities = [
  "الرياض", "جدة", "مكة", "المدينة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "خميس مشيط", "الهفوف", "المبرز", "حفر الباطن", "حائل", "نجران", "الجبيل", "أبها", "ينبع", "عرعر", "عنيزة", "سكاكا", "جازان", "القطيف", "الباحة", "بيشة", "الرس",
]

interface AddSenderAddressFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function AddSenderAddressForm({ isOpen, onClose, onSubmit, isLoading = false }: AddSenderAddressFormProps) {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertStatus, setAlertStatus] = useState<'success' | 'fail'>("success")
  const [alertMessage, setAlertMessage] = useState("")

  const { data: customerMeData } = useGetCustomerMeQuery();

  const methods = useForm({
    defaultValues: {
      clientName: "",
      clientPhone: "",
      country: "السعودية",
      city: "",
      clientEmail:""
    },
  })

  const { register, handleSubmit, reset, watch } = methods

  const handleFormSubmit = async (data: any) => {
    try {
      const clientAddress = `${data.country}, ${data.city}`;
      const clientEmail = customerMeData?.data?.email || "";
      await onSubmit({
        ...data,
        clientAddress,
        clientEmail,
      });
      setAlertStatus("success")
      setAlertMessage("تمت إضافة العنوان بنجاح")
      setAlertOpen(true)
      reset()
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error: any) {
      setAlertStatus("fail")
      setAlertMessage(error?.data?.message || "حدث خطأ أثناء إضافة العنوان")
      setAlertOpen(true)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }
const [weightFocused, setWeightFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
const [weightFocusedA, setWeightFocusedA] = useState(false);
  const [descFocusedA, setDescFocusedA] = useState(false);
const [weightFocusedAA, setWeightFocusedAA] = useState(false);
  const [descFocusedAA, setDescFocusedAA] = useState(false);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1a365d] flex items-center gap-2 mt-10">
              <Building className="w-5 h-5 text-[#3498db]"  />
              إضافة عنوان جديد
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2 flex flex-col gap-4">
            {/* اسم العميل */}
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-sm font-medium flex items-center gap-2 text-[#3498db]">
                <User className="h-4 w-4 text-[#3498db]" />
                اسم العميل
                                 <span className=" text-red-500">*</span>
              </Label>

                    <input
                id="clientName"
                {...register("clientName")}
                placeholder="اسم العميل"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setWeightFocused(true)}
                onBlur={() => setWeightFocused(false)}
                style={weightFocused ? { boxShadow: '0 2px 0 0 #3498db' } : {}}
                          required  />
                          
            </div>
            {/* رقم الجوال */}
            <div className="flex gap-2">
              <div className="  flex-1 space-y-2">
                <Label htmlFor="clientPhone" className="text-sm font-medium flex items-center gap-2 text-[#3498db]">
                  <Phone className="h-4 w-4 text-[#3498db]" />
                  رقم الجوال
                   <span className=" text-red-500">*</span>
                </Label>
   

                        <input
                 id="clientPhone"
                 {...register("clientPhone")}
                placeholder="05xxxxxxxx"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setWeightFocusedA(true)}
                onBlur={() => setWeightFocusedA(false)}
                style={weightFocusedA ? { boxShadow: '0 2px 0 0 #3498db', fontFamily: 'inherit'  } : {}}
                        required    />
              </div>
            </div>
            {/* الدولة والمدينة في صف واحد */}
           
              <div className="flex-1 space-y-2">
                <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2 text-[#3498db]">
                  <MapPin className="h-4 w-4 text-[#3498db]" />
                  الدولة
                                   <span className=" text-red-500">*</span>
                </Label>
                             
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="الدولة"
                  className={cn(
                    "v7-neu-input"
                  )}
                  style={{ direction: 'rtl', fontFamily: 'inherit' }}
               required />
              </div>
              <div className="flex-1 space-y-2">

                <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2 text-[#3498db]">
                  <MapPin className="h-4 w-4 text-[#3498db]" />
                  المدينة
                                   <span className=" text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="المدينة"
                  className={cn(
                    "v7-neu-input"
                  )}
                  style={{ direction: 'rtl', fontFamily: 'inherit' }}
               required  />
              </div>
                  <div className="flex-1 space-y-2">
                <Label htmlFor="clientPhone" className="text-sm font-medium flex items-center gap-2 text-[#3498db]">
                  <Phone className="h-4 w-4 text-[#3498db]" />
                 البريد الإلكتروني
                </Label>

                        <input
                 id="clientEmail"
                 {...register("clientEmail")}
                placeholder="example@gmail.com"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setWeightFocusedAA(true)}
                onBlur={() => setWeightFocusedAA(false)}
                style={weightFocusedAA ? { boxShadow: '0 2px 0 0 #3498db', fontFamily: 'inherit'  } : {}}
                            />
              </div>

            {/* removed district and customer inputs */}
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-2"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]"
                disabled={isLoading}
              >
                {isLoading ? "جاري الإضافة..." : "إضافة العنوان"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
    </>
  )
} 