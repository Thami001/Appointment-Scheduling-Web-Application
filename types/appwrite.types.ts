import { Models } from "node-appwrite";

export interface Client extends Models.Document {
    userId: string;
    name: string;
    email: string;
    phone: string;
    birthDate: Date;
    gender: Gender;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    primaryTechnician: string;
    identificationType: string | undefined;
    identificationNumber: string | undefined;
    privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
    patient: Client;
    schedule: Date;
    status: Status;
    primaryTechnician: string;
    reason: string;
    note: string;
    userId: string;
    cancellationReason: string | null;
}