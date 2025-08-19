import { DashboardRepository } from '../../models/finanzas/Dashboard.js';

const DashRepo = new DashboardRepository();

const getGananciaMes = async (_req, res) => {
    try {
        const data = await DashRepo.getGananciaMes();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error en getGananciaMes:", error);
        res.status(500).json({ error: "Error al obtener la ganancia mensual" });
    }
};

const getGananciasMes = async (_req, res) => {
    try {
        const data = await DashRepo.getGananciasMes();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error en getGananciasMes:", error);
        res.status(500).json({ error: "Error al obtener historial de ganancias" });
    }
};

const getGastoMes = async (_req, res) => {
    try {
        const data = await DashRepo.getGastoMes();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error en getGastoMes:", error);
        res.status(500).json({ error: "Error al obtener el gasto mensual" });
    }
};

const getGastosMes = async (_req, res) => {
    try {
        const data = await DashRepo.getGastosMes();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error en getGastosMes:", error);
        res.status(500).json({ error: "Error al obtener historial de gastos" });
    }
};

const getTopVentas = async (_req, res) => {
    try {
        const data = await DashRepo.getTopVentas();
        res.status(200).json(data);
    } catch (error) {
        console.error("C-Error en getTopVentas:", error);
        res.status(500).json({ error: "Error al obtener top de ventas" });
    }
};

export {
    getGananciaMes,
    getGananciasMes,
    getGastoMes,
    getGastosMes,
    getTopVentas
};
