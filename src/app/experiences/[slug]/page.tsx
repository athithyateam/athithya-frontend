import { Suspense } from "react";
import { redirect } from "next/navigation";

async function RedirectContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/post/${slug}`);
  return null;
}

export default function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <RedirectContent params={params} />
    </Suspense>
  );
}
