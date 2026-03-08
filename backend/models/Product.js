class Product {
  constructor(id, name, category, description, specifications, applications, packaging, price) {
    this.id = id;
    this.name = name;
    this.category = category; // 'fresh', 'dry', 'medicinal', 'ingredients'
    this.description = description;
    this.specifications = specifications;
    this.applications = applications; // Array of use cases
    this.packaging = packaging;
    this.price = price; // Bulk pricing structure
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

// Static product data for B2B mushroom supply
const products = [
  new Product(
    1,
    "Fresh Oyster Mushrooms",
    "fresh",
    "Premium quality fresh oyster mushrooms harvested from controlled environment facilities. Ideal for food processing, restaurants, and wholesale distribution.",
    {
      moisture: "85-90%",
      shelfLife: "7-10 days refrigerated",
      packingSize: "1kg, 5kg, 10kg boxes",
      origin: "Controlled environment cultivation"
    },
    ["Food Processing", "Restaurant Supply", "Wholesale Distribution", "Export"],
    "Ventilated corrugated boxes with temperature control",
    {
      currency: "USD",
      minOrder: "100kg",
      bulkPricing: "Contact for bulk rates"
    }
  ),
  new Product(
    2,
    "Button Mushrooms",
    "fresh",
    "Grade-A fresh button mushrooms with consistent size and quality. Suitable for industrial processing, canning, and fresh market supply.",
    {
      moisture: "88-92%",
      size: "20-40mm diameter",
      shelfLife: "10-14 days refrigerated",
      packingSize: "1kg, 5kg, 10kg boxes"
    },
    ["Canning Industry", "Food Processing", "Restaurant Chain Supply", "Export Markets"],
    "Food-grade packaging with optimal ventilation",
    {
      currency: "USD",
      minOrder: "500kg",
      bulkPricing: "Competitive wholesale rates available"
    }
  ),
  new Product(
    3,
    "Cordyceps",
    "medicinal",
    "Premium cultured Cordyceps sinensis for pharmaceutical and nutraceutical applications. Standardized active compounds for consistent potency.",
    {
      activeCompounds: "Cordycepin, Adenosine, Polysaccharides",
      moisture: "8-12%",
      purity: "≥95%",
      certification: "GMP, Organic certified"
    },
    ["Pharmaceutical Manufacturing", "Nutraceutical Production", "Health Supplements", "Research & Development"],
    "Pharmaceutical-grade sealed containers with desiccant",
    {
      currency: "USD",
      minOrder: "10kg",
      bulkPricing: "Price on inquiry based on specifications"
    }
  ),
  new Product(
    4,
    "Gucchi (Morel) Mushrooms",
    "fresh",
    "Wild and cultivated Morel mushrooms, dried and fresh varieties available. Premium grade for gourmet food industry and export markets.",
    {
      grade: "Premium A-Grade",
      moisture: "Fresh: 85%, Dried: 8-12%",
      size: "Large, Medium, Small grades available",
      processing: "Hand-picked and sorted"
    },
    ["Gourmet Food Industry", "High-end Restaurants", "Export Markets", "Specialty Food Processing"],
    "Temperature-controlled packaging for freshness",
    {
      currency: "USD",
      minOrder: "25kg",
      bulkPricing: "Seasonal pricing available"
    }
  ),
  new Product(
    5,
    "Dry Oyster Mushrooms",
    "dry",
    "Dehydrated oyster mushrooms with extended shelf life. Ideal for food manufacturers, soup mixes, and seasoning applications.",
    {
      moisture: "8-12%",
      shelfLife: "18-24 months",
      processing: "Air-dried, no additives",
      packaging: "Vacuum sealed"
    },
    ["Food Manufacturing", "Soup & Seasoning Industry", "Instant Food Products", "Export Markets"],
    "Vacuum-sealed bags in corrugated boxes",
    {
      currency: "USD",
      minOrder: "100kg",
      bulkPricing: "Volume discounts available"
    }
  ),
  new Product(
    6,
    "Dry Button Mushrooms",
    "dry",
    "Dehydrated button mushrooms for industrial applications. Consistent quality and extended shelf life for food processing industry.",
    {
      moisture: "8-12%",
      shelfLife: "24 months",
      processing: "Hot air dried",
      grading: "Sliced, diced, powder available"
    },
    ["Food Processing", "Seasoning Manufacturing", "Ready-to-eat Products", "Industrial Catering"],
    "Multi-layer barrier bags with nitrogen flushing",
    {
      currency: "USD",
      minOrder: "200kg",
      bulkPricing: "Competitive industrial rates"
    }
  ),
  new Product(
    7,
    "Mushroom Food Additives",
    "ingredients",
    "Natural mushroom-based flavor enhancers, umami compounds, and nutritional additives for food industry applications.",
    {
      type: "Flavor enhancers, Umami compounds, Nutritional extracts",
      form: "Powder, liquid extract, granules",
      potency: "Standardized active compounds",
      certification: "FDA approved, HACCP certified"
    },
    ["Food Manufacturing", "Flavor Industry", "Nutritional Products", "Functional Foods"],
    "Food-grade containers with tamper-evident sealing",
    {
      currency: "USD",
      minOrder: "50kg",
      bulkPricing: "Custom formulation pricing available"
    }
  ),
  new Product(
    8,
    "Pharmaceutical Intermediates & APIs",
    "ingredients",
    "High-purity mushroom-derived pharmaceutical intermediates and Active Pharmaceutical Ingredients (APIs) for drug manufacturing.",
    {
      purity: "≥98% HPLC",
      compliance: "GMP, ICH guidelines",
      documentation: "COA, stability data, DMF support",
      testing: "Complete analytical profile"
    },
    ["Pharmaceutical Manufacturing", "Drug Development", "Clinical Research", "API Manufacturing"],
    "Pharmaceutical-grade containers with complete documentation",
    {
      currency: "USD",
      minOrder: "1kg",
      bulkPricing: "Regulatory compliant pricing structure"
    }
  )
];

module.exports = { Product, products };