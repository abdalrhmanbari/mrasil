import Image from "next/image";
import { useState, useEffect } from "react";

const companies = [
  {
    name: "سمسا",
    img: "/companies/smsa.jpg",
  },
  {
    name: "ريدبوكس",
    img: "/companies/RedBox.jpg",
  },
  {
    name: "اراميكس",
    img: "/companies/Aramex.jpg",
  },
  {
    name: "اومني لاما",
    img: "/companies/omniclama.png",
  },
  {
    name: "سبل",
    img: "/companies/sbl.jpeg",
  },
];

const stores = [
  { name: "Shopify", img: "/stores/shopify.jpg" },
  { name: "WooCommerce", img: "/stores/woo.jpg" },
  { name: "زد", img: "/stores/zid.jpg" },
  { name: "سلة", img: "/stores/salla.jpg" },
];

export function Platform() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-blue-900 text-center mb-16">كل الشحنات الخاصة بك في منصة واحدة فقط</h2>
        <div className="mb-16">
          <h3 className="text-center mb-8 text-2xl font-bold text-blue-800">شركات الشحن </h3>
          {/* 3D Companies Gallery */}
          <div className="h-[380px] w-full flex items-center justify-center overflow-hidden bg-white rounded-2xl">
            <div className="relative lg:w-[420px] lg:h-[420px] md:w-[340px] md:h-[340px] sm:w-[260px] sm:h-[260px] w-[180px] h-[180px] [transform-style:preserve-3d] animate-[rotate_30s_linear_infinite]">
              {companies.map((company, idx) => (
                <span
                  key={company.name}
                  style={{
                    '--i': idx + 1,
                  } as React.CSSProperties}
                  className="span-style flex flex-col items-center mb-4 border-2 border-purple-300 bg-white shadow-lg min-h-[180px]"
                >
                  <Image
                    src={company.img}
                    alt={company.name}
                    width={160}
                    height={160}
                    className="img-style"
                  />
                  <span className="company-label mt-2 text-blue-700 text-lg font-bold drop-shadow text-center w-36 truncate" title={company.name}>{company.name}</span>
                </span>
              ))}
            </div>
            <style jsx>{`
              .span-style {
                position: absolute;
                top: 50%;
                left: 50%;
                transform-style: preserve-3d;
                transform: rotateY(calc(45deg * (var(--i) - 1))) translateZ(270px) translate(-50%, -50%);
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .img-style {
                border-radius: 50%;
                box-shadow: 0 4px 24px rgba(0,0,0,0.15);
                border: 4px solid #fff;
                width: 140px;
                height: 110px;
                object-fit: cover;
                background: #fff;
              }
              @media (min-width: 640px) {
                .img-style { width: 160px; height: 120px; }
              }
              @keyframes rotate {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
              }
              .company-label {
                text-shadow: 0 2px 8px rgba(0,0,0,0.25);
                letter-spacing: 0.5px;
              }
            `}</style>
          </div>
        </div>
        {/* Stores section as a static row */}
        <div>
          <h3 className="text-center mb-8 text-2xl font-bold text-blue-800">المنصات والمتاجر</h3>
          <div className="flex gap-8 justify-center flex-wrap">
            {stores.map((store) => (
              <div
                key={store.name}
                className="bg-white p-8 rounded-2xl shadow-md w-56 h-56 flex flex-col items-center justify-center border border-gray-100 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 cursor-pointer"
              >
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-blue-200 bg-white flex items-center justify-center">
                  <Image
                    src={store.img}
                    alt={store.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="font-extrabold text-xl text-blue-900 mt-2">{store.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
