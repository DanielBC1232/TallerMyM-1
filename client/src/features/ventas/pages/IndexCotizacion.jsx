import ListaCotizaciones from "../components/ListaCotizaciones";
import ModalAgregarCotizacion from "../components/ModalAgregarCotizacion";

const IndexCotizacion = () => {
    return (
        <div className="bg-darkest rounded-4 shadow-sm" style={{ minHeight: "88vh" }}>
            <div className="px-4 py-3 rounded-top-4 bg-header">
                <ModalAgregarCotizacion />
            </div>
            <div className="mt-3 px-2">
                <ListaCotizaciones />
            </div>
        </div>
    );
};
export default IndexCotizacion;
