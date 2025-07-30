import { useEffect, useRef } from "react";

export default function PaymentForm({ amount = 1000, description = "اشتراك ذهبي" }) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.moyasar.com/mpf/1.8.4/moyasar.js";
      script.async = true;
      script.onload = () => {
        if (window.Moyasar && typeof window.Moyasar.init === "function") {
          window.Moyasar.init();
        }
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  return (
    <form id="payment-form" ref={formRef}>
      <div
        className="mysr-form"
        data-amount={amount.toString()}
        data-currency="SAR"
        data-description={description}
        data-publishable-api-key="pk_test_xxxxx" // <-- غيّر للمفتاح تبعك
        data-callback-url="http://localhost:3000/payment-success"
        data-method="card"
      ></div>
    </form>
  );
}