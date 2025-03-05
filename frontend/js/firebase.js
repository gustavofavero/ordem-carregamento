// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1xFDxC2ZMTJe0Rvk0wKGLrMjWuL4i03k",
  authDomain: "sistema-transportes.firebaseapp.com",
  projectId: "sistema-transportes",
  storageBucket: "sistema-transportes.firebasestorage.app",
  messagingSenderId: "429175160328",
  appId: "1:429175160328:web:a0229f74d6657755f81bbd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para salvar dados no Firestore Database
async function salvarTransportadora(dados) {
    try {
        await addDoc(collection(db, "transportadoras"), dados);
        alert("Cadastro salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar: ", error);
    }
}

// Exporta a função para ser usada no HTML
export { salvarTransportadora };
