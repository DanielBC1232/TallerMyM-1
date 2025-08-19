import sql from 'mssql';
import { connectDB } from '../../config/database.js';

export class VehiculosCompatibles {
    constructor(idVehiculos, modelo) {
        this.idVehiculos = idVehiculos;
        this.modelo = modelo;
    }
}

export class VehiculoRepository {
    // Obtener todas los vehiculos
    async getAll() {
        try {
            const pool = await connectDB();
            const result = await pool.request().query("SELECT * FROM VEHICULOS_COMPATIBLES");
            return result.recordset;
        }
        catch (error) {
            console.error("Error en getAll:", error);
            throw new Error("Error al obtener vehiculos");
        }
    }

    async findById(idVehiculos) {
        try {
            const pool = await connectDB();
            const result = await pool
                .request()
                .input("idVehiculos", sql.Int, idVehiculos) // Parametros
                .query("SELECT * FROM VEHICULOS_COMPATIBLES WHERE idVehiculos = @idVehiculos");
            return result.recordset.length > 0 ? result.recordset[0] : null;
        }
        catch (error) {
            console.error(" Error en findById:", error);
            throw new Error("Error al obtener categoría por ID");
        }
    }
}