/**
 * Static Content Data
 * 
 * This file contains all static content data (hero, about, etc.)
 * extracted from db.json
 */

// Import images
import heroImage from "@/assets/hero-steel-factory.jpg";
import steelProductsImage from "@/assets/steel-products.jpg";
import ceoPortrait from "@/assets/ceo-portrait.jpg";
import logoImage from "@/assets/logo.png";

// Hero data
export const heroData = {
  slides: [
    {
      id: 1,
      title: "شركة مصانع الدلتا للصلب",
      subtitle: "الريادة في صناعة الصلب والمسبوكات",
      description: "واحدة من أعرق شركات إنتاج الحديد والصلب والمسبوكات في مصر والشرق الأوسط، بطاقة إنتاجية حديثة ورؤية مبتكرة تدعم الاقتصاد الوطني",
      image: heroImage,
      buttonText: "تعرف على استراتيجيتنا",
      link: "/strategy",
      stats: [
        { number: "50+", label: "سنة خبرة" },
        { number: "ISO", label: "شهادات الجودة" },
        { number: "100%", label: "رضا العملاء" },
      ]
    },
    {
      id: 2,
      title: "منتجات عالية الجودة",
      subtitle: "عروق الصلب والمسبوكات",
      description: "تشكيلة واسعة من المنتجات تشمل عروق الصلب (البيلت) إلى جانب إنتاج مسبوكات الزهر ومسبوكات الصلب الكربوني",
      image: steelProductsImage,
      buttonText: "شاهد منتجاتنا",
      link: "/products",
      stats: [
        { number: "100+", label: "نوع منتج" },
        { number: "ISO", label: "9001:2015" },
        { number: "24/7", label: "خدمة مستمرة" },
      ]
    }
  ]
};

// About data
export const aboutData = {
  title: "عن الشركة",
  description: "واحدة من أعرق شركات إنتاج الحديد الصلب والمسبوكات الزهر والصلب في مصر والشرق الأوسط تقدم تشكيلة واسعة من المنتجات تشمل عروق الصلب (البيلت) إلى جانب إنتاج مسبوكات الزهر ومسبوكات الصلب الكربوني.",
  image: steelProductsImage,
  features: [
    {
      icon: "Factory",
      title: "خبرة عريقة في صناعة الصلب",
      description: "عقود من التميز والريادة في المجال الصناعي"
    },
    {
      icon: "Award",
      title: "منتجات متنوعة من عروق الصلب والمسبوكات",
      description: "تشكيلة واسعة تلبي احتياجات مختلف القطاعات"
    },
    {
      icon: "Globe",
      title: "خدمة قطاعات استراتيجية",
      description: "نخدم مصر والشرق الأوسط بأعلى معايير الجودة"
    },
    {
      icon: "TrendingUp",
      title: "تطور مستمر وابتكار",
      description: "استثمار دائم في التكنولوجيا الحديثة"
    }
  ],
  stats: [
    { number: "50+", label: "سنة خبرة" },
    { number: "100+", label: "نوع منتج" },
    { number: "ISO", label: "شهادات الجودة" },
    { number: "24/7", label: "خدمة مستمرة" }
  ]
};

// Vision Mission data
export const visionMissionData = {
  vision: {
    title: "رؤيتنا",
    description: "أن نكون الشركة الرائدة في صناعة الحديد والصلب والمسبوكات في مصر والشرق الأوسط، من خلال الابتكار المستمر والجودة العالية والاستدامة."
  },
  mission: {
    title: "رسالتنا",
    description: "تقديم منتجات عالية الجودة تلبي احتياجات عملائنا، مع الالتزام بأعلى معايير الجودة والسلامة والاستدامة البيئية، والمساهمة في دعم الاقتصاد الوطني."
  }
};

// Strategy data
export const strategyData = {
  title: "استراتيجيتنا",
  description: "نتبع استراتيجية شاملة تركز على التطوير المستمر والابتكار والجودة.",
  points: [
    "التطوير التكنولوجي المستمر باستخدام أحدث طرق الإنتاج",
    "التركيز على الجودة والامتثال للمعايير الدولية",
    "الاستدامة البيئية والمسؤولية الاجتماعية",
    "تطوير الموارد البشرية والاستثمار في الكوادر",
    "التوسع في الأسواق المحلية والإقليمية"
  ]
};

// Quality data
export const qualityData = {
  title: "سياسة الجودة والبيئة والسلامة",
  description: "نلتزم بأعلى معايير الجودة والسلامة والاستدامة البيئية.",
  policies: [
    {
      title: "الجودة",
      description: "نطبق معايير ISO 9001:2015 في جميع عملياتنا"
    },
    {
      title: "البيئة",
      description: "نعمل على تقليل البصمة الكربونية وحماية البيئة"
    },
    {
      title: "السلامة",
      description: "نضمن سلامة جميع العاملين والبيئة المحيطة"
    }
  ]
};

// CEO Message data
export const ceoMessageData = {
  name: "العضو المنتدب التنفيذي",
  title: "كلمة الإدارة",
  message: "نفخر بأن نكون جزءاً من صناعة الحديد والصلب في مصر. نسعى دائماً للتميز والابتكار.",
  image: ceoPortrait
};

// Settings data
export const settingsData = {
  siteName: "مصانع الدلتا للصلب",
  logo: logoImage,
  contact: {
    email: "info@deltasteel.com",
    phone: "+20 123 456 7890",
    address: "مصر"
  },
  socialMedia: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: ""
  }
};

// Blog posts data
export const blogPostsData = [
  {
    id: "1",
    title: "أحدث تقنيات صناعة الصلب في 2024",
    excerpt: "استكشف أحدث الابتكارات والتقنيات في صناعة الحديد والصلب التي تشكل مستقبل الصناعة",
    content: "محتوى المقال الكامل...",
    date: "2024-11-15",
    category: "تقنيات",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    published: true
  },
  {
    id: "2",
    title: "معايير الجودة والسلامة في مصانعنا",
    excerpt: "تعرف على معايير الجودة العالمية التي نطبقها في جميع مراحل الإنتاج لضمان أعلى مستويات الجودة",
    content: "محتوى المقال الكامل...",
    date: "2024-11-10",
    category: "الجودة",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
    published: true
  }
];
