import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Footer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push("/signup");
  };

  return (
    <footer className="py-16 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4 text-white">Contact Us</h3>
            <div className="flex flex-col gap-2 text-blue-100">
              <p>Email: info@marasil.com</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-white">Connect With Us</h3>
            <Button
              variant="outline"
              className="rounded-full bg-white text-blue-600 border-blue-600 hover:bg-blue-700 hover:text-white hover:border-white transition-colors min-w-[140px]"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  جاري التحميل...
                </span>
              ) : (
                "Join Us Now"
              )}
            </Button>
          </div>
        </div>
        <div className="border-t border-blue-200 pt-8 text-center text-sm text-blue-100">
          <p>© 2025 Marasil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
