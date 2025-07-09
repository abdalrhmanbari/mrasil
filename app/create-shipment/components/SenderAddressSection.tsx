import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Building, CheckCircle2, Phone, MapPin, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddSenderAddressForm } from "./AddSenderAddressForm";
import { useGetCustomerMeQuery } from "../../api/customerApi";
import { useCreateAddressMutation } from "../../api/adressesApi";

interface SenderAddressSectionProps {
  selectedSender: string | number | null;
  setSelectedSender: Dispatch<SetStateAction<string | number | null>>;
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

export function SenderAddressSection({ selectedSender, setSelectedSender, setValue }: SenderAddressSectionProps) {
  // Fetch sender addresses from customer profile
  const { data: customerMeData, isLoading: isLoadingCustomerMe } = useGetCustomerMeQuery();
  // Mutation for creating a new sender address
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();
  const [openAddSenderModal, setOpenAddSenderModal] = useState(false);
  const [searchSender, setSearchSender] = useState("");
  const [showAllSenders, setShowAllSenders] = useState(false);

  // Use API data for sender cards (customer addresses)
  const senderCards = (customerMeData?.data.addresses || []).map((address, idx) => ({
    id: address._id || idx,
    _id: address._id,
    name: address.alias || "-",
    mobile: address.phone || "-",
    city: address.city || "-",
    address: address.location || "-",
    email: customerMeData?.data.email || "-",
  }));

  const handleSelectSender = (card: any) => {
    if (selectedSender === card.id) {
      setSelectedSender(null);
      setValue("shipper_full_name", "");
      setValue("shipper_mobile", "");
      setValue("shipper_city", "");
      setValue("shipper_address", "");
    } else {
      setSelectedSender(card.id);
      setValue("shipper_full_name", card.name);
      setValue("shipper_mobile", card.mobile);
      setValue("shipper_city", card.city);
      setValue("shipper_address", card.address);
    }
  };

  const filteredSenderCards = senderCards.filter(card =>
    card.name.toLowerCase().includes(searchSender.toLowerCase()) ||
    card.mobile.toLowerCase().includes(searchSender.toLowerCase()) ||
    card.city.toLowerCase().includes(searchSender.toLowerCase()) ||
    card.address.toLowerCase().includes(searchSender.toLowerCase()) ||
    card.email.toLowerCase().includes(searchSender.toLowerCase())
  );
  const displayedSenderCards = showAllSenders ? filteredSenderCards : filteredSenderCards.slice(0, 6);

  const handleAddSenderAddress = async (data: any) => {
    try {
      await createAddress({
        alias: data.alias,
        location: data.location,
        city: data.city,
        phone: data.phone,
        country: "sa",
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  return (
    <motion.div variants={staggerChildren}>
      <div className="flex items-center gap-3">
        <div className="v7-neu-icon-sm">
          <Building className="h-5 w-5 text-[#3498db]" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">اختر عنوان الالتقاط</h3>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-[#3498db]" />
          </span>
          <Input
            className="pr-10 v7-neu-input"
            placeholder="ابحث ضمن عناوين الالتقاط الخاصة بك"
            type="text"
            value={searchSender}
            onChange={e => setSearchSender(e.target.value)}
            style={{ direction: 'rtl', fontFamily: 'inherit' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpenAddSenderModal(true)}
          className="v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] transition-all duration-300 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2"
        >
          + عنوان جديد
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedSenderCards.map(card => (
          <motion.div
            key={card.id}
            className={`v7-neu-card-inner p-5 cursor-pointer relative transition-all duration-300 hover:shadow-lg ${
              selectedSender === card.id
                ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
            }`}
            onClick={() => handleSelectSender(card)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedSender === card.id && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <div className="font-bold text-lg">{card.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-[#3498db]" />
                <span>{card.mobile}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                <span>{card.city}</span>
              </div>
              {card.address && <div className="text-sm text-gray-700">{card.address}</div>}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4 text-[#3498db]" />
                <span>{card.email}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* More button */}
      {filteredSenderCards.length > 6 && !showAllSenders && (
        <div className="flex justify-center mt-4">
          <Button type="button" variant="ghost" className="text-blue-500 flex items-center gap-1 py-3 px-8 text-lg rounded-xl font-bold border border-blue-200 shadow-sm" onClick={() => setShowAllSenders(true)}>
            المزيد <span>+</span>
          </Button>
        </div>
      )}
      {/* Add Sender Address Form */}
      <AddSenderAddressForm
        isOpen={openAddSenderModal}
        onClose={() => setOpenAddSenderModal(false)}
        onSubmit={handleAddSenderAddress}
        isLoading={isCreatingAddress}
      />
    </motion.div>
  );
} 