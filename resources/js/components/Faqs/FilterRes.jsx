import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../Utils/TextWithHighlight";
import { useTranslation } from "../../hooks/useTranslation";
import { useDebounce } from "../../Utils/useDebounce";

const FilterRes = ({ filter, setFilter, landing }) => {
    
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
                    className="col-span-1 px-6 py-4 flex items-center rounded-3xl bg-[#F5F2F9] min-w-[350px] sm:min-w-[500px] max-w-2xl mx-auto"
                    variants={itemVariants}
                    whileHover={{ y: -3 }}
                    whileFocus="focus"
                    variants={inputFocus}
                >
                    <motion.i
                        className="fas fa-search text-negro mr-2"
                        whileHover={{ scale: 1.1 }}
                    />
                    <motion.input
                        id="txt-search"
                        type="text"
                        placeholder={t(
                            "public.post.search",
                            "Buscar publicación"
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

export default FilterRes;
