import express from 'express';
import Excel from 'exceljs';
const router = express.Router();

import authMiddleware from '../../middleware/authMiddleware.js';

import { CotizacionRepository } from '../../models/ventas/cotizacion.js';
const CotizacionRepo = new CotizacionRepository();

import { ClienteRepository } from "../../models/clientes/cliente.js";
const ClienteRepo = new ClienteRepository();

import { TrabajadorRepository } from '../../models/trabajadores/trabajadores.js';
const TrabajadorRepo = new TrabajadorRepository();

router.post('/generar-factura',authMiddleware, async (req, res) => {
    try {
        const formData = req.body; //recibe los datos enviado de react
        const fechaActual = new Date().toISOString().split('T')[0]; // FormatoYYYY-MM-DD
        const fileName = `Factura-${fechaActual}.xlsx`; //nombre de archivo con fecha

        const workbook = new Excel.Workbook(); //nuevo xlsx
        const worksheet = workbook.addWorksheet('Factura'); //hoja de trabajo excel y empezar a escibir

        //columnas
        worksheet.columns = [
            { header: 'Código de Orden', key: 'codigoOrden', width: 20 },
            { header: 'Descripción', key: 'descripcionOrden', width: 40 },
            { header: 'Fecha de Ingreso', key: 'fechaIngreso', width: 15 },
            { header: 'Fecha de Venta', key: 'fechaVenta', width: 15 },
            { header: 'Cliente', key: 'nombreCliente', width: 25 },
            { header: 'Vehículo', key: 'vehiculo', width: 25 },
            { header: 'Monto Total', key: 'montoTotal', width: 15 },
            { header: 'Dinero Vuelto', key: 'dineroVuelto', width: 15 },
            { header: 'Método de Pago', key: 'metodoPago', width: 20 }
        ];

        //fila de header en negrita
        worksheet.getRow(1).font = { bold: true };

        //Fila con datos segun los datos recibidos (formData)
        worksheet.addRow({
            codigoOrden: formData.codigoOrden || 'N/A',
            descripcionOrden: formData.descripcionOrden || 'N/A',
            fechaIngreso: formData.fechaIngreso ? formData.fechaIngreso.split('T')[0] : 'N/A',
            fechaVenta: formData.fechaVenta ? formData.fechaVenta.split('T')[0] : 'N/A',
            nombreCliente: formData.nombreCliente || 'N/A',
            vehiculo: formData.vehiculo || 'N/A',
            montoTotal: formData.montoTotal || 0,
            dineroVuelto: formData.dineroVuelto || 0,
            metodoPago: formData.metodoPago || 'Tarjeta'
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end(); //terminar edicion de archivo y retornar
    } catch (error) {
        console.error('Error al generar el archivo XLSX:', error);
        res.status(500).json({ error: 'Error al generar el archivo XLSX' });
    }
});

router.post('/descargar-cotizacion/:id',authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);//tomar el id de cotizacion
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

        //traer datos de BD
        const cotizacion = await CotizacionRepo.getCotizacionById(id);

        if (!cotizacion) {//cotizacion no existe
            return res.status(404).json({ error: 'Cotización no encontrada' });
        }

        const fechaActual = new Date().toISOString().split('T')[0]; // FormatoYYYY-MM-DD
        const fileName = `Factura-${fechaActual}.xlsx`; //nombre de archivo con fecha

        const workbook = new Excel.Workbook(); //nuevo xlsx
        const worksheet = workbook.addWorksheet('Factura'); //hoja de trabajo excel y empezar a escibir

        const formatDate = (fecha) => {
            if (!fecha) return 'N/A';
            const dateObj = new Date(fecha);
            return isNaN(dateObj.getTime()) ? 'N/A' : dateObj.toISOString().split('T')[0];
        };

        //columnas
        worksheet.columns = [
            { header: 'Cliente', key: 'nombreCliente', width: 25 },
            { header: 'Detalles', key: 'detalles', width: 40 },
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Monto Total', key: 'montoTotal', width: 20 },
            { header: 'Monto Mano de obra', key: 'montoManoObra', width: 40 },
        ];

        //fila de header en negrita
        worksheet.getRow(1).font = { bold: true };

        //Fila con datos segun los datos recibidos (formData)
        worksheet.addRow({
            nombreCliente: cotizacion.nombreCliente || 'N/A',
            detalles: cotizacion.detalles || 'N/A',
            fecha: formatDate(cotizacion.fecha),
            montoTotal: Number(cotizacion.montoTotal || 0).toFixed(2),
            montoManoObra: Number(cotizacion.montoManoObra || 0).toFixed(2),
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        res.send(buffer);
    } catch (error) {
        console.error('Error al generar el archivo XLSX:', error);
        res.status(500).json({ error: 'Error al generar el archivo XLSX' });
    }
});

router.get('/reporte-clientes-inactivos',authMiddleware, async (_req, res) => {
    try {
        const clientes = await ClienteRepo.getClientesInactivos();
        if (!Array.isArray(clientes) || clientes.length === 0) {
            return res.status(404).json({ error: 'No hay clientes inactivos para exportar' });
        }

        const fechaActual = new Date().toISOString().split('T')[0];
        const fileName = `ClientesInactivos-${fechaActual}.xlsx`;

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Clientes Inactivos');

        worksheet.columns = [
            { header: 'ID', key: 'idCliente', width: 10 },
            { header: 'Nombre Completo', key: 'nombreCliente', width: 30 },
            { header: 'Correo', key: 'correo', width: 30 },
            { header: 'Teléfono', key: 'telefono', width: 20 },
        ];
        worksheet.getRow(1).font = { bold: true };

        clientes.forEach(cliente => {
            worksheet.addRow({
                idCliente: cliente.idCliente || 'N/A',
                nombreCliente: cliente.nombreCliente || 'N/A',
                correo: cliente.correo || 'N/A',
                telefono: cliente.telefono || 'N/A'
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error al generar el reporte XLSX de clientes inactivos:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
});

router.get('/reporte-trabajadores-eficientes',authMiddleware, async (_req, res) => {
    try {
        // Obtenemos los datos de trabajadores eficientes
        // Se espera que getTrabajadoresEficientes retorne objetos con { nombreCompleto, cedula, totalOrdenes }
        const trabajadores = await TrabajadorRepo.getTrabajadoresEficientes();

        if (!Array.isArray(trabajadores) || trabajadores.length === 0) {
            return res.status(404).json({ error: 'No hay datos de trabajadores eficientes para exportar' });
        }

        // Genera el nombre del archivo usando la fecha actual
        const fechaActual = new Date().toISOString().split('T')[0];
        const fileName = `TrabajadoresEficientes-${fechaActual}.xlsx`;

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Trabajadores Eficientes');

        // Definir columnas del Excel
        worksheet.columns = [
            { header: 'Nombre Completo', key: 'nombreCompleto', width: 30 },
            { header: 'Cédula', key: 'cedula', width: 15 },
            { header: 'Total Ordenes', key: 'totalOrdenes', width: 15 },
        ];

        // Poner la fila de encabezado en negrita
        worksheet.getRow(1).font = { bold: true };

        // Agregar cada trabajador a una nueva fila
        trabajadores.forEach(trabajador => {
            worksheet.addRow({
                nombreCompleto: trabajador.nombreCompleto || 'N/A',
                cedula: trabajador.cedula || 'N/A',
                totalOrdenes: trabajador.totalOrdenes || 0
            });
        });

        // Convertir el workbook a buffer y enviar la respuesta
        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(buffer);

    } catch (error) {
        console.error('Error al generar el reporte XLSX de trabajadores eficientes:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
});


export default router;