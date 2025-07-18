import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, MapPin, Mail, Search, UserPlus, Trash2, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddRecipientForm } from "../components/AddRecipientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ResponseModal from "../../components/ResponseModal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useGetAllClientAddressesQuery, useCreateClientAddressMutation, useDeleteClientAddressMutation, useUpdateClientAddressMutation } from "../../api/clientAdressApi";

interface RecipientAddressSectionProps {
  selectedRecipient: string | null;
  setSelectedRecipient: Dispatch<SetStateAction<string | null>>;
  setValue: (field: string, value: any) => void;
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function RecipientAddressSection({ selectedRecipient, setSelectedRecipient, setValue }: RecipientAddressSectionProps) {
  const { data: clientAddressesData } = useGetAllClientAddressesQuery();
  const [createClientAddress, { isLoading: isCreating, error: createError }] = useCreateClientAddressMutation();
  const [deleteClientAddress, { isLoading: isDeleting }] = useDeleteClientAddressMutation();
  const [updateClientAddress, { isLoading: isUpdating, error: updateError }] = useUpdateClientAddressMutation();

  const recipientCards = clientAddressesData?.data || [];
  const [openRecipientModal, setOpenRecipientModal] = useState(false);
  const [editRecipientModalOpen, setEditRecipientModalOpen] = useState(false);
  const [recipientToEdit, setRecipientToEdit] = useState<any | null>(null);
  const [editRecipient, setEditRecipient] = useState({
    clientName: "",
    clientAddress: "",
    district: "",
    city: "",
    country: "",
    clientEmail: "",
    clientPhone: "",
    customer: "",
  });
  const [recipientToDelete, setRecipientToDelete] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchRecipient, setSearchRecipient] = useState("");
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<'success' | 'fail'>("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSelectRecipient = (card: any) => {
    if (selectedRecipient === card._id) {
      setSelectedRecipient(null);
      setValue("recipient_full_name", "");
      setValue("recipient_mobile", "");
      setValue("recipient_city", "");
      setValue("recipient_address", "");
      setValue("recipient_email", "");
      setValue("recipient_district", "");
    } else {
      setSelectedRecipient(card._id);
      setValue("recipient_full_name", card.clientName || "");
      setValue("recipient_mobile", card.clientPhone);
      setValue("recipient_city", card.city);
      setValue("recipient_address", card.clientAddress);
      setValue("recipient_email", card.clientEmail || "");
      setValue("recipient_district", card.district || "");
    }
  };

  const handleDeleteRecipient = (id: string) => {
    setRecipientToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (recipientToDelete) {
      await deleteClientAddress(recipientToDelete);
      setRecipientToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleEditRecipient = (card: any) => {
    setRecipientToEdit(card);
    setEditRecipient({
      clientName: card.clientName || "",
      clientAddress: card.clientAddress || "",
      district: card.district || "",
      city: card.city || "",
      country: card.country || "",
      clientEmail: card.clientEmail || "",
      clientPhone: card.clientPhone || "",
      customer: card.customer || "",
    });
    setEditRecipientModalOpen(true);
  };

  const handleEditRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditRecipient({ ...editRecipient, [e.target.name]: e.target.value });
  };

  const handleEditRecipientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientToEdit) return;
    try {
      await updateClientAddress({ id: recipientToEdit._id, data: { ...editRecipient, customer: editRecipient.customer || "" } }).unwrap();
      setEditRecipientModalOpen(false);
      setRecipientToEdit(null);
    } catch (err) {
      // error handled by updateError
    }
  };

  const filteredRecipientCards = (recipientCards || []).filter(card =>
    (card.clientName || "").toLowerCase().includes(searchRecipient.toLowerCase()) ||
    (card.clientPhone || "").toLowerCase().includes(searchRecipient.toLowerCase()) ||
    (card.clientEmail || "").toLowerCase().includes(searchRecipient.toLowerCase())
  );
  const displayedRecipientCards = showAllRecipients ? filteredRecipientCards : filteredRecipientCards.slice(0, 6);

  return (
    <motion.div variants={staggerChildren}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1a365d]">اختر المستلم</h2>
      </div>
      <div className="flex flex-row items-center gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-[#3498db]" />
          </span>
          <Input
            type="text"
            placeholder="ابحث ضمن عناوين العملاء"
            value={searchRecipient}
            onChange={e => setSearchRecipient(e.target.value)}
            className="pr-16   m-v7-neu-input"
            style={{ direction: 'rtl', fontFamily: 'inherit' }}
          />
        </div>
        <Button
          type="button"
          onClick={() => setOpenRecipientModal(true)}
          className="v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] transition-all duration-300 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2"
        >
           + عنوان  مستلم جديد
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedRecipientCards.map(card => (
          <motion.div
            key={card._id}
            className={`v7-neu-card-inner p-5 cursor-pointer relative transition-all duration-300 hover:shadow-lg ${
              selectedRecipient === card._id
                ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
            }`}
            onClick={() => handleSelectRecipient(card)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedRecipient === card._id && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-blue-100"
                onClick={e => {
                  e.stopPropagation();
                  handleEditRecipient(card);
                }}
              >
                <Edit className="h-4 w-4 text-[#3498db]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-blue-100"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteRecipient(card._id);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="font-bold text-lg">{card.clientName}</div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-[#3498db]" />
                <span>{card.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                <span>{card.city}{card.clientAddress ? `، ${card.clientAddress}` : ''}</span>
              </div>
              {card.district && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-bold">الحي/المنطقة:</span>
                  <span>{card.district}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4 text-[#3498db]" />
                <span>{card.clientEmail}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* More/Less button */}
      {filteredRecipientCards.length > 6 && (
        <div className="flex justify-center mt-4">
          <Button
            type="button"
            variant="ghost"
            className="text-blue-500 flex items-center gap-1 py-3 px-8 text-lg rounded-xl font-bold border border-blue-200 shadow-sm"
            onClick={() => setShowAllRecipients((prev) => !prev)}
          >
            {showAllRecipients ? 'عرض أقل' : 'المزيد +'}
          </Button>
        </div>
      )}
      {/* Recipient Modal */}
      <Dialog open={openRecipientModal} onOpenChange={setOpenRecipientModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <AddRecipientForm
            isOpen={openRecipientModal}
            onClose={() => setOpenRecipientModal(false)}
            onSubmit={async (data) => {
              try {
                const payload = { ...data };
                if ('customer' in payload && !payload.customer) {
                  delete (payload as any).customer;
                }
                await createClientAddress(payload).unwrap();
                setAlertStatus("success");
                setAlertMessage("تمت إضافة العميل بنجاح");
                setAlertOpen(true);
                setOpenRecipientModal(false);
              } catch (err: any) {
                setAlertStatus("fail");
                setAlertMessage(err?.data?.message || "حدث خطأ أثناء إضافة العميل");
                setAlertOpen(true);
              }
            }}
            isLoading={isCreating}
            error={createError}
            initialValues={{
              clientName: "",
              clientAddress: "",
              district: "",
              city: "",
              country: "",
              clientEmail: "",
              clientPhone: "",
              customer: "",
            }}
          />
        </DialogContent>
      </Dialog>
      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setRecipientToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={isDeleting ? "جاري الحذف..." : "حذف"}
        cancelText="إلغاء"
      />
      {/* Edit Recipient Modal */}
      <Dialog open={editRecipientModalOpen} onOpenChange={setEditRecipientModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات العميل</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditRecipientSubmit} className="space-y-2">
            <Input name="clientName" placeholder="الاسم" value={editRecipient.clientName} onChange={handleEditRecipientChange} required />
            <Input name="clientAddress" placeholder="العنوان" value={editRecipient.clientAddress} onChange={handleEditRecipientChange} required />
            <Input name="district" placeholder="الحي/المنطقة (district)" value={editRecipient.district} onChange={handleEditRecipientChange} />
            <Input name="city" placeholder="المدينة" value={editRecipient.city} onChange={handleEditRecipientChange} required />
            <Input name="country" placeholder="الدولة" value={editRecipient.country} onChange={handleEditRecipientChange} required />
            <Input name="clientEmail" placeholder="البريد الإلكتروني" value={editRecipient.clientEmail} onChange={handleEditRecipientChange} required />
            <Input name="clientPhone" placeholder="رقم الجوال" value={editRecipient.clientPhone} onChange={handleEditRecipientChange} required />
            {updateError && <div className="text-red-500 text-sm">{typeof updateError === 'string' ? updateError : 'حدث خطأ أثناء التعديل'}</div>}
            <DialogFooter>
              <Button type="submit" className="bg-blue-500 text-white" disabled={isUpdating}>
                {isUpdating ? 'جاري التعديل...' : 'حفظ التعديلات'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 