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

type CreatorSpec = {
  id: string;
  name: string;
  niche: string;
  bio: string;
  location: string;
  languages: string[];
  topics: string[];
  ig: number; // instagram followers
  yt: number; // youtube subs (0 = none)
  eng: number; // blended engagement %
  quality: number;
  credibility: number;
  growth: number;
  rate: number; // per-campaign fee INR
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
    id: "cr_arjun_fit", name: "Arjun Mehta", niche: "fitness",
    bio: "Strength coach. Science-based training & Indian-diet nutrition breakdowns.",
    location: "Bengaluru", languages: ["English", "Hindi"],
    topics: ["strength training", "protein nutrition", "fat loss", "gym programming"],
    ig: 820000, yt: 1400000, eng: 4.8, quality: 88, credibility: 91, growth: 3.2, rate: 650000, fraud: 4,
    aud: {
      age: { "18-24": 38, "25-34": 41, "35-44": 14, "45+": 7 },
      gender: { male: 78, female: 21, other: 1 },
      geos: [{ city: "Bengaluru", pct: 18 }, { city: "Mumbai", pct: 14 }, { city: "Delhi NCR", pct: 13 }, { city: "Hyderabad", pct: 11 }],
      interests: ["bodybuilding", "supplements", "running", "meal prep"],
      affinities: ["protein powder", "fitness wearables", "gym apparel"],
      intent: 74, income: "mid",
    },
  },
  {
    id: "cr_priya_yoga", name: "Priya Nair", niche: "fitness",
    bio: "Yoga & mobility for desk workers. 30-day habit challenges.",
    location: "Kochi", languages: ["English", "Malayalam", "Hindi"],
    topics: ["yoga", "mobility", "stress relief", "morning routines"],
    ig: 540000, yt: 380000, eng: 6.1, quality: 90, credibility: 93, growth: 4.5, rate: 380000, fraud: 3,
    aud: {
      age: { "18-24": 26, "25-34": 44, "35-44": 21, "45+": 9 },
      gender: { male: 31, female: 68, other: 1 },
      geos: [{ city: "Kochi", pct: 12 }, { city: "Bengaluru", pct: 16 }, { city: "Chennai", pct: 13 }, { city: "Mumbai", pct: 10 }],
      interests: ["yoga", "wellness", "ayurveda", "healthy eating"],
      affinities: ["athleisure", "herbal supplements", "meditation apps"],
      intent: 68, income: "mid",
    },
  },
  {
    id: "cr_rohit_run", name: "Rohit Deshpande", niche: "fitness",
    bio: "Marathoner. Couch-to-42K training plans and race-day gear reviews.",
    location: "Pune", languages: ["English", "Marathi", "Hindi"],
    topics: ["running", "endurance", "race training", "running shoes"],
    ig: 290000, yt: 210000, eng: 5.4, quality: 86, credibility: 89, growth: 2.8, rate: 220000, fraud: 5,
    aud: {
      age: { "18-24": 22, "25-34": 46, "35-44": 23, "45+": 9 },
      gender: { male: 64, female: 35, other: 1 },
      geos: [{ city: "Pune", pct: 17 }, { city: "Mumbai", pct: 15 }, { city: "Bengaluru", pct: 12 }, { city: "Delhi NCR", pct: 9 }],
      interests: ["running", "marathons", "fitness tracking", "nutrition"],
      affinities: ["running shoes", "energy gels", "fitness wearables", "protein powder"],
      intent: 71, income: "high",
    },
  },
  {
    id: "cr_sana_lift", name: "Sana Qureshi", niche: "fitness",
    bio: "Women's strength training. Busting gym myths in Hindi.",
    location: "Lucknow", languages: ["Hindi", "English"],
    topics: ["women's fitness", "strength training", "home workouts", "protein for women"],
    ig: 410000, yt: 95000, eng: 7.2, quality: 84, credibility: 87, growth: 6.8, rate: 260000, fraud: 6,
    aud: {
      age: { "18-24": 44, "25-34": 39, "35-44": 12, "45+": 5 },
      gender: { male: 22, female: 77, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 16 }, { city: "Lucknow", pct: 12 }, { city: "Jaipur", pct: 9 }, { city: "Mumbai", pct: 9 }],
      interests: ["home workouts", "weight loss", "healthy recipes", "self care"],
      affinities: ["protein powder", "activewear", "fitness apps"],
      intent: 66, income: "mid",
    },
  },
  {
    id: "cr_kavya_skin", name: "Kavya Reddy", niche: "beauty",
    bio: "Dermatology-first skincare. Ingredient deep dives for Indian skin.",
    location: "Hyderabad", languages: ["English", "Telugu"],
    topics: ["skincare", "ingredients", "acne", "sunscreen"],
    ig: 950000, yt: 620000, eng: 5.6, quality: 89, credibility: 94, growth: 3.9, rate: 720000, fraud: 3,
    aud: {
      age: { "18-24": 47, "25-34": 38, "35-44": 11, "45+": 4 },
      gender: { male: 14, female: 85, other: 1 },
      geos: [{ city: "Hyderabad", pct: 14 }, { city: "Bengaluru", pct: 14 }, { city: "Chennai", pct: 11 }, { city: "Mumbai", pct: 11 }],
      interests: ["skincare", "makeup", "K-beauty", "haircare"],
      affinities: ["serums", "sunscreen", "clean beauty", "dermo-cosmetics"],
      intent: 81, income: "mid",
    },
  },
  {
    id: "cr_mira_glow", name: "Mira D'Souza", niche: "beauty",
    bio: "Makeup artist. Bridal looks and affordable dupes.",
    location: "Mumbai", languages: ["English", "Hindi"],
    topics: ["makeup", "bridal", "tutorials", "drugstore dupes"],
    ig: 1300000, yt: 480000, eng: 3.9, quality: 78, credibility: 82, growth: 2.1, rate: 850000, fraud: 12,
    aud: {
      age: { "18-24": 52, "25-34": 35, "35-44": 9, "45+": 4 },
      gender: { male: 11, female: 88, other: 1 },
      geos: [{ city: "Mumbai", pct: 19 }, { city: "Delhi NCR", pct: 14 }, { city: "Pune", pct: 9 }, { city: "Ahmedabad", pct: 8 }],
      interests: ["makeup", "fashion", "weddings", "celebrities"],
      affinities: ["lipstick", "foundation", "affordable beauty"],
      intent: 72, income: "mixed",
    },
  },
  {
    id: "cr_ananya_hair", name: "Ananya Iyer", niche: "beauty",
    bio: "Curly hair care for Indian hair types. Routines, not products-first.",
    location: "Chennai", languages: ["English", "Tamil"],
    topics: ["haircare", "curly hair", "hair oils", "scalp health"],
    ig: 360000, yt: 150000, eng: 6.8, quality: 91, credibility: 90, growth: 5.5, rate: 240000, fraud: 2,
    aud: {
      age: { "18-24": 41, "25-34": 42, "35-44": 12, "45+": 5 },
      gender: { male: 9, female: 90, other: 1 },
      geos: [{ city: "Chennai", pct: 18 }, { city: "Bengaluru", pct: 15 }, { city: "Coimbatore", pct: 8 }, { city: "Hyderabad", pct: 8 }],
      interests: ["haircare", "natural beauty", "skincare", "wellness"],
      affinities: ["hair oils", "sulfate-free shampoo", "leave-in conditioners"],
      intent: 77, income: "mid",
    },
  },
  {
    id: "cr_dev_tech", name: "Dev Sharma", niche: "tech",
    bio: "Smartphone reviews under ₹30K. No sponsored scores, ever.",
    location: "Delhi NCR", languages: ["Hindi", "English"],
    topics: ["smartphones", "budget tech", "reviews", "comparisons"],
    ig: 480000, yt: 2100000, eng: 4.1, quality: 85, credibility: 88, growth: 2.5, rate: 900000, fraud: 5,
    aud: {
      age: { "18-24": 49, "25-34": 36, "35-44": 11, "45+": 4 },
      gender: { male: 84, female: 15, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 16 }, { city: "Mumbai", pct: 11 }, { city: "Patna", pct: 8 }, { city: "Jaipur", pct: 8 }],
      interests: ["smartphones", "gadgets", "gaming", "PC builds"],
      affinities: ["budget smartphones", "earbuds", "power banks"],
      intent: 79, income: "mixed",
    },
  },
  {
    id: "cr_nisha_code", name: "Nisha Verma", niche: "tech",
    bio: "Software engineering careers, system design, and dev tooling.",
    location: "Bengaluru", languages: ["English"],
    topics: ["programming", "career advice", "AI tools", "productivity"],
    ig: 220000, yt: 640000, eng: 5.0, quality: 92, credibility: 93, growth: 4.8, rate: 420000, fraud: 2,
    aud: {
      age: { "18-24": 43, "25-34": 47, "35-44": 8, "45+": 2 },
      gender: { male: 71, female: 28, other: 1 },
      geos: [{ city: "Bengaluru", pct: 24 }, { city: "Hyderabad", pct: 14 }, { city: "Pune", pct: 11 }, { city: "Delhi NCR", pct: 10 }],
      interests: ["coding", "AI", "startups", "online courses"],
      affinities: ["SaaS tools", "online courses", "laptops", "fintech apps"],
      intent: 75, income: "high",
    },
  },
  {
    id: "cr_zaid_gadget", name: "Zaid Khan", niche: "tech",
    bio: "Audio nerd. Earbuds, headphones and hi-fi on a budget.",
    location: "Mumbai", languages: ["Hindi", "English"],
    topics: ["audio", "earbuds", "headphones", "unboxings"],
    ig: 310000, yt: 880000, eng: 4.6, quality: 83, credibility: 85, growth: 3.4, rate: 380000, fraud: 7,
    aud: {
      age: { "18-24": 51, "25-34": 35, "35-44": 10, "45+": 4 },
      gender: { male: 80, female: 19, other: 1 },
      geos: [{ city: "Mumbai", pct: 15 }, { city: "Delhi NCR", pct: 13 }, { city: "Kolkata", pct: 9 }, { city: "Bengaluru", pct: 9 }],
      interests: ["music", "gadgets", "smartphones", "gaming"],
      affinities: ["earbuds", "headphones", "budget audio"],
      intent: 76, income: "mixed",
    },
  },
  {
    id: "cr_meghna_cook", name: "Meghna Joshi", niche: "food",
    bio: "20-minute high-protein Indian recipes for working professionals.",
    location: "Mumbai", languages: ["Hindi", "English"],
    topics: ["healthy recipes", "high protein", "meal prep", "Indian cooking"],
    ig: 1100000, yt: 720000, eng: 5.2, quality: 87, credibility: 90, growth: 4.1, rate: 700000, fraud: 4,
    aud: {
      age: { "18-24": 31, "25-34": 45, "35-44": 17, "45+": 7 },
      gender: { male: 38, female: 61, other: 1 },
      geos: [{ city: "Mumbai", pct: 16 }, { city: "Delhi NCR", pct: 13 }, { city: "Bengaluru", pct: 12 }, { city: "Pune", pct: 9 }],
      interests: ["cooking", "fitness", "meal prep", "nutrition"],
      affinities: ["protein powder", "kitchen appliances", "health foods"],
      intent: 73, income: "mid",
    },
  },
  {
    id: "cr_suresh_street", name: "Suresh Babu", niche: "food",
    bio: "Street food hunts across South India. Vendor stories first.",
    location: "Chennai", languages: ["Tamil", "English"],
    topics: ["street food", "food travel", "South Indian cuisine"],
    ig: 680000, yt: 1500000, eng: 4.4, quality: 81, credibility: 84, growth: 3.0, rate: 520000, fraud: 8,
    aud: {
      age: { "18-24": 39, "25-34": 38, "35-44": 16, "45+": 7 },
      gender: { male: 58, female: 41, other: 1 },
      geos: [{ city: "Chennai", pct: 21 }, { city: "Bengaluru", pct: 14 }, { city: "Madurai", pct: 9 }, { city: "Hyderabad", pct: 9 }],
      interests: ["food", "travel", "local culture"],
      affinities: ["food delivery", "snacks", "beverages"],
      intent: 62, income: "mixed",
    },
  },
  {
    id: "cr_ira_baker", name: "Ira Kapoor", niche: "food",
    bio: "Eggless baking science. Why your cake failed, explained.",
    location: "Delhi NCR", languages: ["Hindi", "English"],
    topics: ["baking", "eggless recipes", "desserts"],
    ig: 430000, yt: 260000, eng: 6.3, quality: 88, credibility: 89, growth: 5.0, rate: 280000, fraud: 3,
    aud: {
      age: { "18-24": 35, "25-34": 41, "35-44": 17, "45+": 7 },
      gender: { male: 18, female: 81, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 19 }, { city: "Mumbai", pct: 12 }, { city: "Chandigarh", pct: 8 }, { city: "Lucknow", pct: 8 }],
      interests: ["baking", "cooking", "home decor", "crafts"],
      affinities: ["kitchen appliances", "baking ingredients", "cookware"],
      intent: 70, income: "mid",
    },
  },
  {
    id: "cr_vikram_money", name: "Vikram Anand", niche: "finance",
    bio: "Personal finance without jargon. SIPs, tax, and salary structuring.",
    location: "Mumbai", languages: ["English", "Hindi"],
    topics: ["investing", "mutual funds", "tax planning", "personal finance"],
    ig: 590000, yt: 1800000, eng: 3.8, quality: 90, credibility: 92, growth: 3.6, rate: 1100000, fraud: 4,
    aud: {
      age: { "18-24": 33, "25-34": 49, "35-44": 14, "45+": 4 },
      gender: { male: 72, female: 27, other: 1 },
      geos: [{ city: "Mumbai", pct: 15 }, { city: "Bengaluru", pct: 14 }, { city: "Delhi NCR", pct: 13 }, { city: "Pune", pct: 9 }],
      interests: ["investing", "stocks", "startups", "credit cards"],
      affinities: ["broking apps", "credit cards", "insurance", "fintech apps"],
      intent: 82, income: "high",
    },
  },
  {
    id: "cr_lakshmi_fin", name: "Lakshmi Menon", niche: "finance",
    bio: "Money basics for first-jobbers, in Malayalam and English.",
    location: "Thiruvananthapuram", languages: ["Malayalam", "English"],
    topics: ["budgeting", "first salary", "emergency funds", "gold vs equity"],
    ig: 270000, yt: 410000, eng: 5.7, quality: 89, credibility: 91, growth: 6.2, rate: 300000, fraud: 3,
    aud: {
      age: { "18-24": 48, "25-34": 41, "35-44": 8, "45+": 3 },
      gender: { male: 55, female: 44, other: 1 },
      geos: [{ city: "Kochi", pct: 17 }, { city: "Thiruvananthapuram", pct: 13 }, { city: "Bengaluru", pct: 12 }, { city: "Chennai", pct: 8 }],
      interests: ["saving", "investing", "career", "upskilling"],
      affinities: ["fintech apps", "digital gold", "online courses"],
      intent: 78, income: "mid",
    },
  },
  {
    id: "cr_tara_style", name: "Tara Bhatia", niche: "fashion",
    bio: "Capsule wardrobes & sustainable Indian labels.",
    location: "Delhi NCR", languages: ["English", "Hindi"],
    topics: ["fashion", "sustainable style", "capsule wardrobe", "thrifting"],
    ig: 760000, yt: 180000, eng: 4.9, quality: 84, credibility: 86, growth: 3.7, rate: 480000, fraud: 6,
    aud: {
      age: { "18-24": 46, "25-34": 40, "35-44": 10, "45+": 4 },
      gender: { male: 17, female: 82, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 18 }, { city: "Mumbai", pct: 15 }, { city: "Bengaluru", pct: 11 }, { city: "Chandigarh", pct: 7 }],
      interests: ["fashion", "sustainability", "beauty", "lifestyle"],
      affinities: ["ethnic wear", "athleisure", "accessories"],
      intent: 74, income: "high",
    },
  },
  {
    id: "cr_kabir_sneaker", name: "Kabir Singh", niche: "fashion",
    bio: "Sneaker culture India. Drops, resale, and on-feet reviews.",
    location: "Mumbai", languages: ["Hindi", "English"],
    topics: ["sneakers", "streetwear", "drops", "resale"],
    ig: 520000, yt: 340000, eng: 5.8, quality: 80, credibility: 81, growth: 7.4, rate: 360000, fraud: 9,
    aud: {
      age: { "18-24": 58, "25-34": 33, "35-44": 7, "45+": 2 },
      gender: { male: 76, female: 23, other: 1 },
      geos: [{ city: "Mumbai", pct: 17 }, { city: "Delhi NCR", pct: 15 }, { city: "Bengaluru", pct: 10 }, { city: "Hyderabad", pct: 8 }],
      interests: ["sneakers", "streetwear", "hip hop", "gaming"],
      affinities: ["sneakers", "sports apparel", "running shoes"],
      intent: 80, income: "mixed",
    },
  },
  {
    id: "cr_arnav_game", name: "Arnav Kulkarni", niche: "gaming",
    bio: "BGMI & Valorant. Competitive breakdowns and device settings.",
    location: "Pune", languages: ["Hindi", "English"],
    topics: ["BGMI", "Valorant", "esports", "gaming gear"],
    ig: 440000, yt: 1900000, eng: 6.5, quality: 79, credibility: 80, growth: 5.9, rate: 560000, fraud: 10,
    aud: {
      age: { "13-17": 18, "18-24": 56, "25-34": 22, "35+": 4 },
      gender: { male: 88, female: 11, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 13 }, { city: "Mumbai", pct: 12 }, { city: "Pune", pct: 10 }, { city: "Kolkata", pct: 9 }],
      interests: ["gaming", "esports", "anime", "gadgets"],
      affinities: ["gaming phones", "earbuds", "energy drinks", "gaming chairs"],
      intent: 69, income: "low",
    },
  },
  {
    id: "cr_fatima_cozy", name: "Fatima Sheikh", niche: "gaming",
    bio: "Cozy and indie games. Switch & PC, zero sweat.",
    location: "Hyderabad", languages: ["English", "Hindi"],
    topics: ["indie games", "cozy games", "game reviews"],
    ig: 180000, yt: 520000, eng: 7.0, quality: 90, credibility: 88, growth: 8.1, rate: 250000, fraud: 2,
    aud: {
      age: { "18-24": 47, "25-34": 41, "35-44": 9, "45+": 3 },
      gender: { male: 49, female: 50, other: 1 },
      geos: [{ city: "Bengaluru", pct: 15 }, { city: "Hyderabad", pct: 13 }, { city: "Mumbai", pct: 11 }, { city: "Delhi NCR", pct: 10 }],
      interests: ["gaming", "anime", "art", "tech"],
      affinities: ["gaming subscriptions", "merch", "headphones"],
      intent: 67, income: "mid",
    },
  },
  {
    id: "cr_aditya_trek", name: "Aditya Rawat", niche: "travel",
    bio: "Himalayan treks on a student budget. Gear lists & permits explained.",
    location: "Dehradun", languages: ["Hindi", "English"],
    topics: ["trekking", "budget travel", "Himalayas", "camping gear"],
    ig: 350000, yt: 470000, eng: 5.9, quality: 86, credibility: 88, growth: 4.4, rate: 300000, fraud: 5,
    aud: {
      age: { "18-24": 45, "25-34": 42, "35-44": 10, "45+": 3 },
      gender: { male: 66, female: 33, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 18 }, { city: "Mumbai", pct: 11 }, { city: "Bengaluru", pct: 11 }, { city: "Chandigarh", pct: 8 }],
      interests: ["trekking", "photography", "fitness", "camping"],
      affinities: ["backpacks", "trekking shoes", "action cameras", "energy bars"],
      intent: 72, income: "mid",
    },
  },
  {
    id: "cr_riya_luxe", name: "Riya Malhotra", niche: "travel",
    bio: "Weekend luxury getaways & boutique stays across India.",
    location: "Gurugram", languages: ["English", "Hindi"],
    topics: ["luxury travel", "resorts", "weekend trips", "food & stay reviews"],
    ig: 610000, yt: 120000, eng: 4.2, quality: 82, credibility: 84, growth: 2.9, rate: 450000, fraud: 8,
    aud: {
      age: { "18-24": 28, "25-34": 47, "35-44": 19, "45+": 6 },
      gender: { male: 35, female: 64, other: 1 },
      geos: [{ city: "Delhi NCR", pct: 22 }, { city: "Mumbai", pct: 14 }, { city: "Bengaluru", pct: 10 }, { city: "Jaipur", pct: 7 }],
      interests: ["travel", "fine dining", "fashion", "wellness"],
      affinities: ["hotels", "airlines", "premium credit cards", "luggage"],
      intent: 76, income: "high",
    },
  },
];

const BRANDS = [
  { id: "br_vitalfuel", name: "VitalFuel", industry: "Sports Nutrition", description: "D2C sports nutrition brand. Whey, plant protein, and recovery supplements." },
  { id: "br_glowtheory", name: "GlowTheory", industry: "Beauty & Personal Care", description: "Dermo-cosmetic skincare built for Indian skin and climate." },
  { id: "br_soundcore_in", name: "PulseAudio", industry: "Consumer Electronics", description: "Budget-premium audio: TWS earbuds and headphones." },
  { id: "br_paisaplan", name: "PaisaPlan", industry: "Fintech", description: "Investment app for first-time investors. SIPs, digital gold, and tax filing." },
  { id: "br_striderz", name: "Striderz", industry: "Footwear & Apparel", description: "Performance running shoes and athleisure designed in India." },
  { id: "br_zenbrew", name: "ZenBrew", industry: "Food & Beverage", description: "Functional beverages: green tea, kombucha, and clean energy drinks." },
];

const PRODUCTS = [
  { id: "pr_whey_iso", brandId: "br_vitalfuel", name: "IsoPrime Whey Protein", category: "protein supplement", priceInr: 3499, marginPct: 38, targetAgeRange: "18-34", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"], targetInterests: ["bodybuilding", "fitness", "meal prep", "running"] },
  { id: "pr_plant_protein", brandId: "br_vitalfuel", name: "TerraPlant Protein", category: "protein supplement", priceInr: 2899, marginPct: 42, targetAgeRange: "22-40", targetGender: "female", targetGeos: ["Bengaluru", "Mumbai", "Chennai", "Kochi"], targetInterests: ["yoga", "wellness", "healthy eating"] },
  { id: "pr_protein_bar", brandId: "br_vitalfuel", name: "VitalFuel Protein Bar", category: "protein snack", priceInr: 129, marginPct: 45, targetAgeRange: "18-35", targetGender: "all", targetGeos: ["Mumbai", "Delhi NCR", "Bengaluru"], targetInterests: ["fitness", "snacks", "trekking", "running"] },
  { id: "pr_vitc_serum", brandId: "br_glowtheory", name: "10% Vitamin C Serum", category: "skincare", priceInr: 899, marginPct: 55, targetAgeRange: "18-34", targetGender: "female", targetGeos: ["Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi NCR"], targetInterests: ["skincare", "beauty", "wellness"] },
  { id: "pr_spf50", brandId: "br_glowtheory", name: "Invisible SPF50 Sunscreen", category: "skincare", priceInr: 649, marginPct: 52, targetAgeRange: "18-40", targetGender: "all", targetGeos: ["Mumbai", "Chennai", "Hyderabad", "Delhi NCR"], targetInterests: ["skincare", "outdoors", "beauty"] },
  { id: "pr_tws_pro", brandId: "br_soundcore_in", name: "PulseBuds Pro ANC", category: "earbuds", priceInr: 4999, marginPct: 30, targetAgeRange: "18-30", targetGender: "all", targetGeos: ["Delhi NCR", "Mumbai", "Bengaluru", "Kolkata"], targetInterests: ["music", "gadgets", "gaming", "smartphones"] },
  { id: "pr_sip_app", brandId: "br_paisaplan", name: "PaisaPlan SIP Account", category: "fintech app", priceInr: 500, marginPct: 80, targetAgeRange: "21-35", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Kochi"], targetInterests: ["investing", "saving", "career"] },
  { id: "pr_run_shoe", brandId: "br_striderz", name: "Striderz Velocity 2", category: "running shoes", priceInr: 5499, marginPct: 44, targetAgeRange: "20-40", targetGender: "all", targetGeos: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR"], targetInterests: ["running", "fitness", "marathons", "sneakers"] },
  { id: "pr_kombucha", brandId: "br_zenbrew", name: "ZenBrew Kombucha", category: "functional beverage", priceInr: 149, marginPct: 48, targetAgeRange: "22-38", targetGender: "all", targetGeos: ["Bengaluru", "Mumbai", "Delhi NCR"], targetInterests: ["wellness", "healthy eating", "yoga", "food"] },
  { id: "pr_clean_energy", brandId: "br_zenbrew", name: "ZenBrew Clean Energy", category: "functional beverage", priceInr: 99, marginPct: 50, targetAgeRange: "18-28", targetGender: "all", targetGeos: ["Delhi NCR", "Mumbai", "Pune", "Kolkata"], targetInterests: ["gaming", "fitness", "study", "esports"] },
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
    budgetInr: 2000000, spendInr: 1870000, startDate: "2026-01-10", endDate: "2026-02-28",
    predicted: outcome(1870000, 2600000, 0.011, 0.026, 3499),
    actual: outcome(1870000, 2840000, 0.012, 0.028, 3499),
    lineup: [
      { creatorId: "cr_arjun_fit", feeInr: 650000, deliverables: ["2 reels", "1 YT integration", "stories x4"], actual: outcome(650000, 1250000, 0.014, 0.032, 3499) },
      { creatorId: "cr_meghna_cook", feeInr: 700000, deliverables: ["3 recipe reels", "stories x3"], actual: outcome(700000, 980000, 0.011, 0.027, 3499) },
      { creatorId: "cr_sana_lift", feeInr: 260000, deliverables: ["2 reels", "stories x4"], actual: outcome(260000, 430000, 0.012, 0.024, 3499) },
      { creatorId: "cr_rohit_run", feeInr: 220000, deliverables: ["1 reel", "1 YT mention"], actual: outcome(220000, 180000, 0.009, 0.021, 3499) },
    ],
  },
  {
    id: "cp_serum_diwali", brandId: "br_glowtheory", productId: "pr_vitc_serum",
    name: "Vitamin C Festive Push", objective: "conversions", status: "completed",
    budgetInr: 1500000, spendInr: 1460000, startDate: "2025-10-05", endDate: "2025-11-15",
    predicted: outcome(1460000, 2300000, 0.013, 0.034, 899),
    actual: outcome(1460000, 2510000, 0.015, 0.038, 899),
    lineup: [
      { creatorId: "cr_kavya_skin", feeInr: 720000, deliverables: ["ingredient deep-dive YT", "2 reels"], actual: outcome(720000, 1480000, 0.017, 0.042, 899) },
      { creatorId: "cr_ananya_hair", feeInr: 240000, deliverables: ["2 reels", "stories x4"], actual: outcome(240000, 520000, 0.014, 0.036, 899) },
      { creatorId: "cr_mira_glow", feeInr: 500000, deliverables: ["1 GRWM reel", "stories x2"], actual: outcome(500000, 510000, 0.009, 0.022, 899) },
    ],
  },
  {
    id: "cp_buds_launch", brandId: "br_soundcore_in", productId: "pr_tws_pro",
    name: "PulseBuds Pro Launch", objective: "launch", status: "completed",
    budgetInr: 2500000, spendInr: 2390000, startDate: "2025-11-20", endDate: "2026-01-05",
    predicted: outcome(2390000, 4100000, 0.014, 0.019, 4999),
    actual: outcome(2390000, 3780000, 0.013, 0.017, 4999),
    lineup: [
      { creatorId: "cr_dev_tech", feeInr: 900000, deliverables: ["full review YT", "1 short"], actual: outcome(900000, 1650000, 0.015, 0.019, 4999) },
      { creatorId: "cr_zaid_gadget", feeInr: 380000, deliverables: ["comparison YT", "2 reels"], actual: outcome(380000, 940000, 0.016, 0.021, 4999) },
      { creatorId: "cr_arnav_game", feeInr: 560000, deliverables: ["gaming latency test", "stream mention"], actual: outcome(560000, 820000, 0.010, 0.012, 4999) },
      { creatorId: "cr_fatima_cozy", feeInr: 250000, deliverables: ["1 video integration"], actual: outcome(250000, 370000, 0.012, 0.016, 4999) },
    ],
  },
  {
    id: "cp_sip_newyear", brandId: "br_paisaplan", productId: "pr_sip_app",
    name: "New Year, First SIP", objective: "conversions", status: "completed",
    budgetInr: 1800000, spendInr: 1750000, startDate: "2026-01-01", endDate: "2026-02-15",
    predicted: outcome(1750000, 2900000, 0.016, 0.06, 500),
    actual: outcome(1750000, 3150000, 0.018, 0.066, 500),
    lineup: [
      { creatorId: "cr_vikram_money", feeInr: 1100000, deliverables: ["explainer YT", "2 reels"], actual: outcome(1100000, 2100000, 0.019, 0.071, 500) },
      { creatorId: "cr_lakshmi_fin", feeInr: 300000, deliverables: ["2 reels Malayalam+English", "stories x4"], actual: outcome(300000, 720000, 0.018, 0.064, 500) },
      { creatorId: "cr_nisha_code", feeInr: 350000, deliverables: ["1 integration", "community post"], actual: outcome(350000, 330000, 0.012, 0.048, 500) },
    ],
  },
  {
    id: "cp_velocity_mar", brandId: "br_striderz", productId: "pr_run_shoe",
    name: "Velocity 2 Marathon Season", objective: "conversions", status: "completed",
    budgetInr: 1200000, spendInr: 1130000, startDate: "2025-12-01", endDate: "2026-01-31",
    predicted: outcome(1130000, 1500000, 0.012, 0.024, 5499),
    actual: outcome(1130000, 1620000, 0.013, 0.027, 5499),
    lineup: [
      { creatorId: "cr_rohit_run", feeInr: 220000, deliverables: ["race-day review", "training reel"], actual: outcome(220000, 520000, 0.016, 0.033, 5499) },
      { creatorId: "cr_kabir_sneaker", feeInr: 360000, deliverables: ["on-feet review", "2 reels"], actual: outcome(360000, 680000, 0.013, 0.026, 5499) },
      { creatorId: "cr_aditya_trek", feeInr: 300000, deliverables: ["trail durability test"], actual: outcome(300000, 420000, 0.010, 0.019, 5499) },
    ],
  },
  {
    id: "cp_kombucha_blr", brandId: "br_zenbrew", productId: "pr_kombucha",
    name: "Kombucha Bengaluru Pilot", objective: "awareness", status: "completed",
    budgetInr: 800000, spendInr: 760000, startDate: "2026-02-10", endDate: "2026-03-20",
    predicted: outcome(760000, 1400000, 0.008, 0.03, 149),
    actual: outcome(760000, 1280000, 0.007, 0.026, 149),
    lineup: [
      { creatorId: "cr_priya_yoga", feeInr: 380000, deliverables: ["morning routine reel x2"], actual: outcome(380000, 690000, 0.008, 0.028, 149) },
      { creatorId: "cr_meghna_cook", feeInr: 350000, deliverables: ["recipe pairing reel"], actual: outcome(350000, 590000, 0.006, 0.024, 149) },
    ],
  },
  {
    id: "cp_spf_summer", brandId: "br_glowtheory", productId: "pr_spf50",
    name: "SPF50 Summer Campaign", objective: "conversions", status: "active",
    budgetInr: 1600000, spendInr: 640000, startDate: "2026-05-15", endDate: "2026-07-15",
    predicted: outcome(1600000, 2700000, 0.014, 0.035, 649),
    actual: null,
    lineup: [
      { creatorId: "cr_kavya_skin", feeInr: 720000, deliverables: ["SPF myths YT", "3 reels"], actual: null },
      { creatorId: "cr_riya_luxe", feeInr: 450000, deliverables: ["poolside integration x2"], actual: null },
      { creatorId: "cr_aditya_trek", feeInr: 300000, deliverables: ["high-altitude SPF test"], actual: null },
    ],
  },
  {
    id: "cp_energy_esports", brandId: "br_zenbrew", productId: "pr_clean_energy",
    name: "Clean Energy x Esports", objective: "launch", status: "active",
    budgetInr: 1000000, spendInr: 410000, startDate: "2026-06-01", endDate: "2026-07-31",
    predicted: outcome(1000000, 2200000, 0.009, 0.022, 99),
    actual: null,
    lineup: [
      { creatorId: "cr_arnav_game", feeInr: 560000, deliverables: ["stream sponsorship x4", "2 shorts"], actual: null },
      { creatorId: "cr_fatima_cozy", feeInr: 250000, deliverables: ["2 video integrations"], actual: null },
    ],
  },
];

const TRENDS = [
  { id: "tr_protein_coffee", topic: "Protein Coffee (Proffee)", category: "fitness", description: "Creators blending protein into cold coffee; recipe formats outperforming standard supplement content 3:1.", velocity: 86, sentiment: 0.62, growthRateWoW: 24, momentum: "rising", topGeos: ["Bengaluru", "Mumbai", "Delhi NCR"], relatedTopics: ["high protein", "iced coffee", "meal prep"] },
  { id: "tr_pickleball", topic: "Pickleball Clubs", category: "fitness", description: "Urban pickleball courts booked out weeks ahead; corporate leagues forming in Bengaluru and Gurugram.", velocity: 78, sentiment: 0.71, growthRateWoW: 18, momentum: "rising", topGeos: ["Bengaluru", "Gurugram", "Mumbai"], relatedTopics: ["racquet sports", "corporate wellness", "athleisure"] },
  { id: "tr_skin_minimal", topic: "Skinimalism", category: "beauty", description: "3-step routines replacing 10-step content; 'fewer, better' messaging resonating with 25-34 segment.", velocity: 72, sentiment: 0.55, growthRateWoW: 9, momentum: "peaking", topGeos: ["Mumbai", "Bengaluru", "Hyderabad"], relatedTopics: ["sunscreen", "barrier repair", "clean beauty"] },
  { id: "tr_scalp_care", topic: "Scalp Care as Skincare", category: "beauty", description: "Scalp serums and oiling-routine content growing fast; strong overlap with traditional hair-oil habits.", velocity: 64, sentiment: 0.6, growthRateWoW: 21, momentum: "emerging", topGeos: ["Chennai", "Hyderabad", "Kochi"], relatedTopics: ["hair oils", "haircare", "ayurveda"] },
  { id: "tr_budget_audio", topic: "Sub-₹5K ANC Earbuds", category: "tech", description: "ANC at budget price points driving comparison-video spikes; purchase intent highest in tier-2 cities.", velocity: 70, sentiment: 0.48, growthRateWoW: 12, momentum: "rising", topGeos: ["Delhi NCR", "Patna", "Jaipur", "Kolkata"], relatedTopics: ["earbuds", "budget tech", "unboxings"] },
  { id: "tr_ai_tools", topic: "AI Productivity Stacks", category: "tech", description: "Creators showcasing AI tool workflows; B2C SaaS conversion rates 2x category average.", velocity: 90, sentiment: 0.66, growthRateWoW: 28, momentum: "rising", topGeos: ["Bengaluru", "Hyderabad", "Pune"], relatedTopics: ["AI", "productivity", "career"] },
  { id: "tr_millet", topic: "Millet Revival", category: "food", description: "Millet-based recipes and D2C snack brands riding government promotion; strong family-audience pull.", velocity: 58, sentiment: 0.59, growthRateWoW: 7, momentum: "peaking", topGeos: ["Chennai", "Bengaluru", "Hyderabad"], relatedTopics: ["healthy eating", "ancient grains", "snacks"] },
  { id: "tr_kombucha", topic: "Gut Health & Fermentation", category: "food", description: "Kombucha, kefir, and kanji content rising; gut-health framing outperforms 'detox' framing.", velocity: 67, sentiment: 0.53, growthRateWoW: 15, momentum: "rising", topGeos: ["Bengaluru", "Mumbai", "Delhi NCR"], relatedTopics: ["probiotics", "functional beverage", "wellness"] },
  { id: "tr_fno_warning", topic: "F&O Loss Stories", category: "finance", description: "Loss-story confessionals driving huge engagement; SEBI-aligned 'invest boring' counter-content trending.", velocity: 75, sentiment: -0.34, growthRateWoW: 11, momentum: "peaking", topGeos: ["Mumbai", "Delhi NCR", "Ahmedabad"], relatedTopics: ["options trading", "SIPs", "investor education"] },
  { id: "tr_digital_gold", topic: "Digital Gold SIPs", category: "finance", description: "Micro gold investing content growing in tier-2/3; strong with first-jobber and women audiences.", velocity: 61, sentiment: 0.51, growthRateWoW: 16, momentum: "emerging", topGeos: ["Kochi", "Lucknow", "Jaipur"], relatedTopics: ["gold", "micro investing", "saving"] },
  { id: "tr_quiet_luxury", topic: "Quiet Luxury Ethnic", category: "fashion", description: "Understated handloom and linen replacing logo-heavy looks in metro 25-40 segment.", velocity: 55, sentiment: 0.58, growthRateWoW: 8, momentum: "emerging", topGeos: ["Delhi NCR", "Mumbai", "Bengaluru"], relatedTopics: ["handloom", "sustainable fashion", "capsule wardrobe"] },
  { id: "tr_run_clubs", topic: "Run Clubs as Social Scene", category: "fitness", description: "Sunday run clubs becoming dating/networking venues; shoe and apparel brands sponsoring local chapters.", velocity: 82, sentiment: 0.69, growthRateWoW: 19, momentum: "rising", topGeos: ["Mumbai", "Bengaluru", "Delhi NCR", "Pune"], relatedTopics: ["running", "community", "athleisure", "running shoes"] },
];

export async function seed(db: Db) {
  await db.insert(brands).values(BRANDS);
  await db.insert(products).values(PRODUCTS);

  await db.insert(creators).values(
    C.map((c) => {
      const platforms: PlatformPresence[] = [
        { platform: "instagram", handle: `@${c.id.replace("cr_", "")}`, followers: c.ig, avgViews: Math.round(c.ig * 0.32), engagementRate: c.eng },
      ];
      if (c.yt > 0) {
        platforms.push({ platform: "youtube", handle: c.name.replace(/\s/g, ""), followers: c.yt, avgViews: Math.round(c.yt * 0.18), engagementRate: +(c.eng * 0.8).toFixed(1) });
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

  await db.insert(campaigns).values(
    CAMPAIGNS.map(({ lineup: _lineup, ...cp }) => cp)
  );

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

  // Graph edges: creator -> topic, creator -> trend, creator -> campaign, campaign -> product, product -> brand
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
