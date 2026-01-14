
import { GoogleGenAI } from "@google/genai";

export const getSmartOrientation = async (userQuery: string) => {
  // Inicialización interna para máxima compatibilidad con inyección de llaves en Google Sites
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    Eres "Aconcagua-Concierge", el guía y facilitador oficial del Hospital de Día Sanatorio Aconcagua. 
    Tu objetivo es ayudar al paciente a navegar el sitio y resolver dudas usando la información disponible en esta página.

    DATOS CLAVE:
    1. GESTIÓN/TURNOS: Judith Ponce (Lun-Vie 8-16hs). Centraliza turnos.
    2. ONCÓLOGOS: Dr. Dubersarsky, Dr. Ortiz, Dra. Di Sisto, Dra. Miranda.
    3. SALUD MENTAL: Terapeuta Altieri Aufranc (Hombre). Terapia ACT y Musicoterapia.
    4. PREPARACIÓN: Comer liviano, hidratación, ropa cómoda, manta personal.
    5. APROSS: Guía de empadronamiento disponible al final de la página.
    6. PAMI: Botón de acceso directo a prestadores arriba a la izquierda.

    REGLAS:
    - Respuestas breves (máx 3 frases).
    - Indica siempre en qué sección está la información.
    - Tono empático y profesional.
    - El Terapeuta Altieri es hombre.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
      }
    });
    
    return response.text || "No pude procesar la consulta. Intenta reformularla o contacta a Judith en Administración.";
  } catch (e) {
    console.error("Clinical AI Connectivity Error:", e);
    throw new Error("Error de conexión. Intenta de nuevo.");
  }
};
