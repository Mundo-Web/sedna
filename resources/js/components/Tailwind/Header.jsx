import { motion, AnimatePresence } from "framer-motion";
import Tippy from "@tippyjs/react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import GeneralRest from "../../actions/GeneralRest";
import { TbBrush } from "react-icons/tb";
import { Trash2 } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { LanguageContext } from "../../context/LanguageContext";
import LanguageDropdown from "./Header/LanguageDropdown";
import MegaMenuPopup from "./Header/MegaMenuPopup";
import SolutionRest from "../../actions/SolutionsRest";
import ServiceRest from "../../actions/ServicesRest";
import PurchaseOptionsRest from "../../actions/PurchaseOptionsRest";

const generalRest = new GeneralRest();
const solutionRest = new SolutionRest();
const serviceRest = new ServiceRest();
const purchaseRest = new PurchaseOptionsRest();


// Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
        },
    },
};

const cartItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        x: -50,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const Header = ({
    session,
    showSlogan = true,
    gradientStart,
    menuGradientEnd,
    backgroundType = "none",
    backgroundSrc = "",
    backgroundHeight = "h-full",
    backgroundPosition = "object-top",
    children,
    landing
    
}) => {
    const { t, loading, error } = useTranslation();
    /*  if (loading) {
        return <div className="text-center py-4">Cargando menú...</div>;
    }
    
    if (error) {
        return (
            <div className="alert alert-danger m-3">
                Error cargando traducciones: {error}
            </div>
        );
    }*/
    
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const btnToggleRef = useRef(null);
    const { incrementarCantidad, decrementarCantidad } =
        useContext(CarritoContext);

    const toggleMenu = (event) => {
        if (event.target.closest(".menu-toggle")) {
            setIsOpen(!isOpen);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                btnToggleRef.current == event.target ||
                btnToggleRef.current.contains(event.target)
            )
                return;
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { carrito, eliminarProducto } = useContext(CarritoContext);
    const [animar, setAnimar] = useState(false);
    const totalProductos = carrito.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc + item.variations.reduce((sum, v) => sum + v.quantity, 0)
            );
        }
        return acc + item.quantity;
    }, 0);

    useEffect(() => {
        if (totalProductos > 0) {
            setAnimar(true);
            setTimeout(() => setAnimar(false), 500);
        }
    }, [totalProductos]);

    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const totalPrecio = carrito.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc +
                item.variations.reduce(
                    (sum, v) => sum + item.final_price * v.quantity,
                    0
                )
            );
        }
        return acc + item.final_price * item.quantity;
    }, 0);

    const [socials, setSocials] = useState([]);
    
    const [megamenu, setMegaMenu] = useState({
        solutions: [],
        services: [],
        options: [],
    });
    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                const languages = await generalRest.getLanguages();
                const megamenu = await generalRest.getMegamenu();
                setSocials(data);
                setLanguagesSystem(languages);
                setMegaMenu(megamenu);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        fetchSocials();
    }, []);
    
    const TikTok = socials.find((social) => social.description === "TikTok");
    const WhatsApp = socials.find(
        (social) => social.description === "WhatsApp"
    );
    const Instagram = socials.find(
        (social) => social.description === "Instagram"
    );
    const Facebook = socials.find(
        (social) => social.description === "Facebook"
    );

    const [activeLink, setActiveLink] = useState("/");

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveLink(currentPath);
    }, []);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const isActive = (path) => {
        return activeLink === path;
    };

    const [languagesSystem, setLanguagesSystem] = useState([]);
    const { currentLanguage, changeLanguage } = useContext(LanguageContext);
    const [selectLanguage, setSelectLanguage] = useState(
        currentLanguage || languagesSystem[0]
    );

    useEffect(() => {
        if (currentLanguage) {
            setSelectLanguage(currentLanguage);
        } else if (languagesSystem.length > 0) {
            setSelectLanguage(languagesSystem[0]);
        }
    }, [currentLanguage, languagesSystem]);
    
    const onUseLanguage = async (langData) => {
        try {
            // Obtén el token CSRF de las cookies automáticamente
            const response = await fetch("/set-current-lang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfTokenFromCookie(), // Función para obtenerlo
                },
                body: JSON.stringify({ lang_id: langData.id }),
                credentials: "include", // Permite enviar cookies
            });

            if (response.ok) {
                await changeLanguage(langData); // ✅ Agrega await aquí
                setSelectLanguage(langData);
                // window.location.reload();
                window.location.href = "/";
            } else {
                console.log("Error de extracion:", await response.text());
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    // Función para extraer el token de la cookie
    const getCsrfTokenFromCookie = () => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return cookie ? decodeURIComponent(cookie[1]) : null;
    };


    const [activeMegaMenu, setActiveMegaMenu] = useState(null);

    useEffect(() => {
        const handleOpenMegaMenu = (event) => {
            const { menuType } = event.detail;
            setActiveMegaMenu(menuType);
        };

        window.addEventListener('openMegaMenu', handleOpenMegaMenu);

        return () => {
            window.removeEventListener('openMegaMenu', handleOpenMegaMenu);
        };
    }, []);

    useEffect(() => {
        if (activeMegaMenu) {
          document.body.style.overflow = 'hidden';
          // Opcional: también podrías querer prevenir el scroll del touch en móviles
          document.body.style.touchAction = 'none';
        } else {
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
        }
      
        return () => {
          document.body.style.overflow = '';
          document.body.style.touchAction = '';
        };
      }, [activeMegaMenu]);
      
    const toggleMegaMenu = (path) => {
        // Si ya está abierto, ciérralo
        if (activeMegaMenu === path) {
            setActiveMegaMenu(null);
        } else if (["#solutions", "#services", "#options"].includes(path)) {
            setActiveMegaMenu(path);
        } else {
            setActiveMegaMenu(null); // Cierra si es otra ruta
        }
    };

    const closeMegaMenu = () => setActiveMegaMenu(null);

    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (accordion) => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    useEffect(() => {
        if (isOpen) {
          const originalStyle = window.getComputedStyle(document.body).overflow;
          document.body.style.overflow = 'hidden';
          return () => {
            document.body.style.overflow = originalStyle;
          };
        }
    }, [isOpen]);

    const AccordionItem = ({ title, items, isOpen, toggleAccordion, onItemClick  }) => (
        <div className={`border-b border-[#EAE8EB] ${isOpen ? 'pb-3' : ' pb-0'}`}>
          <button 
            onClick={toggleAccordion}
            className={`flex justify-between items-center w-full text-left pl-2 py-3 rounded-md  overflow-hidden relative ${isOpen ? 'bg-[#F5F2F9]' : 'bg-transparent'}`}
          >
            <span className={`w-1 h-full absolute left-0 top-0 transition-colors duration-300 ${isOpen ? 'bg-[#3E2F4D]' : 'bg-transparent'}`}></span>
            <span className="text-[#5C4774] text-base font-Poppins_SemiBold ">{title}</span>
            <motion.span
              animate={{ rotate: isOpen ? 0 : 180 }}
              className="text-[#5C4774]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_476_2405" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" mask-type="alpha">
                    <rect width="24" height="24" transform="matrix(1 0 0 -1 0 24)" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_476_2405)">
                    <path d="M12 8.62344L6 14.6234L7.4 16.0234L12 11.4484L16.6 16.0234L18 14.6234L12 8.62344Z" fill="#3E2F4D" />
                </g>
               </svg>
            </motion.span>
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pl-4 pt-3 space-y-4"
              >
                {items.map((item, index) => (
                  <motion.li key={index}>
                    <button 
                      className="text-[#5C4774] text-sm font-Poppins_Regular hover:text-[#7B5E9A]"
                      onClick={() => onItemClick(item)}
                    >
                      {item}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const searchModalRef = useRef(null);
    const [isSearching, setIsSearching] = useState(false);
    

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
            setSearchModalOpen(false);
          }
        };
    
        if (searchModalOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchModalOpen]);
      
    useEffect(() => {
    if (searchQuery.length > 2) {
        setIsSearching(true);
        const promises = [
            solutionRest.getSolutions({ query: searchQuery }),
            serviceRest.getServices({ query: searchQuery }),
            purchaseRest.getOptions({ query: searchQuery })
        ];

        Promise.all(promises)
            .then(([solutions, services, purchases]) => {
                const combinedResults = [
                    ...(solutions.data || []).map(item => ({ ...item, type: 'solution' })),
                    ...(services.data || []).map(item => ({ ...item, type: 'service' })),
                    ...(purchases.data || []).map(item => ({ ...item, type: 'purchase' }))
                ];
                setSearchResults(combinedResults);
            })
            .catch(error => {
                console.error("Error en la búsqueda:", error);
                setSearchResults([]);
            })
            .finally(() => {
                setIsSearching(false);
            });
    } else {
        setSearchResults([]);
    }
    }, [searchQuery]);
    
    useEffect(() => {
        setSearchQuery('')
    }, [searchModalOpen])


    const ServiceModal = ({ isOpen, onClose, content }) => {
        if (!content) return null;
        
        return (
            <AnimatePresence>
            {isOpen && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-70 z-[99] flex items-center justify-center p-4"
                onClick={onClose}
                >
                <motion.div 
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: 50 }}
                    className="bg-white rounded-lg max-w-2xl w-full h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-4 py-6 relative">
                        <div className="flex justify-between items-start mb-4 ">
                            <h3 className="text-2xl font-Poppins_SemiBold text-[#3E2F4D]">{content.categoryName}</h3>
                            <button onClick={onClose} className="text-[#5C4774] absolute right-2.5 top-7">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="#5C4774" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    
                        <div className="flex flex-col gap-4">
                            {content.items.map((item, index) => (
                                <a key={index} href={`/${item.category.type}/${item.slug}`} className="">
                                    <div className="border-b border-[#EAE8EB] p-3 rounded-md last:border-0 bg-[#F5F2F9]">
                                        <h4 className="font-Poppins_SemiBold text-[#3E2F4D]">{item.title}</h4>
                                        <p className="text-[#5C4774] text-sm mt-1 line-clamp-3">{item.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        );
    };

    const solutionsCategories = [
        ...new Set(
            megamenu.solutions
            .filter(item => item.category && item.category.name !== "Undefined")
            .map(item => item.category.name)
        )
    ];
      
    const servicesCategories = [
    ...new Set(
        megamenu.services
        .filter(item => item.category && item.category.name !== "Undefined")
        .map(item => item.category.name)
    )
    ];
    
    const optionsCategories = [
    ...new Set(
        megamenu.options
        .filter(item => item.category && item.category.name !== "Undefined")
        .map(item => item.category.name)
    )
    ];

    const menuData = {};
    
    [...megamenu.solutions, ...megamenu.services, ...megamenu.options].forEach(item => {
        menuData[item.title] = {
            title: item.title,
            description: item.description,
            slug: item.slug,
        };
    });

    
    
    return (
        <>

            <div
                className={`w-full max-w-full relative ${backgroundHeight}`}
            >
                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className={`font-poppins static lg:w-full top-0 z-40 transition-colors duration-300 ${
                        backgroundType === "none"
                            ? "bg-transparent mt-0"
                            : isScrolled
                            ? "bg-[#224483] pt-0 !mt-0"
                            : "bg-transparent top-4 pt-8 md:pt-14 lg:pt-10"
                    } ${
                        isScrolled &&
                        "bg-[#224483] pt-0 !mt-0 transition-all duration-150"
                    }`}
                >
                    <div
                        className={`px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-2  flex justify-between items-center text-[#3E2F4D] shadow-lg lg:shadow-none`}
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center"
                        >
                            <a href="/">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    src="/assets/img/sedna_logo.svg"
                                    alt="Sedna Logo"
                                    className="object-contain h-10 lg:h-16 w-auto"
                                />
                            </a>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="hidden xl:flex py-6 mx-auto justify-center items-center font-normal text-base"
                        >
                            <nav className="flex items-center gap-1">
                                {[
                                  
                                    "#solutions",
                                    "#services",
                                    "#options",
                                    "/contact",
                                ].map((path) => {
                                    const text = {
                                     
                                        "#solutions": t(
                                            "public.header.solutions",
                                            "Soluciones"
                                        ),
                                        "#services": t(
                                            "public.header.services",
                                            "Servicios"
                                        ),
                                        "#options": t(
                                            "public.header.options",
                                            "Opciones de compra"
                                        ),
                                        "/contact": t(
                                            "public.header.help",
                                            "Ayuda"
                                        ),
                                    }[path];

                                    return (
                                        <div key={path} className="relative">
                                            <motion.a
                                                key={path}
                                                href={path}
                                                onClick={(e) => {
                                                    if (["#solutions", "#services", "#options"].includes(path)) {
                                                        e.preventDefault();
                                                        toggleMegaMenu(path);
                                                    } else {
                                                        setActiveMegaMenu(null); 
                                                    }
                                                    handleLinkClick(path);
                                                }}
                                                variants={itemVariants}
                                                whileHover={{ backgroundColor: "#F5F2F9" }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`relative py-2.5 px-4 rounded-full transition-all duration-300 font-Poppins_Medium text-base flex items-center gap-1.5 ${
                                                    isActive(path)
                                                        ? "bg-[#EFF0F1] text-[#3E2F4D]"
                                                        : "bg-transparent text-[#3E2F4D] hover:bg-[#F5F2F9]"
                                                }`}
                                            >
                                                {isActive(path) && (
                                                    <motion.span
                                                        layoutId="activeDot"
                                                        className="h-2 w-2 bg-[#3E2F4D] rounded-full"
                                                    />
                                                )}
                                                {text}
                                                {["#solutions", "#services", "#options"].includes(path) && (
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        width="16" 
                                                        height="16" 
                                                        viewBox="0 0 24 24" 
                                                        fill="none"
                                                        className={`transition-transform duration-300 ${activeMegaMenu === path ? 'rotate-180' : ''}`}
                                                    >
                                                        <path d="M6 9L12 15L18 9" stroke="#3E2F4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </motion.a>
                                            <AnimatePresence>
                                                {activeMegaMenu === path && (
                                                    <div className="">
                                                        <MegaMenuPopup 
                                                         isOpen={activeMegaMenu === path} 
                                                         onClose={closeMegaMenu}
                                                         data={
                                                            activeMegaMenu === "#solutions"
                                                            ? megamenu.solutions
                                                            : activeMegaMenu === "#services"
                                                            ? megamenu.services
                                                            : activeMegaMenu === "#options"
                                                            ? megamenu.options
                                                            : []
                                                        }
                                                        />
                                                    </div>
                                                )}
                                            </AnimatePresence>    
                                    </div>
                                    );
                                })}
                            </nav>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="hidden xl:flex items-center gap-3">
                                <motion.button 
                                    onClick={() => setSearchModalOpen(true)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2.5 hover:bg-[#F5F2F9] rounded-full transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <path d="M17.5 17.5L22 22" stroke="#3E2F4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="#3E2F4D" strokeWidth="2" strokeLinejoin="round"/>
                                    </svg>
                                </motion.button>
                                
                                <div className="w-px h-6 bg-[#E0DDE5]"></div>
                                
                                <LanguageDropdown 
                                    languagesSystem={languagesSystem} 
                                    selectLanguage={selectLanguage} 
                                    onUseLanguage={onUseLanguage} 
                                />
                                
                                <motion.a 
                                    href="/contact"
                                    whileHover={{ scale: 1.02, backgroundColor: "#6B4E85" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-[#7B5E9A] font-Poppins_SemiBold text-white text-base px-6 py-2.5 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    {t("public.header.contact", "Contáctanos")}
                                </motion.a>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex xl:hidden items-center gap-3">
                                <motion.button 
                                    onClick={() => setSearchModalOpen(true)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 hover:bg-[#F5F2F9] rounded-full transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M17.5 17.5L22 22" stroke="#3E2F4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="#3E2F4D" strokeWidth="2" strokeLinejoin="round"/>
                                    </svg>
                                </motion.button>
                                
                                <motion.button
                                    ref={btnToggleRef}
                                    onClick={toggleMenu}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ backgroundColor: "#E8E4EE" }}
                                    className={`menu-toggle rounded-full h-[44px] w-[44px] flex items-center justify-center bg-[#EFF0F1] transition-all duration-300 ${
                                        isModalOpen ? "hidden" : "flex"
                                    }`}
                                    aria-label="Toggle menu"
                                >
                                    <i
                                        className={`fas ${
                                            isOpen ? "fa-times" : "fa-bars"
                                        } text-xl text-[#3E2F4D]`}
                                    />
                                </motion.button>
                        </motion.div>
                    </div>

                    
                </motion.header>

                {/* Menú móvil */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                            className="fixed inset-0 bg-[#FFFFFF] text-[#000000] z-[30] p-[5%] overflow-y-auto"
                        >   
                            
                            <div className="flex flex-col items-start justify-between h-full">
                                <div className="flex flex-col gap-3 flex-grow w-full">
                                    <h2 className="text-2xl text-[#3E2F4D] font-Poppins_SemiBold h-12">Menú</h2>
                                    
                                    <a
                                        href="/"
                                        className="text-[#5C4774] text-base font-Poppins_SemiBold border-l-4 py-1 pl-1 rounded-l-md border-l-transparent border-b pb-3 border-[#EAE8EB]"
                                    >
                                        {t("public.header.home", "Inicio")}
                                    </a>

                                    {/* Acordeón de Soluciones */}
                                    <AccordionItem 
                                        title= {t(
                                            "public.header.solutions",
                                            "Soluciones")} 
                                        items={solutionsCategories}
                                        isOpen={openAccordion === 'solutions'}
                                        toggleAccordion={() => toggleAccordion('solutions')}
                                        onItemClick={(category) => {
                                            const categoryItems = megamenu.solutions.filter(
                                                item => item.category && item.category.name === category && item.category.name !== "Undefined"
                                            );
                                            setModalContent({
                                              categoryName: category,
                                              items: categoryItems
                                            });
                                            setIsModalOpen(true);
                                        }}
                                    />
                                    
                                    {/* Acordeón de Servicios */}
                                    <AccordionItem 
                                        title={t(
                                            "public.header.services",
                                            "Servicios"
                                        )} 
                                        items={servicesCategories}
                                        isOpen={openAccordion === 'services'}
                                        toggleAccordion={() => toggleAccordion('services')}
                                        onItemClick={(category) => {
                                            const categoryItems = megamenu.services.filter(
                                                item => item.category && item.category.name === category && item.category.name !== "Undefined"
                                            );
                                            setModalContent({
                                                categoryName: category,
                                                items: categoryItems
                                            });
                                            setIsModalOpen(true);
                                        }}
                                    />
                                    
                                    {/* Acordeón de Opciones de compra */}
                                    <AccordionItem 
                                        title={t(
                                            "public.header.options",
                                            "Opciones de compra"
                                        )}
                                        items={optionsCategories}
                                        isOpen={openAccordion === 'options'}
                                        toggleAccordion={() => toggleAccordion('options')}
                                        onItemClick={(category) => {
                                            const categoryItems = megamenu.options.filter(
                                                item => item.category && item.category.name === category && item.category.name !== "Undefined"
                                            );
                                            setModalContent({
                                              categoryName: category,
                                              items: categoryItems
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        
                                    />

                                    <a
                                        href="/contact"
                                        className="text-[#5C4774] text-base font-Poppins_SemiBold border-l-4 py-1 pl-1 rounded-l-md border-transparent"
                                    >
                                        {t(
                                            "public.header.help",
                                            "Ayuda"
                                        )}
                                    </a>
                                </div>
                                
                                <a href="/contact" className="bg-[#7B5E9A] text-base rounded-sm font-Poppins_SemiBold  text-white py-3 w-full text-center">
                                    <span className="font-Poppins_SemiBold">{t("public.header.contact", "Contáctanos")}</span>
                                </a>
                                
                                <ServiceModal 
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    content={modalContent}
                                />

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal de búsqueda */}
                {searchModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
                    <div ref={searchModalRef} className="bg-white w-full max-w-xl rounded-lg shadow-xl mx-4">
                    <div className="relative">
                        <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Estoy buscando (mínimo 2 caracteres)..."
                        className="w-full p-3 px-4 bg-transparent focus:outline-none"
                        />
                        <button
                        onClick={() => setSearchModalOpen(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                        <i className="mdi mdi-close text-xl"></i>
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {searchResults.map((result) => (
                        <a
                            href={`/${result.type === 'solution' ? 'solucion' : result.type === 'service' ? 'servicio' : 'opcion'}/${result.slug}`}
                            key={result.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-2 items-center border-t"
                        >
                            <img
                                src={`/api/${result.type === 'solution' ? 'solution' : result.type === 'service' ? 'service' : 'purchaseOption'}/media/${result.image}`}
                                className="h-12 aspect-[4/3] rounded"
                                alt={result.name}
                                onError={e => e.target.src = '/api/cover/thumbnail/null'} />
                            <div className="w-[calc(100%-60px)]">
                                <h3 className="font-bold truncate w-full">{result.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
                            </div>
                        </a>
                        ))}

                        {searchQuery.length > 2 && searchResults.length === 0 && (
                        <div className="p-4 text-center text-gray-500 border-t">
                            No se encontraron resultados para "{searchQuery}"
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                )}

                {/* Contenido dinámico */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center text-center text-white p-6"
                    >
                        {children}
                    </motion.div>
                )}

                {/* Modal Carrito */}
                <AnimatePresence>
                    {mostrarCarrito && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-start justify-end px-[5%] lg:px-0 pt-12 pb-12 overflow-y-auto z-50 scrollbar-hide"
                        >
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-[#EFE5FF] shadow-lg w-full sm:max-w-[380px] lg:max-w-[700px] 2xl:max-w-[800px] h-max p-8 lg:p-14 rounded-[30px] lg:rounded-[50px]"
                            >
                                {/* Encabezado */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-[24.67px] lg:text-[44.67px] font-bold">
                                        Tu Carrito
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMostrarCarrito(false)}
                                        className="text-lg font-bold text-[#5F48B7]"
                                    >
                                        ✖
                                    </motion.button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-[#9C79D4] py-2 text-[13.95px] md:text-[16.95px] lg:text-[26.95px] mt-4 mb-8 text-center rounded-[14px] lg:rounded-[20px] text-white"
                                >
                                    ¡Tienes envío gratis en lima!{" "}
                                    <motion.img
                                        animate={{ rotate: [0, 15, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                        }}
                                        src="/assets/img/emojis/motor-scooter.png"
                                        className="h-[16.88px] lg:h-[26.88px] inline-flex ml-2"
                                    />{" "}
                                </motion.div>

                                {/* Lista de productos con Scroll */}
                                <div className="flex-1 gap-4">
                                    {carrito.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full flex flex-col items-center justify-center gap-5 text-3xl h-max my-5"
                                        >
                                            <img
                                                src="/assets/img/logo.png"
                                                alt="Wefem"
                                                className="h-[58px] w-[330.55px] object-cover object-top"
                                                style={{
                                                    textShadow:
                                                        "0px 4px 7.5px 0px #00000040",
                                                }}
                                            />
                                            <p className="text-center text-gray-500">
                                                Tu carrito está vacío
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <AnimatePresence>
                                            {carrito.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={cartItemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                    className="flex items-center gap-4 mb-4 w-full"
                                                >
                                                    <motion.img
                                                        layout
                                                        src={`/api/items/media/${item.image}`}
                                                        alt={item.name}
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/api/cover/thumbnail/null")
                                                        }
                                                        className="w-20 h-20 md:w-28 md:h-28 lg:w-52 lg:h-52 object-cover rounded-lg"
                                                    />
                                                    <div className="flex flex-col w-[calc(100%-5rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-10rem)]">
                                                        <div className="w-full flex">
                                                            <div className="w-5/6 lg:w-8/12">
                                                                <h3 className="text-[17.95px] md:text-[20.95px] lg:text-[24.95px] 2xl:text-[34.95px] font-normal leading-3 md:leading-[20.78px] lg:leading-[30.78px]">
                                                                    {item.name}
                                                                </h3>
                                                                {item.summary && (
                                                                    <p className="text-[10px] md:text-xs lg:text-[16.81px] 2xl:text-[25px] font-light inline-flex">
                                                                        (
                                                                        {
                                                                            item.summary
                                                                        }
                                                                        )
                                                                    </p>
                                                                )}

                                                                {item.discount && (
                                                                    <motion.p
                                                                        whileHover={{
                                                                            scale: 1.02,
                                                                        }}
                                                                        className="w-11/12 md:w-full h-[18.55px] md:h-[25.55px] lg:h-[35.55px] bg-[#212529] text-white rounded-[5.44px] mb-2 md:my-2 lg:my-4 flex items-center justify-center text-[8.65px] md:text-[9.65px] 2xl:text-[16.65px] font-semibold leading-[21.75px]"
                                                                    >
                                                                        <span className="font-medium md:font-bold text-[7.65px] md:text-[9.65px] 2xl:text-[16.65px] mr-2">
                                                                            ESTAS
                                                                            AHORRANDO
                                                                        </span>{" "}
                                                                        S/{" "}
                                                                        {Number(
                                                                            item.price -
                                                                                item.discount
                                                                        ).toFixed(
                                                                            0
                                                                        )}{" "}
                                                                        <img
                                                                            src="/assets/img/emojis/fire.png"
                                                                            className="h-[9.88px] 2xl:h-[16px] inline-flex ml-2"
                                                                        />
                                                                    </motion.p>
                                                                )}
                                                            </div>

                                                            {/* 🗑️ Botón para eliminar */}
                                                            <div className="w-1/6 lg:w-4/12 flex items-start justify-end">
                                                                <motion.button
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.9,
                                                                    }}
                                                                    className="group text-white px-2 py-1 rounded-md hover:fill-red-500 transition-all duration-300"
                                                                    onClick={() =>
                                                                        eliminarProducto(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="h-10 lg:h-12 scale-x-[-1]">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 448 512"
                                                                            className="h-full w-4 lg:w-5 relative"
                                                                            fill="current"
                                                                        >
                                                                            <path
                                                                                className="group-hover:-rotate-12 group-hover:absolute group-hover:inset-0"
                                                                                fill="current"
                                                                                d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3z"
                                                                            />
                                                                            <path
                                                                                fill="current"
                                                                                d="M32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex">
                                                            <div className="w-1/2 md:w-4/6 lg:w-1/2 h-full flex">
                                                                <p className="text-[18.42px] md:text-[24.42px] h-full items-center lg:text-[35.33px] 2xl:text-[45.33px] font-bold text-[#5F48B7]">
                                                                    S/{" "}
                                                                    {Number(
                                                                        item.final_price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="w-1/2 md:w-2/6 lg:w-1/2 h-full lg:h-14">
                                                                <div className="flex h-full text-[#000000] bg-transparent border border-black items-center justify-around rounded-[8px] md:rounded-[10px]">
                                                                    <motion.button
                                                                        whileTap={{
                                                                            scale: 0.8,
                                                                        }}
                                                                        className="h-full md:w-8 md:h-8 text-xs md:text-base 2xl:text-2xl"
                                                                        onClick={() =>
                                                                            decrementarCantidad(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        -
                                                                    </motion.button>
                                                                    <span className="h-full flex items-center text-xs md:text-base 2xl:text-2xl font-medium">
                                                                        {item.variations &&
                                                                        item
                                                                            .variations
                                                                            .length >
                                                                            0
                                                                            ? item.variations.reduce(
                                                                                  (
                                                                                      sum,
                                                                                      v
                                                                                  ) =>
                                                                                      sum +
                                                                                      v.quantity,
                                                                                  0
                                                                              )
                                                                            : item.quantity}
                                                                    </span>
                                                                    <motion.button
                                                                        whileTap={{
                                                                            scale: 0.8,
                                                                        }}
                                                                        className="h-6 md:w-8 md:h-8 text-xs md:text-base 2xl:text-2xl"
                                                                        onClick={() =>
                                                                            incrementarCantidad(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Total y botón de Checkout */}
                                {totalPrecio > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full mt-8"
                                    >
                                        <div className="w-full flex items-center justify-between my-6">
                                            <p className="text-[25.42px] md:text-[50.42px] lg:text-[45.33px] 2xl:text-[51.33px] font-bold text-black">
                                                Subtotal
                                            </p>
                                            <p className="text-[25.42px] md:text-[50.42px] lg:text-[45.33px] 2xl:text-[51.33px] font-bold text-black">
                                                S/ {totalPrecio.toFixed(2)}
                                            </p>
                                        </div>

                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href="/checkout"
                                            className="block text-center text-[20.76px] md:text-[25.76px] lg:text-[34.76px] 2xl:text-[36.76px] w-full font-semibold rounded-[12.11px] lg:rounded-[15.11px] bg-[#FF9900] text-white py-3 2xl:py-4 hover:bg-opacity-90 transition-all duration-300"
                                        >
                                            IR A COMPRAR
                                        </motion.a>

                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="mt-6 relative w-full"
                                        >
                                            <img
                                                src="/assets/img/checkout/banner-pagos.png"
                                                className="w-full object-cover h-auto rounded-lg shadow-lg shadow-gray-500/20"
                                            />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
    
};

export default Header;
