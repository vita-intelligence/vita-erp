/**
 * Select — Vita ERP canonical import for HeroUI Select (compound component).
 *
 * Styling tokens (radius, border-width) are applied globally via globals.css
 * targeting the `.select__trigger` CSS class.
 *
 * Compound usage:
 *   <Select>
 *     <Select.Trigger><Select.Value /></Select.Trigger>
 *     <Select.Popover>
 *       <ListBox>...</ListBox>
 *     </Select.Popover>
 *   </Select>
 */

export * from "@heroui/react";
export {
  Select,
  SelectIndicator,
  type SelectIndicatorProps,
  SelectPopover,
  type SelectPopoverProps,
  type SelectProps,
  SelectRoot,
  type SelectRootProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
  type SelectValueProps,
} from "@heroui/react";
