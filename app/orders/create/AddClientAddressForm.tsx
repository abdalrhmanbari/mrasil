import { useState } from 'react';
import { useCreateClientAddressMutation } from '@/app/api/clientAdressApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddClientAddressForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    district: '',
    city: '',
    country: '',
    clientEmail: '',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
  });
  const [createClientAddress, { isLoading, isSuccess, error }] = useCreateClientAddressMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await createClientAddress({ ...form, customer: '' }).unwrap();
      if (onSuccess) onSuccess();
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input name="clientName" placeholder="اسم العميل" value={form.clientName} onChange={handleChange} required />
      <Input name="clientEmail" placeholder="البريد الإلكتروني" value={form.clientEmail} onChange={handleChange} required type="email" />
      <Input name="clientPhone" placeholder="رقم الجوال" value={form.clientPhone} onChange={handleChange} required />
      <Input name="clientAddress" placeholder="العنوان" value={form.clientAddress} onChange={handleChange} required />
      <Input name="country" placeholder="الدولة" value={form.country} onChange={handleChange} required />
      <Input name="city" placeholder="المدينة" value={form.city} onChange={handleChange} required />
      <Input name="district" placeholder="الحي" value={form.district} onChange={handleChange} required />
      <Button
        type="submit"
        className="w-full bg-[#294D8B] text-white rounded px-4 py-2 shadow-sm hover:bg-[#1e3b6f]"
        disabled={isLoading}
      >
        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
      </Button>
      {isSuccess && submitted && <div className="text-green-600 text-center">تمت إضافة العنوان بنجاح</div>}
      {error && <div className="text-red-600 text-center">حدث خطأ أثناء الإضافة</div>}
    </form>
  );
} 