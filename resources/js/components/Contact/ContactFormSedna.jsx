import React, { useEffect, useRef, useState } from "react";
import {
    Mail,
    User,
    MessageSquare,
    ArrowUpRight,
    ChevronDown,
} from "lucide-react";
import MessagesRest from "../../Actions/MessagesRest";
import Swal from "sweetalert2";
import { data } from "autoprefixer";
import { useTranslation } from "../../hooks/useTranslation";

const messagesRest = new MessagesRest();

const PhoneInput = ({ onPhoneChange, initialPhone }) => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    // Cargar países y establecer Perú como predeterminado
    useEffect(() => {
        const loadCountries = async () => {
            try {
                // Si está en public/data
                const response = await fetch(
                    "/assets/data/countries_phone.json"
                );
                // Si está en src/data (importar directamente)
                // import countriesData from '../data/countries_phone.json';

                const data = await response.json();
                setCountries(data);

                // Establecer Perú como predeterminado (código PE)
                const peru = data.find((c) => c.iso2 === "PE");
                setSelectedCountry(peru || data[0]);
            } catch (error) {
                console.error("Error loading countries:", error);
            }
        };

        loadCountries();
    }, []);

    // Procesar initialPhone cuando cambia o cuando se cargan los países
    useEffect(() => {
        if (initialPhone && countries.length > 0) {
            // Extraer el código del país (ej: +51 de "+51987654321")
            const phoneCodeMatch = initialPhone.match(/^\+\d+/);
            if (phoneCodeMatch) {
                const phoneCode = phoneCodeMatch[0].substring(1); // Quita el "+"
                const number = initialPhone.substring(phoneCodeMatch[0].length);
                
                // Buscar el país correspondiente al código
                const country = countries.find(
                    (c) => c.phoneCode.replace(/\D/g, "") === phoneCode
                );
                
                if (country) {
                    setSelectedCountry(country);
                    setPhoneNumber(number);
                }
            }
        }
    }, [initialPhone, countries]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Solo números
        setPhoneNumber(value);

        // Enviar el número completo con prefijo al formulario padre
        if (selectedCountry) {
            const fullNumber = `+${selectedCountry.phoneCode.replace(
                /\D/g,
                ""
            )}${value}`;
            onPhoneChange(fullNumber);
        }
    };

    // const handleCountrySelect = (country) => {
    //     setSelectedCountry(country);
    //     setShowDropdown(false);
    // };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setShowDropdown(false);
        
        // Actualizar el número completo cuando cambia el país
        if (phoneNumber) {
            const fullNumber = `+${country.phoneCode.replace(/\D/g, "")}${phoneNumber}`;
            onPhoneChange(fullNumber);
        }
    };

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium mb-1">Teléfono*</label>

            <div className="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                {/* Selector de país */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="flex items-center justify-between px-3 py-2 h-full border-r border-gray-300 bg-gray-50 rounded-l-md w-20"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="flex items-center">
                            <span
                                className={`fi fi-${selectedCountry?.iso2.toLowerCase()} mr-2`}
                            ></span>
                            <span>{selectedCountry?.iso2}</span>
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                                showDropdown ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {showDropdown && (
                        <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200">
                            {countries.map((country) => (
                                <div
                                    key={country.iso2}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <span
                                        className={`fi fi-${country.iso2.toLowerCase()} mr-3`}
                                    ></span>
                                    <span className="flex-1">
                                        {country.nameES}
                                    </span>
                                    <span className="text-gray-500">
                                        +{country.phoneCode}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input de teléfono */}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Ej: 987654321"
                    className="flex-1 px-4 py-2 focus:outline-none rounded-r-md"
                    pattern="[0-9]*"
                />
            </div>

            {/* Mostrar número completo */}
            {phoneNumber && selectedCountry && (
                <p className="mt-1 text-sm text-gray-500">
                    Número completo: +{selectedCountry.phoneCode} {phoneNumber}
                </p>
            )}
        </div>
    );
};

const ContactFormSedna = ({title = "", date = false, button = "", subject= ""}) => {
    const [formData, setFormData] = useState({
        phone: "",
        date: "",
        interest: ""
    });
    const nameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const businessRef = useRef();
    const rucRef = useRef();
    const descriptionRef = useRef();
    const phoneRef = useRef();
    

    const [sending, setSending] = useState(false);

    const onMessageSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
    
        // Prepara los datos para enviar
        const request = {
            name: `${nameRef.current.value} ${lastNameRef.current.value}`.trim(),
            email: emailRef.current.value,
            description: descriptionRef.current.value,
            business: businessRef.current.value || null, 
            ruc: rucRef.current.value || null,
            subject: subject || "Consulta general", 
            interest: formData.interest || null,
            phone: formData.phone, 
            date: formData.date || null, 
        };
    
        console.log("Datos a enviar:", request); // Para depuración
    
        try {
            const result = await messagesRest.save(request);
         
            if (result) {
                Swal.fire({
                    icon: "success",
                    title: "Mensaje enviado",
                    text: "Tu mensaje ha sido enviado correctamente",
                    showConfirmButton: false,
                    timer: 3000,
                });
                
                // Resetear formulario
                nameRef.current.value = "";
                lastNameRef.current.value = "";
                emailRef.current.value = "";
                businessRef.current.value = "";
                rucRef.current.value = "";
                descriptionRef.current.value = "";
                setFormData({
                    phone: "",
                    date: "",
                    interest: ""
                });

                window.location.href = "/thanks";
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar el formulario: " + error.message,
            });
        } finally {
            setSending(false);
        }
    };

    const { t } = useTranslation();

    return (
        <form className="flex flex-col gap-y-4 bg-[#F5F2F9] p-6 rounded-xl font-Poppins_Regular" onSubmit={onMessageSubmit}>
            <h3 className="text-xl font-semibold text-[#4B246D]">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                <div>
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium  mb-1"
                    >
                        {t("public.form.name", "Nombre")}
                    </label>
                    <input
                        ref={nameRef}
                        type="text"
                        id="nombre"
                        placeholder={t("public.form.name", "Nombre")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="apellido-materno"
                        className="block text-sm font-medium  mb-1"
                    >
                        {t("public.form.lastname", "Apellidos")}
                    </label>
                    <input
                        ref={lastNameRef}
                        type="text"
                        id="apellido-materno"
                        placeholder={t("public.form.lastname", "Apellidos")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.email", "E-mail")}
                </label>
                <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    placeholder={t("public.form.email", "E-mail")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <PhoneInput
                     onPhoneChange={(fullNumber) => setFormData({...formData, phone: fullNumber})}
                     initialPhone={formData.phone}
                />
            </div>

            <div>
                <label
                    htmlFor="business"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.business", "Nombre de la empresa")}
                </label>
                <input
                    ref={businessRef}
                    type="text"
                    id="business"
                    placeholder={t("public.form.business", "Nombre de la empresa")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label
                    htmlFor="ruc"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.ruc", "RUC")}
                </label>
                <input
                    ref={rucRef}
                    type="text"
                    id="ruc"
                    placeholder={t("public.form.ruc", "RUC")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            

            <div className="bg-white rounded-md p-4 text-[#4B246D]">
                <label className="block text-sm font-medium mb-1">Interés*</label>
                <div className="space-y-2 mt-3">
                    {['solution', 'service', 'option'].map((option) => (
                        <div key={option} className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                id={option}
                                name="interest"
                                checked={formData.interest === option}
                                onChange={() => setFormData({...formData, interest: option})}
                                className="border border-gray-300 rounded-md focus:outline-none text-[#7B5E9A] bg-[#7B5E9A] focus:ring-0"
                            />
                            <label htmlFor={option} className="block text-sm font-medium">
                                {t(`public.form.${option}`, 
                                    option === 'solution' ? 'Solución' : 
                                    option === 'service' ? 'Servicio' : 'Opciones de compra')}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {date && (
                <div>
                    <label
                        htmlFor="date"
                        className="block text-sm font-medium mb-1"
                    >
                        {t("public.form.date", "Fecha de reunión")}
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            <div>
                <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.message", "Escribe un mensaje")}
                </label>
                <textarea
                    ref={descriptionRef}
                    id="mensaje"
                    rows={6}
                    placeholder={t("public.form.message", "Escribe un mensaje")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="privacidad"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-azul border-gray-300 rounded focus:ring-azul/50"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="privacidad" className="">
                        {t(
                            "public.form.privacy",
                            "Acepto los Terminos y condiciones."
                        )}
                    </label>
                </div>
            </div>

            <button
                disabled={sending}
                type="submit"
                className=" mt-2 bg-[#7B5E9A] font-semibold text-white py-3 text-center w-full gap-2 rounded-lg flex flex-col items-center"
            >
                {!sending ? (
                    <p className="ml-4">
                        {button}
                    </p>
                ) : (
                    <p> {t("public.btn.sending", "Enviando formulario...")}</p>
                )}
            </button>
        </form>
    );
};

export default ContactFormSedna;