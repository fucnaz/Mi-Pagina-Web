// ============================================================================
// CONFIGURACIÓN DE FIREBASE AUTHENTICATION (Google Sign-In)
// ============================================================================
// INSTRUCCIONES PARA ACTIVAR GOOGLE SIGN-IN:
// 1. Ve a https://console.firebase.google.com/ y crea un proyecto (o usa uno existente).
// 2. En el menú lateral, ve a "Compilación" -> "Authentication" y haz clic en "Comenzar".
// 3. En la pestaña "Sign-in method", activa el proveedor "Google" y guarda.
// 4. Ve a la Configuración del Proyecto (icono de engranaje ⚙️) -> "Tus apps" -> "Agregar app web (</>)".
// 5. Copia tu objeto "firebaseConfig" y reemplaza los valores a continuación:
// ============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Credenciales oficiales de Firebase para Spectra Code:
export const firebaseConfig = {
  apiKey: "AIzaSyBltlehrAwmIALhcvNF4EVk5AnSGvmogmE",
  authDomain: "spectracode-c52a2.firebaseapp.com",
  projectId: "spectracode-c52a2",
  storageBucket: "spectracode-c52a2.firebasestorage.app",
  messagingSenderId: "977274196690",
  appId: "1:977274196690:web:b21c170ed15d7b2bd4930b",
  measurementId: "G-W926JZ034Q"
};

// Verificar si las credenciales fueron reemplazadas
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "TU_API_KEY_AQUI" && 
    firebaseConfig.authDomain && 
    !firebaseConfig.authDomain.includes("TU_PROYECTO")
  );
};

let app = null;
let auth = null;
const provider = new GoogleAuthProvider();

// Configuración opcional del proveedor de Google
provider.setCustomParameters({
  prompt: 'select_account'
});

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.warn("⚠️ Firebase Auth: Las credenciales en firebase-config.js son valores por defecto. Por favor configura tus credenciales de Firebase Console.");
  }
} catch (error) {
  console.error("Error inicializando Firebase:", error);
}

/**
 * Iniciar sesión con cuenta de Google (Gmail)
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("CONFIG_NEEDED");
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error("Error en Google Sign-In:", error);
    throw error;
  }
}

/**
 * Cerrar sesión actual
 */
export async function logoutUser() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
}

/**
 * Escucha cambios en el estado de autenticación (iniciar sesión, cerrar sesión, restaurar sesión)
 * @param {Function} callback Función que recibe (user) o (null)
 */
export function onAuthStateChangedListener(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export { auth, provider };
