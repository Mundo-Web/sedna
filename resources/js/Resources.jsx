import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';
import Aos from 'aos';
import HtmlContent from "./Utils/HtmlContent";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import { useTranslation } from "./hooks/useTranslation";
import FilterRes from "./Components/Faqs/FilterRes";

const Resources = ({ resources, landing }) => {
  const { t, loading, error } = useTranslation();

  const landingHero = landing?.find(
    (item) => item.correlative === "page_resources_hero"
  );

  const landingFooter = landing?.find(
    (item) => item.correlative === "page_resources_footer"
  );
  
  const [filter, setFilter] = useState({
    search: '',
    sortOrder: "asc",
  });

  const [filteredResources, setFilteredResources] = useState(resources || []);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // Función para filtrar los recursos
  const filterResources = () => {
    let result = [...resources];
    
    // Filtrado por búsqueda
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      result = result.filter(resource => 
        resource.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrado por categoría (si lo implementas después)
    if (filter.category) {
      result = result.filter(resource => 
        resource.category_id === filter.category
      );
    }
    
    // Ordenamiento
    result.sort((a, b) => {
      if (filter.sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    
    setFilteredResources(result);
  };

  // Ejecutar filtrado cuando cambien los filtros o los recursos
  useEffect(() => {
    filterResources();
  }, [filter, resources]);

  
  return (
    <div>
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

      <FilterRes
        filter={filter}
        setFilter={setFilter}
        landing={landing}
      />

      <section className='px-[5%] py-10 lg:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-8'>
          {filteredResources.length > 0 ? (
            filteredResources.map((res, index) => (
              <div key={index} data-aos="fade-up">
                <div className='flex flex-col gap-3 rounded-xl text-[#3E2F4D] px-3 py-2 hover: transition-colors'>
                  
                  <div className="relative w-full h-40 rounded-lg  bg-gray-50 overflow-hidden flex items-center justify-center">
                    {res.archive ? (
                      <>
                        {/* Para imágenes */}
                        {['.jpg', '.jpeg', '.png', '.gif', '.svg'].some(ext => res.archive.toLowerCase().endsWith(ext)) && (
                          <img 
                            src={`/api/sliders/documents/${res.archive}`} 
                            alt="Preview" 
                            className="object-contain max-h-full max-w-full"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.png';
                            }}
                          />
                        )}
                        
                        {/* Para PDF */}
                        {res.archive.toLowerCase().endsWith('.pdf') && (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">PDF Doc.</span>
                          </div>
                        )}
                        
                        {/* Para Word */}
                        {['.doc', '.docx'].some(ext => res.archive.toLowerCase().endsWith(ext)) && (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <svg className="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium">Word Doc.</span>
                          </div>
                        )}
                        
                        {/* Para Excel */}
                        {['.xls', '.xlsx'].some(ext => res.archive.toLowerCase().endsWith(ext)) && (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium">Excel Doc.</span>
                          </div>
                        )}
                        
                        {/* Para PowerPoint */}
                        {['.ppt', '.pptx'].some(ext => res.archive.toLowerCase().endsWith(ext)) && (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <svg className="w-12 h-12 text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium">PowerPoint Doc.</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm">No hay vista previa disponible</div>
                    )}
                  </div>
                  
                  <p className='text-sm 2xl:text-base font-Poppins_Regular'>
                    {t("public.download.post","Publicado")} | {new Date(res.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h1 className='flex font-Poppins_Regular font-semibold cursor-pointer'>
                    <span className='line-clamp-4'>{res.name}</span>
                  </h1>
                  <a href={`/api/sliders/documents/${res.archive}`} download className='flex flex-row gap-1 text-sm 2xl:text-base font-Poppins_Regular'>{t("public.download.download","Descargar")}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                    <path d="M1.33398 9.83073V11.1176C1.33398 13.8217 1.33398 15.1738 2.07238 16.0896C2.22155 16.2746 2.39008 16.4431 2.57509 16.5923C3.49091 17.3307 4.843 17.3307 7.54715 17.3307C8.13515 17.3307 8.42907 17.3307 8.69832 17.2357C8.75432 17.216 8.80915 17.1932 8.86273 17.1676C9.12032 17.0444 9.32815 16.8366 9.7439 16.4208L13.691 12.4737C14.1727 11.992 14.4136 11.7511 14.5405 11.4448C14.6673 11.1386 14.6673 10.7979 14.6673 10.1166V7.33073C14.6673 4.18803 14.6673 2.61669 13.691 1.64037C12.7147 0.664063 11.1433 0.664062 8.00065 0.664062M8.83398 16.9141V16.4974C8.83398 14.1404 8.83398 12.9619 9.56623 12.2296C10.2985 11.4974 11.477 11.4974 13.834 11.4974H14.2507" stroke="#7B5E9A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10" data-aos="fade-up">
              <p className="text-lg text-[#5C4774]">
                {t("public.no_results", "No se encontraron resultados para tu búsqueda")}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 px-[5%] py-10 lg:py-40 bg-cover bg-center" style={{ backgroundImage: `url('/api/landing_home/media/${landingFooter?.image}')` }}>
        <div className="flex flex-col gap-4 xl:gap-6 max-w-xl mx-auto text-center">
          <p className='font-Poppins_Regular font-semibold text-[#5C4774]'>{landingFooter?.title}</p>
          <h2 className="font-Poppins_Regular font-semibold text-[#1F1827] text-3xl 2xl:text-4xl !leading-tight">
            {landingFooter?.description}
          </h2>
          
          <a href="#" className='max-w-[220px] mx-auto'>
            <div className="bg-[#7B5E9A] px-4 py-3 rounded-md">
              <p className="leading-none text-white text-base 2xl:text-lg font-Poppins_Regular">
                {t("public.btn.chat", "Ir a Whatsapp")}
              </p>
            </div>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <CarritoProvider>
      <Base {...properties} showSlogan={false}>
        <Resources {...properties} />
      </Base>
    </CarritoProvider>
  );
});