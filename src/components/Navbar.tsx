import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Navbar Component
 *
 * Main navigation bar that appears at the top of all pages.
 * Uses React Router for navigation between pages.
 * Includes scroll effect that changes appearance when scrolling.
 */
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const homeDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // افتح دروب داون الرئيسية تلقائياً لو جئنا من صفحة أخرى بطلب فتحه
  useEffect(() => {
    // التحقق من sessionStorage أولاً
    const shouldOpenDropdown = sessionStorage.getItem("openHomeDropdown") === "true";
    
    if (location.pathname === "/" && shouldOpenDropdown) {
      // مسح القيمة من sessionStorage
      sessionStorage.removeItem("openHomeDropdown");
      // استخدام setTimeout للتأكد من أن الصفحة اتحملت بالكامل
      const timer = setTimeout(() => {
        setIsHomeDropdownOpen(true);
      }, 200);
      return () => clearTimeout(timer);
    }
    
    // أيضاً التحقق من location.state كبديل
    const state = (location.state as { openHomeDropdown?: boolean } | null) || {};
    if (location.pathname === "/" && state.openHomeDropdown) {
      const timer = setTimeout(() => {
        setIsHomeDropdownOpen(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        homeDropdownRef.current &&
        !homeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHomeDropdownOpen(false);
      }
    };

    if (isHomeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHomeDropdownOpen]);

  const scrollToSection = (sectionId: string) => {
    console.log("scrollToSection called with:", sectionId, "current path:", location.pathname);
    
    if (location.pathname !== "/") {
      // لو كنا في صفحة ثانية انتقل للصفحة الرئيسية مع تمرير المطلوب
      sessionStorage.setItem("scrollToSection", sectionId);
      setIsHomeDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/");
      return;
    }

    // إذا كنا بالفعل في الصفحة الرئيسية، انتقل مباشرة للقسم
    // لا نغلق القوائم إلا بعد التأكد من أن الـ scroll سيحدث
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      console.log("Looking for element:", sectionId, "Found:", element);
      if (element) {
        // إغلاق القوائم قبل الـ scroll مباشرة
        setIsHomeDropdownOpen(false);
        setIsMobileMenuOpen(false);
        // استخدام requestAnimationFrame لضمان أن الـ DOM جاهز
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", `#${sectionId}`);
        });
      } else {
        // لو العنصر مش موجود، جرب مرة تانية بعد وقت أطول
        console.log("Element not found, retrying...");
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId);
          console.log("Retry - Looking for element:", sectionId, "Found:", retryElement);
          if (retryElement) {
            setIsHomeDropdownOpen(false);
            setIsMobileMenuOpen(false);
            requestAnimationFrame(() => {
              retryElement.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(null, "", `#${sectionId}`);
            });
          } else {
            console.error("Element not found after retry:", sectionId);
            // إغلاق القوائم حتى لو العنصر مش موجود
            setIsHomeDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }
        }, 400);
      }
    };
    
    // استخدام timeout أقصر لأننا في نفس الصفحة
    setTimeout(scrollToElement, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setIsMobileMenuOpen(false);
  };

  const homeDropdownItems = [
    { section: "vision-mission", label: t("nav.visionMission") },
    { section: "strategy", label: t("nav.strategy") },
    { section: "quality", label: t("nav.quality") },
    { section: "ceo-message", label: t("nav.ceoMessage") },
  ];

  const navItems = [
    { path: "/about", label: t("nav.about") },
    { path: "/products", label: t("nav.products") },
    { path: "/services", label: t("nav.services") },
    { path: "/news", label: t("nav.news") },
    { path: "/partners", label: t("nav.partners") },
    { path: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav
      className={`fixed top-12\ sm:top-16 right-0 left-0 z-50 transition-base ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-[auto,1fr,auto] items-center h-14 sm:h-16 md:h-20 gap-2 sm:gap-4">
          {/* Logo - Left Side */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src={logo}
              alt="مصانع الدلتا للصلب"
              className="h-7 w-auto sm:h-10 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-sm sm:text-base md:text-xl font-bold text-primary hidden sm:block">
              {t("nav.home") === "Home"
                ? "Delta Steel Factories"
                : "مصانع الدلتا للصلب"}
            </span>
          </Link>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
            {/* Home with Dropdown */}
            <div
              className="relative"
              ref={homeDropdownRef}
              onMouseEnter={() => setIsHomeDropdownOpen(true)}
              onMouseLeave={() => setIsHomeDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  if (location.pathname !== "/") {
                    // الانتقال للصفحة الرئيسية أولاً
                    window.location.href = "/";
                  } else {
                    // داخل الصفحة الرئيسية: فتح/إغلاق الدروب داون
                    setIsHomeDropdownOpen((prev) => !prev);
                  }
                }}
                className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-fast flex items-center gap-1 ${
                  location.pathname === "/"
                    ? "text-primary bg-muted"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {t("nav.home")}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isHomeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Content */}
              {isHomeDropdownOpen && (
                <div className={`absolute top-full mt-0 w-56 bg-white rounded-lg shadow-lg border border-muted py-2 z-50 ${
                  i18n.language === "ar" ? "right-0" : "left-0"
                }`}>
                  {homeDropdownItems.map((item) => (
                    <button
                      key={item.section}
                      onClick={() => scrollToSection(item.section)}
                      className={`block w-full px-4 py-2 text-sm font-medium transition-fast hover:text-primary hover:bg-muted ${
                        i18n.language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Other Nav Items */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-fast ${
                  location.pathname === item.path
                    ? "text-primary bg-muted"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side: language switcher and mobile menu button */}
          <div className="flex items-center justify-end gap-2">
            <LanguageSwitcher />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-muted bg-white/95 backdrop-blur-md max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex flex-col py-2 space-y-0.5">
              {/* Mobile Search */}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                <form onSubmit={handleSearchSubmit} dir="rtl">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t("nav.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-9 text-sm"
                    />
                  </div>
                </form>
              </div>
              {/* Home with Dropdown - Mobile */}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Home button clicked, pathname:", location.pathname);
                    if (location.pathname !== "/") {
                      // من صفحة أخرى: انتقل للرئيسية وافتح دروب داون الرئيسية بعد الوصول
                      sessionStorage.setItem("openHomeDropdown", "true");
                      navigate("/");
                    } else {
                      // من داخل الرئيسية: فتح/إغلاق الدروب داون
                      console.log("Toggling dropdown, current state:", isHomeDropdownOpen);
                      setIsHomeDropdownOpen((prev) => !prev);
                    }
                  }}
                  className={`w-full flex items-center justify-between text-sm sm:text-base font-medium rounded-lg transition-fast px-3 sm:px-4 py-2.5 sm:py-3 ${
                    location.pathname === "/"
                      ? "text-primary bg-muted"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  <span>{t("nav.home")}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isHomeDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isHomeDropdownOpen && (
                  <div 
                    className={`mt-1 space-y-0.5 ${
                      i18n.language === "ar" ? "pr-4" : "pl-4"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {homeDropdownItems.map((item) => (
                      <button
                        key={item.section}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Dropdown item clicked:", item.section);
                          // استخدام setTimeout صغير لضمان أن الـ event تم معالجته بالكامل
                          setTimeout(() => {
                            scrollToSection(item.section);
                          }, 10);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        className={`block w-full px-4 py-2 text-sm font-medium rounded-lg transition-fast hover:text-primary hover:bg-muted active:bg-muted ${
                          i18n.language === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Nav Items - Mobile */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-fast ${
                    location.pathname === item.path
                      ? "text-primary bg-muted"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
