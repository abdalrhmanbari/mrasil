import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';

interface Shipment {
  _id: string;
  type: string;
  requestNote: string;
  createdAt: string;
  shipment?: { company?: string };
}

interface ReturnsTableProps {
  data?: Shipment[];
  isLoading: boolean;
  error: any;
  isApproving: boolean;
  handleApproval: any;
  approvalResult: { status: 'success' | 'error', message: string } | null;
  setApprovalResult: (val: any) => void;
}

const ReturnsTable: React.FC<ReturnsTableProps> = ({
  data,
  isLoading,
  error,
  isApproving,
  handleApproval,
  approvalResult,
  setApprovalResult,
}) => {
  return (
    <CardContent dir="rtl" className="rtl">
      <div className="rounded-lg shadow v7-neu-table overflow-x-auto bg-white dark:bg-gray-800">
        {isLoading && <div className="text-center py-8">جاري التحميل...</div>}
        {error && <div className="text-center py-8 text-red-600">حدث خطأ أثناء جلب البيانات</div>}
        {!isLoading && !error && (!data || !data.length) && (
          <div className="text-center py-8">لا توجد بيانات</div>
        )}
        {!isLoading && !error && data && data.length > 0 && (
          <table className="w-full min-w-[800px] text-sm text-right whitespace-nowrap rounded-lg v7-neu-table bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-gray-800">
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[180px]">رقم الطلب</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">نوع الطلب</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[200px]">ملاحظات</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[180px]">تاريخ الإنشاء</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">شركة الشحن</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 text-blue-700 break-all">{item._id}</td>
                  <td className="px-4 py-3">{item.type === 'return' ? 'استرجاع' : item.type}</td>
                  <td className="px-4 py-3 break-all">{item.requestNote}</td>
                  <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString('ar-EG')}</td>
                  <td className="px-4 py-3">{item.shipment?.company || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center gap-2 justify-end">
                      <Button variant="outline" size="sm" className="v7-neu-button-sm bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs" disabled={isApproving}
                        onClick={async () => {
                          try {
                            const res = await handleApproval({ returnRequestId: item._id, approve: 'true' }).unwrap();
                            setApprovalResult({ status: 'success', message: res.message || 'تمت الموافقة بنجاح' });
                          } catch (err: any) {
                            setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الموافقة' });
                          }
                        }}>
                        <CheckCircle className="h-3 w-3 ml-1" />
                        <span>موافقة</span>
                      </Button>
                      <Button variant="outline" size="sm" className="v7-neu-button-sm bg-rose-50 text-red-600 border-rose-200 hover:bg-rose-100 text-xs" disabled={isApproving}
                        onClick={async () => {
                          try {
                            const res = await handleApproval({ returnRequestId: item._id, approve: 'false' }).unwrap();
                            setApprovalResult({ status: 'success', message: res.message || 'تم الرفض بنجاح' });
                          } catch (err: any) {
                            setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الرفض' });
                          }
                        }}>
                        <XCircle className="h-3 w-3 ml-1 text-red-600" />
                        <span>رفض</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {approvalResult && (
        <AlertDialog open={!!approvalResult} onOpenChange={() => setApprovalResult(null)}>
          <AlertDialogContent className="rounded-lg shadow-lg p-6 bg-white dark:bg-gray-900 max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-center mb-2">{approvalResult.status === 'success' ? 'نجاح' : 'خطأ'}</AlertDialogTitle>
            </AlertDialogHeader>
            <div className={`text-center py-4 ${approvalResult.status === 'success' ? 'text-green-700' : 'text-red-700'} text-base font-medium`}>{approvalResult.message}</div>
            <div className="flex justify-center mt-4">
              <AlertDialogAction className="v7-neu-button-accent px-6 py-2 rounded-lg" onClick={() => setApprovalResult(null)}>حسناً</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </CardContent>
  );
};

export default ReturnsTable; 