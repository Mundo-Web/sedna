import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../Utils/TextWithHighlight";
import { useTranslation } from "../../hooks/useTranslation";
import { useDebounce } from "../../Utils/useDebounce";

const Filter = ({ categories, filter, setFilter, landing }) => {
    
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const landingFooter = landing.find(
        (item) => item.correlative === "page_blog_footer"
    );

    useEffect(() => {
        setFilter(old => ({
            ...old,
            search: debouncedSearchTerm
        }));
    }, [debouncedSearchTerm, setFilter]);

    // Animaciones
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const buttonHover = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
        tap: {
            scale: 0.98,
        },
    };

    const inputFocus = {
        focus: {
            boxShadow: "0 0 0 2px #3b82f6",
            transition: {
                duration: 0.2,
            },
        },
    };

    const { t } = useTranslation();

    return (
        <motion.section
            className="py-8 xl:py-12 px-[5%]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex flex-col gap-4 md:gap-8 items-center text-negro">
                
                {/* Campo de búsqueda */}
                <motion.label
                    htmlFor="txt-search"
                    className="col-span-1 px-6 py-4 flex items-center rounded-xl bg-[#F5F2F9] min-w-[350px] sm:min-w-[500px] max-w-2xl mx-auto"
                    variants={itemVariants}
                    whileHover={{ y: -3 }}
                    whileFocus="focus"
                    variants={inputFocus}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 17.5L22 22" stroke="#3E2F4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="#3E2F4D" stroke-width="1.5" stroke-linejoin="round"/>
</svg>

                    <motion.input
                        id="txt-search"
                        type="text"
                        placeholder={t(
                            "public.post.search",
                            "Busca un tema o noticia"
                        )}
                        value={searchTerm}
                        className="w-full pl-4 bg-transparent border-none outline-none text-slate-800"
                        // onChange={(e) =>
                        //     setFilter((old) => ({
                        //         ...old,
                        //         search: e.target.value,
                        //     }))
                        // }
                        onChange={(e) => setSearchTerm(e.target.value)}
                        whileFocus={{
                            outline: "none",
                            x: 3,
                        }}
                    />
                </motion.label>

                {/* Botones de categorías */}
                <motion.div
                    className="flex flex-wrap max-w-3xl gap-3 justify-center items-center lg:justify-start"
                    variants={containerVariants}
                >
                    Filtrar por:

                    {categories.map((item, index) => (
                        <motion.button
                            key={index}
                            className={`px-4 py-2.5 rounded-3xl ${
                                item.id == filter.category
                                    ? "bg-[#5C4774] text-white"
                                    : "bg-slate-100 text-negro"
                            }`}
                            onClick={() =>
                                setFilter((old) => ({
                                    ...old,
                                    category:
                                        item.id == filter.category
                                            ? null
                                            : item.id,
                                }))
                            }
                            variants={itemVariants}
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonHover}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                delay: index * 0.05,
                            }}
                        >
                            {item.name}
                        </motion.button>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Filter;
