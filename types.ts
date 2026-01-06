
export interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  icon: string;
  category: 'administrativo' | 'asistencial' | 'comunidad';
}

export interface OrientationMessage {
  role: 'user' | 'assistant';
  content: string;
}
