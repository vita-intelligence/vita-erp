"use client";

/**
 * ColorsModule — composes all color-related sections.
 */

import { BrandSection } from "./BrandSection";
import { GradientPicker } from "./gradient-picker";
import { NeutralControls } from "./NeutralControls";
import { TextSection } from "./TextSection";

export function ColorsModule() {
  return (
    <div className="space-y-8">
      <NeutralControls />

      <BrandSection />

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
            Surfaces
          </h3>
          <p className="text-xs text-vita-text-muted">
            Page and card backgrounds — solid color or gradient.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <GradientPicker
            tokenKey="background"
            label="Background"
            description="Page background — tint to match warm or cool brand feel"
          />
          <GradientPicker
            tokenKey="surface"
            label="Surface"
            description="Cards and panels — slightly offset from background"
          />
        </div>
      </section>

      <TextSection />
    </div>
  );
}
