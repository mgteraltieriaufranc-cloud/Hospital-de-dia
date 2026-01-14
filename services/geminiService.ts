
import { GoogleGenAI } from "@google/genai";

export const getSmartOrientation = async (userQuery: string) => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    Eres "Aconcagua-Concierge", el guía y facilitador oficial del sitio web del Hospital de Día. 
    Tu objetivo es ayudar al paciente a navegar el sitio y resolver dudas usando la información disponible en las secciones.

    CONTENIDO DEL SITIO PARA REFERENCIA:
    1. GESTIÓN/TURNOS: Judith Ponce (Lun-Vie 8-16hs). Centraliza turnos.
    2. ONCÓLOGOS: Dr. Dubersarsky, Dr. Ortiz, Dra. Di Sisto, Dra. Miranda.
    3. SALUD MENTAL: Mgter. Altieri Aufranc (Terapia ACT, Musicoterapia).
    4. PREPARACIÓN: Comer liviano, hidratación previa, ropa cómoda, manta personal.
    5. FUNDACIÓN: Dr. Claudio Dubersarsky y Escuela de Pacientes (Campanita).
    6. CONTACTO: WhatsApp +54 9 351 869-3409. Ubicación: Paraná 560 2do piso, Córdoba.

    REGLAS DE RESPUESTA:
    - Si preguntan por un médico específico, indícales que pueden encontrar su botón de "Pedir Turno" en la sección de "Staff de Oncología".
    - Si preguntan por Salud Mental, mencione a la Mgter. Altieri Aufranc y su sección dedicada.
    - Si es sobre trámites de APROSS, recuérdales que hay un botón naranja de "Novedades APROSS" arriba a la derecha.
    - Usa un tono extremadamente empático, claro y pedagógico.
    - Siempre termina indicando en qué sección de esta página pueden ampliar la información.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });
    
    return response.text || "Lo siento, no pude procesar la consulta. Por favor, intenta de nuevo o contacta a administración.";
  } catch (e) {
    console.error("Clinical AI Error:", e);
    return "Error en la conexión con el motor de orientación. Por favor, desplázate hacia abajo para ver la sección de contacto o llama al Hospital de Día.";
  }
};
