import { SimOneWorkspace } from "@/components/simone-workspace";

export const metadata = {
  title: "SimOne Workspace",
};

export default async function VentureWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SimOneWorkspace ventureId={id} />;
}
