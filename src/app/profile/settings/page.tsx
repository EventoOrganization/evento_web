"use client";
import ComingSoon from "@/components/ComingSoon";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, endSession } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  console.log("user in settings", user);
  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      const { error } = await fetchData("/auth/logout", HttpMethod.POST);

      if (error) {
        toast({
          description: error,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      endSession();
      toast({
        description: "You have been logged out.",
        variant: "default",
      });

      router.push("/");
    } catch (err) {
      toast({
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <ComingSoon message="This page is under construction. Please check back later!" />
    );
  }

  return (
    <div>
      <h2>Settings</h2>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Page;
