import type { Agent } from "@/types";
import { company } from "./company";

/** تخصصات الاستشارة — بدون أسماء أو صور */
export const agents: Agent[] = [
  {
    id: "a1",
    name: { en: "DAM Properties", ar: "دي إيه إم للعقارات" },
    role: {
      en: "Rock Villa & residential districts",
      ar: "روك فيلا والأحياء السكنية",
    },
    phone: company.phone,
    email: company.email,
    whatsapp: company.whatsapp,
  },
  {
    id: "a2",
    name: { en: "DAM Properties", ar: "دي إيه إم للعقارات" },
    role: {
      en: "New Obour — Reveal & Jazeel",
      ar: "العبور الجديدة — ريفيل وجزيل",
    },
    phone: company.phone,
    email: company.email,
    whatsapp: company.whatsapp,
  },
  {
    id: "a3",
    name: { en: "DAM Properties", ar: "دي إيه إم للعقارات" },
    role: {
      en: "Golf City — Zaghloul Holding",
      ar: "جولف سيتي — زغلول هولدينج",
    },
    phone: company.phone,
    email: company.email,
    whatsapp: company.whatsapp,
  },
  {
    id: "a4",
    name: { en: "DAM Properties", ar: "دي إيه إم للعقارات" },
    role: {
      en: "Legal & finance advisory",
      ar: "تمويل وقانون عقاري",
    },
    phone: company.phone,
    email: company.email,
    whatsapp: company.whatsapp,
  },
];
