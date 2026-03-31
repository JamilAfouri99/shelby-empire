import type { Metadata } from "next";
import { Suspense } from "react";
import { searchVault } from "@/actions/vault";
import { VaultSearch } from "@/components/vault/vault-search";
import { VaultResults } from "@/components/vault/vault-results";
import { PageLoading } from "@/components/common/loading";
import { ErrorDisplay } from "@/components/common/error-display";

export const metadata: Metadata = {
  title: "Quote Vault — By Order",
};

type VaultPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function VaultPage({ searchParams }: VaultPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-gold">Quote Vault</h1>
      <VaultSearch />
      <Suspense fallback={<PageLoading />}>
        <VaultResultsSection params={params} />
      </Suspense>
    </div>
  );
}

async function VaultResultsSection({ params }: { params: Record<string, string | undefined> }) {
  const result = await searchVault(params);

  if (!result.ok) {
    return <ErrorDisplay message={result.error} />;
  }

  return (
    <VaultResults
      quotes={result.value.quotes}
      total={result.value.total}
      page={result.value.page}
      totalPages={result.value.totalPages}
    />
  );
}
