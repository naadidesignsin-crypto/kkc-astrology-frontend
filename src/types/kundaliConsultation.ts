export type KundaliConsultationStatus =
  | "WHATSAPP_MESSAGE_CREATED"
  | "WHATSAPP_OPENED"
  | "CONSULTED"
  | "CLOSED";

export type KundaliConsultationCreateRequest = {
  sectionName: string;
};

export type KundaliConsultationResponse = {
  consultationId: number;
  reportId: number;
  orderId: string;
  fullName: string;
  gender: string;
  birthPlace: string;
  dateOfBirth: string;
  timeOfBirth: string;
  sectionName: string;
  whatsappNumber: string;
  whatsappUrl: string;
  whatsappMessage: string;
  status: KundaliConsultationStatus;
  createdAt: string;
  updatedAt: string;
};
