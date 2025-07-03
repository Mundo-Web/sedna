import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import JSEncrypt from "jsencrypt";
import CreateReactScript from "./Utils/CreateReactScript";
import AuthRest from "./actions/AuthRest";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { GET } from "sode-extend-react";
import Global from "./Utils/Global";
import InputForm from "./components/Tailwind/Components/InputForm";

const Login = ({}) => {
    document.title = `Login | ${Global.APP_NAME}`;

    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(Global.PUBLIC_RSA_KEY);

    // Estados
    const [loading, setLoading] = useState(true);

    const emailRef = useRef();
    const passwordRef = useRef();
    const rememberRef = useRef();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (GET.message)
            Swal.fire({
                icon: "info",
                title: "Mensaje",
                text: GET.message,
                showConfirmButton: false,
                timer: 3000,
            });
        if (GET.service)
            history.pushState(null, null, `/login?service=${GET.service}`);
        else history.pushState(null, null, "/login");
    }, [null]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //const email = emailRef.current.value;
        // const password = passwordRef.current.value;
        const email = formData.email;
        const password = formData.password;
        const request = {
            email: jsEncrypt.encrypt(email),
            password: jsEncrypt.encrypt(password),
        };
        const result = await AuthRest.login(request);

        if (!result) return setLoading(false);

        location.reload();
    };

    return (
        <>
            <div className=" w-full px-[5%] min-h-screen flex items-center mx-auto py-16 bg-[#F3E5FF]">
                <div className="max-w-5xl mx-auto p-8 lg:grid lg:grid-cols-2 gap-8 bg-white rounded-xl">
                    <div className="hidden lg:block">
                        {/* <video
                            autoPlay
                            loop
                            muted
                            alt="Imagen decorativa"
                            className="h-[400px] w-full object-cover rounded-xl"
                        >
                            <source src="/assets/img/home/login.mp4" />
                        </video> */}

                        <img className="object-contain" src='/assets/img/home/sed_icono1.png' onError={handleImageError} />

                    </div>
                    <div className="flex items-center justify-center px-8">
                        <div className="mx-auto w-full max-w-md space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-center">
                                    Bienvenido a {" "}
                                    <span className="text-azul">
                                        Sedna
                                    </span>
                                </h1>
                            </div>
                            <form
                                className="space-y-4"
                                onSubmit={onLoginSubmit}
                            >
                                <div className="space-y-2">
                                    <InputForm
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hola@mail.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <InputForm
                                        label="Contraseña"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="password"
                                    />
                                </div>
                                <div className="flex items-center justify-between pb-6">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            ref={rememberRef}
                                            className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="text-sm text-gray-600"
                                        >
                                            Guardar mis datos
                                        </label>
                                    </div>
                                    <a
                                        href="/forgot-password"
                                        className="text-sm flex gap-2
                                    items-center justify-center text-azul font-semibold hover:text-azul  "
                                    >
                                        Olvidé mi contraseña
                                    </a>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-xl font-semibold  bg-primary px-4 py-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                                >
                                    Ingresar
                                </button>
                                <div>
                                    {" "}
                                    <div className="row mt-3">
                                        <div className="text-sm text-center customtext-neutral-light">
                                            <a
                                                href="/crear-cuenta"
                                                className="text-muted"
                                            >
                                                ¿Eres nuevo por aquí? Crea una
                                                cuenta.{" "}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(<Login {...properties} />);
});
