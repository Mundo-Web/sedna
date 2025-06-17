import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ContactForm from "./Components/Contact/ContactForm";
import MaintenancePage from "./Utils/MaintenancePage";
import { useTranslation } from "./hooks/useTranslation";
import ContactFormSedna from "./components/Contact/ContactFormSedna";


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.6,
        },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 },
    },
};

const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const buttonHover = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
    },
};

const ContactoPage = ({ landing, sedes, whatsapp, staff }) => {
    const landingHero = landing?.find(
        (item) => item.correlative === "page_contact_hero"
    );
    const landingForm = landing?.find(
        (item) => item.correlative === "page_contact_form"
    );
    const landingSoporte = landing?.find(
        (item) => item.correlative === "page_contact_help"
    );
    const sectionone = landing?.find(
        (item) => item.correlative === "page_contact_sectionone"
    );
    const sectiontwo = landing?.find(
        (item) => item.correlative === "page_contact_sectiontwo"
    );
    const landingVentas = landing?.find(
        (item) => item.correlative === "page_contact_ventas"
    );
    const sectiontree = landing?.find(
        (item) => item.correlative === "page_contact_sectiontree"
    );
    const sectionfour = landing?.find(
        (item) => item.correlative === "page_contact_sectionfour"
    );
    const sectionfive = landing?.find(
        (item) => item.correlative === "page_contact_sectionfive"
    );

    const sedesValidas = Array.isArray(sedes) ? sedes : [];

    const todosHorariosIguales =
        sedesValidas.length > 0 &&
        sedesValidas.every(
            (sede, _, arr) =>
                JSON.stringify(sede.horario) === JSON.stringify(arr[0].horario)
    );

    const { t } = useTranslation();

    const [openedId, setOpenedId] = useState(sectionone.id);

    const [activeTab, setActiveTab] = useState("ventas");

    const toggleAccordion = (id) => {
        setOpenedId(openedId === id ? null : id);
      };

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

    const VentasContent = () => {
        // Estado para controlar qué formulario mostrar
        const [activeForm, setActiveForm] = useState(null);
    
        // Efecto para actualizar el formulario activo cuando cambia el acordeón
        useEffect(() => {
            if (openedId === sectionfour.id) {
                setActiveForm('form1');
            } else if (openedId === sectionfive.id) {
                setActiveForm('form2');
            } else {
                setActiveForm(null);
            }
        }, [openedId]);
    
        return (
            <section className="px-[5%] xl:px-[8%] py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10 xl:gap-16">
                    <div className="flex flex-col gap-3 items-left justify-start">
                        <h2 className="font-Poppins_Regular font-semibold text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight !tracking-tight">
                            {landingVentas.title}
                        </h2>
                        <div className="flex flex-col w-full font-Poppins_Regular text-base 2xl:text-lg text-[#5C4774]">
                            {landingVentas.description}
                        </div>
                        <div className="w-full flex">
                            <a href={landingVentas.link}>
                                <div className="bg-[#7B5E9A] text-base 2xl:text-lg px-4 py-3 my-auto rounded-md">
                                    <p className="leading-none text-white">{landingVentas.subtitle}</p>
                                </div>
                            </a>
                        </div>
    
                        <div className="flex flex-col w-full max-w-3xl gap-5">
                            <div className="mt-6">
                                {/* Pestaña 1 */}
                                <div className={`bg-white rounded-xl text-[#3E2F4D] shadow-md transition-all duration-300 ${
                                    openedId !== sectiontree.id ? 'opacity-90 hover:opacity-100' : ''
                                    }`}>
                                    <h1
                                        className={`flex justify-between font-Poppins_Regular font-semibold px-6 py-4 bg-[#F5F2F9] cursor-pointer text-base 2xl:text-xl ${
                                        openedId === sectiontree.id ? 'border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400'
                                        }`}
                                        onClick={() => toggleAccordion(sectiontree.id)}
                                    >
                                        <span>{sectiontree.title}</span>
                                        <i className={`mdi ${openedId === sectiontree.id ? 'mdi-arrow-up' : 'mdi-arrow-down'}`}></i>
                                    </h1>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openedId === sectiontree.id ? 'border-l-2 border-[#4B246D] max-h-[500px] opacity-100 py-3' : 'border-l-2 border-slate-400 max-h-0 opacity-0 py-0'
                                        }`}
                                    >
                                        <p className='font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                            {sectiontree.description}
                                        </p>
                                        <div className="flex">
                                            <a href={sectiontree.link} className='flex flex-row gap-2 mt-3 font-semibold font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                                {sectiontree.subtitle} <ArrowIcon />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                        
                                {/* Pestaña 2 - Al desplegarse mostrará Formulario 1 */}
                                <div className={`bg-white rounded-xl text-[#3E2F4D] shadow-md transition-all duration-300 ${
                                    openedId !== sectionfour.id ? 'opacity-90 hover:opacity-100' : ''
                                    }`}>
                                    <h1
                                        className={`flex justify-between font-Poppins_Regular font-semibold px-6 py-4 bg-[#F5F2F9] cursor-pointer text-base 2xl:text-xl ${
                                        openedId === sectionfour.id ? 'border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400'
                                        }`}
                                        onClick={() => toggleAccordion(sectionfour.id)}
                                    >
                                        <span>{sectionfour.title}</span>
                                        <i className={`mdi ${openedId === sectionfour.id ? 'mdi-arrow-up' : 'mdi-arrow-down'}`}></i>
                                    </h1>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openedId === sectionfour.id ? 'max-h-[500px] opacity-100 py-3 border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400 max-h-0 opacity-0 py-0'
                                        }`}
                                    >
                                        <p className='font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                        {sectionfour.description}
                                        </p>
                                    </div>
                                </div>
    
                                {/* Pestaña 3 - Al desplegarse mostrará Formulario 2 */}
                                <div className={`bg-white rounded-xl text-[#3E2F4D] shadow-md transition-all duration-300 ${
                                    openedId !== sectionfive.id ? 'opacity-90 hover:opacity-100' : ''
                                    }`}>
                                    <h1
                                        className={`flex justify-between font-Poppins_Regular font-semibold px-6 py-4 bg-[#F5F2F9] cursor-pointer text-base 2xl:text-xl ${
                                        openedId === sectionfive.id ? 'border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400'
                                        }`}
                                        onClick={() => toggleAccordion(sectionfive.id)}
                                    >
                                        <span>{sectionfive.title}</span>
                                        <i className={`mdi ${openedId === sectionfive.id ? 'mdi-arrow-up' : 'mdi-arrow-down'}`}></i>
                                    </h1>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openedId === sectionfive.id ? 'max-h-[500px] opacity-100 py-3 border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400 max-h-0 opacity-0 py-0'
                                        }`}
                                    >
                                        <p className='font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                        {sectionfive.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="flex flex-col gap-3 items-center justify-start">
                        <div className="flex flex-col w-full">
                            {activeForm === null ? (
                                // Mostrar imagen por defecto cuando no hay acordeón desplegado
                                <img
                                    className="object-cover w-full h-full rounded-lg overflow-hidden max-w-md mx-auto"
                                    src={`/api/landing_home/media/${landingVentas.image}`}
                                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                />
                            ) : activeForm === 'form1' ? (
                                <ContactFormSedna subject="Solicitud de contacto" title={t("public.form.title", "Solicitar un mensaje")} button={t("public.form.button", "Enviar formulario")} />
                            ) : (
                                <ContactFormSedna subject="Agendamiento de cita" title={t("public.form.title", "Agendar Reunión")} button={t("public.form.button", "Agendar cita")} date={true} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const SoporteContent = () => (
        <section className="px-[5%] xl:px-[8%] py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="flex flex-col gap-3 items-left justify-center">
                    <h2 className="font-Poppins_Regular font-semibold text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight !tracking-tight">
                        {landingSoporte.title}
                    </h2>
                    <div className="flex flex-col w-full font-Poppins_Regular text-base 2xl:text-lg text-[#5C4774]">
                        {landingSoporte.description}
                    </div>
                    <div className="w-full flex">
                        <a href={landingSoporte.link}>
                            <div className="bg-[#7B5E9A] text-base 2xl:text-lg px-4 py-3 my-auto rounded-md">
                                <p className="leading-none text-white">{landingSoporte.subtitle}</p>
                            </div>
                        </a>
                    </div>

                    <div className="flex flex-col w-full max-w-3xl gap-5">
                        {   
                            <div className="mt-6">
                                {/* Pestaña 1 */}
                                <div className={`bg-white rounded-xl text-[#3E2F4D] shadow-md transition-all duration-300 ${
                                    openedId !== sectionone.id ? 'opacity-90 hover:opacity-100' : ''
                                    }`}>
                                    <h1
                                        className={`flex justify-between font-Poppins_Regular font-semibold px-6 py-4 bg-[#F5F2F9] cursor-pointer text-base 2xl:text-xl ${
                                        openedId === sectionone.id ? 'border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400'
                                        }`}
                                        onClick={() => toggleAccordion(sectionone.id)}
                                    >
                                        <span>{sectionone.title}</span>
                                        <i className={`mdi ${openedId === sectionone.id ? 'mdi-arrow-up' : 'mdi-arrow-down'}`}></i>
                                    </h1>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openedId === sectionone.id ? 'border-l-2 border-[#4B246D] max-h-[500px] opacity-100 py-3' : 'border-l-2 border-slate-400 max-h-0 opacity-0 py-0'
                                        }`}
                                    >
                                        <p className='font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                            {sectionone.description}
                                        </p>
                                        <div className="flex">
                                            <a href={sectionone.link}  className='flex flex-row gap-2 mt-3 font-semibold font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                                {sectionone.subtitle} <ArrowIcon />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                        
                                {/* Pestaña 2 */}
                                <div className={`bg-white rounded-xl text-[#3E2F4D] shadow-md transition-all duration-300 ${
                                    openedId !== sectiontwo.id ? 'opacity-90 hover:opacity-100' : ''
                                    }`}>
                                    <h1
                                        className={`flex justify-between font-Poppins_Regular font-semibold px-6 py-4 bg-[#F5F2F9] cursor-pointer text-base 2xl:text-xl ${
                                        openedId === sectiontwo.id ? 'border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400'
                                        }`}
                                        onClick={() => toggleAccordion(sectiontwo.id)}
                                    >
                                        <span>{sectiontwo.title}</span>
                                        <i className={`mdi ${openedId === sectiontwo.id ? 'mdi-arrow-up' : 'mdi-arrow-down'}`}></i>
                                    </h1>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openedId === sectiontwo.id ? 'max-h-[500px] opacity-100 py-3 border-l-2 border-[#4B246D]' : 'border-l-2 border-slate-400 max-h-0 opacity-0 py-0'
                                        }`}
                                    >
                                        <p className='font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                        {sectiontwo.description}
                                        </p>

                                        <div className="flex">
                                            <a href={sectiontwo.link}  className='flex flex-row gap-2 mt-3 font-semibold font-Poppins_Regular text-base 2xl:text-lg text-[#4B246D]'>
                                                {sectiontwo.subtitle} <ArrowIcon />
                                            </a>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center justify-start">
                    <div className="flex flex-col">
                        <img
                        className="object-cover w-full h-full rounded-lg overflow-hidden max-w-md mx-auto"
                        src={`/api/landing_home/media/${landingSoporte.image}`}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <div className="font-poppins text-negro">
            <Header />

            <section className="flex flex-col md:justify-center items-center gap-5 2xl:gap-8 px-[5%] pt-10 lg:pt-16">
                <div className="flex flex-row items-start justify-start md:justify-center w-full max-w-2xl 2xl:max-w-3xl md:text-center">
                    <p className="font-Poppins_Medium text-[#3E2F4D] text-xl 2xl:text-2xl !leading-tight">{landingHero?.subtitle}</p>
                </div>

                <div className="flex flex-row items-start justify-start md:justify-center w-full max-w-3xl 2xl:max-w-4xl md:text-center">
                    <h2 className="font-Poppins_Medium text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight">{landingHero?.title}</h2>
                </div>
        
                <div className="flex flex-col items-center justify-start w-full max-w-2xl 2xl:max-w-3xl gap-5 md:text-center">
                    <p className="font-Poppins_Regular text-base 2xl:text-lg text-[#5C4774]">
                        {landingHero?.description}
                    </p>
                </div>
            </section>


            <div className="flex flex-row md:justify-center items-center text-[#3E2F4D] gap-3 md:gap-8 2xl:gap-10 px-[5%] pt-10 lg:pt-16">
                <button 
                    className={`text-base xl:text-xl font-medium pb-2 ${activeTab === "ventas" ? "border-b-2 border-[#4B246D] text-[#4B246D]" : "text-[#7B5E9A]"}`}
                    onClick={() => setActiveTab("ventas")}
                >
                    Contacto con ventas
                </button>
                <button 
                    className={`text-base xl:text-xl font-medium pb-2 ${activeTab === "soporte" ? "border-b-2 border-[#4B246D] text-[#4B246D]" : "text-[#7B5E9A]"}`}
                    onClick={() => setActiveTab("soporte")}
                >
                    Contacto con soporte
                </button>
            </div>

            {activeTab === "ventas" ? <VentasContent /> : <SoporteContent />}

            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <ContactoPage {...properties} />
            </Base>
        </CarritoProvider>
    );
});
