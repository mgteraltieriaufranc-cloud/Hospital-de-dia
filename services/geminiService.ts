
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartOrientation = async (userQuery: string) => {
  const prompt = `
    Actúa como un asistente de orientación oncológica profesional y empático para un Hospital de Día.
    Tu objetivo es ayudar al usuario a encontrar la sección o profesional correcto.
    
    Contexto Institucional:
    - Referente Administrativa: Judith Ponce.
    - Médicos Oncólogos: Dr. Dubersarsky, Dr. Ortiz, Dra. Di Sisto, Dra. Miranda.
    - Salud Mental: Mgter. Altieri Aufranc (ACT, Musicoterapia).
    
    Secciones/Servicios:
    1. Gestión Administrativa: Horarios y trámites con Judith Ponce.
    2. Información de Sesión: Preparación, durante y después del tratamiento.
    3. Oncología: Turnos con el staff médico.
    4. Hospital de Día: Quimioterapia, infusiones, hierro.
    5. Apoyo Emocional/Salud Mental: Espacio con la Mgter. Altieri Aufranc.
    6. Turnos y Consultas: Centralización de pedidos.

    Responde de forma cálida, humana y profesional. Máximo 2 párrafos.
    Si mencionas a un profesional, hazlo con su título (Dr./Dra./Mgter.).
    No brindes consejos médicos ni prometas atención inmediata.
    
    Consulta del usuario: "${userQuery}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (e) {
    console.error("Error en la orientación IA:", e);
    return "Lo sentimos, no pudimos procesar tu consulta. Por favor, utiliza los botones de las secciones principales para dirigirte al área correspondiente.";
  }
};
