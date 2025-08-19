import { UsuarioRepository } from "../../models/administrativo/admin.js";

const UsuarioRepo = new UsuarioRepository();

// Registrar un usuario
const registrarUsuario = async (req, res) => {
  try {
    const { username, email, cedula, password } = req.body;//parametros
    //------
    await UsuarioRepo.insertUser(username, email, cedula, password);

    res.status(201).json();
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ 
        error: error.message,
        reason: error.reason || "conflict"
      });
    }
    console.error("Error al insertar usuario:", error);
    res.status(500).json({ error: "Error al insertar el usuario" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const { username, email, idRol, password } = req.body;
    const usuario = await UsuarioRepo.updateUsuario(idUsuario, username, email, idRol, password);

    res.status(200).json(usuario);
  } catch (error) {
    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado o no se pudo actualizar" });
    }
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar los datos del usuario" });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { idUsuario, isLocked } = req.body;//parametros

    const usuario = await UsuarioRepo.cambiarEstadoUsuario(idUsuario, isLocked);

    res.status(200).json(usuario);
  } catch (error) {
    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado o no se pudo eliminar" });
    }
    console.error("Error al eliminar Usuario:", error);
    res.status(500).json({ error: "Error al eliminar Usuario" });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    // Usar el método getAll del repositorio
    const usuarios = await UsuarioRepo.getAll();

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    res.status(500).json({ error: "Error al obtener todos los usuarios" });
  }
};

// Obtener un usuario por ID
const obtenerUsuario = async (req, res) => {
  try {
    // Usar el método getOneByID del repositorio
    const id = parseInt(req.params.id);
    const usuario = await UsuarioRepo.getOneByID(id);

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  const resultado = await UsuarioRepo.iniciarSesion(email, password);

  if (resultado.statusCode === 200) {
    return res.status(200).json(resultado.data);
  }

  return res.status(resultado.statusCode).json({ message: resultado.message });
};

const enviarCorreoToken = async (req, res) => {
  try {
    const { email } = req.body;

    const resultado = await UsuarioRepo.enviarCorreoToken(email);

    if (!resultado) {
      return res.status(404).json({ error: "Correo no encontrado o no se pudo actualizar" });
    }

    res.status(200).json({ mensaje: "Token enviado exitosamente al correo" });

  } catch (error) {
    console.error("Error en enviarCorreoToken:", error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
};


const verificarToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    const resultado = await UsuarioRepo.verificarToken(email, token);
    if (resultado) {
      res.status(200).json({ mensaje: "Token verificado correctamente" });
    } else if (!resultado) {
      res.status(404).json({ mensaje: "Token incorrecto" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al validar token" });
  }
}

const updateContrasena = async (req, res) => {
  try {
    const { email, password } = req.body;

    const resultado = await UsuarioRepo.updateContrasena(email, password);
    if (resultado) {
      res.status(200).json(true);
    } else if (!resultado) {
      res.status(404).json(false);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar constrasena" });
  }
}

export {
  registrarUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  obtenerUsuarios,  //plural
  obtenerUsuario, //singular
  iniciarSesion,
  enviarCorreoToken,
  verificarToken,
  updateContrasena
};