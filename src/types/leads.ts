export type LeadStatus = "new" | "assigned" | "contacted" | "won" | "lost";

export type LeadSource = "property" | "contact" | "manual";

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
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  assignedSalesId?: string | null;
  notes?: string;
}
