import { TrabajadorRepository } from '../../models/trabajadores/trabajadores.js';

// Crear una instancia de TrabajadorRepository
const TrabajadorRepo = new TrabajadorRepository();

const insertTrabajador = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { nombreCompleto, cedula, salario, seguroSocial } = req.body;

        //Verificar si ya existe con la misma cedula
        const trabajadorExistente = await TrabajadorRepo.findOne(cedula);
        if (trabajadorExistente) {
            return res.status(409).json({ error: "La cédula ya está registrada en el sistema." });
        }

        // Usar el método de inserción del repositorio
        const trabajador = await TrabajadorRepo.insertTrabajador(nombreCompleto, cedula, salario, seguroSocial);

        // Enviar la respuesta
        res.status(201).json({ message: "Trabajador insertado correctamente", rowsAffected: trabajador });
    } catch (error) {
        console.error("Error al insertar trabajador:", error);
        res.status(500).json({ error: "Error al insertar trabajador" });
    }
};

const getTrabajadores = async (req, res) => {
    try {
        const { nombreCompleto, cedula, salarioMin, salarioMax } = req.body;
        // Usar el método de listado del repositorio
        const trabajadores = await TrabajadorRepo.getTrabajadores(nombreCompleto, cedula, salarioMin, salarioMax);

        // Enviar la respuesta
        res.status(200).json(trabajadores);
    } catch (error) {
        console.error("Error al obtener trabajadores:", error);
        res.status(500).json({ error: "Error al obtener trabajadores" });
    }
};


const getTrabxAmonest = async (req, res) => {
    try {
        
        // Usar el método de listado del repositorio
        const trabajadores = await TrabajadorRepo.getTrabxAmonest();

        // Enviar la respuesta
        res.status(200).json(trabajadores);
    } catch (error) {
        console.error("Error al obtener trabajadores:", error);
        res.status(500).json({ error: "Error al obtener trabajadores" });
    }
};

const getTrabajadorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Usar el método de obtener trabajador por ID del repositorio
        const trabajador = await TrabajadorRepo.getTrabajadorById(id);

        // Enviar la respuesta
        res.status(200).json(trabajador);
    } catch (error) {
        console.error("Error al obtener trabajador:", error);
        res.status(500).json({ error: "Error al obtener trabajador" });
    }
};

const getTrabajadorByCedula = async (req, res) => {
    try {
        const {cedula} = req.body;

        // Usar el método de obtener trabajador por ID del repositorio
        const trabajador = await TrabajadorRepo.getTrabajadorByCedula(cedula);

        // Enviar la respuesta
        res.status(200).json(trabajador);
    } catch (error) {
        console.error("Error al obtener trabajador:", error);
        res.status(500).json({ error: "Error al obtener trabajador" });
    }
};

const obtenerTrabajadoresMenuDesplegable = async (req, res) => {
    try {
        // Usar el método getMenu del repositorio
        const trabajadores = await TrabajadorRepo.getMenu();

        res.status(200).json(trabajadores);
    } catch (error) {
        console.error("Error al obtener todos los trabajadores para el menú desplegable:", error);
        res.status(500).json({ error: "Error al obtener todos los trabajadores para el menú desplegable" });
    }
};

const updateTrabajador = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idTrabajador, nombreCompleto, cedula, salario, seguroSocial } = req.body;

        // Usar el método de actualizar del repositorio
        const trabajador = await TrabajadorRepo.updateTrabajador(idTrabajador, nombreCompleto, cedula, salario, seguroSocial);

        // Enviar la respuesta
        res.status(200).json({ message: "Trabajador actualizado correctamente", rowsAffected: trabajador });
    } catch (error) {
        console.error("Error al actualizar trabajador:", error);
        res.status(500).json({ error: "Error al actualizar trabajador" });
    }
};

const deleteTrabajador = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({ error: "ID de trabajador no proporcionado" });
        }

        const rowsAffected = await TrabajadorRepo.deleteTrabajador(id);
        if (rowsAffected > 0) {
            res.status(200).json({ message: "Trabajador eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Trabajador no encontrado" });
        }
    } catch (error) {
        console.error("Error eliminando trabajador:", error);
        res.status(500).json({ error: "Error eliminando trabajador" });
    }
};

const getTrabajadoresEficientes = async (_req, res) => {
    try {

        const trabajadores = await TrabajadorRepo.getTrabajadoresEficientes();

        res.status(200).json(trabajadores);
    } catch (error) {
        console.error("Error al obtener todos los trabajadores:", error);
        res.status(500).json({ error: "Error al obtener todos los trabajadores" });
    }
};


export { getTrabajadoresEficientes, getTrabajadorByCedula, insertTrabajador, getTrabajadores, getTrabajadorById, updateTrabajador, deleteTrabajador, obtenerTrabajadoresMenuDesplegable,getTrabxAmonest };