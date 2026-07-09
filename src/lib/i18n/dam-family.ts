import type { Locale } from "@/types";

const ar = {
  headline: "دام فاميلي",
  lead: "مجتمع عملاء DAM — برنامج ولاء لمن اشتروا أو يحجزون معنا في العبور. مزايا حصرية، متابعة شخصية، وفعاليات خاصة لعائلتنا.",
  tagline: "مش مجرد صفقة — علاقة طويلة المدى",
  intro: [
    "دام فاميلي هو برنامجنا لعملاء دي إيه إم للعقارات: من لحظة الحجز أو الشراء، بتبقى جزء من مجتمع بيتشارك التجارب، الأولويات في المعاينات، وعروض الشركاء في العبور.",
    "سواء اخترت وحدة أولي بالتقسيط أو إعادة بيع جاهزة، فريقنا يتابع معاك بعد التعاقد — من تسليم الوحدة لحد ما تستقر في بيتك الجديد.",
  ],
  stats: [
    { value: "+350", label: "عميل", sub: "انضموا للبرنامج" },
    { value: "VIP", label: "معاينات", sub: "أولوية حجز" },
    { value: "24/7", label: "دعم", sub: "واتساب ومتابعة" },
    { value: "مجاني", label: "العضوية", sub: "لعملاء DAM" },
  ],
  benefits: [
    {
      title: "أولوية في المعاينات",
      desc: "حجز معاينات خاصة ومواعيد مرنة في جولف سيتي وروك فيلا ومشاريع العبور الجديدة قبل العرض العام.",
    },
    {
      title: "متابعة ما بعد البيع",
      desc: "تنسيق التسليم، متابعة التشطيب، وربطك بخدمات ما بعد التعاقد — تشطيب، تأثيث، أو تأجير.",
    },
    {
      title: "عروض شركاء حصرية",
      desc: "خصومات على التشطيب، الديكور، النقل، والتأمين مع شبكة موردين موثوقين في العبور والقاهرة.",
    },
    {
      title: "فعاليات ودعوات",
      desc: "جولات في الكمبوندات، لقاءات مع المطورين، وورش استثمار عقاري لأعضاء دام فاميلي فقط.",
    },
    {
      title: "برنامج الإحالة",
      desc: "ادعُ صديقاً يشتري مع DAM واحصل على مكافآت ومزايا إضافية عند إتمام صفقته.",
    },
    {
      title: "خط ساخن VIP",
      desc: "قناة تواصل مباشرة مع فريق المبيعات والعمليات — رد سريع على استفساراتك العقارية.",
    },
  ],
  steps: [
    { title: "احجز أو اشترِ", desc: "أي وحدة أولي أو إعادة بيع عبر دي إيه إم للعقارات." },
    { title: "انضم مجاناً", desc: "نسجّلك في البرنامج تلقائياً بعد توقيع العقد." },
    { title: "استمتع بالمزايا", desc: "معاينات VIP، عروض الشركاء، ومتابعة حتى التسليم." },
  ],
  who: {
    title: "مين ينضم؟",
    items: [
      "مشتري وحدة سكنية أو تجارية جديدة من المطور (أولي)",
      "مشتري وحدة إعادة بيع جاهزة عبر DAM",
      "مستثمر بأكثر من وحدة في العبور",
      "عائلات تبحث عن متابعة شاملة من الحجز للتسليم",
    ],
  },
  cta: {
    title: "جاهز تنضم لعائلتنا؟",
    lead: "تواصل معنا واحجز استشارتك — ولو اشتريت معانا قبل كده، اسألنا عن مزايا دام فاميلي.",
    primary: "انضم لدام فاميلي",
    secondary: "تصفح العقارات",
  },
};

const en = {
  headline: "DAM Family",
  lead: "The DAM client community — a loyalty program for buyers and reservers in Obour. Exclusive perks, personal follow-up, and members-only events.",
  tagline: "More than a deal — a long-term relationship",
  intro: [
    "DAM Family is our program for DAM Properties clients: from reservation or purchase, you join a community with priority viewings, shared experiences, and partner offers across Obour.",
    "Whether you choose a primary installment unit or a ready resale home, our team stays with you after signing — from handover until you're settled in.",
  ],
  stats: ar.stats,
  benefits: [
    {
      title: "Priority viewings",
      desc: "Private tours and flexible slots at Golf City, Rock Villa, and New Obour projects before public release.",
    },
    {
      title: "Post-sale follow-up",
      desc: "Handover coordination, finishing updates, and trusted referrals for fit-out, furnishing, or leasing.",
    },
    {
      title: "Partner offers",
      desc: "Discounts on finishing, décor, moving, and insurance through our vetted partner network.",
    },
    {
      title: "Events & invites",
      desc: "Compound tours, developer meetups, and investment workshops for DAM Family members only.",
    },
    {
      title: "Referral rewards",
      desc: "Invite a friend who buys with DAM and unlock extra perks when their deal closes.",
    },
    {
      title: "VIP hotline",
      desc: "Direct line to sales and operations — fast answers to your property questions.",
    },
  ],
  steps: [
    { title: "Reserve or buy", desc: "Any primary or resale unit through DAM Properties." },
    { title: "Join free", desc: "We enroll you automatically after contract signing." },
    { title: "Enjoy perks", desc: "VIP viewings, partner deals, and follow-up through delivery." },
  ],
  who: {
    title: "Who can join?",
    items: [
      "Buyers of new developer units (primary)",
      "Buyers of ready resale units through DAM",
      "Investors with multiple units in Obour",
      "Families who want end-to-end support from booking to handover",
    ],
  },
  cta: {
    title: "Ready to join the family?",
    lead: "Get in touch for a consultation — already bought with us? Ask about your DAM Family benefits.",
    primary: "Join DAM Family",
    secondary: "Browse properties",
  },
};

export function getDamFamilyContent(locale: Locale) {
  return locale === "en" ? en : ar;
}

export type DamFamilyContent = ReturnType<typeof getDamFamilyContent>;
