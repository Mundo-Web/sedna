import React from "react";
import { motion } from "framer-motion";
import HtmlContent from "../../Utils/HtmlContent";
import TextWithHighlight from "../../Utils/TextWithHighlight";

const PostCard = ({
    id,
    slug,
    name,
    summary,
    category,
    image,
    post_date,
    firstImage = false,
}) => {
    // Animaciones
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hover: { 
            scale: 1.05,
            transition: { 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
            } 
        }
    };

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.2,
                duration: 0.6
            }
        }
    };

    return (
        <motion.a 
            href={`/blog/${slug}`} 
            className="flex flex-col self-stretch my-auto w-full mt-6"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            <div className={`flex flex-col gap-4 ${firstImage && "flex-col-reverse"}`}>
                <motion.div 
                    className="flex flex-col w-full"
                    variants={contentVariants}
                >
                    <h3 className="text-lg sm:text-xl font-Poppins_Medium lg:text-[28px]  text-[#3E2F4D] line-clamp-2">
                        <TextWithHighlight text={name} />
                    </h3>

                    <motion.p 
                        className="mt-2 sm:mt-3 font-Poppins_Regular 2xl:mt-4 text-base lg:text-lg text-[#3E2F4D] line-clamp-4"
                    >
                        {summary || "Sin descripción"}
                    </motion.p>
                    
                </motion.div>

                <motion.div 
                    className="flex flex-row"
                    whileHover={{ x: 3 }} // Pequeño movimiento al hover
                >
                    <span className="rounded-sm text-sm text-[#3E2F4D] font-Poppins_Medium mb-1 px-3 py-2 bg-[#D7C8E6]">{category.name}</span>
                </motion.div>

                <motion.div 
                    className="flex flex-col w-full overflow-hidden rounded-lg"
                    whileHover="hover"
                >
                    <motion.img
                        src={`/api/posts/media/${image}`}
                        alt={name}
                        className="w-full object-cover aspect-[4/3]"
                        variants={imageVariants}
                        initial={{ scale: 1 }}
                        style={{ originX: 0.5, originY: 0.5 }} // Para que el zoom sea desde el centro
                    />
                </motion.div>
            </div>

            <motion.div 
                className="flex justify-between items-center mt-2 sm:mt-3 w-full gap-4"
                variants={contentVariants}
            >
                <span className="text-xs sm:text-sm text-end font-Poppins_Medium leading-snug text-[#3E2F4D]">
                    {moment(post_date).format("ll")}
                </span>
            </motion.div>
        </motion.a>
       
    );
};

export default PostCard;