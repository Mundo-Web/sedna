import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../Utils/HtmlContent";
import GeneralRest from "../../actions/GeneralRest";
import { X } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaPinterest,
  FaReddit
} from 'react-icons/fa';

ReactModal.setAppElement("#app");

// Mapeo de iconos de redes sociales
const socialIconsMap = {
  'fab fa-facebook': FaFacebook,
  'fab fa-twitter': FaTwitter,
  'fab fa-instagram': FaInstagram,
  'fab fa-linkedin': FaLinkedin,
  'fab fa-youtube': FaYoutube,
  'fab fa-tiktok': FaTiktok,
  'fab fa-whatsapp': FaWhatsapp,
  'fab fa-telegram': FaTelegram,
  'fab fa-discord': FaDiscord,
  'fab fa-snapchat': FaSnapchat,
  'fab fa-pinterest': FaPinterest,
  'fab fa-reddit': FaReddit
};

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
    const [whatsappData, setWhatsappData] = useState({
        number: '',
        message: ''
    });

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                // Filtrar solo las redes sociales visibles
                const visibleSocials = data.filter(social => social.visible === 1 || social.visible === true);
                setSocials(visibleSocials);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        fetchSocials();
    }, []);

    // Buscar WhatsApp para el botón flotante
    const Whatsapp = socials.find(
        (social) => social.description === "WhatsApp" || social.icon === "fab fa-whatsapp"
    );

    const [aboutuses, setAboutuses] = useState(null);

    useEffect(() => {
        const fetchAboutuses = async () => {
            try {
                const data = await generalRest.getAboutuses();
                setAboutuses(data);
                
                // Extraer datos de WhatsApp de los generales
                const generals = data?.generals || [];
                const whatsappNumber = generals.find((x) => x.correlative === "whatsapp_number")?.description ?? "";
                const whatsappMessage = generals.find((x) => x.correlative === "whatsapp_message")?.description ?? "";
                
                setWhatsappData({
                    number: whatsappNumber,
                    message: whatsappMessage
                });
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

    // Construir el enlace de WhatsApp
    const whatsappLink = whatsappData.number 
        ? `https://api.whatsapp.com/send?phone=${whatsappData.number}${whatsappData.message ? `&text=${encodeURIComponent(whatsappData.message)}` : ''}`
        : null;

    // Función para hacer scroll al header y abrir el mega menú
    const scrollToHeaderAndOpenMenu = (menuType) => {
        // Hacer scroll suave al inicio de la página
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Esperar a que termine el scroll y luego disparar el evento para abrir el mega menú
        setTimeout(() => {
            const event = new CustomEvent('openMegaMenu', {
                detail: { menuType }
            });
            window.dispatchEvent(event);
        }, 1000); // Ajusta el tiempo según la duración del scroll
    };

    return (
        <>  
            {whatsappLink && (
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
                            href={whatsappLink}
                            rel="noopener noreferrer"
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
                        <div className="flex flex-row gap-5 text-white mt-3 flex-wrap">
                            {socials.map((social, index) => {
                                const IconComponent = socialIconsMap[social.icon];
                                
                                return (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#7B5E9A] transition-colors duration-300"
                                        title={social.description}
                                    >
                                        {IconComponent ? (
                                            <IconComponent className="text-2xl" />
                                        ) : (
                                            <i className={`${social.icon} fa-xl`}></i>
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    
                    

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

                
                    <div className="flex flex-col gap-2 font-Poppins_Regular text-[15px]">
                        <h3 className="text-lg pb-3 font-Poppins_Medium">
                            {t("public.footer.portfolio", "Nuestro Portafolio")}
                        </h3>
                        <button 
                            onClick={() => scrollToHeaderAndOpenMenu('#solutions')} 
                            className="cursor-pointer text-left hover:text-[#7B5E9A] transition-colors duration-300"
                        >
                            {t("public.footer.solutions", "Soluciones")}
                        </button>
                        <button 
                            onClick={() => scrollToHeaderAndOpenMenu('#services')} 
                            className="cursor-pointer text-left hover:text-[#7B5E9A] transition-colors duration-300"
                        >
                            {t("public.footer.services", "Servicios")}
                        </button>
                        <button 
                            onClick={() => scrollToHeaderAndOpenMenu('#options')} 
                            className="cursor-pointer text-left hover:text-[#7B5E9A] transition-colors duration-300"
                        >
                            {t(
                                "public.footer.purchase_options",
                                "Opciones de compra"
                            )}
                        </button>
                    </div>

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
