export type LeadStatus = "new" | "assigned" | "contacted" | "won" | "lost";

export type LeadSource = "property" | "contact" | "manual" | "hero";

export type NotifyStatus = "pending" | "sent" | "failed" | "skipped";

export interface Lead {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  source: LeadSource;
  propertyId?: string;
  propertySlug?: string;
  propertyTitle?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  message?: string;
  goal?: string;
  propertyType?: string;
  budget?: string;
  district?: string;
  assignedSalesId?: string;
  assignedAt?: string;
  notes?: string;
  notifyStatus?: NotifyStatus;
  notifiedAt?: string;
  notifyError?: string;
}

export interface CreateLeadInput {
  source: LeadSource;
  propertyId?: string;
  propertySlug?: string;
  propertyTitle?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  message?: string;
  goal?: string;
  propertyType?: string;
  budget?: string;
  district?: string;
  notes?: string;
  /** أولي أو إعادة بيع — لتوزيع المندوب */
  saleCategory?: "primary" | "resale";
}

export interface LeadCreateResponse {
  lead: Lead;
  assignedRep?: {
    id: string;
    name: string;
    whatsapp: string;
  };
  /** تم إرسال إشعار تليجرام للمندوب */
  salesNotified?: boolean;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  assignedSalesId?: string | null;
  notes?: string;
}
