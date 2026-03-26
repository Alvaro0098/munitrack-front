import { useState, useRef } from "react";

export const useForm = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const initialDataRef = useRef(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  /**
   * Validar y enviar formulario
   * @param {function} onSuccess - Callback ejecutado si validación pasa
   * @param {function} onError - (Opcional) Callback ejecutado si onSuccess falla
   */
  const handleSubmit = async (onSuccess, onError) => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSuccess(formData);
      } catch (error) {
        // Si onSuccess falla y hay un callback onError, ejecutarlo
        if (onError) {
          onError(error, setServerErrors);
        } else {
          // Si no hay handler de error, relanzar
          throw error;
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  /**
   * Setear errores desde el servidor (ej: DNI duplicado)
   * @param {object} serverErrors - Objeto con errores del servidor { DNI: "Ya existe...", Email: "..." }
   */
  const setServerErrors = (serverErrors) => {
    setErrors((prevErrors) => ({ ...prevErrors, ...serverErrors }));
  };

  /**
   * Limpiar todos los errores del formulario
   */
  const clearErrors = () => {
    setErrors({});
  };

  /**
   * Guardar el estado actual del formulario como "inicial" (para detectar cambios)
   * Se usa cuando se carga data para edición
   */
  const saveInitialState = () => {
    initialDataRef.current = { ...formData };
  };

  /**
   * Detectar si el formulario fue modificado respecto al estado inicial
   * @returns {boolean} true si hay cambios, false si es igual al inicial
   */
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
  };

  return { formData, setFormData, errors, handleChange, handleSubmit, setServerErrors, clearErrors, saveInitialState, hasChanges };
};

//headless ui
//useForm le devuelve al componente un kit de herramientas completo para manejar formularios de manera eficiente, incluyendo el estado actual del formulario, los errores de validación, y funciones para manejar cambios y envíos. Esto permite que los componentes que lo utilizan se centren en la lógica específica de su formulario sin preocuparse por la gestión del estado o la validación, haciendo el código más limpio y reutilizable.   
// El componente esta en constante comunicacion con el hook, cada vez que el usuario interactua con el formulario, el hook se encarga de actualizar el estado y validar los datos, proporcionando una experiencia de usuario fluida y consistente.  
//Desde que se despliega el modal, se inicializa la instancia del hook
//actua como observador de los cambios en el formulario, cada vez que el usuario modifica un campo, el hook actualiza su estado interno y valida los datos, manteniendo el componente sincronizado con el estado del formulario y sus errores.
//handleChange se vincula a cada uno de los inputs, captura cada cambio y actualiza el estado interno del hook
//handleSubmit se encarga de validar los datos y ejecutar la acción de confirmación solo si no hay errores, asegurando que el componente que utiliza el hook pueda centrarse en la lógica específica del formulario sin preocuparse por la gestión del estado o la validación.

//ejemplo: 
// Mensaje de error debajo del input de observación
// el usuario realiza un cambio en el input
// el navegador registra el evento onChange y llama a handleChange
// le pasa el nombre del campo (observacion) y el nuevo valor ingresado
// handleChange actualiza el estado formData con el nuevo valor para observacion
// si había un error previo para ese campo, lo elimina del estado errors
// el componente se vuelve a renderizar con el nuevo estado, mostrando el nuevo valor y ocultando el mensaje de error si es que se corrigió el problema.
// el hook recibe la informacion,actualiza su estado interno y se la devuelve al componente, que a su vez se encarga de mostrarla al usuario. Esto crea un ciclo de comunicación constante entre el hook y el componente, donde el hook actúa como el cerebro que maneja la lógica del formulario, mientras que el componente es la interfaz que interactúa con el usuario.
// el hook centraliza la logica 




//useForm es un custom hook que maneja el estado de un formulario, validación y cambios en los campos. Se le pasa un estado inicial y una función de validación, y devuelve el estado del formulario, errores, y funciones para manejar cambios y envíos.   
// En ModalsIncidence.jsx, se utiliza useForm para gestionar el estado del formulario de incidencia, validando campos como área y observación antes de permitir la confirmación.
// En ProtectedRoute.jsx, se utiliza useAuth para verificar si el usuario está autenticado. Si no lo está, se redirige a la página de login. Si lo está, se renderiza el componente hijo a través de Outlet.    
// En CreateOperator.jsx, se utiliza useAuth para obtener el token y el rol del usuario. Solo los superadministradores pueden ver el botón para registrar un nuevo operador, y se maneja la eliminación de operadores con confirmación y manejo de errores. 
// En RouterPrincipal.jsx, se importa ProtectedRoute para proteger ciertas rutas y asegurar que solo los usuarios autenticados puedan acceder a ellas.  
// En Incidence.jsx, se maneja la carga de incidencias, la apertura de modales para crear o editar incidencias, y la eliminación directa con confirmación. Se utiliza useState para manejar el estado de las incidencias, la carga y la configuración del modal.    
// En resumen, estos archivos muestran cómo se utilizan hooks personalizados y de React para manejar la autenticación, el estado del formulario, la validación y la gestión de datos en una aplicación React.   




//