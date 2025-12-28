/**
 * Static Products Data
 * 
 * This file contains all products data extracted from PDF.
 * You can update this data with information from the PDF file.
 */

// Import product images
// @ts-ignore - TypeScript may not recognize Arabic file names
import product1Image from "@/assets/بينز.jpg";
// @ts-ignore
import product2Image from "@/assets/ترس حلزوني للونش.JPG";
// @ts-ignore
import product3Image from "@/assets/ترس حلزوني.JPG";
// @ts-ignore
import product4Image from "@/assets/ترس سنه مايله.JPG";
// @ts-ignore
import product5Image from "@/assets/ترس سياره الشحنه.JPG";
// @ts-ignore
import product6Image from "@/assets/ترس قرص.JPG";

export interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  image?: string;
  imageUrl?: string;
  category: string;
  price?: number;
  priceRange?: 'low' | 'medium' | 'high' | 'premium';
  specifications?: string[];
  applications?: string[];
  material?: string;
  dimensions?: string;
  weight?: string;
  inStock?: boolean;
}

// Static products data from PDF and db.json
export const staticProducts: Product[] = [
  {
    id: 1,
    name: "بينز",
    description: "منتج بينز عالي الجودة",
    fullDescription: "بينز عالي الجودة مصنوع من أفضل أنواع الحديد الصلب، يتميز بالمتانة والقوة. مناسب للاستخدام في مختلف التطبيقات الصناعية.",
    image: product1Image,
    category: "أدوات",
    price: 500,
    priceRange: 'medium',
    specifications: [
      "مصنوع من حديد صلب عالي الجودة",
      "مقاوم للتآكل والصدأ",
      "متوفر بمقاسات مختلفة",
      "مطابق لمعايير الجودة العالمية"
    ],
    applications: [
      "الصناعات الثقيلة",
      "البناء والتشييد",
      "الآلات والمعدات",
      "البنية التحتية"
    ],
    material: "حديد صلب عالي الجودة",
    inStock: true,
  },
  {
    id: 2,
    name: "ترس حلزوني للونش",
    description: "ترس حلزوني مخصص للونش",
    fullDescription: "ترس حلزوني مصمم خصيصاً للاستخدام في أنظمة الونش. يتميز بدقة التصنيع والكفاءة العالية في نقل الحركة.",
    image: product2Image,
    category: "تروس",
    price: 1500,
    priceRange: 'high',
    specifications: [
      "دقة تصنيع عالية",
      "مقاوم للاهتزاز",
      "كفاءة نقل حركة ممتازة",
      "عمر افتراضي طويل"
    ],
    applications: [
      "أنظمة الونش",
      "المعدات الثقيلة",
      "الرافعات",
      "أنظمة الرفع"
    ],
    material: "حديد صلب كربوني",
    inStock: true,
  },
  {
    id: 3,
    name: "ترس حلزوني",
    description: "ترس حلزوني بمواصفات عالمية",
    fullDescription: "ترس حلزوني عالي الجودة مصنوع وفقاً للمعايير العالمية. مناسب للاستخدام في مختلف التطبيقات الصناعية.",
    image: product3Image,
    category: "تروس",
    price: 1200,
    priceRange: 'high',
    specifications: [
      "مواصفات عالمية",
      "جودة عالية",
      "متانة وقوة",
      "أداء موثوق"
    ],
    applications: [
      "الصناعات الميكانيكية",
      "المعدات الصناعية",
      "أنظمة النقل",
      "الآلات الدقيقة"
    ],
    material: "حديد صلب",
    inStock: true,
  },
  {
    id: 4,
    name: "ترس سنه مايله",
    description: "ترس سنه مايله متعدد الاستخدامات",
    fullDescription: "ترس سنه مايله متعدد الاستخدامات، يتميز بالمرونة والقدرة على العمل في ظروف مختلفة.",
    image: product4Image,
    category: "تروس",
    price: 1000,
    priceRange: 'medium',
    specifications: [
      "متعدد الاستخدامات",
      "مرونة عالية",
      "مقاوم للاهتزاز",
      "سهولة الصيانة"
    ],
    applications: [
      "الصناعات العامة",
      "المعدات المتنوعة",
      "الآلات الصناعية",
      "أنظمة الحركة"
    ],
    material: "حديد صلب",
    inStock: true,
  },
  {
    id: 5,
    name: "ترس سياره الشحنه",
    description: "ترس مخصص لسيارات الشحنة",
    fullDescription: "ترس قوي ومتين مصمم خصيصاً لسيارات الشحن الثقيلة. يتميز بالقدرة على تحمل الأحمال الثقيلة والظروف القاسية.",
    image: product5Image,
    category: "تروس",
    price: 2000,
    priceRange: 'high',
    specifications: [
      "قوة تحمل عالية",
      "متانة فائقة",
      "مقاوم للتآكل",
      "مصمم للمركبات الثقيلة"
    ],
    applications: [
      "سيارات الشحن",
      "المركبات الثقيلة",
      "النقل التجاري",
      "المعدات الصناعية"
    ],
    material: "حديد صلب عالي الجودة",
    inStock: true,
  },
  {
    id: 6,
    name: "ترس قرص",
    description: "ترس قرص قوي ومتين",
    fullDescription: "ترس قرصي مصنوع بدقة عالية لضمان الأداء الأمثل. مناسب للاستخدام في مختلف التطبيقات الصناعية.",
    image: product6Image,
    category: "تروس",
    price: 800,
    priceRange: 'medium',
    specifications: [
      "شكل قرصي محسّن",
      "دقة تصنيع عالية",
      "متانة وقوة",
      "أداء موثوق"
    ],
    applications: [
      "المعدات الصناعية",
      "الآلات الميكانيكية",
      "أنظمة النقل",
      "التطبيقات الصناعية العامة"
    ],
    material: "حديد صلب",
    inStock: true,
  },
];

// Categories extracted from products
export const categories = Array.from(new Set(staticProducts.map(p => p.category)));

// Price ranges
export const priceRanges = [
  { value: 'low', label: 'منخفض (أقل من 500)', min: 0, max: 500 },
  { value: 'medium', label: 'متوسط (500 - 1500)', min: 500, max: 1500 },
  { value: 'high', label: 'عالي (1500 - 3000)', min: 1500, max: 3000 },
  { value: 'premium', label: 'مميز (أكثر من 3000)', min: 3000, max: Infinity },
];
