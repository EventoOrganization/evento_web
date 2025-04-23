"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/(prod)/SessionProvider";
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
      clearStorageAndCookies();
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
    }
  };

  const clearStorageAndCookies = () => {
    // Clear sessionStorage by default
    sessionStorage.clear();
    localStorage.clear();

    // Check if rememberMe was true and clear localStorage if needed
    const rememberMe = JSON.parse(
      localStorage.getItem("rememberMe") || "false",
    );

    if (rememberMe) {
      localStorage.clear();
    }

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  };

  return (
    <Button className="" onClick={handleclick}>
      Logout
    </Button>
  );
};

export default LogoutBtn;
