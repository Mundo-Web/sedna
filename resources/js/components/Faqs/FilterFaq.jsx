import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../Utils/TextWithHighlight";
import { useTranslation } from "../../hooks/useTranslation";
import { useDebounce } from "../../Utils/useDebounce";

const FilterFaq = ({ filter, setFilter, landing }) => {
    
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
            className="pt-8 xl:pt-12 px-[5%]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex flex-col gap-4 md:gap-8 items-center text-negro">
                
                {/* Campo de búsqueda */}
                <motion.label
                    htmlFor="txt-search"
                    className="col-span-1 px-6 py-4 flex items-center rounded-3xl bg-[#F5F2F9] min-w-[350px] sm:min-w-[500px] max-w-3xl mx-auto"
                    variants={itemVariants}
                    whileHover={{ y: -3 }}
                    whileFocus="focus"
                    variants={inputFocus}
                >
                   <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 17.5L22.5 22" stroke="#3E2F4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.5 11C20.5 6.02944 16.4706 2 11.5 2C6.52944 2 2.5 6.02944 2.5 11C2.5 15.9706 6.52944 20 11.5 20C16.4706 20 20.5 15.9706 20.5 11Z" stroke="#3E2F4D" stroke-width="1.5" stroke-linejoin="round"/>
</svg>


                    <motion.input
                        id="txt-search"
                        type="text"
                        placeholder={t(
                            "public.post.search",
                            "Buscar por palabra clave"
                        )}
                        value={searchTerm}
                        className="w-full bg-transparent border-none outline-none text-slate-800"
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
            </div>
        </motion.section>
    );
};

export default FilterFaq;
