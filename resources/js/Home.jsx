import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";

import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import ItemsRest from "./actions/ItemRest";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import HealthSection from "./components/Home/HealthSection";
import TratamientoSection from "./components/Home/TratamientoSection";
import TestimonioSection from "./components/Home/TestimonioSection";
import AcercaDe from "./components/Home/AcercaDe";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import ModalAppointment from "./components/Appointment/ModalAppointment";

import { motion } from "framer-motion";
import { ScrollAnimation } from "./animations/ScrollAnimation";
import { scrollEffects } from "./animations/animationVariantsSccroll";
import { PersistentScrollAnimation } from "./animations/PersistentScrollAnimation";
import BlurText from "./Utils/BlurText";
import { useTranslation } from "./hooks/useTranslation";


// Animaciones para textos (en loop)
const textVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
    loop: {
        y: [0, -5, 0], // Movimiento sutil arriba/abajo
        transition: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3,
            ease: "easeInOut",
        },
    },
};

// Animación para el resaltado de texto
const highlightVariants = {
    visible: {
        color: "#224483",
        scale: 1.05,
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2.5,
        },
    },
};

// Animación del botón (igual a tu versión)
const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
        },
    },
    pulse: {
        scale: [1, 1.05, 1],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
        },
    },
    hover: {
        scale: 1.1,
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.5 },
    },
};

ReactModal.setAppElement("#app");

const Home = ({
    linkWhatsApp,
    randomImage,
    showSlogan = true,
    indicators,
    landing,
    benefits,
    services,
    testimonies,
    staff_boss,
    options,
    solutions,
    solutions_first,
    solutions_second,
}) => {
    const { t, loading, error } = useTranslation();
    const tipoSlider = "nopain";
    const landingHero = landing?.find(
        (item) => item.correlative === "page_home_hero"
    );
    const landingBenefits = landing?.find(
        (item) => item.correlative === "page_home_sectiontwo"
    );
    const landingServices = landing?.find(
        (item) => item.correlative === "page_home_services"
    );
    const landingTestimonies = landing?.find(
        (item) => item.correlative === "page_home_sectionfour"
    );
    const landingCaracters = landing?.find(
        (item) => item.correlative === "page_home_caracters"
    );
    const landingCaractersOne = landing?.find(
        (item) => item.correlative === "page_home_caracters_one"
    );
    const landingCaractersTwo = landing?.find(
        (item) => item.correlative === "page_home_caracters_two"
    );
    const landingCaractersTree = landing?.find(
        (item) => item.correlative === "page_home_caracters_tree"
    );
    const landingCaractersFour = landing?.find(
        (item) => item.correlative === "page_home_caracters_four"
    );
    const landingContactOne = landing?.find(
        (item) => item.correlative === "page_home_contact_one"
    );
    const landingContactTwo = landing?.find(
        (item) => item.correlative === "page_home_contact_two"
    );
    const landingContactTree = landing?.find(
        (item) => item.correlative === "page_home_contact_tree"
    );
    const landingContact = landing?.find(
        (item) => item.correlative === "page_home_contact"
    );
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    const handleEnded = () => {
        setIsPlaying(false); // Mostrar el botón otra vez
    };

    const [isModalOpen, setIsModalOpen] = useState(false);


    const [allowSync, setAllowSync] = useState(false);
    const [slidesPerView, setSlidesPerView] = useState(4);
    const topSwiperRef = useRef(null);
    const bottomSwiperRef = useRef(null);
  
    // Función para determinar el número de slides por vista según el ancho de la pantalla
    const getCurrentSlidesPerView = () => {
      const width = window.innerWidth;
      if (width >= 1550) return 5.5;
      if (width >= 1150) return 4.5;
      if (width >= 950) return 3.5;
      if (width >= 650) return 2;
      return 1;
    };

    useEffect(() => {
        const handleResize = () => {
          const newSlidesPerView = getCurrentSlidesPerView();
          if (newSlidesPerView !== slidesPerView) {
            setSlidesPerView(newSlidesPerView);
          }
        };
    
        // Establecer el valor inicial
        setSlidesPerView(getCurrentSlidesPerView());
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, [slidesPerView]);
    
      // Función para sincronizar los carruseles
      const syncSwipers = (sourceSwiper, targetSwiper) => {
        if (!allowSync || !sourceSwiper || !targetSwiper) return;
        
        const totalSlides = sourceSwiper.slides.length;
        const activeIndex = sourceSwiper.activeIndex;
        const currentSlidesPerView = sourceSwiper.params.slidesPerView;
        
        // Calculamos la posición correspondiente en el otro carrusel
        let targetIndex = totalSlides - activeIndex - currentSlidesPerView;
        
        // Aseguramos que el índice esté dentro de los límites
        targetIndex = Math.max(0, Math.min(targetIndex, totalSlides - currentSlidesPerView));
        
        // Movemos el carrusel objetivo sin disparar eventos
        setAllowSync(false);
        targetSwiper.slideTo(targetIndex, sourceSwiper.params.speed, false);
        setTimeout(() => {
          setAllowSync(true);
        }, sourceSwiper.params.speed + 50);
      };

      const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/api/cover/thumbnail/null";
      };

      const swiperRef = useRef(null);

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

      const solutionsArrayPrim = Object.values(solutions_first || {});
      const solutionsArray = Object.values(solutions_second || {});
    
    
    return (
        <div>
            <Header showSlogan={showSlogan}></Header>
            

        {landingHero && (
            <section className="bg-center lg:h-svh bg-cover bg-no-repeat flex flex-col justify-center relative ">
            <div className="flex flex-col lg:flex-row h-full justify-center items-start lg:items-end relative">
                <div className="absolute w-[20%] h-40 top-0 left-0 bg-gradient-to-r from-[rgba(31,24,39,0.4)] via-[rgba(31,24,39,0.4)] to-[rgba(123,94,154,0.4)] mix-blend-hard-light blur-[200px]"></div>
    
                <div className="pl-[5%] pr-[5%] w-full min-h-[300px] h-full lg:w-1/2 flex flex-col justify-center gap-4 py-8 ">
                    
                    <motion.h3
                            className="font-Poppins_SemiBold text-[#5C4774] text-xl 2xl:text-2xl line-clamp-1 flex flex-row gap-3 items-center"
                            initial="hidden"
                            animate={["visible", "loop"]} // Animación inicial + loop
                            variants={textVariants}
                        >
                            {landingHero?.subtitle}
                    </motion.h3>

                    <motion.h2
                            className="font-Poppins_SemiBold leading-none text-[#3E2F4D] text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                            initial="hidden"
                            animate={["visible", "loop"]} // Animación inicial + loop
                            variants={textVariants}
                        >
                            {landingHero?.title}
                    </motion.h2>            
                   
                    <motion.p
                            className="font-Poppins_Medium leading-normal text-base 2xl:text-xl text-[#5C4774]"
                            initial="hidden"
                            animate={["visible", "loop"]}
                            variants={textVariants}
                            transition={{ delay: 0.3 }} // Pequeño retraso
                        >
                            {landingHero?.description}
                    </motion.p>    
                    <motion.div
                            className="flex flex-col md:flex-row gap-5"
                            initial={{ opacity: 0 }}
                            animate={["visible", "loop"]}
                            variants={textVariants}
                            transition={{ delay: 0.6 }}
                        >
                        <div className="flex flex-col justify-start items-start font-Poppins_SemiBold">
                            <a href={landingHero?.link}><div className="bg-[#7B5E9A] bg-opacity-30 hover:bg-[#7B5E9A] border-[#7B5E9A] px-4 py-3 rounded-md group">
                                <p className="leading-none text-[#3E2F4D] group-hover:text-white text-base 2xl:text-lg">
                                {t(
                                    "public.btn.our_solutions",
                                    "Nuestras soluciones"
                                )}
                                </p>
                            </div></a>
                        </div>
    
                        <div className="flex flex-col justify-start items-start font-Poppins_SemiBold">
                            <a href="/contact"><div className="bg-transparent px-4 py-3 rounded-md hover:bg-[#7B5E9A] group">
                                <p className="leading-none text-[#3E2F4D] group-hover:text-white text-base 2xl:text-lg">
                                    {t(
                                        "public.btn.talk_adviser",
                                        "Habla con un experto"
                                    )}
                                </p>
                            </div></a>
                        </div>
                    </motion.div>
                    
                </div>
    
                <div className="pr-[5%] pl-[5%] w-full h-full lg:w-1/2 flex flex-col justify-center items-start lg:items-end bg-gradient-to-r from-[#E6D6F4] to-[#F0E8F9]">
                            <motion.div
                                className=""
                                initial="hidden"
                                animate={["visible", "loop"]}
                                variants={textVariants}
                                transition={{ delay: 0.3 }} // Pequeño retraso
                            >
                                <img
                                    src={`/api/landing_home/media/${landingHero?.image}`}
                                    className="object-center object-contain mx-auto h-full w-auto max-h-[500px] 2xl:max-h-none"
                                    onError={(e) =>
                                        (e.target.src = "/api/cover/thumbnail/null")
                                    }
                                />
                            </motion.div>
                    
                </div>
            </div> 
            </section>
        )}

        {landingBenefits && (
            <section className="flex flex-col md:justify-center items-center gap-5 2xl:gap-8 px-[5%] pt-10 lg:pt-16 xl:pt-20">
            
                <div className="flex flex-row items-start justify-start w-full max-w-2xl 2xl:max-w-3xl md:text-center">
                    <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight "><TextWithHighlight text={landingBenefits?.title} ></TextWithHighlight></h2>
                </div>

                <div className="flex flex-col items-end justify-start w-full max-w-2xl 2xl:max-w-3xl gap-5 md:text-center">
                    <p className="font-Poppins_Regular text-base 2xl:text-lg text-[#5C4774]">
                        {landingBenefits?.description}
                    </p>
                </div>

            </section>
        )}

        {/* <section className="flex flex-col lg:flex-row justify-start items-start gap-5 lg:gap-16 px-[5%] pt-10 lg:pt-16 xl:pt-20">
            <div className="bg-[#F5F2F9] p-6 w-full rounded-lg relative space-y-10">
                <Swiper
                    ref={topSwiperRef}
                    slidesPerView={slidesPerView}
                    spaceBetween={10}
                    initialSlide={0}
                    resistanceRatio={0}
                    threshold={10}
                    watchSlidesProgress={true}
                    slideToClickedSlide={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        650: { slidesPerView: 2 },
                        950: { slidesPerView: 3 },
                        1150: { slidesPerView: 4 },
                        1450: { slidesPerView: 5 }
                    }}
                    onSlideChange={(swiper) => {
                        if (bottomSwiperRef.current) {
                        syncSwipers(swiper, bottomSwiperRef.current.swiper);
                        }
                    }}
                    onTouchMove={(swiper) => {
                        if (allowSync && bottomSwiperRef.current) {
                        const progress = swiper.progress;
                        bottomSwiperRef.current.swiper.setProgress(1 - progress, false);
                        }
                    }}
                    >
                    {solutionsArrayPrim.map((slide) => (
                        <React.Fragment key={slide.id}>
                            
                            <SwiperSlide>
                                <div className="flex flex-col gap-4 max-w-xs bg-white bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                    <div className="w-full h-full rounded-xl overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={`/api/solution/media/${slide.image_secondary}`}
                                            onError={handleImageError}
                                            alt={slide.title}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                            
                            <SwiperSlide>
                                <a href={`/solucion/${slide.slug}`}>
                                    <div className="flex flex-col gap-4 max-w-xs bg-white bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                        <div className="bg-[#e9e3f1] w-12 h-12 2xl:w-14 2xl:h-14 rounded-full flex flex-col items-center justify-center">
                                            <img 
                                                className="object-center object-cover w-auto" 
                                                src={`/api/solution/media/${slide?.image_icon}`}
                                                onError={handleImageError}
                                                alt={slide.title}
                                            />
                                        </div>
                                        <h2 className="font-Poppins_Medium text-[#3E2F4D] text-xl line-clamp-2 leading-none">{slide.title}</h2>
                                        <p className="font-Poppins_Regular text-[#5C4774] text-base line-clamp-4">{slide.description}</p>
                                    </div>
                                </a>
                            </SwiperSlide>
                        </React.Fragment>
                    ))}
                </Swiper>

                <Swiper
                    ref={bottomSwiperRef}
                    slidesPerView={slidesPerView}
                    spaceBetween={10}
                    initialSlide={solutionsArray.length - slidesPerView}
                    resistanceRatio={0}
                    threshold={10}
                    watchSlidesProgress={true}
                    slideToClickedSlide={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        650: { slidesPerView: 2 },
                        950: { slidesPerView: 3 },
                        1150: { slidesPerView: 4 },
                        1450: { slidesPerView: 5 }
                    }}
                    onInit={() => {
                        setTimeout(() => {
                        setAllowSync(true);
                        }, 100);
                    }}
                    onSlideChange={(swiper) => {
                        if (topSwiperRef.current) {
                        syncSwipers(swiper, topSwiperRef.current.swiper);
                        }
                    }}
                    onTouchMove={(swiper) => {
                        if (allowSync && topSwiperRef.current) {
                        const progress = swiper.progress;
                        topSwiperRef.current.swiper.setProgress(1 - progress, false);
                        }
                    }}
                    >
                    {solutionsArray.map((solutionsecond) => (
                        <React.Fragment key={solutionsecond.id}>
                          
                            <SwiperSlide>
                                <div className="flex flex-col gap-4 max-w-xs bg-white bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                    <div className="w-full h-full rounded-xl overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={`/api/solution/media/${solutionsecond.image_secondary}`}
                                            onError={handleImageError}
                                            alt={solutionsecond.title}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                           
                            <SwiperSlide>
                                <a href={`/solucion/${solutionsecond.slug}`}>
                                    <div className="flex flex-col gap-4 max-w-xs bg-white bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                        <div className="bg-[#e9e3f1] w-12 h-12 2xl:w-14 2xl:h-14 rounded-full flex flex-col items-center justify-center">
                                            <img 
                                                className="object-center object-cover w-auto" 
                                                src={`/api/solution/media/${solutionsecond?.image_icon}`}
                                                onError={handleImageError}
                                                alt={solutionsecond.title}
                                            />
                                        </div>
                                        <h2 className="font-Poppins_Medium text-[#3E2F4D] text-xl line-clamp-2 leading-none">{solutionsecond.title}</h2>
                                        <p className="font-Poppins_Regular text-[#5C4774] text-base line-clamp-4">{solutionsecond.description}</p>
                                    </div>
                                </a>
                            </SwiperSlide>
                        </React.Fragment>
                    ))}
                </Swiper>
            </div>
        </section> */}

        <section className="flex flex-col lg:flex-row justify-start items-start gap-5 lg:gap-16 pl-[5%] pt-10 lg:pt-16 xl:pt-20">
            <div className="bg-[#F5F2F9] p-6 w-full rounded-lg relative space-y-10">
                {/* Carrusel Superior */}
                <Swiper
                    ref={topSwiperRef}
                    slidesPerView={slidesPerView}
                    spaceBetween={10}
                    initialSlide={0}
                    resistanceRatio={0}
                    threshold={10}
                    watchSlidesProgress={true}
                    slideToClickedSlide={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        650: { slidesPerView: 2 },
                        950: { slidesPerView: 3.5 },
                        1150: { slidesPerView: 4.5 },
                        1550: { slidesPerView: 5.5 }
                    }}
                    onSlideChange={(swiper) => {
                        if (bottomSwiperRef.current && allowSync) {
                            bottomSwiperRef.current.swiper.slideTo(swiper.activeIndex);
                        }
                    }}
                    onTouchMove={(swiper) => {
                        if (allowSync && bottomSwiperRef.current) {
                            const { progress } = swiper;
                            bottomSwiperRef.current.swiper.setProgress(progress, false);
                        }
                    }}
                >
                    {solutionsArrayPrim.map((slide) => (
                        <React.Fragment key={slide.id}>
                            {/* Tarjeta adicional solo si existe image_secondary */}
                            <SwiperSlide>
                                <div className="flex flex-col gap-4 max-w-xs bg-white bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                    <div className="w-full h-full rounded-xl overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={`/api/solution/media/${slide.image_secondary}`}
                                            onError={handleImageError}
                                            alt={slide.title}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                            
                            {/* Tarjeta normal */}
                            <SwiperSlide>
                                <a href={`/solucion/${slide.slug}`}>
                                    <div className="flex flex-col gap-4 max-w-xs bg-white group hover:bg-[#3E2F4D] bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                        <div className="bg-[#e9e3f1] w-12 h-12 2xl:w-14 2xl:h-14 rounded-full flex flex-col items-center justify-center">
                                            <img 
                                                className="object-center object-cover w-auto" 
                                                src={`/api/solution/media/${slide?.image_icon}`}
                                                onError={handleImageError}
                                                alt={slide.title}
                                            />
                                        </div>
                                        <h2 className="font-Poppins_Medium text-[#3E2F4D] group-hover:text-white text-xl line-clamp-2 leading-none">{slide.title}</h2>
                                        <p className="font-Poppins_Regular text-[#5C4774] group-hover:text-white text-base line-clamp-4">{slide.description}</p>
                                    </div>
                                </a>
                            </SwiperSlide>
                        </React.Fragment>
                    ))}
                </Swiper>

                {/* Carrusel Inferior */}
                <Swiper
                    ref={bottomSwiperRef}
                    slidesPerView={slidesPerView}
                    spaceBetween={10}
                    initialSlide={0}
                    resistanceRatio={0}
                    threshold={10}
                    watchSlidesProgress={true}
                    slideToClickedSlide={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        650: { slidesPerView: 2 },
                        950: { slidesPerView: 3.5 },
                        1150: { slidesPerView: 4.5 },
                        1550: { slidesPerView: 5.5 }
                    }}
                    onInit={() => {
                        setTimeout(() => {
                            setAllowSync(true);
                        }, 100);
                    }}
                    onSlideChange={(swiper) => {
                        if (topSwiperRef.current && allowSync) {
                            topSwiperRef.current.swiper.slideTo(swiper.activeIndex);
                        }
                    }}
                    onTouchMove={(swiper) => {
                        if (allowSync && topSwiperRef.current) {
                            const { progress } = swiper;
                            topSwiperRef.current.swiper.setProgress(progress, false);
                        }
                    }}
                >
                    {solutionsArray.map((solutionsecond) => (
                        <React.Fragment key={solutionsecond.id}>
                            {/* Tarjeta adicional solo si existe image_secondary */}
                            <SwiperSlide>
                                <div className="flex flex-col gap-4 max-w-xs bg-white bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                    <div className="w-full h-full rounded-xl overflow-hidden">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={`/api/solution/media/${solutionsecond.image_secondary}`}
                                            onError={handleImageError}
                                            alt={solutionsecond.title}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                            
                            {/* Tarjeta normal */}
                            <SwiperSlide>
                                <a href={`/solucion/${solutionsecond.slug}`}>
                                    <div className="flex flex-col gap-4 max-w-xs bg-white group hover:bg-[#3E2F4D] bg-opacity-50 rounded-2xl p-5 aspect-square h-64 mx-auto">
                                        <div className="bg-[#e9e3f1] w-12 h-12 2xl:w-14 2xl:h-14 rounded-full flex flex-col items-center justify-center">
                                            <img 
                                                className="object-center object-cover w-auto" 
                                                src={`/api/solution/media/${solutionsecond?.image_icon}`}
                                                onError={handleImageError}
                                                alt={solutionsecond.title}
                                            />
                                        </div>
                                        <h2 className="font-Poppins_Medium text-[#3E2F4D] group-hover:text-white text-xl line-clamp-2 leading-none">{solutionsecond.title}</h2>
                                        <p className="font-Poppins_Regular text-[#5C4774] group-hover:text-white text-base line-clamp-4">{solutionsecond.description}</p>
                                    </div>
                                </a>
                            </SwiperSlide>
                        </React.Fragment>
                    ))}
                </Swiper>
            </div>
        </section>

        {landingServices && (        
            <section className="flex flex-col md:justify-center items-center gap-5 2xl:gap-8 px-[5%] pt-10 lg:pt-20">
                <div className="flex flex-row items-start justify-start w-full max-w-3xl 2xl:max-w-4xl md:text-center">
                    <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-3xl sm:text-4xl lg:text-[44px] !leading-tight "><TextWithHighlight text={landingServices?.title} ></TextWithHighlight></h2>
                </div>
            </section>
        )}
        
        <section className="flex flex-col md:justify-center items-center gap-5 2xl:gap-8 px-[5%] pt-10">
            <div className="w-full">
                <Swiper
                ref={swiperRef}
                slidesPerView={4}
                spaceBetween={25}
                loop={true}
                grabCursor={true}
                centeredSlides={false}
                initialSlide={0}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                pagination={{
                    el: ".swiper-pagination-services",
                    clickable: true,
                    dynamicBullets: true,
                }}
                breakpoints={{
                    0: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                    },
                    600: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    },
                    1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                    },
                    1350: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                    },
                }}
                >
                {services.map((service) => (
                    <SwiperSlide key={service.id}>
                        <div className="flex flex-col gap-3">
                            <img 
                                className="object-center object-contain mx-auto aspect-square w-auto max-h-[500px] 2xl:max-h-none" 
                                src={`/api/service/media/${service?.image_secondary}`}
                                onError={handleImageError}
                                alt={service.title}
                            />
                            <h2 className="font-Poppins_Medium text-[#3E2F4D] text-xl 2xl:text-2xl line-clamp-2">
                                {service.title}
                            </h2>
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg line-clamp-4">
                                {service.description}
                            </p>
                            <a href={`/servicio/${service.slug}`}>
                                <div className="flex flex-row gap-2 items-center justify-start">
                                    <span className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">
                                            {t(
                                                "public.btn.more",
                                                "Saber más"
                                            )}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <mask id="mask0_226_5036" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
                                        <rect y="0.984375" width="20" height="20" fill="#D9D9D9"/>
                                        </mask>
                                        <g mask="url(#mask0_226_5036)">
                                        <path d="M13.4791 11.8203H3.33325V10.1536H13.4791L8.81242 5.48698L9.99992 4.32031L16.6666 10.987L9.99992 17.6536L8.81242 16.487L13.4791 11.8203Z" fill="#7D3CB5"/>
                                        </g>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper>
                
                {/* Agrega aquí los elementos de navegación si los necesitas */}
                {/* <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-pagination-services"></div> */}
            </div>
        </section>


        <section className="flex flex-col md:flex-row items-center gap-5 2xl:gap-8 px-[5%] pt-10 lg:pt-20">
            {/* Columna izquierda con texto */}
            <div className="w-full md:w-1/3">
                <div className="flex flex-col gap-2">
                <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-3xl sm:text-4xl md:text-3xl lg:text-[44px] !leading-tight">
                    <TextWithHighlight text={landingTestimonies?.title} ></TextWithHighlight>
                </h2>
                <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">
                    {landingTestimonies?.description}
                </p>
                <div className="flex flex-col justify-start items-start font-Poppins_SemiBold">
                    <a href="#">
                    <div className="bg-[#7B5E9A] px-4 py-3 rounded-md">
                        <p className="leading-none text-white text-base 2xl:text-lg font-Poppins_Regular">
                            {t(
                                "public.btn.quote",
                                "Cotiza ahora"
                            )}
                        </p>
                    </div>
                    </a>
                </div>
                </div>
            </div>

            {/* Columna derecha con carrusel */}
            <div className="w-full md:w-2/3">
                <div className="w-full relative">
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={25}
                        grabCursor={true}
                        initialSlide={0}
                        modules={[Navigation]}
                        navigation={{
                            nextEl: ".testimonies-swiper-button-next",
                            prevEl: ".testimonies-swiper-button-prev",
                        }}
                        breakpoints={{
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 25,
                        },
                        650: {
                            slidesPerView: 1.5,
                            spaceBetween: 25,
                        },
                        950: {
                            slidesPerView: 2,
                            spaceBetween: 25,
                        },
                        1200: {
                            slidesPerView: 2.5,
                            spaceBetween: 25,
                        },
                        1550: {
                            slidesPerView: 3,
                            spaceBetween: 25,
                        },
                        }}
                    >
                        {options.map((option) => (
                            <SwiperSlide key={option.id}>
                                <div className="flex flex-col rounded-lg overflow-hidden h-full">
                                <div className="w-full h-full aspect-[4/3] bg-[#E9E9FD] p-5">
                                    <img 
                                    className="object-center object-contain w-full h-full aspect-square min-h-[190px]" 
                                    src={`/api/purchaseOption/media/${option?.image_secondary}`}
                                    onError={handleImageError}
                                    alt={option.title}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 p-4 bg-gradient-to-b from-[#F5F2F9] via-[#F5F2F9]/80 to-[#F5F2F9]/40">
                                    <h2 className="font-Poppins_Medium text-[#3E2F4D] text-xl 2xl:text-2xl line-clamp-2">
                                    {option.title}
                                    </h2>
                                    <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg line-clamp-3 2xl:line-clamp-4">
                                    {option.description}
                                    </p>
                                    <a href={`/opcion/${option.slug}`}>
                                        <div className="flex flex-row gap-2 items-center justify-start">
                                            <span className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg hover:underline">
                                                {t(
                                                    "public.btn.more",
                                                    "Saber más"
                                                )}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <mask id={`mask_${option.id}`} style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
                                                <rect y="0.984375" width="20" height="20" fill="#D9D9D9"/>
                                                </mask>
                                                <g mask={`url(#mask_${option.id})`}>
                                                <path d="M13.4791 11.8203H3.33325V10.1536H13.4791L8.81242 5.48698L9.99992 4.32031L16.6666 10.987L9.99992 17.6536L8.81242 16.487L13.4791 11.8203Z" fill="#7D3CB5"/>
                                                </g>
                                            </svg>
                                        </div>
                                    </a>
                                </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Flechas de navegación */}
                    <div className="testimonies-swiper-button-prev absolute -left-2.5 md:-left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white p-2 rounded-full shadow-md">
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="#7B5E9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="testimonies-swiper-button-next absolute -right-2.5 md:-right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white p-2 rounded-full shadow-md">
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="#7B5E9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        </section>


        <section className="px-[5%] pt-10 lg:pt-20">
            <div className="bg-[#F5F2F9] py-10 lg:py-16 px-5 md:px-10 rounded-xl overflow-hidden flex flex-col lg:flex-row items-start gap-12">
                <div className="w-full lg:w-2/5 ">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-3xl sm:text-4xl md:text-3xl lg:text-[44px] !leading-tight ">
                            <TextWithHighlight text={landingCaracters?.title} ></TextWithHighlight>
                        </h2>
                        <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">{landingCaracters?.description}</p>
                    </div>
                </div>
                <div className="w-full lg:w-3/5  xl:pl-[4%] 2xl:pl-[10%]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4 p-4 2xl:p-6 bg-white rounded-lg group hover:bg-[#7B5E9A] aspect-square">
                            <div className="flex flex-row gap-4 items-center">
                                <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] group-hover:bg-white flex flex-col justify-center items-center">
                                    <img className="object-contain" src={`/api/landing_home/media/${landingCaractersOne?.image}`}  onError={handleImageError} />
                                </div>
                                <h2 className="font-Poppins_Medium text-[#3E2F4D] text-lg 2xl:text-2xl group-hover:text-white">
                                    {landingCaractersOne?.title}
                                </h2>
                            </div>
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg group-hover:text-white">{landingCaractersOne?.description}</p>
                        </div>

                        <div className="flex flex-col gap-4 p-4 2xl:p-6 bg-white rounded-lg group hover:bg-[#7B5E9A] aspect-square">
                            <div className="flex flex-row gap-4 items-center">
                                <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] group-hover:bg-white flex flex-col justify-center items-center">
                                    <img className="object-contain" src={`/api/landing_home/media/${landingCaractersTwo?.image}`} onError={handleImageError} />
                                </div>
                                <h2 className="font-Poppins_Medium text-[#3E2F4D] text-lg 2xl:text-2xl group-hover:text-white">
                                    {landingCaractersTwo?.title}
                                </h2>
                            </div>
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg group-hover:text-white">{landingCaractersTwo?.description}</p>
                        </div>

                        <div className="flex flex-col gap-4 p-4 2xl:p-6 bg-white rounded-lg group hover:bg-[#7B5E9A] aspect-square">
                            <div className="flex flex-row gap-4 items-center">
                                <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] group-hover:bg-white flex flex-col justify-center items-center">
                                    <img className="object-contain" src={`/api/landing_home/media/${landingCaractersTree?.image}`} onError={handleImageError} />
                                </div>
                                <h2 className="font-Poppins_Medium text-[#3E2F4D] text-lg 2xl:text-2xl group-hover:text-white">
                                    {landingCaractersTree?.title}
                                </h2>
                            </div>
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg group-hover:text-white">{landingCaractersTree?.description}</p>
                        </div>

                        <div className="flex flex-col gap-4 p-4 2xl:p-6 bg-white rounded-lg group hover:bg-[#7B5E9A] aspect-square">
                            <div className="flex flex-row gap-4 items-center">
                                <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] group-hover:bg-white flex flex-col justify-center items-center">
                                    <img className="object-contain" src={`/api/landing_home/media/${landingCaractersFour?.image}`} onError={handleImageError} />
                                </div>
                                <h2 className="font-Poppins_Medium text-[#3E2F4D] text-lg 2xl:text-2xl group-hover:text-white">
                                     {landingCaractersFour?.title}
                                </h2>
                            </div>
                            <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg group-hover:text-white">{landingCaractersFour?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>    


        <section className="flex flex-col gap-6 px-[5%] py-10 lg:py-16 my-10 lg:my-16 bg-cover bg-center" style={{ backgroundImage: `url(/api/landing_home/media/${landingContact?.image})` }}>

            <div className="flex flex-col gap-2 max-w-xl mx-auto text-center">
                <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-3xl sm:text-4xl md:text-3xl lg:text-[44px] !leading-tight ">
                <TextWithHighlight text={landingContact?.title} ></TextWithHighlight>
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl 2xl:max-w-6xl mx-auto gap-5">
                <div className="flex flex-col gap-2 p-6 2xl:p-8 bg-white rounded-lg">
                    <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] flex flex-col justify-center items-center">
                        <img 
                            src={`/api/landing_home/media/${landingContactOne?.image}`}
                            className="object-cover w-8 h-8"
                            onError={(e) =>(e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </div>
                    <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-lg 2xl:text-xl">
                        {landingContactOne?.title}
                    </h2>
                    <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">{landingContactOne?.description}</p>
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className="font-Poppins_Regular font-semibold text-[#5C4774] text-sm 2xl:text-base hover:underline">{landingContactOne?.subtitle}</span>
                        <ArrowIcon />
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-6 2xl:p-8 bg-white rounded-lg">
                    <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] flex flex-col justify-center items-center">
                        <img 
                            src={`/api/landing_home/media/${landingContactTwo?.image}`}
                            className="object-cover w-8 h-8"
                            onError={(e) =>(e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </div>
                    <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-lg 2xl:text-xl">
                            {landingContactTwo?.title}
                    </h2>
                    <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">{landingContactTwo?.description}</p>
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className="font-Poppins_Regular font-semibold text-[#5C4774] text-sm 2xl:text-base hover:underline">{landingContactTwo?.subtitle}</span>
                        <ArrowIcon />
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-6 2xl:p-8 bg-white rounded-lg">
                    <div className="rounded-full aspect-square w-16 bg-[#F5F2F9] flex flex-col justify-center items-center">
                        <img 
                            src={`/api/landing_home/media/${landingContactTree?.image}`}
                            className="object-cover w-8 h-8"
                            onError={(e) =>(e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </div>
                    <h2 className="font-Poppins_SemiBold text-[#3E2F4D] text-lg 2xl:text-xl">
                            {landingContactTree?.title}
                    </h2>
                    <p className="font-Poppins_Regular text-[#5C4774] text-base 2xl:text-lg">{landingContactTree?.description}</p>
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className="font-Poppins_Regular font-semibold text-[#5C4774] text-sm 2xl:text-base hover:underline">{landingContactTree?.subtitle}</span>
                        <ArrowIcon />
                    </div>
                </div>
            </div>
        
        </section>


            {/* {indicators && (
                <ScrollAnimation>
                    <div className=" h-auto w-full bg-[#F8F8F8] mt-[36px] lg:mt-0">
                        {" "}
                        <div className="lg:max-w-[82rem] mx-auto lg:px-[5%]">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={30}
                                loop={true}
                                breakpoints={{
                                    0: { slidesPerView: 1.5, spaceBetween: 0 },
                                    640: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 10,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 180,
                                    },
                                }}
                            >
                                {indicators.map((benefit, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="flex gap-4 w-full my-6 lg:my-7 ">
                                            <div className="bg-white rounded-xl h-[60px] w-[60px] lg:h-[80px] lg:w-[80px]  flex items-center justify-center">
                                                <img
                                                    src={`/api/indicator/media/${benefit.symbol}`}
                                                    className="h-[32.2px] w-[32.2px] lg:h-[40.2px] lg:w-[40.2px] "
                                                />
                                            </div>
                                            <div className="text-[#242424]">
                                                <h1 className="text-4xl lg:text-5xl font-medium leading-[102%]">
                                                    {benefit.name}{" "}
                                                    <span className="text-[#224483]">
                                                        +
                                                    </span>
                                                </h1>
                                                <h2 className="font-normal">
                                                    {benefit.description}
                                                </h2>
                                            </div>
                                            <span className="hidden lg:block lg:absolute -right-20 top-1/2 -translate-x-1/2  -translate-y-1/2 h-12 w-1 bg-[#242424] rounded-full"></span>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </ScrollAnimation>
            )} */}

            {/* {benefits && landingBenefits && (
                <ScrollAnimation>
                    <div className="px-[5%] lg:max-w-[82rem] lg:mx-auto mt-10 lg:mt-14 lg:flex lg:justify-between lg:items-center">
                        <h2 className="text-[32px] font-medium leading-[102%] max-w-[16rem] lg:text-6xl lg:max-w-[46rem] lg:tracking-wide ">
                            <TextWithHighlight text={landingBenefits?.title} />
                        </h2>
                        <a
                            href="/services"
                            className=" mt-5 bg-[#EFF0F1] w-max text-[#242424] py-1 pl-1 pr-3  gap-2 rounded-full flex items-center lg:h-14"
                        >
                            <div className="bg-[#224483] w-12 p-2 rounded-full">
                                <img
                                    src="/assets/img/icons/treatment.png"
                                    className=" h-auto    "
                                />
                            </div>
                            {t(
                                "public.btn.all_services",
                                "Ver todos los servicios"
                            )}
                        </a>
                    </div>
                </ScrollAnimation>
            )} */}

            {/* {benefits && landingBenefits && (
                <ScrollAnimation>
                    <HealthSection
                        landingBenefits={landingBenefits}
                        benefits={benefits}
                    />
                </ScrollAnimation>
            )}
            {services && landingServices && (
                <ScrollAnimation>
                    <div className="px-[5%] lg:max-w-[82rem] lg:mx-auto mt-10 lg:mt-10 lg:flex lg:justify-between lg:items-center">
                        <h2 className="text-[32px] font-medium leading-[102%] max-w-[16rem] lg:text-6xl lg:max-w-[44rem] lg:tracking-wide ">
                            <TextWithHighlight text={landingServices?.title} />
                        </h2>
                        <a
                            href="/services"
                            className=" w-max mt-5 bg-[#EFF0F1] text-[#242424] py-1 pl-1 pr-3  gap-2 rounded-full flex items-center lg:h-14"
                        >
                            <div className="bg-[#224483] w-12 p-2 rounded-full">
                                <img
                                    src="/assets/img/icons/treatment.png"
                                    className=" h-auto    "
                                />
                            </div>
                            {t(
                                "public.btn.all_services",
                                "Ver todos los servicios"
                            )}
                        </a>
                    </div>
                </ScrollAnimation>
            )}
            {services && landingServices && (
                <ScrollAnimation>
                    <TratamientoSection
                        setIsModalOpen={setIsModalOpen}
                        isModalOpen={isModalOpen}
                        services={services}
                        landingServices={landingServices}
                    />
                </ScrollAnimation>
            )}
            {services && landingServices && (
                <ScrollAnimation>
                    <div className="px-[5%]  py-4 lg:hidden ">
                        <div className="bg-[#F8F8F8] rounded-3xl p-4">
                            <h2 className="text-[32px] font-medium leading-[102%] max-w-[16rem]">
                                {landingServices?.description}
                            </h2>
                            <motion.div
                                className="w-full px-[5%] lg:px-0 flex items-center justify-center lg:justify-start mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#EFF0F1] text-[#242424] py-1 pl-1 pr-3 gap-2 rounded-full flex items-center"
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate={["visible", "pulse"]}
                                    whileHover="hover"
                                    style={{
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-[#224483] opacity-0 rounded-full"
                                        initial={{ scale: 0 }}
                                        whileTap={{
                                            scale: 2,
                                            opacity: 0.3,
                                            transition: { duration: 0.5 },
                                        }}
                                    />
                                    <div className="bg-[#224483] w-12 p-2 rounded-full">
                                        <img
                                            src="/assets/img/icons/calendar-check.png"
                                            className="h-auto"
                                            alt="Calendario"
                                        />
                                    </div>
                                    {t(
                                        "public.btn.appointment",
                                        "Reserva tu cita"
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </ScrollAnimation>
            )}
            {testimonies && landingTestimonies && (
                <ScrollAnimation>
                    <div className="px-[5%] flex items-center justify-center mt-9  lg:mt-32">
                        <h2 className="text-[32px] font-medium leading-[102%] w-full text-center lg:text-6xl lg:max-w-3xl lg:tracking-wide  ">
                            <TextWithHighlight
                                text={landingTestimonies?.title}
                            />
                        </h2>
                    </div>
                </ScrollAnimation>
            )}
            {testimonies && (
                <ScrollAnimation>
                    <TestimonioSection testimonies={testimonies} />
                </ScrollAnimation>
            )}
            {staff_boss && <AcercaDe staff_boss={staff_boss} />} */}
            <Footer />
            {/* Modal */}
            <ModalAppointment
                linkWhatsApp={linkWhatsApp}
                randomImage={randomImage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Home {...properties} />
            </Base>
        </CarritoProvider>
    );
});
