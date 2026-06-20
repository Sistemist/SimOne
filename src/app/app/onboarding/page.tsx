import { SimOneOnboarding } from "@/components/simone-onboarding";
import { getCurrentAlphaUser } from "@/lib/auth";

export const metadata = {
  title: "Start SimOne | Sprint Zero",
};

export default async function OnboardingPage() {
  const alphaUser = await getCurrentAlphaUser();

  return <SimOneOnboarding alphaUser={alphaUser} />;
}
