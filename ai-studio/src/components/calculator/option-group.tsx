"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";

import { RadioGroup } from "@/components/ui/radio-group";
import { formatRub, pluralizeWeeks } from "@/lib/estimate";
import type { PricingOption } from "@/types";
import { cn } from "@/lib/utils";

interface RadioOptionsProps {
  label: string;
  name: string;
  value: string;
  options: PricingOption[];
  onChange: (id: string) => void;
}

export function RadioOptions({
  label,
  name,
  value,
  options,
  onChange,
}: RadioOptionsProps) {
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        aria-label={label}
        className="grid gap-2.5"
      >
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.id}
            value={option.id}
            id={`${name}-${option.id}`}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-all duration-300",
              "hover:border-border hover:bg-card",
              "data-[state=checked]:border-primary/25 data-[state=checked]:bg-primary/10 data-[state=checked]:shadow-[0_0_0_1px_rgba(99,102,241,0.18)]",
            )}
          >
            <span
              aria-hidden="true"
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="text-[15px] font-medium text-foreground">
                  {option.label}
                </span>
                {option.badge ? (
                  <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                    {option.badge}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                {option.description}
              </span>
            </span>

            <span className="ml-2 shrink-0 text-right">
              <span className="block whitespace-nowrap text-[14px] font-semibold text-foreground">
                {formatRub(option.price)}
              </span>
              <span className="block whitespace-nowrap text-[12px] text-muted-foreground">
                {pluralizeWeeks(option.weeks)}
              </span>
            </span>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

interface IntegrationOptionsProps {
  label: string;
  options: PricingOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function IntegrationOptions({
  label,
  options,
  selected,
  onToggle,
}: IntegrationOptionsProps) {
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="grid gap-2.5">
        {options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-300",
                checked
                  ? "border-primary/25 bg-primary/10"
                  : "border-border bg-card hover:border-border hover:bg-card",
              )}
            >
              <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={() => onToggle(option.id)}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
                  "border-border bg-card",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                  checked && "border-primary bg-primary text-primary-foreground",
                )}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 transition-opacity",
                    checked ? "opacity-100" : "opacity-0",
                  )}
                  strokeWidth={3}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[15px] font-medium text-foreground">
                    {option.label}
                  </span>
                  {option.badge ? (
                    <span className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-primary">
                      {option.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                  {option.description}
                </span>
              </span>

              <span className="ml-2 shrink-0 text-right">
                <span className="block whitespace-nowrap text-[14px] font-semibold text-foreground">
                  +{formatRub(option.price)}
                </span>
                <span className="block whitespace-nowrap text-[12px] text-muted-foreground">
                  {pluralizeWeeks(option.weeks)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
