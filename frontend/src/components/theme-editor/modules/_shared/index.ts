/**
 * Shared theme editor primitives and controls.
 *
 * All modules import from this barrel — internal file layout may change
 * without affecting consumers.
 */

export type { BorderControlsProps } from "./BorderControls";
// Reusable token-bound controls
export { BorderControls } from "./BorderControls";
export { BorderStyleRow, FontWeightRow, TransitionRow } from "./controls";
// Preview context
export { PreviewExternalProvider, usePreviewExternal } from "./PreviewContext";
export type {
  ChipProps,
  RowProps,
  SectionProps,
  SliderRowProps,
} from "./primitives";
// Primitives
export { Chip, Row, Section, SliderRow } from "./primitives";
export type {
  ShadowBuilderDefaults,
  ShadowBuilderProps,
} from "./ShadowBuilder";
// Shadow builder
export { ShadowBuilder } from "./ShadowBuilder";
