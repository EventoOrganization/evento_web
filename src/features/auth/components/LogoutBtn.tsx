// src/features/auth/components/logoutBtn.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const handleclick = async () => {
    try {
      const logoutRes = await fetchData<any>(
        "/auth/logout",
        HttpMethod.POST,
        undefined,
        session.token,
      );
      if (logoutRes.error) {
        toast({
          description: logoutRes.error,
          variant: "destructive",
          duration: 3000,
        });
      }
      toast({
        description: "Logged out successfully",
        className: "bg-evento-gradient-button text-white",
        duration: 3000,
      });
      session.endSession();
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
    }
  };
  return (
    <Button className="bg-muted text-muted-foreground" onClick={handleclick}>
      logoutBtn
    </Button>
  );
};

export default LogoutBtn;
