import type { Db } from "./client";
import {
  creators,
  audiences,
  brands,
  products,
  campaigns,
  campaignCreators,
  trends,
  graphEdges,
  type CampaignOutcome,
  type PlatformPresence,
} from "./schema";

/*
  Creators are real, public Indian creators referenced by their public handles
  so profile links resolve to the genuine Instagram / YouTube pages. Audience
  breakdowns, scores, and campaign outcomes are modelled/simulated demo data
  (this is a forecasting prototype); fraud risk is kept low and realistic.
*/

type CreatorSpec = {
  id: string;
  name: string;
  niche: string;
  bio: string;
  location: string;
  languages: string[];
  topics: string[];
  ig: number;
  igHandle: string;
  yt: number; // 0 = no youtube
  ytHandle?: string;
  eng: number;
  quality: number;
  credibility: number;
  growth: number;
  rate: number;
  fraud: number;
  aud: {
    age: Record<string, number>;
    gender: { male: number; female: number; other: number };
    geos: { city: string; pct: number }[];
    interests: string[];
    affinities: string[];
    intent: number;
    income: string;
  };
};

const C: CreatorSpec[] = [
  {
    id: "cr_beerbiceps", name: "Ranveer Allahbadia", niche: "fitness",
    bio: "Fitness, wellness and self-improvement. Founder of BeerBiceps and host of The Ranveer Show.",
    location: "Mumbai", languages: ["English", "Hindi"],
    topics: ["fitness", "wellness", "nutrition", "self improvement"],
    ig: 4000000, igHandle: "@beerbiceps", yt: 9000000, ytHandle: "@BeerBiceps",
    eng: 3.2, quality: 88, credibility: 90, growth: 3.0, rate: 1200000, fraud: 4,
    aud: {
      age: { "18-24": 40, "25-34": 42, "35-44": 13, "45+": 5 },
      gender: { male: 74, female: 25, other: 1 },
      geos: [{ city: "Mumbai", pct: 16 }, { city: "Delhi NCR", pct: 14 }, { city: "Bengaluru", pct: 12 }, { city: "Pune", pct: 9 }],
      interests: ["fitness", "supplements", "podcasts", "self help"],
      affinities: ["protein powder", "fitness wearables", "supplements"],
      intent: 72, income: "mid",
    },
  },
  {
    id: "cr_rohitkhatri", name: "Rohit Khatri", niche: "fitness",
    bio: "Science-based training and no-nonsense nutrition. Honest gym and supplement reviews.",
    location: "Delhi NCR", languages: ["Hindi", "English"],
    topics: ["strength training", "fat loss", "protein nutrition", "supplement reviews"],
    ig: 700000, igHandle: "@rohitkhatrifitness", yt: 1600000, ytHandle: "@RohitKhatriFitness",
    eng: 5.4, quality: 89, credibility: 91, growth: 3.6, rate: 320000, fraud: 3,
    aud: {
      age: { "18-24": 44, "25-34": 41, "35-44": 11, "45+": 4 },
      gender: { male: 79, female: 20, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 18 }, { city: "Mumbai", pct: 12 }, { city: "Bengaluru", pct: 11 }, { city: "Lucknow", pct: 8 }],
      interests: ["bodybuilding", "supplements", "meal prep", "running"],
      affinities: ["protein powder", "creatine", "gym apparel", "fitness wearables"],
      intent: 76, income: "mid",
    },
  },
  {
    id: "cr_draanchal", name: "Dr. Aanchal Panth", niche: "beauty",
    bio: "Dermatologist (MBBS, MD). Evidence-based skincare and myth-busting for Indian skin.",
    location: "Mumbai", languages: ["English", "Hindi"],
    topics: ["skincare", "dermatology", "ingredients", "sunscreen"],
    ig: 900000, igHandle: "@dr.aanchal.md", yt: 350000, ytHandle: "@DrAanchalMD",
    eng: 5.8, quality: 93, credibility: 95, growth: 4.5, rate: 380000, fraud: 2,
    aud: {
      age: { "18-24": 38, "25-34": 44, "35-44": 13, "45+": 5 },
      gender: { male: 16, female: 83, other: 1 },
      geos: [{ city: "Mumbai", pct: 14 }, { city: "Bengaluru", pct: 13 }, { city: "Hyderabad", pct: 11 }, { city: "Delhi NCR", pct: 11 }],
      interests: ["skincare", "acne", "sunscreen", "wellness"],
      affinities: ["serums", "sunscreen", "clean beauty", "dermo-cosmetics"],
      intent: 82, income: "mid",
    },
  },
  {
    id: "cr_malvika", name: "Malvika Sitlani", niche: "beauty",
    bio: "Makeup artist and beauty founder. Flawless-base tutorials, reviews and dupes.",
    location: "Mumbai", languages: ["English", "Hindi"],
    topics: ["makeup", "beauty", "skincare", "tutorials"],
    ig: 1200000, igHandle: "@malvikasitlaniofficial", yt: 450000, ytHandle: "@MalvikaSitlani",
    eng: 4.6, quality: 86, credibility: 88, growth: 3.1, rate: 480000, fraud: 4,
    aud: {
      age: { "18-24": 46, "25-34": 39, "35-44": 11, "45+": 4 },
      gender: { male: 12, female: 87, other: 1 },
      geos: [{ city: "Mumbai", pct: 17 }, { city: "Delhi NCR", pct: 13 }, { city: "Bengaluru", pct: 11 }, { city: "Pune", pct: 8 }],
      interests: ["makeup", "skincare", "fashion", "K-beauty"],
      affinities: ["foundation", "serums", "lipstick", "clean beauty"],
      intent: 78, income: "mid",
    },
  },
  {
    id: "cr_shreyajain", name: "Shreya Jain", niche: "beauty",
    bio: "Beauty, makeup and skincare. Drugstore-to-luxury reviews and honest tutorials.",
    location: "Delhi NCR", languages: ["English", "Hindi"],
    topics: ["makeup", "beauty reviews", "drugstore", "tutorials"],
    ig: 450000, igHandle: "@shreyajain26", yt: 600000, ytHandle: "@ShreyaJain26",
    eng: 5.2, quality: 85, credibility: 87, growth: 2.8, rate: 280000, fraud: 4,
    aud: {
      age: { "18-24": 49, "25-34": 37, "35-44": 10, "45+": 4 },
      gender: { male: 13, female: 86, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 18 }, { city: "Mumbai", pct: 12 }, { city: "Lucknow", pct: 8 }, { city: "Jaipur", pct: 7 }],
      interests: ["makeup", "skincare", "haircare", "fashion"],
      affinities: ["lipstick", "foundation", "affordable beauty", "serums"],
      intent: 75, income: "mid",
    },
  },
  {
    id: "cr_technicalguruji", name: "Gaurav Chaudhary", niche: "tech",
    bio: "India's biggest tech voice. Smartphone reviews, gadgets and unboxings in Hindi.",
    location: "Delhi NCR", languages: ["Hindi", "English"],
    topics: ["smartphones", "gadgets", "tech reviews", "unboxings"],
    ig: 6000000, igHandle: "@technicalguruji", yt: 23000000, ytHandle: "@TechnicalGuruji",
    eng: 3.0, quality: 84, credibility: 86, growth: 2.2, rate: 1500000, fraud: 5,
    aud: {
      age: { "18-24": 47, "25-34": 37, "35-44": 12, "45+": 4 },
      gender: { male: 82, female: 17, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 15 }, { city: "Mumbai", pct: 11 }, { city: "Patna", pct: 8 }, { city: "Jaipur", pct: 8 }],
      interests: ["smartphones", "gadgets", "gaming", "tech news"],
      affinities: ["smartphones", "earbuds", "power banks", "smartwatches"],
      intent: 78, income: "mixed",
    },
  },
  {
    id: "cr_trakintech", name: "Arun Prabhudesai", niche: "tech",
    bio: "Trakin Tech. Fast, clear smartphone and gadget reviews, tech news and deals.",
    location: "Pune", languages: ["Hindi", "English"],
    topics: ["smartphones", "tech news", "gadgets", "reviews"],
    ig: 500000, igHandle: "@trakintech", yt: 9000000, ytHandle: "@TrakinTech",
    eng: 3.6, quality: 86, credibility: 88, growth: 2.6, rate: 900000, fraud: 4,
    aud: {
      age: { "18-24": 45, "25-34": 39, "35-44": 12, "45+": 4 },
      gender: { male: 83, female: 16, other: 1 },
      geos: [{ city: "Pune", pct: 12 }, { city: "Mumbai", pct: 12 }, { city: "Delhi NCR", pct: 12 }, { city: "Bengaluru", pct: 9 }],
      interests: ["smartphones", "gadgets", "audio", "tech deals"],
      affinities: ["earbuds", "smartphones", "smartwatches", "headphones"],
      intent: 80, income: "mixed",
    },
  },
  {
    id: "cr_warikoo", name: "Ankur Warikoo", niche: "finance",
    bio: "Entrepreneur and educator. Personal finance, careers and money without jargon.",
    location: "Delhi NCR", languages: ["English", "Hindi"],
    topics: ["personal finance", "investing", "career", "entrepreneurship"],
    ig: 3700000, igHandle: "@ankurwarikoo", yt: 5900000, ytHandle: "@warikoo",
    eng: 3.9, quality: 90, credibility: 92, growth: 3.6, rate: 1100000, fraud: 3,
    aud: {
      age: { "18-24": 34, "25-34": 48, "35-44": 14, "45+": 4 },
      gender: { male: 68, female: 31, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 15 }, { city: "Mumbai", pct: 14 }, { city: "Bengaluru", pct: 13 }, { city: "Pune", pct: 9 }],
      interests: ["investing", "startups", "career", "saving"],
      affinities: ["broking apps", "credit cards", "online courses", "fintech apps"],
      intent: 82, income: "high",
    },
  },
  {
    id: "cr_yourfoodlab", name: "Sanjyot Keer", niche: "food",
    bio: "Chef and founder of Your Food Lab. Restaurant-style and high-protein recipes at home.",
    location: "Mumbai", languages: ["Hindi", "English"],
    topics: ["recipes", "cooking", "high protein", "Indian food"],
    ig: 1500000, igHandle: "@yourfoodlab", yt: 1800000, ytHandle: "@YourFoodLab",
    eng: 5.0, quality: 88, credibility: 90, growth: 4.0, rate: 700000, fraud: 3,
    aud: {
      age: { "18-24": 33, "25-34": 44, "35-44": 16, "45+": 7 },
      gender: { male: 45, female: 54, other: 1 },
      geos: [{ city: "Mumbai", pct: 15 }, { city: "Delhi NCR", pct: 13 }, { city: "Bengaluru", pct: 11 }, { city: "Pune", pct: 9 }],
      interests: ["cooking", "fitness", "meal prep", "food"],
      affinities: ["protein powder", "kitchen appliances", "health foods", "groceries"],
      intent: 73, income: "mid",
    },
  },
  {
    id: "cr_kabitaskitchen", name: "Kabita Singh", niche: "food",
    bio: "Kabita's Kitchen. Simple, foolproof Indian home recipes for everyday cooking.",
    location: "Delhi NCR", languages: ["Hindi", "English"],
    topics: ["home cooking", "recipes", "Indian food", "vegetarian"],
    ig: 600000, igHandle: "@kabitaskitchen", yt: 13000000, ytHandle: "@kabitaskitchen",
    eng: 4.2, quality: 87, credibility: 89, growth: 2.4, rate: 600000, fraud: 4,
    aud: {
      age: { "18-24": 24, "25-34": 43, "35-44": 22, "45+": 11 },
      gender: { male: 32, female: 67, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 14 }, { city: "Mumbai", pct: 11 }, { city: "Kolkata", pct: 9 }, { city: "Patna", pct: 8 }],
      interests: ["cooking", "home", "recipes", "family"],
      affinities: ["kitchen appliances", "groceries", "cookware", "spices"],
      intent: 70, income: "mid",
    },
  },
  {
    id: "cr_komalpandey", name: "Komal Pandey", niche: "fashion",
    bio: "Fashion creator. Experimental styling, trend breakdowns and outfit ideas.",
    location: "Delhi NCR", languages: ["English", "Hindi"],
    topics: ["fashion", "styling", "trends", "outfits"],
    ig: 1900000, igHandle: "@komalpandeyofficial", yt: 700000, ytHandle: "@KomalPandey",
    eng: 4.4, quality: 85, credibility: 86, growth: 3.2, rate: 560000, fraud: 5,
    aud: {
      age: { "18-24": 47, "25-34": 39, "35-44": 10, "45+": 4 },
      gender: { male: 18, female: 81, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 18 }, { city: "Mumbai", pct: 15 }, { city: "Bengaluru", pct: 10 }, { city: "Chandigarh", pct: 7 }],
      interests: ["fashion", "beauty", "lifestyle", "shopping"],
      affinities: ["ethnic wear", "western wear", "accessories", "footwear"],
      intent: 76, income: "high",
    },
  },
  {
    id: "cr_thatbohogirl", name: "Kritika Khurana", niche: "fashion",
    bio: "ThatBohoGirl. Boho and everyday styling, outfit edits and lifestyle.",
    location: "Delhi NCR", languages: ["English", "Hindi"],
    topics: ["fashion", "boho style", "outfits", "lifestyle"],
    ig: 1500000, igHandle: "@thatbohogirl", yt: 350000, ytHandle: "@KritikaKhurana",
    eng: 4.0, quality: 83, credibility: 84, growth: 2.9, rate: 450000, fraud: 6,
    aud: {
      age: { "18-24": 50, "25-34": 37, "35-44": 9, "45+": 4 },
      gender: { male: 16, female: 83, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 19 }, { city: "Mumbai", pct: 13 }, { city: "Bengaluru", pct: 9 }, { city: "Jaipur", pct: 7 }],
      interests: ["fashion", "travel", "lifestyle", "beauty"],
      affinities: ["western wear", "ethnic wear", "accessories", "sunglasses"],
      intent: 74, income: "mid",
    },
  },
  {
    id: "cr_carryminati", name: "Ajey Nagar", niche: "gaming",
    bio: "CarryMinati. Gaming and live streams on CarryisLive; one of India's biggest creators.",
    location: "Delhi NCR", languages: ["Hindi", "English"],
    topics: ["gaming", "streaming", "esports", "comedy"],
    ig: 19000000, igHandle: "@carryminati", yt: 16000000, ytHandle: "@CarryisLive",
    eng: 6.5, quality: 80, credibility: 82, growth: 4.0, rate: 1400000, fraud: 8,
    aud: {
      age: { "13-17": 16, "18-24": 54, "25-34": 25, "35+": 5 },
      gender: { male: 84, female: 15, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 14 }, { city: "Mumbai", pct: 12 }, { city: "Kolkata", pct: 8 }, { city: "Pune", pct: 8 }],
      interests: ["gaming", "esports", "comedy", "gadgets"],
      affinities: ["gaming phones", "earbuds", "energy drinks", "gaming gear"],
      intent: 68, income: "low",
    },
  },
  {
    id: "cr_mumbikernikhil", name: "Nikhil Sharma", niche: "travel",
    bio: "Mumbiker Nikhil. Motovlogs, travel and daily life across India.",
    location: "Mumbai", languages: ["Hindi", "English"],
    topics: ["travel", "motovlog", "adventure", "lifestyle"],
    ig: 1400000, igHandle: "@mumbiker_nikhil", yt: 4000000, ytHandle: "@MumbikerNikhil",
    eng: 4.8, quality: 84, credibility: 86, growth: 3.0, rate: 450000, fraud: 5,
    aud: {
      age: { "18-24": 46, "25-34": 41, "35-44": 9, "45+": 4 },
      gender: { male: 72, female: 27, other: 1 },
      geos: [{ city: "Mumbai", pct: 17 }, { city: "Delhi NCR", pct: 12 }, { city: "Pune", pct: 10 }, { city: "Bengaluru", pct: 8 }],
      interests: ["travel", "motorcycles", "adventure", "gadgets"],
      affinities: ["helmets", "action cameras", "running shoes", "backpacks"],
      intent: 71, income: "mid",
    },
  },
  {
    id: "cr_larissa", name: "Larissa D'Sa", niche: "travel",
    bio: "Travel and lifestyle creator. Boutique stays, food and slow travel across India.",
    location: "Mumbai", languages: ["English", "Hindi"],
    topics: ["travel", "lifestyle", "luxury", "food"],
    ig: 800000, igHandle: "@larissa_wlc", yt: 250000, ytHandle: "@LarissaDSa",
    eng: 4.2, quality: 82, credibility: 84, growth: 2.7, rate: 350000, fraud: 6,
    aud: {
      age: { "18-24": 33, "25-34": 47, "35-44": 16, "45+": 4 },
      gender: { male: 31, female: 68, other: 1 },
      geos: [{ city: "Mumbai", pct: 18 }, { city: "Delhi NCR", pct: 13 }, { city: "Bengaluru", pct: 10 }, { city: "Goa", pct: 7 }],
      interests: ["travel", "fashion", "fine dining", "wellness"],
      affinities: ["hotels", "airlines", "luggage", "skincare"],
      intent: 75, income: "high",
    },
  },
  {
    id: "cr_souravjoshi", name: "Sourav Joshi", niche: "travel",
    bio: "Daily vlogs and family life. One of India's most-watched lifestyle vloggers.",
    location: "Delhi NCR", languages: ["Hindi"],
    topics: ["vlogs", "lifestyle", "family", "daily life"],
    ig: 12000000, igHandle: "@souravjoshivlogs", yt: 27000000, ytHandle: "@souravjoshivlogs",
    eng: 5.5, quality: 83, credibility: 85, growth: 4.2, rate: 1100000, fraud: 6,
    aud: {
      age: { "13-17": 22, "18-24": 48, "25-34": 22, "35+": 8 },
      gender: { male: 58, female: 41, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 13 }, { city: "Lucknow", pct: 9 }, { city: "Mumbai", pct: 9 }, { city: "Jaipur", pct: 8 }],
      interests: ["vlogs", "family", "art", "lifestyle"],
      affinities: ["smartphones", "snacks", "apparel", "stationery"],
      intent: 66, income: "mixed",
    },
  },
];

const BRANDS = [
  { id: "br_vitalfuel", name: "VitalFuel", industry: "Sports Nutrition", description: "D2C sports nutrition brand. Whey, plant protein, and recovery supplements." },
  { id: "br_glowtheory", name: "GlowTheory", industry: "Beauty & Personal Care", description: "Dermo-cosmetic skincare built for Indian skin and climate." },
  { id: "br_soundcore_in", name: "PulseAudio", industry: "Consumer Electronics", description: "Budget-premium audio: TWS earbuds and headphones." },
  { id: "br_paisaplan", name: "PaisaPlan", industry: "Fintech", description: "Investment app for first-time investors: SIPs, digital gold, tax filing." },
  { id: "br_striderz", name: "Striderz", industry: "Footwear & Apparel", description: "Performance running shoes and athleisure designed in India." },
  { id: "br_zenbrew", name: "ZenBrew", industry: "Food & Beverage", description: "Functional beverages: green tea, kombucha, and clean energy drinks." },
];

const PRODUCTS = [
  { id: "pr_whey_iso", brandId: "br_vitalfuel", name: "IsoPrime Whey Protein", category: "protein supplement", priceInr: 3499, marginPct: 38, targetAgeRange: "18-34", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"], targetInterests: ["bodybuilding", "fitness", "meal prep", "running"] },
  { id: "pr_plant_protein", brandId: "br_vitalfuel", name: "TerraPlant Protein", category: "protein supplement", priceInr: 2899, marginPct: 42, targetAgeRange: "22-40", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Chennai", "Pune"], targetInterests: ["fitness", "wellness", "healthy eating"] },
  { id: "pr_protein_bar", brandId: "br_vitalfuel", name: "VitalFuel Protein Bar", category: "protein snack", priceInr: 129, marginPct: 45, targetAgeRange: "18-35", targetGender: "all", targetGeos: ["Mumbai", "Delhi NCR", "Bengaluru"], targetInterests: ["fitness", "snacks", "travel", "running"] },
  { id: "pr_vitc_serum", brandId: "br_glowtheory", name: "10% Vitamin C Serum", category: "skincare", priceInr: 899, marginPct: 55, targetAgeRange: "18-34", targetGender: "female", targetGeos: ["Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi NCR"], targetInterests: ["skincare", "beauty", "wellness"] },
  { id: "pr_spf50", brandId: "br_glowtheory", name: "Invisible SPF50 Sunscreen", category: "skincare", priceInr: 649, marginPct: 52, targetAgeRange: "18-40", targetGender: "all", targetGeos: ["Mumbai", "Chennai", "Hyderabad", "Delhi NCR"], targetInterests: ["skincare", "outdoors", "beauty"] },
  { id: "pr_tws_pro", brandId: "br_soundcore_in", name: "PulseBuds Pro ANC", category: "earbuds", priceInr: 4999, marginPct: 30, targetAgeRange: "18-30", targetGender: "all", targetGeos: ["Delhi NCR", "Mumbai", "Bengaluru", "Kolkata"], targetInterests: ["music", "gadgets", "gaming", "smartphones"] },
  { id: "pr_sip_app", brandId: "br_paisaplan", name: "PaisaPlan SIP Account", category: "fintech app", priceInr: 500, marginPct: 80, targetAgeRange: "21-35", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune"], targetInterests: ["investing", "saving", "career"] },
  { id: "pr_run_shoe", brandId: "br_striderz", name: "Striderz Velocity 2", category: "running shoes", priceInr: 5499, marginPct: 44, targetAgeRange: "20-40", targetGender: "all", targetGeos: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR"], targetInterests: ["running", "fitness", "travel"] },
  { id: "pr_kombucha", brandId: "br_zenbrew", name: "ZenBrew Kombucha", category: "functional beverage", priceInr: 149, marginPct: 48, targetAgeRange: "22-38", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Delhi NCR"], targetInterests: ["wellness", "healthy eating", "food"] },
  { id: "pr_clean_energy", brandId: "br_zenbrew", name: "ZenBrew Clean Energy", category: "functional beverage", priceInr: 99, marginPct: 50, targetAgeRange: "18-28", targetGender: "all", targetGeos: ["Delhi NCR", "Mumbai", "Pune", "Kolkata"], targetInterests: ["gaming", "fitness", "esports"] },
];

function outcome(spend: number, reach: number, ctr: number, cvr: number, price: number): CampaignOutcome {
  const impressions = Math.round(reach * 1.7);
  const engagement = Math.round(impressions * 0.045);
  const clicks = Math.round(impressions * ctr);
  const conversions = Math.round(clicks * cvr);
  const revenueInr = conversions * price;
  return { reach, impressions, engagement, clicks, conversions, revenueInr, roas: +(revenueInr / spend).toFixed(2) };
}

type CampaignSpec = {
  id: string; brandId: string; productId: string; name: string; objective: string; status: string;
  budgetInr: number; spendInr: number; startDate: string; endDate: string | null;
  predicted: CampaignOutcome | null; actual: CampaignOutcome | null;
  lineup: { creatorId: string; feeInr: number; deliverables: string[]; actual: CampaignOutcome | null }[];
};

const CAMPAIGNS: CampaignSpec[] = [
  {
    id: "cp_whey_q1", brandId: "br_vitalfuel", productId: "pr_whey_iso",
    name: "IsoPrime Metro Launch", objective: "conversions", status: "completed",
    budgetInr: 2500000, spendInr: 2320000, startDate: "2026-01-10", endDate: "2026-02-28",
    predicted: outcome(2320000, 3200000, 0.011, 0.026, 3499),
    actual: outcome(2320000, 3480000, 0.012, 0.028, 3499),
    lineup: [
      { creatorId: "cr_rohitkhatri", feeInr: 320000, deliverables: ["2 reels", "1 YT integration", "stories x4"], actual: outcome(320000, 720000, 0.016, 0.034, 3499) },
      { creatorId: "cr_beerbiceps", feeInr: 1200000, deliverables: ["1 YT integration", "2 reels"], actual: outcome(1200000, 1980000, 0.012, 0.027, 3499) },
      { creatorId: "cr_yourfoodlab", feeInr: 700000, deliverables: ["2 high-protein recipe reels"], actual: outcome(700000, 880000, 0.010, 0.025, 3499) },
    ],
  },
  {
    id: "cp_serum_diwali", brandId: "br_glowtheory", productId: "pr_vitc_serum",
    name: "Vitamin C Festive Push", objective: "conversions", status: "completed",
    budgetInr: 1400000, spendInr: 1340000, startDate: "2025-10-05", endDate: "2025-11-15",
    predicted: outcome(1340000, 2100000, 0.013, 0.034, 899),
    actual: outcome(1340000, 2360000, 0.015, 0.039, 899),
    lineup: [
      { creatorId: "cr_draanchal", feeInr: 380000, deliverables: ["ingredient deep-dive", "2 reels"], actual: outcome(380000, 880000, 0.018, 0.044, 899) },
      { creatorId: "cr_malvika", feeInr: 480000, deliverables: ["GRWM reel", "stories x3"], actual: outcome(480000, 820000, 0.014, 0.037, 899) },
      { creatorId: "cr_shreyajain", feeInr: 280000, deliverables: ["review reel", "stories x4"], actual: outcome(280000, 560000, 0.013, 0.035, 899) },
    ],
  },
  {
    id: "cp_buds_launch", brandId: "br_soundcore_in", productId: "pr_tws_pro",
    name: "PulseBuds Pro Launch", objective: "launch", status: "completed",
    budgetInr: 3000000, spendInr: 2850000, startDate: "2025-11-20", endDate: "2026-01-05",
    predicted: outcome(2850000, 4600000, 0.014, 0.019, 4999),
    actual: outcome(2850000, 4280000, 0.013, 0.017, 4999),
    lineup: [
      { creatorId: "cr_technicalguruji", feeInr: 1500000, deliverables: ["full review YT", "1 short"], actual: outcome(1500000, 2350000, 0.015, 0.019, 4999) },
      { creatorId: "cr_trakintech", feeInr: 900000, deliverables: ["comparison YT", "2 reels"], actual: outcome(900000, 1380000, 0.014, 0.018, 4999) },
      { creatorId: "cr_carryminati", feeInr: 450000, deliverables: ["stream mention"], actual: outcome(450000, 560000, 0.009, 0.011, 4999) },
    ],
  },
  {
    id: "cp_sip_newyear", brandId: "br_paisaplan", productId: "pr_sip_app",
    name: "New Year, First SIP", objective: "conversions", status: "completed",
    budgetInr: 1600000, spendInr: 1540000, startDate: "2026-01-01", endDate: "2026-02-15",
    predicted: outcome(1540000, 2600000, 0.016, 0.06, 500),
    actual: outcome(1540000, 2820000, 0.018, 0.067, 500),
    lineup: [
      { creatorId: "cr_warikoo", feeInr: 1100000, deliverables: ["explainer YT", "2 reels"], actual: outcome(1100000, 2100000, 0.020, 0.072, 500) },
      { creatorId: "cr_technicalguruji", feeInr: 440000, deliverables: ["1 integration"], actual: outcome(440000, 720000, 0.013, 0.052, 500) },
    ],
  },
  {
    id: "cp_velocity_mar", brandId: "br_striderz", productId: "pr_run_shoe",
    name: "Velocity 2 Marathon Season", objective: "conversions", status: "completed",
    budgetInr: 1100000, spendInr: 1020000, startDate: "2025-12-01", endDate: "2026-01-31",
    predicted: outcome(1020000, 1500000, 0.012, 0.024, 5499),
    actual: outcome(1020000, 1640000, 0.013, 0.027, 5499),
    lineup: [
      { creatorId: "cr_rohitkhatri", feeInr: 320000, deliverables: ["training reel", "review"], actual: outcome(320000, 640000, 0.016, 0.033, 5499) },
      { creatorId: "cr_mumbikernikhil", feeInr: 450000, deliverables: ["on-road durability test", "2 reels"], actual: outcome(450000, 740000, 0.012, 0.025, 5499) },
      { creatorId: "cr_beerbiceps", feeInr: 250000, deliverables: ["1 story set"], actual: outcome(250000, 320000, 0.010, 0.020, 5499) },
    ],
  },
  {
    id: "cp_kombucha_blr", brandId: "br_zenbrew", productId: "pr_kombucha",
    name: "Kombucha Metro Pilot", objective: "awareness", status: "completed",
    budgetInr: 900000, spendInr: 840000, startDate: "2026-02-10", endDate: "2026-03-20",
    predicted: outcome(840000, 1500000, 0.008, 0.03, 149),
    actual: outcome(840000, 1360000, 0.007, 0.027, 149),
    lineup: [
      { creatorId: "cr_yourfoodlab", feeInr: 480000, deliverables: ["recipe pairing reel x2"], actual: outcome(480000, 820000, 0.008, 0.029, 149) },
      { creatorId: "cr_draanchal", feeInr: 360000, deliverables: ["gut-health reel"], actual: outcome(360000, 540000, 0.006, 0.024, 149) },
    ],
  },
  {
    id: "cp_spf_summer", brandId: "br_glowtheory", productId: "pr_spf50",
    name: "SPF50 Summer Campaign", objective: "conversions", status: "active",
    budgetInr: 1500000, spendInr: 600000, startDate: "2026-05-15", endDate: "2026-07-15",
    predicted: outcome(1500000, 2600000, 0.014, 0.035, 649),
    actual: null,
    lineup: [
      { creatorId: "cr_draanchal", feeInr: 380000, deliverables: ["SPF myths reel", "3 reels"], actual: null },
      { creatorId: "cr_malvika", feeInr: 480000, deliverables: ["everyday-SPF GRWM"], actual: null },
      { creatorId: "cr_larissa", feeInr: 350000, deliverables: ["travel SPF integration x2"], actual: null },
    ],
  },
  {
    id: "cp_energy_esports", brandId: "br_zenbrew", productId: "pr_clean_energy",
    name: "Clean Energy x Esports", objective: "launch", status: "active",
    budgetInr: 1200000, spendInr: 500000, startDate: "2026-06-01", endDate: "2026-07-31",
    predicted: outcome(1200000, 2400000, 0.009, 0.022, 99),
    actual: null,
    lineup: [
      { creatorId: "cr_carryminati", feeInr: 1400000, deliverables: ["stream sponsorship x4", "2 shorts"], actual: null },
      { creatorId: "cr_rohitkhatri", feeInr: 300000, deliverables: ["pre-workout energy reel"], actual: null },
    ],
  },
];

const TRENDS = [
  { id: "tr_protein_coffee", topic: "Protein Coffee (Proffee)", category: "fitness", description: "Creators blending protein into cold coffee; recipe formats outperforming standard supplement content.", velocity: 86, sentiment: 0.62, growthRateWoW: 24, momentum: "rising", topGeos: ["Bengaluru", "Mumbai", "Delhi NCR"], relatedTopics: ["high protein", "iced coffee", "meal prep"] },
  { id: "tr_pickleball", topic: "Pickleball Clubs", category: "fitness", description: "Urban pickleball courts booked out weeks ahead; corporate leagues forming in metros.", velocity: 78, sentiment: 0.71, growthRateWoW: 18, momentum: "rising", topGeos: ["Bengaluru", "Gurugram", "Mumbai"], relatedTopics: ["racquet sports", "corporate wellness", "athleisure"] },
  { id: "tr_skin_minimal", topic: "Skinimalism", category: "beauty", description: "Three-step routines replacing ten-step content; 'fewer, better' messaging resonating with 25-34.", velocity: 72, sentiment: 0.55, growthRateWoW: 9, momentum: "peaking", topGeos: ["Mumbai", "Bengaluru", "Hyderabad"], relatedTopics: ["sunscreen", "barrier repair", "clean beauty"] },
  { id: "tr_scalp_care", topic: "Scalp Care as Skincare", category: "beauty", description: "Scalp serums and oiling-routine content growing fast; strong overlap with traditional hair-oil habits.", velocity: 64, sentiment: 0.6, growthRateWoW: 21, momentum: "emerging", topGeos: ["Chennai", "Hyderabad", "Kochi"], relatedTopics: ["hair oils", "haircare", "ayurveda"] },
  { id: "tr_budget_audio", topic: "Sub-₹5K ANC Earbuds", category: "tech", description: "ANC at budget price points driving comparison-video spikes; purchase intent highest in tier-2 cities.", velocity: 70, sentiment: 0.48, growthRateWoW: 12, momentum: "rising", topGeos: ["Delhi NCR", "Patna", "Jaipur", "Kolkata"], relatedTopics: ["earbuds", "tech reviews", "unboxings"] },
  { id: "tr_ai_tools", topic: "AI Productivity Stacks", category: "tech", description: "Creators showcasing AI tool workflows; B2C SaaS conversion rates well above category average.", velocity: 90, sentiment: 0.66, growthRateWoW: 28, momentum: "rising", topGeos: ["Bengaluru", "Hyderabad", "Pune"], relatedTopics: ["AI", "productivity", "career"] },
  { id: "tr_high_protein", topic: "High-Protein Indian Meals", category: "food", description: "Desi high-protein recipe reels surging as fitness and food audiences converge.", velocity: 75, sentiment: 0.64, growthRateWoW: 17, momentum: "rising", topGeos: ["Mumbai", "Delhi NCR", "Bengaluru"], relatedTopics: ["high protein", "recipes", "meal prep"] },
  { id: "tr_kombucha", topic: "Gut Health & Fermentation", category: "food", description: "Kombucha, kefir, and kanji content rising; gut-health framing outperforms 'detox' framing.", velocity: 67, sentiment: 0.53, growthRateWoW: 15, momentum: "rising", topGeos: ["Bengaluru", "Mumbai", "Delhi NCR"], relatedTopics: ["wellness", "functional beverage", "healthy eating"] },
  { id: "tr_fno_warning", topic: "Invest-Boring Counter-Content", category: "finance", description: "SEBI-aligned 'invest boring' content trending against F&O loss-story confessionals.", velocity: 75, sentiment: 0.2, growthRateWoW: 11, momentum: "peaking", topGeos: ["Mumbai", "Delhi NCR", "Ahmedabad"], relatedTopics: ["investing", "SIPs", "investor education"] },
  { id: "tr_digital_gold", topic: "Digital Gold SIPs", category: "finance", description: "Micro gold-investing content growing in tier-2/3; strong with first-jobber and women audiences.", velocity: 61, sentiment: 0.51, growthRateWoW: 16, momentum: "emerging", topGeos: ["Kochi", "Lucknow", "Jaipur"], relatedTopics: ["investing", "saving", "career"] },
  { id: "tr_quiet_luxury", topic: "Quiet Luxury Ethnic", category: "fashion", description: "Understated handloom and linen replacing logo-heavy looks in metro 25-40 segment.", velocity: 55, sentiment: 0.58, growthRateWoW: 8, momentum: "emerging", topGeos: ["Delhi NCR", "Mumbai", "Bengaluru"], relatedTopics: ["fashion", "styling", "outfits"] },
  { id: "tr_run_clubs", topic: "Run Clubs as Social Scene", category: "fitness", description: "Sunday run clubs becoming social and networking venues; shoe and apparel brands sponsoring chapters.", velocity: 82, sentiment: 0.69, growthRateWoW: 19, momentum: "rising", topGeos: ["Mumbai", "Bengaluru", "Delhi NCR", "Pune"], relatedTopics: ["running", "athleisure", "fitness"] },
];

export async function seed(db: Db) {
  await db.insert(brands).values(BRANDS);
  await db.insert(products).values(PRODUCTS);

  await db.insert(creators).values(
    C.map((c) => {
      const platforms: PlatformPresence[] = [
        { platform: "instagram", handle: c.igHandle, followers: c.ig, avgViews: Math.round(c.ig * 0.3), engagementRate: c.eng },
      ];
      if (c.yt > 0 && c.ytHandle) {
        platforms.push({ platform: "youtube", handle: c.ytHandle, followers: c.yt, avgViews: Math.round(c.yt * 0.15), engagementRate: +(c.eng * 0.8).toFixed(1) });
      }
      return {
        id: c.id, name: c.name, niche: c.niche, bio: c.bio, location: c.location,
        languages: c.languages, contentTopics: c.topics, platforms,
        totalFollowers: c.ig + c.yt, engagementRate: c.eng, audienceQuality: c.quality,
        credibilityScore: c.credibility, growthRateMoM: c.growth,
        ratePerCampaignInr: c.rate, fraudRisk: c.fraud,
      };
    })
  );

  await db.insert(audiences).values(
    C.map((c) => ({
      id: `au_${c.id}`,
      creatorId: c.id,
      ageDistribution: c.aud.age,
      genderSplit: c.aud.gender,
      topGeos: c.aud.geos,
      languages: c.languages,
      interests: c.aud.interests,
      affinities: c.aud.affinities,
      purchaseIntent: c.aud.intent,
      incomeProfile: c.aud.income,
    }))
  );

  await db.insert(campaigns).values(CAMPAIGNS.map(({ lineup: _lineup, ...cp }) => cp));

  await db.insert(campaignCreators).values(
    CAMPAIGNS.flatMap((cp) =>
      cp.lineup.map((l, i) => ({
        id: `cc_${cp.id}_${i}`,
        campaignId: cp.id,
        creatorId: l.creatorId,
        feeInr: l.feeInr,
        deliverables: l.deliverables,
        actual: l.actual,
      }))
    )
  );

  await db.insert(trends).values(TRENDS);

  const edges: (typeof graphEdges.$inferInsert)[] = [];
  let e = 0;
  const edge = (fromType: string, fromId: string, toType: string, toId: string, edgeType: string, weight: number) =>
    edges.push({ id: `ed_${e++}`, fromType, fromId, toType, toId, edgeType, weight });

  for (const c of C) {
    for (const t of c.topics) edge("creator", c.id, "topic", t, "influences", 0.8);
    for (const a of c.aud.affinities) edge("audience", `au_${c.id}`, "topic", a, "affinity", 0.7);
  }
  for (const cp of CAMPAIGNS) {
    edge("campaign", cp.id, "product", cp.productId, "promotes", 1);
    for (const l of cp.lineup) {
      const w = l.actual ? Math.min(1, l.actual.roas / 4) : 0.5;
      edge("creator", l.creatorId, "campaign", cp.id, "worked_on", w);
      if (l.actual) edge("creator", l.creatorId, "product", cp.productId, "sold_for", w);
    }
  }
  for (const t of TRENDS) {
    for (const c of C) {
      if (c.niche === t.category || c.topics.some((tp) => t.relatedTopics.includes(tp))) {
        edge("creator", c.id, "trend", t.id, "rides_trend", t.velocity / 100);
      }
    }
  }
  await db.insert(graphEdges).values(edges);
}
