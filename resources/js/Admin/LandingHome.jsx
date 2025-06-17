import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Modal from "../Components/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Swal from "sweetalert2";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import VideoFormGroup from "../components/Adminto/form/VideoFormGroup";
import LandingHomeRest from "../actions/Admin/LandingHomeRest";
import { Notify } from "sode-extend-react";

const landingHomeRest = new LandingHomeRest();

const normalizeCorrelative = (correlative) => {
    if (!correlative) return "home";
    const parts = correlative.split("_");
    if (parts.length < 2) return "home";
    return parts[1]; // Devuelve 'home', 'services', etc.
};

const EditableCell = ({
    data,
    field,
    currentLangId,
    defaultLangId,
    onSave,
}) => {
    const [tempValue, setTempValue] = useState(data[field] || "");
    const [isEditing, setIsEditing] = useState(false);

    const isBaseLanguage = currentLangId === defaultLangId;
    const isTranslatable = !isBaseLanguage;

    const handleSave = () => {
        onSave(field, tempValue);
        setIsEditing(false);
    };

    return (
        <div
            className={`d-flex gap-2 align-items-center ${
                isTranslatable ? "translation-field" : ""
            }`}
        >
            {isBaseLanguage ? (
                <span>{data[field]}</span>
            ) : (
                <>
                    <input
                        className="form-control flex-grow-1"
                        value={tempValue}
                        onChange={(e) => {
                            setTempValue(e.target.value);
                            setIsEditing(true);
                        }}
                        disabled={!isTranslatable}
                    />
                    {isEditing && isTranslatable && (
                        <button
                            className="btn btn-xs btn-soft-primary"
                            onClick={handleSave}
                        >
                            <i className="fa fa-save"></i>
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const LandingHome = ({
    items: initialItems,
    current_lang_id,
    default_lang_id,
}) => {
    const modalRef = useRef();
    const [activeTab, setActiveTab] = useState("home");
    const [isEditing, setIsEditing] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [items, setItems] = useState(initialItems);
    const [translations, setTranslations] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Form refs
    const idRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const linkRef = useRef(null);
    const is_videoRef = useRef(null);

    // Nombres de las páginas para los tabs
    const pageNames = {
        home: "Inicio",
        services: "Servicios",
        solutions: "Soluciones",
        purchase: "Opciones de compra",
        partners: "Aliados comerciales",
        aboutus: "Nosotros",
        faqs: "Faqs",
        contact: "Contacto",
        blog: "Blog",
        legal: "Legal",
        resources: "Recursos",
    };

    // Cargar traducciones cuando cambia el idioma
    useEffect(() => {
        const loadTranslations = async () => {
            if (current_lang_id !== default_lang_id) {
                setIsLoading(true);
                try {
                    const response = await landingHomeRest.getByLang(
                        current_lang_id
                    );
                    const translationsMap = {};

                    response.forEach((item) => {
                        if (item.original_id) {
                            translationsMap[item.original_id] = item;
                        }
                    });

                    setTranslations(translationsMap);
                } catch (error) {
                    Notify.error("Error al cargar traducciones");
                    console.error("Error loading translations:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTranslations({});
            }
        };

        loadTranslations();
    }, [current_lang_id, default_lang_id]);

    // Agrupar items por página - VERSIÓN CORREGIDA
    const groupedItems = items.reduce((acc, item) => {
        const page = normalizeCorrelative(item.correlative);

        if (!acc[page]) {
            acc[page] = [];
        }

        const translation = translations[item.original_id || item.id] || {};
        const displayItem = {
            ...item,
            title:
                current_lang_id !== default_lang_id
                    ? translation.title || item.title
                    : item.title,
            subtitle:
                current_lang_id !== default_lang_id
                    ? translation.subtitle || item.subtitle
                    : item.subtitle,
            description:
                current_lang_id !== default_lang_id
                    ? translation.description || item.description
                    : item.description,
            link:
                current_lang_id !== default_lang_id
                    ? translation.link || item.link
                    : item.link,
            is_translated: !!translation.id,
        };

        acc[page].push(displayItem);
        return acc;
    }, {});

    // Debug: Verificar agrupación
    useEffect(() => {
        console.log("Items agrupados:", groupedItems);
        console.log("Items en home:", groupedItems.home?.length);
    }, [groupedItems]);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        setTimeout(() => {
            if (idRef.current) idRef.current.value = data?.id ?? "";
            if (titleRef.current) titleRef.current.value = data?.title ?? "";
            if (subtitleRef.current)
                subtitleRef.current.value = data?.subtitle ?? "";
            if (descriptionRef.current)
                descriptionRef.current.value = data?.description ?? "";
            if (linkRef.current) linkRef.current.value = data?.link ?? "";

            const isVideoChecked =
                data?.is_video === "1" || data?.is_video === 1;
            if (is_videoRef.current) {
                is_videoRef.current.checked = isVideoChecked;
                setIsVideo(isVideoChecked);
            }

            if (isVideoChecked && videoRef.current && data?.video) {
                videoRef.current.setVideoSrc(
                    `/api/landing_home/video/${data.video}`
                );
            } else if (imageRef.current && data?.image) {
                imageRef.current.src = `/api/landing_home/media/${data?.image}`;
            }
        }, 100);

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            if (idRef.current?.value)
                formData.append("id", idRef.current.value);
            if (titleRef.current?.value)
                formData.append("title", titleRef.current.value);
            if (subtitleRef.current?.value)
                formData.append("subtitle", subtitleRef.current.value);
            if (descriptionRef.current?.value)
                formData.append("description", descriptionRef.current.value);
            if (linkRef.current?.value)
                formData.append("link", linkRef.current.value);

            formData.append(
                "is_video",
                is_videoRef.current?.checked ? "1" : "0"
            );
            formData.append("lang_id", default_lang_id);

            if (isVideo && videoRef.current) {
                const videoFile = videoRef.current.getFile();
                if (videoFile) formData.append("video", videoFile);
            } else if (imageRef.current?.files?.[0]) {
                formData.append("image", imageRef.current.files[0]);
            }

            const result = await landingHomeRest.save(formData);
            if (!result) return;

            const updatedItems = await landingHomeRest.getAll();
            if (updatedItems) setItems(updatedItems);

            $(modalRef.current).modal("hide");
            Notify.success("Sección guardada correctamente");
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            Notify.error("Hubo un error al enviar el formulario");
        }
    };

    const handleSaveTranslation = async (itemId, field, value) => {
        try {
            const item = items.find((i) => i.id === itemId);
            if (!item) return;

            const payload = {
                original_id: item.original_id || item.id,
                [field]: value,
                lang_id: current_lang_id,
                title:
                    field === "title"
                        ? value
                        : translations[item.id]?.title || item.title,
                subtitle:
                    field === "subtitle"
                        ? value
                        : translations[item.id]?.subtitle || item.subtitle,
                description:
                    field === "description"
                        ? value
                        : translations[item.id]?.description ||
                          item.description,
                link:
                    field === "link"
                        ? value
                        : translations[item.id]?.link || item.link,
            };

            const result = await landingHomeRest.translate(payload);
            if (!result) return;

            setTranslations((prev) => {
                const updated = { ...prev };
                if (!updated[item.id]) {
                    updated[item.id] = {
                        ...item,
                        id: result.id,
                        original_id: item.id,
                        lang_id: current_lang_id,
                    };
                }
                updated[item.id][field] = value;
                return updated;
            });

            Notify.success("Traducción guardada correctamente");
        } catch (error) {
            Notify.error("Error al guardar traducción");
            console.error(error);
        }
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await landingHomeRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;

        const updatedItems = await landingHomeRest.getAll();
        if (updatedItems) setItems(updatedItems);
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar sección",
            text: "¿Estás seguro de eliminar esta sección?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;

        const result = await landingHomeRest.delete(id);
        if (!result) return;

        const updatedItems = await landingHomeRest.getAll();
        if (updatedItems) setItems(updatedItems);
        Notify.success("Sección eliminada correctamente");
    };

    const isTranslationMode = current_lang_id !== default_lang_id;

    return (
        <>
            <div
                className={`card ${
                    isTranslationMode ? "translation-mode" : ""
                }`}
            >
                <div className="card-header d-flex justify-content-between align-items-center">
                    <ul className="nav nav-tabs card-header-tabs">
                        {Object.keys(pageNames).map((page) => (
                            <li key={page} className="nav-item">
                                <button
                                    className={`nav-link ${
                                        activeTab === page ? "active" : ""
                                    }`}
                                    onClick={() => setActiveTab(page)}
                                >
                                    {pageNames[page]}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {isTranslationMode && (
                            <span
                                className="badge bg-success me-2"
                                style={{ padding: "6px" }}
                            >
                                <i className="fa fa-language me-1"></i> Modo
                                Traducción
                            </span>
                        )}
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                                onModalOpen({
                                    correlative: `page_${activeTab}_new`,
                                    lang_id: default_lang_id,
                                })
                            }
                        >
                            <i className="fa fa-plus me-1"></i> Nueva Sección
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>
                            <p className="mt-2">Cargando traducciones...</p>
                        </div>
                    ) : (
                        Object.keys(pageNames).map((page) => (
                            <div
                                key={page}
                                style={{
                                    display:
                                        activeTab === page ? "block" : "none",
                                }}
                            >
                                <h4 className="mb-4">
                                    Secciones de {pageNames[page]}
                                </h4>
                                <p className="text-muted mb-3">
                                    Mostrando {groupedItems[page]?.length || 0}{" "}
                                    secciones
                                </p>

                                {groupedItems[page]?.length === 0 ? (
                                    <div className="alert alert-info">
                                        No hay secciones configuradas para esta
                                        página
                                    </div>
                                ) : (
                                    <div className="row">
                                        {(groupedItems[page] || []).map(
                                            (item) => (
                                                <div
                                                    key={item.id}
                                                    className="col-md-6 mb-4"
                                                >
                                                    <div className="card h-100">
                                                        <div className="card-header d-flex justify-content-between align-items-center">
                                                            <h5 className="mb-0">
                                                                {item.correlative?.split(
                                                                    "_"
                                                                )[2] ||
                                                                    "Sección"}
                                                                <small className="text-muted ms-2">
                                                                    (
                                                                    {
                                                                        item.correlative
                                                                    }
                                                                    )
                                                                </small>
                                                            </h5>
                                                            {/*   <SwitchFormGroup
                                                                checked={
                                                                    item.visible
                                                                }
                                                                onChange={(e) =>
                                                                    onVisibleChange(
                                                                        {
                                                                            id: item.id,
                                                                            value: e
                                                                                .target
                                                                                .checked,
                                                                        }
                                                                    )
                                                                }
                                                            />*/}
                                                        </div>

                                                        <div className="card-body">
                                                            {item.is_video ===
                                                                "1" ||
                                                            item.is_video ===
                                                                1 ? (
                                                                <video
                                                                    src={`/api/landing_home/video/${item.video}`}
                                                                    className="img-fluid mb-3"
                                                                    style={{
                                                                        maxHeight:
                                                                            "200px",
                                                                        width: "100%",
                                                                        objectFit:
                                                                            "cover",
                                                                    }}
                                                                    onError={(
                                                                        e
                                                                    ) =>
                                                                        (e.target.src =
                                                                            "/api/cover/thumbnail/null")
                                                                    }
                                                                    controls
                                                                />
                                                            ) : item.image ? (
                                                                <img
                                                                    src={`/api/landing_home/media/${item.image}`}
                                                                    className="img-fluid mb-3"
                                                                    style={{
                                                                        maxHeight:
                                                                            "200px",
                                                                        width: "100%",
                                                                        objectFit:
                                                                            "cover",
                                                                    }}
                                                                    onError={(
                                                                        e
                                                                    ) =>
                                                                        (e.target.src =
                                                                            "/api/cover/thumbnail/null")
                                                                    }
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="bg-light mb-3"
                                                                    style={{
                                                                        height: "200px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <span className="text-muted">
                                                                        Sin
                                                                        imagen/video
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {item.title && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Título:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={
                                                                            item
                                                                        }
                                                                        field="title"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.subtitle && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Subtítulo:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={
                                                                            item
                                                                        }
                                                                        field="subtitle"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.description && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Descripción:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={
                                                                            item
                                                                        }
                                                                        field="description"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}

                                                            {item.link && (
                                                                <div className="mb-2">
                                                                    <strong>
                                                                        Enlace:
                                                                    </strong>
                                                                    <EditableCell
                                                                        data={
                                                                            item
                                                                        }
                                                                        field="link"
                                                                        currentLangId={
                                                                            current_lang_id
                                                                        }
                                                                        defaultLangId={
                                                                            default_lang_id
                                                                        }
                                                                        onSave={(
                                                                            field,
                                                                            value
                                                                        ) =>
                                                                            handleSaveTranslation(
                                                                                item.id,
                                                                                field,
                                                                                value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="card-footer d-flex justify-content-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() =>
                                                                    onModalOpen(
                                                                        item
                                                                    )
                                                                }
                                                                disabled={
                                                                    isTranslationMode
                                                                }
                                                            >
                                                                <i className="fa fa-edit"></i>{" "}
                                                                Editar
                                                            </button>
                                                            {/*    <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() =>
                                                                    onDeleteClicked(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-trash"></i>{" "}
                                                                Eliminar
                                                            </button>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar sección" : "Agregar sección"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <div className="row" id="principal-container">
                    <input ref={idRef} type="hidden" />

                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={titleRef}
                            label="Título"
                            placeholder="Título principal de la sección"
                            required
                        />

                        <InputFormGroup
                            eRef={subtitleRef}
                            label="Subtítulo"
                            placeholder="Subtítulo opcional"
                        />

                        <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción"
                            rows={3}
                            placeholder="Descripción detallada de la sección"
                        />

                        <InputFormGroup
                            eRef={linkRef}
                            label="Enlace"
                            placeholder="https://ejemplo.com"
                        />
                    </div>

                    <div className="col-md-6">
                        <SwitchFormGroup
                            eRef={is_videoRef}
                            onChange={(e) => setIsVideo(e.target.checked)}
                            label="Usar video en lugar de imagen"
                            specification="Solo se mostrará el video en la sección"
                        />

                        {!isVideo ? (
                            <ImageFormGroup
                                eRef={imageRef}
                                label="Imagen"
                                col="col-12"
                                aspect={16 / 9}
                                fit="contain"
                                required={!isEditing}
                            />
                        ) : (
                            <VideoFormGroup
                                eRef={videoRef}
                                label="Video"
                                col="col-12"
                                required={!isEditing}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Landing Inicio">
            <LandingHome {...properties} />
        </BaseAdminto>
    );
});
