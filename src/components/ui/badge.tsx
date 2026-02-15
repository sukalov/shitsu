import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "h-5 gap-1 border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-neutral-800 focus-visible:ring-neutral-800/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white",
        secondary: "bg-neutral-100 text-neutral-900",
        sold: "bg-neutral-900/80 text-white",
        series: "bg-white/90 text-neutral-900 border-neutral-200",
        outline: "border-neutral-300 text-neutral-600 bg-transparent",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
