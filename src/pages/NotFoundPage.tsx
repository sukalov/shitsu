import { Link } from "react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { cn } from "@/lib/utils";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <SEO title="404 — SHITSU" noIndex />
      <h1 className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest text-neutral-900 mb-12">
        404: НЕ НАЙДЕНО
      </h1>
      <Link
        to="/"
        className={cn(buttonVariants(), "uppercase tracking-[0.1em]")}
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        На главную
      </Link>
    </div>
  );
}
