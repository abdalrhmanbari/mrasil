"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Filter,
  Search,
  Sliders,
  RepeatIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDown,
  CheckCircle,
  Trash2,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useCreateRequestMutation } from '../api/createReturnOrExchangeRequestApi';
import { useGetShipmentsQuery } from '../api/getReturnOrExchangeShipmentsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useHandleApprovalMutation } from '../api/handleReturnApprovalApi';
import { useSearchShipmentsQuery } from '../api/searchMyCustomerShipmentsApi';
import { useGetReturnShipmentsQuery } from '../api/returnShipmentsApi';

export default function ReplacementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
 
  const [dynamicReplacements, setDynamicReplacements] = useState(null)
  const [showExtraBtns, setShowExtraBtns] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [shipmentId, setShipmentId] = useState('');
  const [type, setType] = useState('return');
  const [requestNote, setRequestNote] = useState('');
  const [alertMsg, setAlertMsg] = useState<string|null>(null);
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [showType, setShowType] = useState('return');
  const [showTableType, setShowTableType] = useState<string|null>(null);
 
  const [handleApproval, { isLoading: isApproving }] = useHandleApprovalMutation();
  const [approvalResult, setApprovalResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEmailToQuery, setSearchEmailToQuery] = useState<string|null>(null);
  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useSearchShipmentsQuery(searchEmailToQuery ? { email: searchEmailToQuery } : skipToken);
  const [searchAlert, setSearchAlert] = useState<string|null>(null);
  const { data: returnShipmentsData, isLoading: isReturnShipmentsLoading, error: returnShipmentsError } = useGetReturnShipmentsQuery({ type: 'exchange' });

  // New state variables for filters and search
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [replacementTypeFilter, setReplacementTypeFilter] = useState("all")
  const [selectedReplacements, setSelectedReplacements] = useState<string[]>([])

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "approve":
        alert(`تمت الموافقة على ${selectedReplacements.length} استبدال`)
        break
      case "reject":
        alert(`تم رفض ${selectedReplacements.length} استبدال`)
        break
      case "export":
        alert(`تم تصدير بيانات ${selectedReplacements.length} استبدال`)
        break
      case "delete":
        alert(`تم حذف ${selectedReplacements.length} استبدال`)
        break
      default:
        break
    }
  }

  // Toggle select all replacements
  const toggleSelectAll = () => {
    if (selectedReplacements.length === (returnShipmentsData?.data?.length || 0)) {
      setSelectedReplacements([])
    } else {
      setSelectedReplacements(returnShipmentsData?.data?.map((item: any) => item._id) || [])
    }
  }

  // Toggle select single replacement
  const toggleSelectReplacement = (id: string) => {
    if (selectedReplacements.includes(id)) {
      setSelectedReplacements(selectedReplacements.filter((replacementId) => replacementId !== id))
    } else {
      setSelectedReplacements([...selectedReplacements, id])
    }
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (event.data && event.data.replacements) {
        setDynamicReplacements(event.data.replacements)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('showExtraReplacementBtns')) {
        setShowExtraBtns(true)
        localStorage.removeItem('showExtraReplacementBtns')
      }
    }
  }, [])

  useEffect(() => {
    if (
      searchEmailToQuery &&
      !isSearchLoading &&
      !searchError &&
      (!searchData || !Array.isArray(searchData.data) || searchData.data.length === 0)
    ) {
      setSearchAlert('لا توجد بيانات لهذا البريد الإلكتروني أو لا توجد شحنات.');
    }
  }, [searchEmailToQuery, isSearchLoading, searchError, searchData]);

  return (
    <V7Layout>
      <V7Content title="إدارة الاستبدال" description="إدارة طلبات الاستبدال وتتبع حالتها">
        <div className=" mx-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#294D8B] dark:text-blue-400">ادارة الاستبدال</h1>
              <p className="text-[#6d6a67] text-xl dark:text-gray-400">إدارة طلبات الاستبدال  وتتبع حالتها</p>
            </div>
          </div>
          <div className="flex flex-wrap  gap-3 mb-6 justify-end">
            <Button
              className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => router.push("/replacements/customize")}
            >
              <Sliders className="mr-2 h-4 w-4" />
              تخصيص صفحة الاستبدال
            </Button>
            <Button className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              تصدير التقرير
            </Button>

            
            <Button
              className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => window.open("/replacements/verify-email", "_blank")}
            >
              التحقق من البريد الالكترونى
            </Button>
            
          </div>

          {/* --- Cards Section: Styled like returns page --- */}
          {(() => {
            // Use exchange data for total
            let total = 0;
            if (Array.isArray(returnShipmentsData?.data)) {
              total = returnShipmentsData.data.length;
            }
            return (
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="v7-neu-card">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#6d6a67]">إجمالي الاستبدالات</p>
                        <h3 className="text-2xl font-bold text-[#294D8B]">{total}</h3>
                      </div>
                      <div className="v7-neu-icon-lg">
                        <RepeatIcon className="h-6 w-6 text-[#294D8B]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="v7-neu-card">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#6d6a67]">قيد المراجعة</p>
                        <h3 className="text-2xl font-bold text-[#f39c12]">0</h3>
                      </div>
                      <div className="v7-neu-icon-lg">
                        <ClockIcon className="h-6 w-6 text-[#f39c12]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="v7-neu-card">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#6d6a67]">تمت الموافقة</p>
                        <h3 className="text-2xl font-bold text-[#2ecc71]">0</h3>
                      </div>
                      <div className="v7-neu-icon-lg">
                        <CheckCircleIcon className="h-6 w-6 text-[#2ecc71]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="v7-neu-card">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#6d6a67]">مرفوضة</p>
                        <h3 className="text-2xl font-bold text-[#e74c3c]">0</h3>
                      </div>
                      <div className="v7-neu-icon-lg">
                        <XCircleIcon className="h-6 w-6 text-[#e74c3c]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* --- End Cards Section --- */}

          {/* --- Filters and Search Section --- */}
          <div className="mb-6">
            <h2 className="w-full block text-3xl font-bold text-[#294D8B] dark:text-blue-400 mb-2 text-right">
              طلبات الاستبدال
            </h2>
            <p className="w-full block text-lg text-gray-600 text bold mb-4 text-right">
              هنا يمكنك مراجعة جميع طلبات الاستبدال، الموافقة أو الرفض عليها، والبحث والتصفية حسب الحاجة.
            </p>
            <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                 
               
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  {/* Search filter */}
                  <div className="relative flex-1 min-w-[200px] v7-neu-input-container">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6d6a67]" />
                    <input
                      type="text"
                      placeholder="بحث عن رقم الاستبدال أو المنتج..."
                      className="v7-neu-input pl-8 text-base w-full"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {/* Status filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="v7-neu-button w-[180px] text-lg flex items-center gap-2 bg-[#f7fafd]">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="فلترة بالحالة" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#f7fafd] text-lg">
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="approved">تم الموافقة</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                      <SelectItem value="processed">تم الاستبدال</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Replacement type filter */}
                  <Select value={replacementTypeFilter} onValueChange={setReplacementTypeFilter}>
                    <SelectTrigger className="v7-neu-button w-[180px] text-lg flex items-center gap-2 bg-[#f7fafd]">
                      <RepeatIcon className="h-4 w-4" />
                      <SelectValue placeholder="نوع الاستبدال" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#f7fafd] text-lg">
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="return">استبدال</SelectItem>
                      <SelectItem value="exchange">استرجاع</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Export button */}
                  <Button className="v7-neu-button gap-2 text-lg">
                    <Download className="h-7 w-7" />
                    <span className="hidden sm:inline-block">تصدير</span>
                  </Button>
                </div>
              </div>
              {selectedReplacements.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold">
                      {selectedReplacements.length}
                    </div>
                    <span className="text-base font-medium text-blue-700">تم تحديد {selectedReplacements.length} استبدال</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-base bg-white hover:bg-blue-50"
                        disabled={selectedReplacements.length === 0}
                      >
                        إجراءات جماعية <ChevronDown className="mr-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#E4E9F2] shadow-sm">
                      <DropdownMenuItem onClick={() => handleBulkAction('approve')} className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                        <CheckCircle className="h-5 w-5 ml-2 text-green-600" />
                        <span>الموافقة على المحدد</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('reject')} className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                        <XCircleIcon className="h-5 w-5 ml-2 text-red-600" />
                        <span>رفض المحدد</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('export')} className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                        <Download className="h-5 w-5 ml-2 text-blue-600" />
                        <span>تصدير المحدد</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600 text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                        <Trash2 className="h-5 w-5 ml-2 text-red-600" />
                        <span>حذف المحدد</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </Tabs>
          </div>
          {/* --- End Filters and Search Section --- */}

         

               

         
          

          
          {searchEmailToQuery && (
            <div className="mt-10 text-lg">
              <h2 className="text-xl font-bold text-[#294D8B] dark:text-blue-400 mb-4 text-right">نتائج البحث عن الشحنات</h2>
              {isSearchLoading && <div className="text-center py-8">جاري التحميل...</div>}
              {searchError && <div className="text-center py-8 text-red-600">حدث خطأ أثناء جلب البيانات</div>}
              {!isSearchLoading && !searchError && (!searchData || !Array.isArray(searchData.data) || searchData.data.length === 0) && (
                null
              )}
              {!isSearchLoading && !searchError && searchData && Array.isArray(searchData.data) && searchData.data.length > 0 && (
                <table className="w-full min-w-[800px] text-lg text-right whitespace-nowrap bg-[#f7fafd] rounded-xl shadow-lg overflow-x-auto">
                  <thead>
                    <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                      {Object.keys(searchData.data[0]).map((key) => (
                        <th key={key} className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="dark:bg-gray-800">
                    {searchData.data.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-3">{typeof val === 'object' ? JSON.stringify(val) : String(val || '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <div className="mt-10 text-lg">
           
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="w-full flex border border-[#e0e6ed] rounded-2xl overflow-hidden bg-transparent text-lg">
                <TabsTrigger value="all" className="flex-1 text-base py-3 transition font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#294D8B] data-[state=active]:font-bold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:font-normal focus:outline-none">
                  الكل
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1 text-base py-3 transition font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#294D8B] data-[state=active]:font-bold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:font-normal focus:outline-none">
                  قيد المراجعة
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex-1 text-base py-3 transition font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#294D8B] data-[state=active]:font-bold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:font-normal focus:outline-none">
                  تمت الموافقة
                </TabsTrigger>
                <TabsTrigger value="processed" className="flex-1 text-base py-3 transition font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#294D8B] data-[state=active]:font-bold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:font-normal focus:outline-none">
                  تم الاستبدال
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex-1 text-base py-3 transition font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#294D8B] data-[state=active]:font-bold data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:font-normal focus:outline-none">
                  مرفوضة
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="overflow-x-auto bg-transparent">
              {isReturnShipmentsLoading && <div className="text-center py-8">جاري التحميل...</div>}
              {returnShipmentsError && <div className="text-center py-8 text-red-600">حدث خطأ أثناء جلب البيانات</div>}
              {!isReturnShipmentsLoading && !returnShipmentsError && (!returnShipmentsData || !returnShipmentsData.data.length) && (
                <div className="text-center py-8">لا توجد بيانات</div>
              )}
              {!isReturnShipmentsLoading && !returnShipmentsError && returnShipmentsData && returnShipmentsData.data.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full min-w-[800px] text-lg text-right whitespace-nowrap overflow-x-auto">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>
                          <input
                            type="radio"
                            checked={selectedReplacements.length === returnShipmentsData.data.length && returnShipmentsData.data.length > 0}
                            onChange={toggleSelectAll}
                            className="accent-blue-600 h-5 w-5 rounded-full border-none focus:ring-2 focus:ring-blue-200"
                            aria-label="تحديد كل الاستبدالات"
                          />
                        </th>
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>رقم الطلب</th>
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>نوع الطلب</th>
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>ملاحظات</th>
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>تاريخ الإنشاء</th>
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>شركة الشحن</th>
                        <th className="px-4 py-4 text-center font-bold text-black text-base" style={{ fontFamily: 'Arial, sans-serif' }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {returnShipmentsData.data.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-4 text-center">
                            <input
                              type="radio"
                              checked={selectedReplacements.includes(item._id)}
                              onChange={() => toggleSelectReplacement(item._id)}
                              className="accent-blue-600 h-5 w-5 rounded-full border-none focus:ring-2 focus:ring-blue-200"
                              aria-label={`تحديد الاستبدال ${item._id}`}
                            />
                          </td>
                        <td className="px-4 py-3 sm font-bold text-blue-700 break-all">{item._id}</td>
                                                 <td className="px-4 py-3 text-sm font-bold text-black">{item.type === 'return' ? 'استبدال' : item.type}</td>
                         <td className="px-4 py-3 text-sm font-bold text-black">{item.requestNote}</td>
                         <td className="px-4 py-3 text-sm font-bold text-black">{new Date(item.createdAt).toLocaleString('ar-EG')}</td>
                         <td className="px-4 py-3 text-sm font-bold text-black">{item.shipment?.company || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50 whitespace-nowrap" disabled={isApproving}
                              onClick={async () => {
                                try {
                                  const res = await handleApproval({ returnRequestId: item._id, approve: 'true' }).unwrap();
                                  setApprovalResult({ status: 'success', message: res.message || 'تمت الموافقة بنجاح' });
                                } catch (err: any) {
                                  setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الموافقة' });
                                }
                              }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span>موافقة</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50 whitespace-nowrap" disabled={isApproving}
                                onClick={async () => {
                                  try {
                                    const res = await handleApproval({ returnRequestId: item._id, approve: 'false' }).unwrap();
                                    setApprovalResult({ status: 'success', message: res.message || 'تم الرفض بنجاح' });
                                  } catch (err: any) {
                                    setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الرفض' });
                                  }
                                }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <path d="M18 6L6 18" />
                                  <path d="M6 6l12 12" />
                                </svg>
                                <span>رفض</span>
                              </Button>
                            </div>
                                                  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
