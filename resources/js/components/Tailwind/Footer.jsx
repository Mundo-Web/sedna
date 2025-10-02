import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../Utils/HtmlContent";
import GeneralRest from "../../actions/GeneralRest";
import { X } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

ReactModal.setAppElement("#app");

const Footer = ({ terms, footerLinks = [] }) => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(false);
    const generalRest = new GeneralRest();
    const links = {};
    /* footerLinks.forEach((fl) => {
        links[fl.correlative] = fl.description;
    });*/
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                setSocials(data);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        fetchSocials();
    }, []); // Asegúrate de que este array de dependencias está vacío si solo se ejecuta una vez

    const Facebook = socials.find(
        (social) => social.description === "Facebook"
    );
    const Twitter = socials.find((social) => social.description === "Twitter");
    const Instagram = socials.find(
        (social) => social.description === "Instagram"
    );
    const Youtube = socials.find((social) => social.description === "Youtube");
    const Tiktok = socials.find((social) => social.description === "Tiktok");
    const Whatsapp = socials.find((social) => social.description === "WhatsApp");

    const [aboutuses, setAboutuses] = useState(null); // o useState({});

    useEffect(() => {
        const fetchAboutuses = async () => {
            try {
                const data = await generalRest.getAboutuses();
                setAboutuses(data);
            } catch (error) {
                console.error("Error fetching about:", error);
            }
        };

        fetchAboutuses();
    }, []);

    const aboutusData = aboutuses?.aboutus || [];
    const generalsData = aboutuses?.generals || [];
    const sedesData = aboutuses?.sedes || [];
    // console.log(sedesData);
    const policyItems = {
        privacy_policy: t("public.footer.privacity", "Políticas de privacidad"),
        terms_conditions: t("public.form.terms", "Términos y condiciones"),
        // 'delivery_policy': 'Políticas de envío',
        exchange_policy: t("public.footer.change", "Políticas de cambio"),
    };

    const cleanText = (text) => {
        if (text === null || text === undefined) return "";

        // Convertir a string y eliminar varios patrones de asteriscos
        return String(text)
            .replace(/\*\*(.*?)\*\*/g, "$1") // **texto**
            .replace(/\*(.*?)\*/g, "$1") // *texto*
            .replace(/[*]+/g, ""); // Cualquier asterisco suelto
    };

    return (
        <>  
            {Whatsapp && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end w-full mx-auto z-[100] relative"
                >
                    <div className="fixed bottom-3 right-2 md:bottom-[1rem] lg:bottom-[2rem] lg:right-3 z-20 cursor-pointer">
                        <a
                            target="_blank"
                            id="whatsapp-toggle"
                            href={Whatsapp.link}
                        >
                            <motion.img
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                }}
                                src="/assets/img/icons/WhatsApp.svg"
                                alt="whatsapp"
                                className="mr-3 w-16 h-16 md:w-[80px] md:h-[80px]"
                            />
                        </a>
                    </div>
                </motion.div>
            )}

            <footer className="bg-[#3E2F4D]">
                {" "}
           
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:justify-center w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto py-10 md:py-16 text-white">
                    {/* Columna 1 - Logo y descripción */}
                    <div className="lg:col-span-2 flex flex-col gap-3 max-w-sm">
                        <a href="/">
                            <img
                                className="min-w-56 w-60"
                                src="/assets/img/logofooter_senda.svg"
                                alt="Sedna Logo"
                            />
                        </a>
                        <p className="!font-Poppins_Regular text-white text-sm">
                            {t(
                                "public.footer.description",
                                "Simplifica la tecnología y potencia tu negocio con Sedna. Estamos a solo un clic de distancia."
                            )}
                        </p>
                        <div className="flex flex-row gap-5 text-white mt-3">
                            {Facebook && (
                                <a
                                    href={Facebook.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    
                                    <i className="fa-brands fa-facebook fa-xl"></i>
                                </a>
                            )}

                            {Tiktok && (
                                <a
                                    href={Tiktok.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-tiktok fa-xl"></i>
                                </a>
                            )} 

                            {Instagram && (
                                <a
                                    href={Instagram.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-instagram fa-xl"></i>
                                </a>
                            )} 

                            {/* {datosgenerales?.linkedin && (
                                <a
                                    href={datosgenerales.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-linkedin fa-xl"></i>
                                </a>
                            )} */}

                            {Twitter && (
                                <a
                                    href={Twitter.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-twitter fa-xl"></i>
                                </a>
                            )} 

                            {Youtube && (
                                <a
                                    href={Youtube.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-youtube fa-xl"></i>
                                </a>
                            )}

                            {Whatsapp && (
                                <a
                                    href={Whatsapp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-whatsapp fa-xl"></i>
                                </a>
                            )}
                        </div>
                    </div>
                    
                    <div className="hidden md:flex"></div>

                    {/* Columna 2 - Sobre Sedna */}
                    <div className="flex flex-col gap-2 font-Poppins_Regular text-[15px]">
                        <h3 className="text-lg pb-3 font-Poppins_Medium">
                            {t("public.footer.about", "Sobre Sedna")}
                        </h3>
                        <a href="/about" className="cursor-pointer">
                            {t("public.footer.our_story", "Nuestra Historia")}
                        </a>
                        <a href="/aliances" className="cursor-pointer">
                            {t(
                                "public.footer.alliances",
                                "Alianzas Comerciales"
                            )}
                        </a>
                        <a href="/contact" className="cursor-pointer">
                            {t("public.footer.contact_us", "Contactanos")}
                        </a>
                    </div>

                    {/* Columna 3 - Portafolio */}
                    {/* <div className="flex flex-col gap-2 font-Poppins_Regular text-[15px]">
                        <h3 className="text-lg pb-3 font-Poppins_Medium">
                            {t("public.footer.portfolio", "Nuestro Portafolio")}
                        </h3>
                        <a href="/soluciones" className="cursor-pointer">
                            {t("public.footer.solutions", "Soluciones")}
                        </a>
                        <a href="/servicios" className="cursor-pointer">
                            {t("public.footer.services", "Servicios")}
                        </a>
                        <a href="/opciones-compra" className="cursor-pointer">
                            {t(
                                "public.footer.purchase_options",
                                "Opciones de compra"
                            )}
                        </a>
                    </div> */}

                    {/* Columna 4 - Soporte */}
                    <div className="flex flex-col gap-2 font-Poppins_Regular text-[15px]">
                        <h3 className="text-lg pb-3 font-Poppins_Medium">
                            {t("public.footer.support", "Centro de Soporte")}
                        </h3>
                        <a href="/faqs" className="cursor-pointer">
                            {t(
                                "public.footer.faqs",
                                "Preguntas Frecuentes (FAQs)"
                            )}
                        </a>
                        <a href="/blog" className="cursor-pointer">
                            {t("public.footer.blog", "Perspectivas (Blog)")}
                        </a>
                    </div>
                </div>
                <div className="bg-[#EBE4F3] text-[#1F1827] py-3 flex items-center justify-center">
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-5 w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto font-Poppins_Regular text-sm">
                        <div className="text-center">
                            <p>
                                {t(
                                    "public.footer.copyright",
                                    "Copyright © 2025 Sedna. Reservados todos los derechos. Realizado por"
                                )}
                                <a
                                    href="https://www.mundoweb.pe"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1F1827] border-b border-[#1F1827]"
                                >
                                    {" "}
                                    Mundo Web
                                </a>
                            </p>
                        </div>

                        <div className="flex flex-row gap-4">
                            <a
                                onClick={() => openModal(0)}
                                className="cursor-pointer"
                            >
                                {t("public.footer.privacy", "Privacidad")}
                            </a>
                            <a
                                onClick={() => openModal(1)}
                                className="cursor-pointer"
                            >
                                {t("public.footer.terms", "Condiciones de uso")}
                            </a>
                        </div>
                    </div>
                </div>
                {/* Modal para Términos y Condiciones */}
                {Object.keys(policyItems).map((key, index) => {
                    const title = policyItems[key];
                    const content =
                        generalsData.find((x) => x.correlative == key)
                            ?.description ?? "";
                    return (
                        <ReactModal
                            key={index}
                            isOpen={modalOpen === index}
                            onRequestClose={closeModal}
                            contentLabel={title}
                            className="fixed top-[5%] left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-lg w-[95%] max-w-4xl max-h-[90vh] mb-10 overflow-y-auto scrollbar-hide"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto  scrollbar-hide "
                        >
                            <button
                                onClick={closeModal}
                                className="float-right  text-red-500 hover:text-red-700 transition-all duration-300 "
                            >
                                <X width="2rem" strokeWidth="4px" />
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{title}</h2>
                            <HtmlContent className="prose" html={content} />
                        </ReactModal>
                    );
                })}
            </footer>
        </>
    );
};

export default Footer;
