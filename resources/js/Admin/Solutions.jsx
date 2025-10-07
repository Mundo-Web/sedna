import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";

import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import { LanguageProvider } from "../context/LanguageContext";
import DragDropImage from "../components/Adminto/form/DragDropImage";
import SolutionsRest from "../actions/Admin/SolutionsRest";
import SelectAPIFormGroupSupport from "../components/Adminto/form/SelectAPIFormGroupSupport";

const servicesRest = new SolutionsRest();
// Componente FeatureCard simplificado
const FeatureCard = ({
    feature,
    index,
    onUpdate,
    onRemove,
    type,
    canRemove,
    characteristics,
    benefits,
    addCharacteristic,
    addBenefit,
}) => {
    const handleFieldChange = (field, value) => {
        onUpdate(index, field, value);
    };

    const handleImageChange = (imageData) => {
        onUpdate(index, "image", imageData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup
                            label="Título"
                            value={feature.title}
                            onChange={(e) =>
                                handleFieldChange("title", e.target.value)
                            }
                        />
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={feature.description}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <DragDropImage
                            current="solution"
                            label="Imagen"
                            currentImage={feature.image}
                            onChange={handleImageChange}
                            aspect={16 / 9}
                        />
                    </div>
                </div>
                {/* <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRemove(index)}
                        disabled={!canRemove}
                    >
                        Eliminar
                    </button>
                    {(type === "characteristic" &&
                        index === characteristics.length - 1) ||
                    (type === "benefit" && index === benefits.length - 1) ? (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={
                                type === "characteristic"
                                    ? addCharacteristic
                                    : addBenefit
                            }
                        >
                            Agregar{" "}
                            {type === "characteristic"
                                ? "Característica"
                                : "Beneficio"}
                        </button>
                    ) : null}
                </div> */}
            </div>
        </div>
    );
};
const Solutions = ({ brands }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref - Siguiendo el patrón del primer código
    const idRef = useRef();
    const titleRef = useRef();
    const titlesecondRef = useRef();
    const categoryRef = useRef();
    const descriptionRef = useRef();
    const descriptionsecondRef = useRef();
    const howItHelpsRef = useRef();
    const descriptionHelpsRef = useRef();
    const valuePropositionRef = useRef();
    const innovationFocusRef = useRef();
    const customerRelationRef = useRef();

    // Refs para imágenes - igual que en el primer código
    const imageIconRef = useRef();
    const imageRef = useRef();
    const imageSecondaryRef = useRef();
    const imageBannerRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState("basic");

    // Estados para características y beneficios
    const [characteristics, setCharacteristics] = useState([
        { title: "", description: "", image: undefined },
    ]);
    const [benefits, setBenefits] = useState([
        { title: "", description: "", image: undefined },
    ]);
    const [selectedCategory, setSelectedCategory] = useState("");
    
    // Funciones para características (simplificadas)
    const addCharacteristic = () => {
        setCharacteristics([
            ...characteristics,
            {
                title: "",
                description: "",
                image: undefined,
            },
        ]);
    };

    const updateCharacteristic = useCallback((index, field, value) => {
        setCharacteristics((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const removeCharacteristic = (index) => {
        if (characteristics.length <= 1) return;
        setCharacteristics(characteristics.filter((_, i) => i !== index));
    };

    // Funciones para beneficios (simplificadas)
    const addBenefit = () => {
        setBenefits([
            ...benefits,
            {
                title: "",
                description: "",
                image: undefined,
            },
        ]);
    };

    const updateBenefit = useCallback((index, field, value) => {
        setBenefits((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const removeBenefit = (index) => {
        if (benefits.length <= 1) return;
        setBenefits(benefits.filter((_, i) => i !== index));
    };

    // Cargar datos al editar - similar al primer código
    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Resetear al tab inicial
        setActiveTab("basic");

        // Resetear valores como en el primer código
        idRef.current.value = data?.id ?? "";
        titleRef.current.value = data?.title ?? "";
        // titlesecondRef.current.value = data?.title_second ?? "";

        categoryRef.current.value = data?.category.name ?? "";
        setSelectedCategory(data?.category.name);
        setSelectedItem(data);
        descriptionRef.current.value = data?.description ?? "";
        // descriptionsecondRef.current.value = data?.description_second ?? "";
        howItHelpsRef.current.value = data?.how_it_helps ?? "";
        descriptionHelpsRef.current.value = data?.description_helps ?? "";
        // valuePropositionRef.current.value = data?.value_proposition ?? "";
        // innovationFocusRef.current.value = data?.innovation_focus ?? "";
        // customerRelationRef.current.value = data?.customer_relation ?? "";

        // Manejo de imágenes como en el primer código
        imageIconRef.image.src = `/api/solution/media/${
            data?.image_icon ?? "undefined"
        }`;
        // imageRef.image.src = `/api/solution/media/${
        //     data?.image ?? "undefined"
        // }`;
        imageSecondaryRef.image.src = `/api/solution/media/${
            data?.image_secondary ?? "undefined"
        }`;
        imageBannerRef.image.src = `/api/solution/media/${
            data?.image_banner ?? "undefined"
        }`;

        // Cargar características y beneficios si existen

        // if (data?.characteristics) {
        //     setCharacteristics(
        //         data.characteristics.map((char) => ({
        //             title: char.title || "",
        //             description: char.description || "",
        //             image: char.image
        //                 ? { preview: `/api/solution/media/${char.image}` }
        //                 : null,
        //         }))
        //     );
        // }

        // if (data?.benefits) {
        //     setBenefits(
        //         data.benefits.map((benefit) => ({
        //             title: benefit.title || "",
        //             description: benefit.description || "",
        //             image: benefit.image
        //                 ? { preview: `/api/solution/media/${benefit.image}` }
        //                 : null,
        //         }))
        //     );
        // }

        // En onModalOpen, al cargar características y beneficios

        // if (data?.characteristics) {
        //     setCharacteristics(
        //         data.characteristics.map((char) => ({
        //             title: char.title,
        //             description: char.description,
        //             image: char.image, 
        //         }))
        //     );
        // }

        // if (data?.benefits) {
        //     setBenefits(
        //         data.benefits.map((char) => ({
        //             title: char.title,
        //             description: char.description,
        //             image: char.image, 
        //         }))
        //     );
        // }

        $(modalRef.current).modal("show");
    };

    // Enviar formulario - similar al primer código pero adaptado
    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Campos básicos como en el primer código
        const request = {
            id: idRef.current.value || undefined,
            title: titleRef.current.value,
            // title_second: titlesecondRef.current.value,
            description: descriptionRef.current.value,
            // description_second: descriptionsecondRef.current.value,
            how_it_helps: howItHelpsRef.current.value,
            description_helps: descriptionHelpsRef.current.value,
            // value_proposition: valuePropositionRef.current.value,
            // innovation_focus: innovationFocusRef.current.value,
            // customer_relation: customerRelationRef.current.value,
        };

        // Añadir campos básicos al formData
        for (const key in request) {
            formData.append(key, request[key]);
        }

        // Añadir imágenes como en el primer código
        const imageicon = imageIconRef.current.files[0];
        if (imageicon) formData.append("image_icon", imageicon);

        // const image = imageRef.current.files[0];
        // if (image) formData.append("image", image);

        const imageSecondary = imageSecondaryRef.current.files[0];
        if (imageSecondary) formData.append("image_secondary", imageSecondary);

        const imageBanner = imageBannerRef.current.files[0];
        if (imageBanner) formData.append("image_banner", imageBanner);

        formData.append("category_name", selectedCategory);
        const result = await servicesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await servicesRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Soluciones"
                rest={servicesRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar nueva solución",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "title",
                        caption: "Título",
                   
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "450px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <div
                                        className="text-truncate"
                                        style={{ maxWidth: "450px" }}
                                    >
                                        {data.description}
                                    </div>
                                )
                            );
                        },
                    },
                    {
                        dataField: "image_icon",
                        caption: "Imagen",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/solution/media/${data.image_icon}`}
                                    style={{
                                        width: "80px",
                                        height: "45px",
                                        objectFit: "contain",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/images/default-thumbnail.jpg")
                                    }
                                />
                            );
                        },
                    },
                      {
                        dataField: "image_secondary",
                        caption: "Imagen",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/solution/media/${data.image_secondary}`}
                                    style={{
                                        width: "80px",
                                        height: "45px",
                                        objectFit: "contain",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/images/default-thumbnail.jpg")
                                    }
                                />
                            );
                        },
                    },
                      {
                        dataField: "image_banner",
                        caption: "Imagen",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/api/solution/media/${data.image_banner}`}
                                    style={{
                                        width: "90px",
                                        height: "45px",
                                        objectFit: "contain",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/images/default-thumbnail.jpg")
                                    }
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className:
                                        "btn btn-xs btn-soft-primary me-1",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Solución" : "Nueva Solución"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />

                {/* Navegación por Tabs */}
                <ul className="nav nav-pills nav-fill mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
                            onClick={() => setActiveTab("basic")}
                            type="button"
                        >
                            <i className="fa fa-info-circle me-2"></i>
                            Información Básica
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "benefits" ? "active" : ""}`}
                            onClick={() => setActiveTab("benefits")}
                            type="button"
                        >
                            <i className="fa fa-thumbs-up me-2"></i>
                            Banner
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "media" ? "active" : ""}`}
                            onClick={() => setActiveTab("media")}
                            type="button"
                        >
                            <i className="fa fa-images me-2"></i>
                            Recursos Visuales
                        </button>
                    </li>
                </ul>

                {/* Contenido de los Tabs */}
                <div className="tab-content">
                    {/* Tab: Información Básica */}
                    <div
                        className={`tab-pane fade ${activeTab === "basic" ? "show active" : ""}`}
                    >
                        <div className="row">
                            <div className="col-md-6" id="solution-container">
                                <SelectAPIFormGroupSupport
                                    eRef={categoryRef}
                                    dropdownParent="#solution-container"
                                    label="Categoría"
                                    searchAPI="/api/admin/category_solutions/paginate"
                                    searchBy="name"
                                    allowCreate
                                    onChange={(categoryName) =>
                                        setSelectedCategory(categoryName)
                                    }
                                    initialValue={selectedItem?.category?.name || ""}
                                />
                            </div>
                            <div className="col-md-6">
                                <InputFormGroup
                                    eRef={titleRef}
                                    label="Título de la solución"
                                    required
                                />
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Descripción principal
                                        <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        ref={descriptionRef}
                                        className="form-control"
                                        rows={6}
                                        placeholder="Describe de manera general la solución..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab: Beneficios y Ayuda */}
                    <div
                        className={`tab-pane fade ${activeTab === "benefits" ? "show active" : ""}`}
                    >
                        <div className="row">
                            <div className="col-md-12">
                                <InputFormGroup
                                    eRef={howItHelpsRef}
                                    label="¿Cómo ayuda esta solución?"
                                />
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Descripción detallada de la ayuda
                                    </label>
                                    <textarea
                                        ref={descriptionHelpsRef}
                                        className="form-control"
                                        rows={8}
                                        placeholder="Explica en detalle cómo esta solución ayuda al cliente..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab: Recursos Visuales */}
                    <div
                        className={`tab-pane fade ${activeTab === "media" ? "show active" : ""}`}
                    >
                        <div className="row">
                            <div className="col-md-6">
                                <div className="border rounded p-3 h-100 bg-light">
                                    <ImageFormGroup
                                        eRef={imageIconRef}
                                        label="Imagen Ícono"
                                        aspect={1 / 1}
                                 
                                    />
                                    <div className="alert alert-info mt-3 py-2">
                                        <small>
                                            <i className="fa fa-info-circle me-1"></i>
                                            <strong>Uso:</strong> Card de la portada
                                            <br />
                                            <strong>Proporción:</strong> 1:1 (cuadrada)
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border rounded p-3 h-100 bg-light">
                                    <ImageFormGroup
                                        eRef={imageSecondaryRef}
                                        label="Imagen Secundaria"
                                        aspect={1/1}
                                    />
                                    <div className="alert alert-info mt-3 py-2">
                                        <small>
                                            <i className="fa fa-info-circle me-1"></i>
                                            <strong>Uso:</strong> Card de la portada
                                            <br />
                                            <strong>Proporción:</strong> 1:1 (cuadrada)
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 mt-3">
                                <div className="border rounded p-3 bg-light">
                                    <ImageFormGroup
                                        eRef={imageBannerRef}
                                        label="Banner Principal"
                                        aspect={16 / 9}
                                    />
                                    <div className="alert alert-info mt-3 py-2">
                                        <small>
                                            <i className="fa fa-info-circle me-1"></i>
                                            <strong>Uso:</strong> Cabecera de la página de detalle
                                            <br />
                                            <strong>Proporción:</strong> 16:9 (panorámica)
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

         
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <LanguageProvider>
            <BaseAdminto {...properties} title="Soluciones">
                <Solutions {...properties} />
            </BaseAdminto>
        </LanguageProvider>
    );
});
