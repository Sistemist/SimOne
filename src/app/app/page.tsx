import { SimOneAppHome } from "@/components/simone-app-home";
import { getCurrentAlphaUser } from "@/lib/auth";

export default async function AppIndexPage() {
  const alphaUser = await getCurrentAlphaUser();

  return <SimOneAppHome alphaUser={alphaUser} persistenceReady={Boolean(process.env.DATABASE_URL)} />;
}
