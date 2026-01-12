import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { visionMissionAPI } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const VisionMission = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["visionMission"],
    queryFn: visionMissionAPI.get,
  });

  const { register, handleSubmit } = useForm({
    defaultValues: data || { vision: {}, mission: {} },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => visionMissionAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visionMission"] });
      toast.success("تم حفظ التغييرات بنجاح");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">إدارة الرؤية والرسالة</h1>
        <p className="text-muted-foreground mt-2">تعديل محتوى الرؤية والرسالة</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>الرؤية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>العنوان</Label>
              <input
                {...register("vision.title")}
                defaultValue={data?.vision?.title}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea
                {...register("vision.description")}
                defaultValue={data?.vision?.description}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الرسالة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>العنوان</Label>
              <input
                {...register("mission.title")}
                defaultValue={data?.mission?.title}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea
                {...register("mission.description")}
                defaultValue={data?.mission?.description}
                rows={4}
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

export default VisionMission;

