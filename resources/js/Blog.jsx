import React, { useState } from "react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import BlogHeader from "./Components/Blog/BlogHeader";
import Filter from "./Components/Blog/Filter";
import Results from "./Components/Blog/Results";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import MaintenancePage from "./Utils/MaintenancePage";
function Blog({ categories, postRecent, landing }) {

    const landingsuscription = landing?.find(
        (item) => item.correlative === "page_blog_suscription"
    );

    const [filter, setFilter] = useState({
        category: null,
        search: null,
        sortOrder: "asc",
    });

    return (
        <div>
            <Header />
            
            {postRecent && postRecent.length > 0 ? (
                <>
                    <BlogHeader postRecent={postRecent} landing={landing} />
                    
                    <Filter
                        categories={categories}
                        filter={filter}
                        setFilter={setFilter}
                        landing={landing}
                    />

                    <Results filter={filter} />

                    <section className="flex flex-col gap-6 px-[5%] py-12 lg:py-40 bg-cover bg-center" style={{ backgroundImage: `url('/api/landing_home/media/${landingsuscription?.image}')` }}>
                        <div className="flex flex-col gap-4 xl:gap-6 max-w-2xl mx-auto text-center">
                            <p className='font-Poppins_Medium text-2xl text-[#5C4774]'>{landingsuscription?.title}</p>
                            <h2 className="font-Poppins_Medium text-[#1F1827] text-2xl md:text-3xl lg:text-[32px] !leading-tight">
                                {landingsuscription?.description}
                            </h2>
                            <div className="relative bg-[#F5F2F9] mt-2 p-2 w-full max-w-lg mx-auto rounded-lg flex flex-col md:flex-row gap-5">
                                <input className="w-full font-Poppins_Regular bg-[#F5F2F9] outline-none ring-transparent focus:ring-transparent border-transparent focus:border-transparent p-2"
                                    placeholder="Ingresa tu e-mail"
                                />

                                <button className="min-w-40 bg-[#7B5E9A] rounded-md py-3 text-white font-Poppins_SemiBold" >
                                    Suscribirse
                                </button>
                            </div>
                        </div>
                    </section>

                </>
            ) : (
                <MaintenancePage />
            )}

            

            <Footer />
        </div>
    );
}

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Blog {...properties} />
            </Base>
        </CarritoProvider>
    );
});
