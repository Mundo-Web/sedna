import React, { useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import Base from "./Components/Tailwind/Base";
import CreateReactScript from './Utils/CreateReactScript';
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import TextWithHighlight from "./Utils/TextWithHighlight";
import { useTranslation } from "./hooks/useTranslation";

const Partners = ({ landing, aliances }) => {
    
  const landingHero = landing?.find(
      (item) => item.correlative === "page_partners_hero"
  );
  const landingFooter = landing?.find(
      (item) => item.correlative === "page_partners_contact"
  );
  const landingCardone = landing?.find(
      (item) => item.correlative === "page_partners_contact_one"
  );
  const landingCardsecond = landing?.find(
      (item) => item.correlative === "page_partners_contact_two"
  );

  const ArrowIcon = () => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <mask id="mask0_226_5036" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
        <rect y="0.984375" width="20" height="20" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_226_5036)">
        <path d="M13.4791 11.8203H3.33325V10.1536H13.4791L8.81242 5.48698L9.99992 4.32031L16.6666 10.987L9.99992 17.6536L8.81242 16.487L13.4791 11.8203Z" fill="#7D3CB5"/>
      </g>
    </svg>
  );

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/api/cover/thumbnail/null";
  };  

  return (
    <div>
      <Header />

          <section className="flex flex-col md:justify-center items-center gap-5 2xl:gap-8 px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto pt-10 lg:pt-16">
                <div className="flex flex-row items-start justify-start md:justify-center w-full max-w-2xl 2xl:max-w-3xl md:text-center">
                    <h2 className="font-Poppins_Medium text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight"><TextWithHighlight text={landingHero?.title} ></TextWithHighlight></h2>
                </div>
        
                <div className="flex flex-col items-center justify-start w-full max-w-2xl 2xl:max-w-3xl gap-5 md:text-center">
                    <p className="font-Poppins_Regular text-base 2xl:text-lg text-[#5C4774]">
                        {landingHero?.description}
                    </p>
                </div>
          </section>

          <section className="flex flex-col md:justify-center items-center px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto pt-10 lg:pt-16">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-12">
                {aliances.map((logo, index) => (
                    <div className="flex flex-col items-center justify-center h-[60px] gap-3">
                        <img
                            className="object-center object-contain w-full h-full max-h-[30px] 2xl:max-h-[45px]"
                            src={`/api/speciality/media/${logo?.image}`}
                            alt={logo.title}
                            onError={(e) =>(e.target.src = "/api/cover/thumbnail/null")}
                        />
                        <span className="font-Poppins_Regular text-base 2xl:text-lg text-[#5C4774]">{logo?.name}</span>
                    </div>
                ))}
            </div>
          </section>


          <section className="flex flex-col lg:flex-row gap-6 mt-10 lg:mt-16 bg-cover bg-bottom" style={{ backgroundImage: "url('/assets/img/servicios/texturacontactos.png')" }}>
               <div className="flex flex-col lg:flex-row gap-6 px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto ">
                 <div className="flex flex-col w-full lg:w-1/2 gap-5 py-10 lg:py-16">
                    <div className="flex flex-col max-w-xl">
                        <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-3xl sm:text-4xl md:text-3xl lg:text-[44px] !leading-tight">
                            {landingFooter?.title}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl 2xl:max-w-6xl mx-auto gap-5">
                        <div className="flex flex-col gap-2 p-6 2xl:p-8 bg-white rounded-lg">
                            <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] flex flex-col justify-center items-center">
                                <img
                                    src={`/api/landing_home/media/${landingCardone?.image}`}
                                    className="object-cover w-8 h-8"
                                    onError={(e) =>(e.target.src = "/api/cover/thumbnail/null")}
                                />
                            </div>
                            <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-lg 2xl:text-xl">
                                {landingCardone?.title}
                            </h2>
                            
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">{landingCardone?.description}</p>
                            <a href={landingCardone?.link}>
                                <div className="flex flex-row gap-2 items-center justify-start">
                                    <span className="font-Poppins_Regular font-semibold text-[#5C4774] text-base 2xl:text-lg hover:underline">{landingCardone?.subtitle}</span>
                                    <ArrowIcon />
                                </div>
                            </a>
                        </div>
            
                        <div className="flex flex-col gap-2 p-6 2xl:p-8 bg-white rounded-lg">
                            <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] flex flex-col justify-center items-center">
                                
                                <img
                                    src={`/api/landing_home/media/${landingCardsecond?.image}`}
                                    className="object-cover w-8 h-8"
                                    onError={(e) =>(e.target.src = "/api/cover/thumbnail/null")}
                                />
                                
                            </div>
                            <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-lg 2xl:text-xl">
                                {landingCardsecond?.title} 
                            </h2>
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">{landingCardsecond?.description}</p>
                            <a href={landingCardsecond?.link}>
                                <div className="flex flex-row gap-2 items-center justify-start">
                                    <span className="font-Poppins_Regular font-semibold text-[#5C4774] text-base 2xl:text-lg hover:underline">{landingCardsecond?.subtitle}</span>
                                    <ArrowIcon />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full lg:w-1/2">
                    <img className="object-bottom object-contain w-full h-full max-w-xl mx-auto" src={`/api/landing_home/media/${landingFooter?.image}`}  onError={handleImageError} />
                </div>
               </div>
            </section>

      <Footer />
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
      <CarritoProvider>
        <Base {...properties} showSlogan={false}>
          <Partners {...properties} />
        </Base>
      </CarritoProvider>
    );
})