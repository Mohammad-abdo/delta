import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { settingsAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import FileUpload from "@/components/admin/FileUpload";

/**
 * Settings Management Page
 */
const Settings = () => {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.get,
  });

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: settings || {},
  });

  const logoValue = watch("logo");
  const heroBackgroundValue = watch("heroBackgroundImage");

  // Update form values when settings are loaded
  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => settingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("تم حفظ الإعدادات بنجاح");
    },
    onError: () => {
      toast.error("فشل في حفظ الإعدادات");
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form data being submitted:", data);
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">الإعدادات العامة</h1>
        <p className="text-muted-foreground mt-2">
          إدارة الإعدادات العامة للموقع
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>معلومات الاتصال</CardTitle>
            <CardDescription>معلومات التواصل مع الشركة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                {...register("contact.email")}
                defaultValue={settings?.contact?.email}
              />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input
                {...register("contact.phone")}
                defaultValue={settings?.contact?.phone}
              />
            </div>
            <div>
              <Label>العنوان</Label>
              <Input
                {...register("contact.address")}
                defaultValue={settings?.contact?.address}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
            <CardDescription>روابط حسابات التواصل الاجتماعي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>فيسبوك</Label>
              <Input
                {...register("socialMedia.facebook")}
                defaultValue={settings?.socialMedia?.facebook}
              />
            </div>
            <div>
              <Label>تويتر</Label>
              <Input
                {...register("socialMedia.twitter")}
                defaultValue={settings?.socialMedia?.twitter}
              />
            </div>
            <div>
              <Label>لينكد إن</Label>
              <Input
                {...register("socialMedia.linkedin")}
                defaultValue={settings?.socialMedia?.linkedin}
              />
            </div>
            <div>
              <Label>إنستجرام</Label>
              <Input
                {...register("socialMedia.instagram")}
                defaultValue={settings?.socialMedia?.instagram}
              />
            </div>
            <div>
              <Label>تيك توك</Label>
              <Input
                {...register("socialMedia.tiktok")}
                defaultValue={settings?.socialMedia?.tiktok}
              />
            </div>
            <div>
              <Label>يوتيوب</Label>
              <Input
                {...register("socialMedia.youtube")}
                defaultValue={settings?.socialMedia?.youtube}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

