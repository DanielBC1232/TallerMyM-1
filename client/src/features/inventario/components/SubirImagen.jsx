import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Uploader } from "rsuite";
import Swal from "sweetalert2";
import { PiUploadSimpleThin } from "react-icons/pi";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const SubirImagen = forwardRef((props, ref) => {
  const {
    preview: initialPreview = null,
    setPreview = () => {},
    className = "",
    currentImage = "",
  } = props;

  const [fileInfo, setFileInfo] = useState(null); // Guarda la info del archivo seleccionado por el usuario
  const [fileList, setFileList] = useState([]);
  const [internalPreview, setInternalPreview] = useState(initialPreview);

  // Variable para saber si el usuario ha seleccionado un nuevo archivo
  const [hasNewFile, setHasNewFile] = useState(false);
  // Variable para saber si el usuario ha borrado explícitamente la imagen
  const [imageCleared, setImageCleared] = useState(false);

  useEffect(() => {
    setInternalPreview(initialPreview);
  }, [initialPreview]);

  // Si hay una imagen actual y no se ha seleccionado un nuevo archivo, mostrar la imagen actual
  useEffect(() => {
    if (currentImage && !hasNewFile && !imageCleared) {
      setInternalPreview(`${import.meta.env.VITE_API_URL}/img/${currentImage}`);
    } else if (!currentImage && !hasNewFile && !imageCleared) {
        setInternalPreview(null); // Si no hay currentImage y no hay nueva, asegurarse de que no haya preview
    }
  }, [currentImage, hasNewFile, imageCleared]);

  useImperativeHandle(ref, () => ({
    async uploadAll() {
      if (!fileInfo) return null; // Si no hay un archivo nuevo seleccionado, no subir nada.

      const fd = new FormData();
      fd.append("img", fileInfo.nativeFile);

      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/img/upload`, {
          method: "POST",
          body: fd,
        });
        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.error || "Error al subir la imagen.");
        }
        const data = await resp.json();
        setHasNewFile(false); // Resetear después de subir
        setImageCleared(false); // Resetear después de subir
        return data.fileName;
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        Swal.fire({
          icon: "error",
          title: "Error de Subida",
          text: error.message || "Hubo un problema al subir la imagen.",
        });
        return null;
      }
    },
    clearImage() {
      setFileInfo(null);
      setFileList([]);
      setInternalPreview(null);
      setPreview(null);
      setHasNewFile(false);
      setImageCleared(true); // Indicar que la imagen ha sido borrada
    },
    // Nuevos métodos para el componente padre
    hasNewFileSelected() {
      return hasNewFile;
    },
    isImageCleared() {
        return imageCleared;
    },
  }));

  function validateFile(native) {
    const { type, size } = native;
    if (!ALLOWED_TYPES.includes(type)) {
      Swal.fire({
        icon: "warning",
        title: "Archivo inválido",
        text: `Tipo detectado: ${type}. Solo PNG, JPEG o JPG permitidos`,
      });
      return false;
    }
    if (size > MAX_SIZE) {
      Swal.fire({
        icon: "warning",
        title: "Archivo demasiado grande",
        text: "La imagen no puede ser mayor a 5MB",
      });
      return false;
    }
    return true;
  }

  function handleChangeList(list) {
    if (list.length === 0) {
      setFileInfo(null);
      setFileList([]);
      setInternalPreview(null);
      setPreview(null);
      setHasNewFile(false);
      setImageCleared(true); // Se borró la selección
      return;
    }
    const f = list[0];
    const native = f.blobFile || f.file;

    if (!native || !(native instanceof File)) {
      console.warn("No se pudo obtener el archivo nativo:", f);
      setHasNewFile(false);
      setImageCleared(false);
      return;
    }

    if (!validateFile(native)) {
      setFileInfo(null);
      setFileList([]);
      setInternalPreview(null);
      setPreview(null);
      setHasNewFile(false);
      setImageCleared(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setInternalPreview(reader.result);
      setPreview(reader.result);
      setFileInfo({ rsFile: f, nativeFile: native });
      setFileList([f]);
      setHasNewFile(true); // Se ha seleccionado un nuevo archivo
      setImageCleared(false); // No se ha borrado la imagen
    };
    reader.readAsDataURL(native);
  }

  return (
    <Uploader
      className={className}
      action=""
      autoUpload={false}
      fileList={fileList}
      fileListVisible={false}
      multiple={false}
      onChange={handleChangeList}
    >
      <button type="button" style={{ width: 220, height: 220 }}>
        {internalPreview ? (
          <img
            src={internalPreview}
            width="100%"
            height="100%"
            alt="preview"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <PiUploadSimpleThin style={{ fontSize: 160 }} />
        )}
      </button>
    </Uploader>
  );
});

export default SubirImagen;