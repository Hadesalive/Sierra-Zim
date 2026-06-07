import type { Icon } from "@phosphor-icons/react";
import {
  SteeringWheelIcon,
  TruckIcon,
  ChalkboardTeacherIcon,
  MonitorIcon,
  MountainsIcon,
  TractorIcon,
  ClipboardTextIcon,
  SealCheckIcon,
  GraduationCapIcon,
  HardHatIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Single source of truth for site-wide content.
 * Pages, navigation, the sitemap and JSON-LD structured data all read from here.
 */

export const SITE_URL = "https://www.sierrazim.com";

export const site = {
  name: "SierraZim Training Academy",
  shortName: "SierraZim",
  legalName: "Sierrazim Limited",
  tagline: "Solution to All Your Training Needs",
  description:
    "SierraZim Training Academy is Sierra Leone's specialist in defensive driving, heavy-vehicle, surface mobile equipment and agricultural machinery operator training, assessment and certification. Trusted by leading mines, farms and fleets across West Africa.",
  url: SITE_URL,
  email: "info@sierrazim.com",
  phones: ["+232 73 077 004", "+232 80 549 288"],
  // E.164 for tel:/wa.me links — keep aligned with `phones` above.
  phonesE164: ["+23273077004", "+23280549288"],
  whatsapp: "23273077004",
  address: {
    city: "Makeni",
    region: "Northern Province",
    country: "Sierra Leone",
    full: "Makeni, Northern Province, Sierra Leone",
  },
  hours: "Monday – Friday, 8:00am – 4:30pm",
  founded: "Sierra Leone",
  leadership: [
    { name: "Stephen Mafunga", role: "Chief Executive Officer" },
    { name: "Anastasia R. Zayat", role: "Managing Director" },
  ],
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: Icon;
  image: string;
  imageAlt: string;
  features: string[];
};

export const services: Service[] = [
  {
    slug: "light-vehicle-defensive-driving",
    title: "Light Vehicle & Defensive Driving",
    short:
      "Professional light motor vehicle training covering road safety, vehicle control and certified defensive driving.",
    description:
      "Our intensive light vehicle programme combines classroom theory with hands-on practical sessions. Learners master road-safety regulations, vehicle pre-start checks and component identification before progressing to all the core skills of driving. The defensive driving module adds technical skills assessment, training and certification so every graduate drives safely and confidently.",
    icon: SteeringWheelIcon,
    image: "/gallery/light-vehicle-hilux.jpg",
    imageAlt:
      "Light vehicle defensive driving training through a cone course in the field",
    features: [
      "Road-safety rules and regulations",
      "Vehicle pre-start checks and component identification",
      "Practical vehicle-control skills",
      "Technical skills assessment and certification",
    ],
  },
  {
    slug: "heavy-vehicle-defensive-driving",
    title: "Heavy Vehicle & Defensive Driving",
    short:
      "Expert heavy-duty training for haulage, tankers, delivery trucks and buses, including defensive driving.",
    description:
      "Designed for haulage, tanker, delivery-truck and bus operations, this programme delivers expert heavy-duty driver training to international technical standards. It covers theory and oral classroom instruction in road-safety regulations, pre-start checks and component identification, followed by practical training across all technical driving skills, with defensive driver certification on completion.",
    icon: TruckIcon,
    image: "/gallery/heavy-truck-side.jpg",
    imageAlt: "Heavy DADTCO haulage truck used for heavy-vehicle driver training",
    features: [
      "Haulage, tanker, delivery-truck and bus training",
      "Defensive driving for heavy vehicles",
      "International technical driving standards",
      "Full assessment and certification",
    ],
  },
  {
    slug: "theory-and-classroom-training",
    title: "Oral & Theory Training",
    short:
      "Classroom foundation in safety rules and regulations for light motor and heavy-duty operators.",
    description:
      "Becoming an expert driver starts in the classroom. Our oral and theory training equips light motor and heavy-duty learners with every safety rule and regulation, taught orally and theoretically, so they build the knowledge base that underpins high international technical driving levels. It is the foundation every SierraZim-certified driver and operator possesses.",
    icon: ChalkboardTeacherIcon,
    image: "/gallery/classroom-briefing.jpg",
    imageAlt: "Instructor delivering an oral and theory classroom session",
    features: [
      "Comprehensive road-safety education",
      "Oral and theoretical instruction",
      "Foundation for practical training",
      "Knowledge assessment",
    ],
  },
  {
    slug: "simulator-training",
    title: "Simulator Training",
    short:
      "Advanced simulator-based training that sharpens technical skills and reduces incidents.",
    description:
      "SierraZim is one of the first training institutes in the region to train with advanced driving simulators. Simulator sessions sharpen learners' technical driving skills in a controlled, safe environment, build vast practical knowledge and drive down incidents and accidents in everyday operations, without the risk and cost of on-road exposure.",
    icon: MonitorIcon,
    image: "/gallery/instructor-truck-course.jpg",
    imageAlt: "Instructor guiding a practical driver-training exercise",
    features: [
      "Advanced driving-simulator technology",
      "Safe, controlled skills practice",
      "Incident and accident reduction",
      "Faster, measurable skills development",
    ],
  },
  {
    slug: "surface-mobile-equipment-training",
    title: "Surface Mobile Equipment Training",
    short:
      "Operator training and certification for the mining sector, trusted by Sierra Rutile and its contractors.",
    description:
      "Built for the mining industry, our Surface Mobile Equipment (SME) programme supports major operators such as Sierra Rutile Mine and its contractors. We deliver consultancy in pre-employment screening assessments, on-the-job training, and defensive driver and operator training and certification, helping mines build a safe, competent and certified mobile-equipment workforce.",
    icon: MountainsIcon,
    image: "/gallery/truck-cone-course.jpg",
    imageAlt: "Surface mobile equipment training course set out with safety cones",
    features: [
      "Mining-sector operator training",
      "Pre-employment screening assessments",
      "On-the-job training",
      "Operator certification",
    ],
  },
  {
    slug: "agriculture-equipment-training",
    title: "Agriculture Equipment Training",
    short:
      "Agricultural machinery and mechanical apprenticeship training that builds market-driven skills.",
    description:
      "In support of the National Youth Commission (NAYCOM) and the United Nations Development Programme (UNDP), SierraZim delivers agriculture equipment training and mechanical apprenticeship programmes. Working alongside agribusinesses such as Sierra Tropical Limited, we develop hands-on, market-driven skills that prepare young people for real, productive employment.",
    icon: TractorIcon,
    image: "/gallery/motorbike-training-team.jpg",
    imageAlt: "Training team during an agricultural and equipment training programme",
    features: [
      "Agricultural machinery operation",
      "Mechanical apprenticeship training",
      "NAYCOM and UNDP youth programmes",
      "Hands-on, market-driven skills",
    ],
  },
  {
    slug: "pre-employment-screening",
    title: "Pre-Employment Screening & Consultancy",
    short:
      "Independent driver and operator assessment, on-the-job training and consultancy for employers.",
    description:
      "Employers rely on SierraZim to verify driver and operator competence before they hire. We provide independent pre-employment screening assessments, technical skills evaluation, on-the-job training and consultancy services, giving you confidence that every driver and operator on your fleet meets the standard before they get behind the wheel.",
    icon: ClipboardTextIcon,
    image: "/gallery/pickup-maneuvering.jpg",
    imageAlt: "Pre-employment driving assessment in progress",
    features: [
      "Independent competence assessment",
      "Technical skills evaluation",
      "On-the-job training",
      "Workforce consultancy",
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export type Client = { name: string; note?: string };

export const clients: Client[] = [
  { name: "Sierra Rutile", note: "Mining" },
  { name: "Sierra Tropical", note: "Agribusiness" },
  { name: "DADTCO Mozambique", note: "Cassava processing" },
  { name: "Miro Forestry", note: "Forestry" },
  { name: "Mantrac", note: "Equipment" },
  { name: "Frontier Buses", note: "Transport" },
  { name: "BAM Natull", note: "Construction" },
  { name: "NAYCOM & UNDP", note: "Youth skills partners" },
];

export const valueProps: { title: string; description: string; icon: Icon }[] = [
  {
    title: "Certified & Competent",
    description:
      "Certification is issued only when a candidate has fully completed the programme and passed both the theory and practical assessments.",
    icon: SealCheckIcon,
  },
  {
    title: "Trained by Experts",
    description:
      "Our instructors hold high international technical standards, producing professional, certified and competent drivers and operators.",
    icon: GraduationCapIcon,
  },
  {
    title: "Industry Proven",
    description:
      "From mining and agribusiness to forestry and transport, we support the biggest names in the region, and deliver across borders.",
    icon: HardHatIcon,
  },
];

export const stats: { value: string; label: string }[] = [
  { value: "7", label: "Specialised programmes" },
  { value: "8+", label: "Major clients & partners" },
  { value: "2", label: "Countries delivered in" },
  { value: "100%", label: "Assessed before certification" },
];

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  w: number;
  h: number;
};

export const gallery: GalleryItem[] = [
  {
    src: "/gallery/instructor-truck-course.jpg",
    alt: "Instructor guiding a heavy-vehicle driver through a cone course",
    caption: "Practical heavy-vehicle training",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/dadtco-heavy-truck.jpg",
    alt: "DADTCO Mozambique heavy haulage truck on the training ground",
    caption: "DADTCO Mozambique programme",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/light-vehicle-hilux.jpg",
    alt: "Light vehicle navigating a defensive-driving cone course",
    caption: "Light vehicle defensive driving",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/ceo-onsite-equipment.jpg",
    alt: "SierraZim team on site with a client at a processing plant",
    caption: "On site with our clients",
    w: 1152,
    h: 1536,
  },
  {
    src: "/gallery/truck-cone-course.jpg",
    alt: "Truck and safety cones laid out for an operator training exercise",
    caption: "Manoeuvring & control",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/motorbike-training-team.jpg",
    alt: "Training team with motorbikes during a field programme",
    caption: "On-site training team",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/graduation-certificates.jpg",
    alt: "Graduates holding their completion certificates",
    caption: "Certified graduates",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/pickup-maneuvering.jpg",
    alt: "Pickup performing a controlled manoeuvre between cones",
    caption: "Pre-employment assessment",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/heavy-truck-side.jpg",
    alt: "Heavy haulage truck used in heavy-vehicle driver training",
    caption: "Heavy haulage training",
    w: 1536,
    h: 1152,
  },
  {
    src: "/gallery/classroom-briefing.jpg",
    alt: "Classroom briefing during oral and theory training",
    caption: "Oral & theory classroom",
    w: 1536,
    h: 1152,
  },
];

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  location: string;
  year: string;
  title: string;
  summary: string;
  overview: string;
  delivered: string[];
  outcomes: string[];
  image: string;
  imageAlt: string;
  /** Service slugs involved in this engagement. */
  services: string[];
  /** Extra photos for the case-study gallery. */
  gallery?: { src: string; alt: string }[];
  /** True only where the imagery is from this exact engagement. */
  realPhotos?: boolean;
  featured?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "dadtco-mozambique",
    client: "DADTCO Mozambique",
    sector: "Agro-processing",
    location: "Mozambique",
    year: "2018",
    title: "Cross-border driver & operator training for DADTCO Mozambique",
    summary:
      "A full defensive-driving and operator training programme delivered on the ground in Mozambique — classroom, practical and certification — for DADTCO's cassava-processing fleet.",
    overview:
      "DADTCO (Dutch Agricultural Development & Trading Company) runs mobile cassava processing across Mozambique, with a fleet of heavy trucks, light vehicles and field bikes. SierraZim deployed its instructors to deliver a complete training programme on site — proof that training done by experts travels across borders.",
    delivered: [
      "Oral and theory classroom training on road safety and vehicle knowledge",
      "Practical defensive driving on a purpose-laid field course",
      "Heavy-vehicle and light-vehicle driver training",
      "Technical skills assessment to international standards",
      "Certification for drivers who passed theory and practical",
    ],
    outcomes: [
      "A certified, competent driving team across the DADTCO fleet",
      "Defensive-driving discipline embedded for safer daily operations",
      "Graduates certified on completion and ready for work",
    ],
    image: "/gallery/dadtco-heavy-truck.jpg",
    imageAlt: "DADTCO Mozambique heavy haulage truck on the SierraZim training ground",
    services: [
      "heavy-vehicle-defensive-driving",
      "light-vehicle-defensive-driving",
      "theory-and-classroom-training",
    ],
    gallery: [
      {
        src: "/gallery/instructor-truck-course.jpg",
        alt: "Instructor leading a heavy-vehicle driver through the cone course in Mozambique",
      },
      {
        src: "/gallery/heavy-truck-side.jpg",
        alt: "DADTCO heavy haulage truck on the field training ground",
      },
      {
        src: "/gallery/truck-cone-course.jpg",
        alt: "Truck and safety cones laid out for a manoeuvring exercise",
      },
      {
        src: "/gallery/light-vehicle-hilux.jpg",
        alt: "Light vehicle navigating the defensive-driving cone course",
      },
      {
        src: "/gallery/motorbike-training-team.jpg",
        alt: "Training team with field bikes during the programme",
      },
      {
        src: "/gallery/classroom-briefing.jpg",
        alt: "Classroom briefing during oral and theory training",
      },
      {
        src: "/gallery/graduation-certificates.jpg",
        alt: "DADTCO graduates holding their completion certificates",
      },
    ],
    realPhotos: true,
    featured: true,
  },
  {
    slug: "sierra-rutile",
    client: "Sierra Rutile",
    sector: "Mining",
    location: "Sierra Leone",
    year: "Ongoing",
    title: "Surface mobile equipment training for Sierra Rutile & contractors",
    summary:
      "Supporting one of Sierra Leone's biggest mines with pre-employment screening, on-the-job training and operator certification for surface mobile equipment.",
    overview:
      "SierraZim supports Sierra Rutile Mine and its contractors with consultancy across the operator lifecycle — from screening candidates before they are hired, through on-the-job training, to defensive driver and operator certification for surface mobile equipment.",
    delivered: [
      "Pre-employment screening assessments",
      "On-the-job training for mobile equipment operators",
      "Defensive driver and operator training",
      "Operator certification",
    ],
    outcomes: [
      "A screened, competent mobile-equipment workforce",
      "Reduced on-site risk through certified operators",
    ],
    image: "/gallery/truck-cone-course.jpg",
    imageAlt: "Operator training course set out with safety cones",
    services: ["surface-mobile-equipment-training", "pre-employment-screening"],
  },
  {
    slug: "sierra-tropical",
    client: "Sierra Tropical",
    sector: "Agribusiness",
    location: "Sierra Leone",
    year: "Ongoing",
    title: "Agriculture equipment training & youth apprenticeships",
    summary:
      "Agriculture equipment training and mechanical apprenticeships supporting Sierra Tropical's pineapple operations, in partnership with NAYCOM and UNDP.",
    overview:
      "Working under Sierra Tropical Limited — a major name in pineapple farming — and in support of the National Youth Commission (NAYCOM) and UNDP, SierraZim delivers agriculture equipment training and mechanical apprenticeships that build hands-on, market-driven skills for young people.",
    delivered: [
      "Agriculture equipment operation training",
      "Mechanical apprenticeship training",
      "Hands-on, market-driven skills development",
      "NAYCOM & UNDP youth programme support",
    ],
    outcomes: [
      "Young people equipped with employable, practical skills",
      "A trained workforce for modern agribusiness operations",
    ],
    image: "/gallery/motorbike-training-team.jpg",
    imageAlt: "Training team during an agriculture and equipment programme",
    services: ["agriculture-equipment-training"],
  },
  {
    slug: "frontier-buses",
    client: "Frontier Buses",
    sector: "Public transport",
    location: "Sierra Leone",
    year: "Ongoing",
    title: "Defensive driver training for a bus fleet",
    summary:
      "Heavy-vehicle and defensive driver training for Frontier Buses, raising safety standards across a passenger-carrying fleet.",
    overview:
      "Passenger transport demands the highest driving standards. SierraZim delivers theory, practical and defensive driver training for Frontier Buses, certifying drivers to operate safely and professionally on the road.",
    delivered: [
      "Oral and theory classroom training",
      "Practical bus and heavy-vehicle driving",
      "Defensive driver training",
      "Driver certification",
    ],
    outcomes: [
      "Safer passenger transport through certified drivers",
      "Consistent professional driving standards across the fleet",
    ],
    image: "/gallery/heavy-truck-side.jpg",
    imageAlt: "Heavy vehicle used in defensive driver training",
    services: ["heavy-vehicle-defensive-driving", "theory-and-classroom-training"],
  },
  {
    slug: "miro-forestry",
    client: "Miro Forestry",
    sector: "Forestry",
    location: "Sierra Leone",
    year: "Ongoing",
    title: "Driver & operator training for forestry operations",
    summary:
      "Defensive driving and operator training supporting Miro Forestry's plantation and haulage operations.",
    overview:
      "Forestry operations rely on safe driving and competent equipment handling across challenging terrain. SierraZim provides driver and operator training and certification to keep Miro Forestry's teams safe and productive.",
    delivered: [
      "Light and heavy-vehicle driver training",
      "Defensive driving",
      "Practical skills assessment",
      "Certification on completion",
    ],
    outcomes: [
      "Certified drivers and operators for forestry haulage",
      "Improved safety across plantation operations",
    ],
    image: "/gallery/instructor-truck-course.jpg",
    imageAlt: "Instructor guiding a driver through a practical training course",
    services: ["light-vehicle-defensive-driving", "heavy-vehicle-defensive-driving"],
  },
  {
    slug: "mantrac",
    client: "Mantrac",
    sector: "Equipment & machinery",
    location: "Sierra Leone",
    year: "Ongoing",
    title: "Operator training for heavy equipment",
    summary:
      "Operator training and certification supporting Mantrac's heavy equipment and machinery customers.",
    overview:
      "SierraZim partners on operator training for heavy equipment and machinery, combining classroom theory with practical, hands-on instruction and certification for competent, confident operators.",
    delivered: [
      "Equipment operator training",
      "Theory and practical instruction",
      "Technical skills assessment",
      "Operator certification",
    ],
    outcomes: [
      "Competent, certified equipment operators",
      "Safer machine handling on site",
    ],
    image: "/gallery/light-vehicle-hilux.jpg",
    imageAlt: "Vehicle and equipment training in the field",
    services: ["surface-mobile-equipment-training", "pre-employment-screening"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
