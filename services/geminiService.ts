
import { GoogleGenAI } from "@google/genai";

export const getSmartOrientation = async (userQuery: string) => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    Eres "Aconcagua-Evidence", el asistente de orientación de alta precisión del Hospital de Día. 
    Tu motor de respuestas debe emular sistemas de evidencia profesional.
    
    PERFIL INSTITUCIONAL:
    - Centro: Hospital de Día (Ubicado en Sanatorio Aconcagua).
    - Referente Administrativa: Judith Ponce (Lunes a viernes 8:00 - 16:00 hs).
    - Oncólogos: Dr. Dubersarsky, Dr. Ortiz, Dra. Di Sisto, Dra. Miranda.
    - Salud Mental: Mgter. Altieri Aufranc (Terapia ACT, Musicoterapia).

    POLÍTICAS HUMANITARIAS:
    - En el Hospital de Día la prioridad es el cuidado humano y el acompañamiento emocional.
    - La atención está centrada en la persona, no solo en la enfermedad.

    PROTOCOLO DE RESPUESTA:
    1. ESTRUCTURA: Usa encabezados claros.
    2. TONO: Humano, empático, claro y no robótico. Siempre refiérete al centro como "Hospital de Día".
    3. CONTENIDO:
       - Si es sobre preparación: Cita los protocolos de alimentación liviana y descanso.
       - Si es sobre turnos: Deriva a Judith Ponce.
       - Si es sobre urgencias: Aclara que los sobreturnos son solo para emergencias oncológicas (fiebre alta, dolor intenso).
    4. SEGURIDAD: Siempre aclara que la información es ORIENTATIVA y que el oncólogo de cabecera es la autoridad final.
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
    
    // Access response.text property directly
    return response.text || "No se ha podido generar una respuesta en este momento.";
  } catch (e) {
    console.error("Clinical AI Error:", e);
    return "Error en la conexión con el motor de evidencia. Por favor, consulte al personal de planta o llame al Hospital de Día.";
  }
};
