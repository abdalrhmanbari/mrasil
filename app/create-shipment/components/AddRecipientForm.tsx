import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, User } from "lucide-react";

const cities = [
  "الرياض",
  "جدة",
  "مكة",
  "المدينة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "الهفوف",
  "المبرز",
  "حفر الباطن",
  "حائل",
  "نجران",
  "الجبيل",
  "أبها",
  "ينبع",
  "عرعر",
  "عنيزة",
  "سكاكا",
  "جازان",
  "القطيف",
  "الباحة",
  "بيشة",
  "الرس",
];

interface AddRecipientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: any;
  initialValues?: {
    clientName?: string;
    clientAddress?: string;
    district?: string;
    city?: string;
    country?: string;
    clientEmail?: string;
    clientPhone?: string;
    customer?: string;
  };
}

export function AddRecipientForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error,
  initialValues,
}: AddRecipientFormProps) {
  const [form, setForm] = useState({
    clientName: initialValues?.clientName || "",
    clientAddress: initialValues?.clientAddress || "",
    district: initialValues?.district || "",
    city: initialValues?.city || "",
    country: initialValues?.country || "",
    clientEmail: initialValues?.clientEmail || "",
    clientPhone: initialValues?.clientPhone || "",
    customer: initialValues?.customer || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Combine country and city for clientAddress, and set district to '----'
    const payload = {
      ...form,
      clientAddress: `${form.country}, ${form.city}`,
      district: "----",
    };
    await onSubmit(payload);
    setSubmitting(false);
  };

  const handleClose = () => {
    setForm({
      clientName: "",
      clientAddress: "",
      district: "",
      city: "",
      country: "",
      clientEmail: "",
      clientPhone: "",
      customer: "",
    });
    onClose();
  };
  const [weightFocused, setWeightFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [weightFocusedA, setWeightFocusedA] = useState(false);
  const [descFocusedA, setDescFocusedA] = useState(false);
  const [weightFocusedAA, setWeightFocusedAA] = useState(false);
  const [descFocusedAA, setDescFocusedAA] = useState(false);
  const [weightFocusedAAA, setWeightFocusedAAA] = useState(false);
  const [descFocusedAAA, setDescFocusedAAA] = useState(false);
  const [weightFocusedM, setWeightFocusedM] = useState(false);
  const [descFocusedM, setDescFocusedM] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" text-[#3498db] w-full mt-6 text-right ">
            إضافة عميل جديد
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-2  flex flex-col gap-4"
        >
          {/* <Input name="clientName" placeholder="الاسم" value={form.clientName} onChange={handleChange} required /> */}
          <div className="space-y-2">
            <Label
              htmlFor="clientName"
              className="text-sm font-medium flex items-center gap-2 text-[#3498db]"
            >
              <User className="h-4 w-4 text-[#3498db]" />
              اسم العميل
              <span className=" text-red-500">*</span>
            </Label>

            <input
              name="clientName"
              placeholder="الاسم"
              value={form.clientName}
              onChange={handleChange}
              required
              className={cn(
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
              )}
              onFocus={() => setWeightFocused(true)}
              onBlur={() => setWeightFocused(false)}
              style={weightFocused ? { boxShadow: "0 2px 0 0 #3498db" } : {}}
            />
          </div>
          {/* رقم الجوال */}
          <div className="flex gap-2">
            <div className="  flex-1 space-y-2">
              <Label
                htmlFor="clientPhone"
                className="text-sm font-medium flex items-center gap-2 text-[#3498db]"
              >
                <Phone className="h-4 w-4 text-[#3498db]" />
                رقم الجوال
                <span className=" text-red-500">*</span>
              </Label>

              <input
                name="clientPhone"
                value={form.clientPhone}
                onChange={handleChange}
                required
                placeholder="05xxxxxxxx"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setWeightFocusedA(true)}
                onBlur={() => setWeightFocusedA(false)}
                style={
                  weightFocusedA
                    ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                    : {}
                }
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-sm font-medium flex items-center gap-2 text-[#3498db]"
            >
              <MapPin className="h-4 w-4 text-[#3498db]" />
              الدولة
              <span className=" text-red-500">*</span>
            </Label>

            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              placeholder="الدولة"
              className={cn(
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
              )}
              onFocus={() => setWeightFocusedAAA(true)}
              onBlur={() => setWeightFocusedAAA(false)}
              style={
                weightFocusedAAA
                  ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                  : {}
              }
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-[#3498db]" />
              المدينة
            </Label>
            <Select onValueChange={handleCityChange} value={form.city}>
              <SelectTrigger id="city" className={cn("v7-neu-input")}>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar">
                {cities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city}
                    className="py-2 px-3 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer transition-colors"
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-sm font-medium flex items-center gap-2 text-[#3498db]"
            >
              <MapPin className="h-4 w-4 text-[#3498db]" />
              البريد الإلكتروني
              <span className=" text-red-500">*</span>
            </Label>

            <input
              name="clientEmail"
              value={form.clientEmail}
              onChange={handleChange}
              required
              placeholder="example@gmail.com"
              className={cn(
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
              )}
              onFocus={() => setWeightFocusedM(true)}
              onBlur={() => setWeightFocusedM(false)}
              style={
                weightFocusedM
                  ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                  : {}
              }
            />
          </div>
          {/* <Input name="country" placeholder="الدولة" value={form.country} onChange={handleChange} required /> */}
          {/* <Input name="clientEmail" placeholder="البريد الإلكتروني" value={form.clientEmail} onChange={handleChange} required />
          <Input name="clientPhone" placeholder="رقم الجوال" value={form.clientPhone} onChange={handleChange} required /> */}
          {error && (
            <div className="text-red-500 text-sm">
              {typeof error === "string" ? error : "حدث خطأ أثناء إضافة العميل"}
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
              disabled={isLoading || submitting}
            >
              {isLoading || submitting ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
