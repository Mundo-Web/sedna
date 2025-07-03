import BasicRest from "./BasicRest";
import { Fetch } from "sode-extend-react";

class ServicesRest extends BasicRest {
    path = "services";
    
    getServices = async (params = {}) => {  // Añade parámetros opcionales
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/getServices`,
                {
                    method: "POST",
                    body: JSON.stringify(params)  // Envía los parámetros en el body
                }
            );
            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al consultar"
                );

            return result ?? { data: [] };  // Asegura que siempre devuelva un objeto con data
        } catch (error) {
            console.error("Error en obtener data:", error);
            return { data: [] };  // Devuelve un objeto consistente incluso en errores
        }
    };
    
}

export default ServicesRest;
