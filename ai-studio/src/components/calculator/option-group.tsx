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
              "group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition-all duration-300",
              "hover:border-white/20 hover:bg-white/[0.04]",
              "data-[state=checked]:border-indigo-400/50 data-[state=checked]:bg-indigo-500/[0.09] data-[state=checked]:shadow-[0_0_0_1px_rgba(99,102,241,0.18)]",
            )}
          >
            <span
              aria-hidden="true"
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors group-data-[state=checked]:border-indigo-400 group-data-[state=checked]:bg-indigo-500"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="text-[15px] font-medium text-slate-100">
                  {option.label}
                </span>
                {option.badge ? (
                  <span className="rounded border border-purple-400/30 bg-purple-500/10 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-purple-300">
                    {option.badge}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                {option.description}
              </span>
            </span>

            <span className="ml-2 shrink-0 text-right">
              <span className="block whitespace-nowrap text-[14px] font-semibold text-slate-200">
                {formatRub(option.price)}
              </span>
              <span className="block whitespace-nowrap text-[12px] text-slate-500">
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
                  ? "border-indigo-400/50 bg-indigo-500/[0.09]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
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
                  "border-white/20 bg-white/[0.03]",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#030712]",
                  checked && "border-indigo-400 bg-indigo-500 text-white",
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
                  <span className="text-[15px] font-medium text-slate-100">
                    {option.label}
                  </span>
                  {option.badge ? (
                    <span className="rounded border border-indigo-400/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-indigo-300">
                      {option.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                  {option.description}
                </span>
              </span>

              <span className="ml-2 shrink-0 text-right">
                <span className="block whitespace-nowrap text-[14px] font-semibold text-slate-200">
                  +{formatRub(option.price)}
                </span>
                <span className="block whitespace-nowrap text-[12px] text-slate-500">
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
