import { SimOneWorkspace } from "@/components/simone-workspace";
import { getAiConfigStatusFromEnv } from "@/lib/ai-config";
import { getCurrentAlphaUser } from "@/lib/auth";

export const metadata = {
  title: "SimOne Workspace",
};

export default async function VentureWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const alphaUser = await getCurrentAlphaUser();
  const aiConfigStatus = getAiConfigStatusFromEnv(process.env);

  return (
    <SimOneWorkspace
      ventureId={id}
      alphaUser={alphaUser}
      persistenceReady={Boolean(process.env.DATABASE_URL)}
      aiConfigStatus={aiConfigStatus}
    />
  );
}
