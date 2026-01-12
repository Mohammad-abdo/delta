import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ceoMessageAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/admin/FileUpload";

const CEOMessage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["ceoMessage"],
    queryFn: ceoMessageAPI.get,
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: data || {},
  });

  const imageValue = watch("image");

  const mutation = useMutation({
    mutationFn: (data: any) => ceoMessageAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceoMessage"] });
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة كلمة الإدارة</h1>
        <p className="text-muted-foreground mt-2">تعديل محتوى كلمة الإدارة</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>محتوى كلمة الإدارة</CardTitle>
            <CardDescription>تعديل محتوى كلمة العضو المنتدب التنفيذي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>الاسم</Label>
              <Input {...register("name")} defaultValue={data?.name} />
            </div>
            <div>
              <Label>المنصب</Label>
              <Input {...register("title")} defaultValue={data?.title} />
            </div>
            <div>
              <Label>الرسالة</Label>
              <Textarea
                {...register("message")}
                defaultValue={data?.message}
                rows={8}
              />
            </div>
            <div>
              <FileUpload
                value={imageValue}
                onChange={(url) => setValue("image", url)}
                label="صورة العضو المنتدب"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CEOMessage;

