import Tippy from "@tippyjs/react";
import React from "react";
import "tippy.js/dist/tippy.css";
import Logout from "../../Actions/Logout";
import MenuItem from "../MenuItem";
import MenuItemContainer from "../MenuItemContainer";
import { useTranslation } from "../../hooks/useTranslation";

const Menu = ({
    session,
    hasRole,
    salesCount,
    messagesCount,
    citasCount,
    reclamosCount,
}) => {
    const mainRole = session.roles[0];
    const { t, loading, error } = useTranslation();
    /* if (loading) {
        return <div className="text-center py-4">Cargando menú...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3">
                Error cargando traducciones: {error}
            </div>
        );
    }*/
    return (
        <div
            className="left-side-menu"
            style={{
                background: "#3E2F4D",
            }}
        >
            <div className="h-100" data-simplebar>
                <div className="user-box text-center ">
                    <img
                        src={`/api/admin/profile/thumbnail/${
                            session.relative_id
                        }?v=${new Date(session.updated_at).getTime()}`}
                        alt={session.name}
                        title={session.name}
                        className="rounded-circle img-thumbnail avatar-md"
                        style={{
                            backgroundColor: "unset",
                            borderColor: "#98a6ad",
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                        onError={(e) =>
                            (e.target.src = `https://ui-avatars.com/api/?name=${session.name}+${session.lastname}&color=7F9CF5&background=EBF4FF`)
                        }
                    />
                    <div className="dropdown">
                        <a
                            href="#"
                            className="user-name dropdown-toggle h5 mt-2 mb-1 d-block"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {session.name.split(" ")[0]}{" "}
                            {session.lastname.split(" ")[0]}
                        </a>
                        <div className="dropdown-menu user-pro-dropdown">
                            <a
                                href="/profile"
                                className="dropdown-item notify-item"
                            >
                                <i className="fe-user me-1"></i>
                                <span>Mi perfil</span>
                            </a>

                            <a
                                href="/account"
                                className="dropdown-item notify-item"
                            >
                                <i className="mdi mdi-account-key-outline me-1"></i>
                                <span>Mi cuenta</span>
                            </a>

                            <a
                                href="#"
                                className="dropdown-item notify-item right-bar-toggle dropdown notification-list"
                            >
                                <i className="fe-settings me-1"></i>
                                <span>Configuracion</span>
                            </a>

                            <a
                                href="#"
                                className="dropdown-item notify-item"
                                onClick={Logout}
                            >
                                <i className="fe-log-out me-1"></i>
                                <span>Cerrar sesion</span>
                            </a>
                        </div>
                    </div>

                    {/* <Tippy content={mainRole.description} arrow={true}> */}
                    <p className="text-muted left-user-info">{mainRole.name}</p>
                    {/* </Tippy> */}

                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <Tippy content="Configuracion">
                                <a
                                    href="#"
                                    className="text-muted left-user-info right-bar-toggle dropdown notification-list"
                                >
                                    <i className="mdi mdi-cog"></i>
                                </a>
                            </Tippy>
                        </li>

                        <li className="list-inline-item">
                            <Tippy content="Cerrar sesion">
                                <a
                                    href="#"
                                    className="text-danger"
                                    onClick={Logout}
                                >
                                    <i className="mdi mdi-power"></i>
                                </a>
                            </Tippy>
                        </li>
                    </ul>
                </div>

                <div id="sidebar-menu" className="show">
                    <ul id="side-menu">
                        <li className="menu-title">Navigation Panel</li>
                        {hasRole("Admin") && (
                            <>
                                <MenuItem
                                    href="/admin/home"
                                    icon="mdi mdi-home"
                                >
                                    {t("admin.sidebar.dashboard", "Dashboard")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/langs"
                                    icon="mdi mdi-google-translate"
                                >
                                    {t("admin.sidebar.languages", "Idiomas")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/messages"
                                    icon="mdi mdi-email-multiple"
                                >
                                    <span className="badge bg-primary float-end">
                                        {messagesCount}
                                    </span>

                                    {t("admin.sidebar.messages", "Mensajes")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/appointments"
                                    icon="mdi mdi-android-messages"
                                >
                                    <span className="badge bg-primary float-end">
                                        {citasCount}
                                    </span>

                                    {t("admin.sidebar.appointments", "Citas")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/complaints"
                                    icon="mdi mdi-book-open-page-variant"
                                >
                                    <span className="badge bg-primary float-end">
                                        {reclamosCount}
                                    </span>

                                    {t(
                                        "admin.sidebar.complaints",
                                        "Reclamaciones"
                                    )}
                                </MenuItem>
                                
                                <MenuItemContainer
                                    title="Soluciones"
                                    icon="mdi mdi-cash-register"
                                >
                                    <MenuItem
                                        href="/admin/solutions"
                                        icon="mdi mdi-shield-star"
                                    >
                                        {t("admin.sidebar.solutions", "Soluciones")}
                                    </MenuItem>
                                    <MenuItem
                                        href="/admin/topicsolutions"
                                        icon="mdi mdi-shield-star"
                                    >
                                        {t("admin.sidebar.topicsolutions", "Temas de Soluciones")}
                                    </MenuItem>
                                </MenuItemContainer>

                                <MenuItemContainer
                                    title="Servicios"
                                    icon="mdi mdi-cash-register"
                                >
                                    <MenuItem
                                        href="/admin/services"
                                        icon="mdi mdi-shield-star"
                                    >
                                        {t("admin.sidebar.services", "Servicios")}
                                    </MenuItem>
                                    <MenuItem
                                        href="/admin/topicservices"
                                        icon="mdi mdi-shield-star"
                                    >
                                        {t("admin.sidebar.topicservices", "Temas de Servicios")}
                                    </MenuItem>
                                </MenuItemContainer>
                               
                                <MenuItem
                                    href="/admin/purchaseOptions"
                                    icon="mdi mdi-shield-star"
                                >
                                    {t(
                                        "admin.sidebar.purchaseOptions",
                                        "Opciones de compra"
                                    )}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/specialities"
                                    icon="mdi mdi-tag-faces"
                                >
                                    {t(
                                        "admin.sidebar.specialties",
                                        "Alianzas comerciales"
                                    )}
                                </MenuItem>
                                {/* <MenuItem
                                    href="/admin/facilities"
                                    icon="mdi mdi-office-building-marker"
                                >
                                    {t(
                                        "admin.sidebar.facilities",
                                        "Instalaciones"
                                    )}
                                </MenuItem> */}
                                <MenuItem
                                    href="/admin/staff"
                                    icon="mdi mdi-account-heart"
                                >
                                    {t("admin.sidebar.staff", "Problemas")}
                                </MenuItem>
                                {/* <MenuItem
                                    href="/admin/sales"
                                    icon="mdi mdi-cart-outline"
                                >
                                    <span className="badge bg-primary float-end">
                                        {salesCount}
                                    </span>
                                    Pedidos
                                </MenuItem>*/}
                                {/*  <MenuItemContainer
                                    title="Inventario"
                                    icon="mdi mdi-cube"
                                >
                                    <MenuItem
                                        href="/admin/categories"
                                        icon="mdi mdi-clipboard-list-outline"
                                    >
                                        Categorias
                                    </MenuItem>

                                    <MenuItem
                                        href="/admin/items"
                                        icon="mdi mdi-cube-send"
                                    >
                                        Items
                                    </MenuItem>

                                    <MenuItem
                                        href="/admin/colors"
                                        icon="mdi mdi-palette-outline"
                                    >
                                        Colores
                                    </MenuItem>
                                    <MenuItem
                                        href="/admin/sizes"
                                        icon="mdi mdi-ruler"
                                    >
                                        Tallas
                                    </MenuItem>
                                </MenuItemContainer>*/}
                                {/* <MenuItemContainer
                                    title="Ventas"
                                    icon="mdi mdi-cash-register"
                                >
                                    <MenuItem
                                        href="/admin/coupons"
                                        icon="mdi mdi-ticket-percent"
                                    >
                                        Cupones
                                    </MenuItem>
                                </MenuItemContainer> */}
                                <li className="menu-title">Landing Page</li>
                                <MenuItem
                                    href="/admin/translations"
                                    icon="mdi mdi-translate"
                                >
                                    {t(
                                        "admin.sidebar.translations",
                                        "Traducciones"
                                    )}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/landing_home"
                                    icon="mdi mdi-tab"
                                >
                                    {t("admin.sidebar.pages", "Páginas")}
                                </MenuItem>
                                {/*    <MenuItem
                                    href="/admin/subscriptions"
                                    icon="mdi mdi-email-multiple"
                                >
                                    Subscripciones
                                </MenuItem>
                                
                                
                                <MenuItem
                                    href="/admin/ads"
                                    icon="mdi mdi-google-ads"
                                >
                                    Pop-ups
                                </MenuItem>*/}
                                <MenuItem
                                    href="/admin/sliders"
                                    icon="mdi mdi-page-layout-body"
                                >
                                    {t("admin.sidebar.pages", "Recursos")}
                                </MenuItem>
                                {/* <MenuItem
                                    href="/admin/about"
                                    icon="mdi mdi-briefcase"
                                >
                                    Nosotros
                                </MenuItem> */}
                                <MenuItem
                                    href="/admin/indicators"
                                    icon="mdi mdi-checkbox-marked-outline"
                                >
                                    {t(
                                        "admin.sidebar.indicators",
                                        "Legal"
                                    )}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/strengths"
                                    icon="mdi mdi-cards-heart"
                                >
                                    {t("admin.sidebar.benefits", "Paises")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/core_values"
                                    icon="mdi mdi-shield-half-full"
                                >
                                    Valores
                                </MenuItem>
                                <MenuItem
                                    href="/admin/testimonies"
                                    icon="mdi mdi-forum"
                                >
                                    {t(
                                        "admin.sidebar.testimonials",
                                        "Sectores"
                                    )}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/categories"
                                    icon="mdi mdi-clipboard-list-outline"
                                >
                                    {t(
                                        "admin.sidebar.categories",
                                        "Categorias"
                                    )}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/posts"
                                    icon="mdi mdi-book-open-page-variant"
                                >
                                    {t("admin.sidebar.posts", "Posts")}
                                </MenuItem>

                                <MenuItem
                                    href="/admin/faqs"
                                    icon="mdi mdi-frequently-asked-questions"
                                >
                                    FAQs
                                </MenuItem>
                                <MenuItem
                                    href="/admin/socials"
                                    icon="mdi mdi-web"
                                >
                                    {t(
                                        "admin.sidebar.socials",
                                        "Redes Sociales"
                                    )}
                                </MenuItem>
                                <li className="menu-title">Configuraciones</li>
                                <MenuItem
                                    href="/admin/users"
                                    icon="mdi mdi-account-multiple"
                                >
                                    {t("admin.sidebar.users", "Usuarios")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/generals"
                                    icon="mdi mdi-credit-card-settings"
                                >
                                    {t(
                                        "admin.sidebar.generals",
                                        "Datos Generales"
                                    )}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/profile"
                                    icon="mdi mdi-account-box"
                                >
                                    {t("admin.sidebar.profile", "Mi perfil")}
                                </MenuItem>
                                <MenuItem
                                    href="/admin/account"
                                    icon="mdi mdi-account-key"
                                >
                                    {t("admin.sidebar.account", "Mi cuenta")}
                                </MenuItem>
                            </>
                        )}
                    </ul>
                </div>
                <div className="clearfix"></div>
            </div>
        </div>
    );
};

export default Menu;
