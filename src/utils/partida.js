import { useStore } from "@/store/store";
import { creaProductores, crearManagers } from "@/utils/creaObjetos";
import ls from "localStorage-slim";
ls.config.encrypt = false;

const almacenarDatosStore = (datos) => {
  const { recursos, productores, managers } = datos;
  const store = useStore();
  store.recursos = recursos;
  store.productores = [...productores];
  store.managers = [...managers];
};

const actualizarDatosStore = (datos) => {
  const { recursos_guardados, productores_guardados, managers_guardados } =
    datos;
  const store = useStore();
  store.recursos = recursos_guardados;

  //va a pisar solo los datos que se guardan
  store.productores = store.productores.map((ele, i) => {
    return { ...ele, ...productores_guardados[i] };
  });

  store.managers = store.managers.map((ele, i) => {
    return { ...ele, ...managers_guardados[i] };
  });

};

//guarda datos en de la store en localStorage
export const guardarDatos = () => {
  const store = useStore();
  // const datos = {
  //   recursos_guardados: store.recursos,
  //   productores_guardados: store.getProductores,
  //   managers_guardados: store.managers,
  // };

  //para guardar en local o base de datos
  const datos_guardar = {
    recursos_guardados: store.recursos,
    productores_guardados: store.getDatosGuardarProductores,
    managers_guardados: store.getDatosGuardarManagers,
  };

  console.log("datos_guardar", datos_guardar);
  console.log("Los datos han sido guardados");
  //window.localStorage.setItem("datos", JSON.stringify(datos));
  ls.set("datos_guardados", JSON.stringify(datos_guardar));
};

//lee Datos guardados en la localStorage
export const leerDatos = () => {
  //const datos = JSON.parse(window.localStorage.getItem("datos"));
  try {
    const datos_localstorage = ls.get("datos_guardados");

    if (datos_localstorage) {
      console.log("leyendo datos", datos_localstorage);
      return JSON.parse(datos_localstorage);
    }
    console.log("no habia datos");
    return;
  } catch (e) {
    //intentar leer datos, si estan corruptos borrarlos
    console.log("peto al leer los datos", e);
    ls.remove("datos");
    return;
  }
};

const datosIniciales = () => {
  const datos = {
    recursos: 999999,
    productores: creaProductores(),
    managers: crearManagers(),
  };
  return datos;
};

export const importData = () => {
  almacenarDatosStore(datosIniciales());
  if (leerDatos()) actualizarDatosStore(leerDatos());
};

export const reiniciarJuego = () => {
  almacenarDatosStore(datosIniciales());
  guardarDatos();
};

//retorna true si hay datos
export const haydatos = () => {
  let datos = leerDatos();
  if (datos) return true;
  return false;
};
