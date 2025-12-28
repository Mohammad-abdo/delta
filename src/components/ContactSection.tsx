import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send, Linkedin, Facebook, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { publicSettingsAPI, defaultSettingsData } from "@/lib/api";

const ContactSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: publicSettingsAPI.get,
    staleTime: 5 * 60 * 1000,
  });

  const mergedSettings = settings || defaultSettingsData;
  const contact = mergedSettings.contact || defaultSettingsData.contact;
  const social = mergedSettings.socialMedia || defaultSettingsData.socialMedia;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("contact.success"),
      description: t("contact.success"),
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 gradient-section">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t("contact.title")}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8 shadow-strong border-0 bg-white">
              <h3 className="text-2xl font-bold text-primary mb-6">
                {t("contact.title")}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.name")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t("contact.name")}
                    className="text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.email")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.phone")} ({t("common.optional", { defaultValue: "اختياري" })})
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+20 XXX XXX XXXX"
                    className="text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("contact.message")} <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={t("contact.message")}
                    rows={5}
                    className="text-right resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary-light text-primary-foreground"
                >
                  <Send className="ml-2 h-5 w-5" />
                  {t("contact.send")}
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="p-8 shadow-medium border-0 bg-white hover:shadow-strong transition-base">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-4 rounded-xl flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-2">
                      {t("contact.address", { defaultValue: "العنوان" })}
                    </h4>
                    <p className="text-muted-foreground">{contact.address}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-medium border-0 bg-white hover:shadow-strong transition-base">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-4 rounded-xl flex-shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-2">
                      {t("contact.phone")}
                    </h4>
                    <p className="text-muted-foreground" dir="ltr">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-medium border-0 bg-white hover:shadow-strong transition-base">
                <div className="flex items-start gap-4">
                  <div className="bg-sky/10 p-4 rounded-xl flex-shrink-0">
                    <Mail className="w-6 h-6 text-sky" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-2">
                      {t("contact.email")}
                    </h4>
                    <p className="text-muted-foreground" dir="ltr">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-8 shadow-medium border-0 bg-white">
                <h4 className="text-lg font-bold text-primary mb-4">
                  {t("footer.socialMedia", { defaultValue: "تابعنا على" })}
                </h4>
                <div className="flex gap-4">
                  <a
                    href={social.linkedin || "#"}
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary hover:text-white transition-base"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href={social.facebook || "#"}
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary hover:text-white transition-base"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href={social.youtube || "#"}
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary hover:text-white transition-base"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
