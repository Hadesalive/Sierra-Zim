import { createElement } from "react";
import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  SteeringWheelIcon,
  TruckIcon,
  ChalkboardTeacherIcon,
  MonitorIcon,
  MountainsIcon,
  TractorIcon,
  ClipboardTextIcon,
  SealCheckIcon,
  GraduationCapIcon,
  HardHatIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Icons stay in code (not CMS-editable, per the content rules), mapped by the
 * CMS slug so they survive content edits and reordering.
 */
const programmeIcons: Record<string, Icon> = {
  "light-vehicle-defensive-driving": SteeringWheelIcon,
  "heavy-vehicle-defensive-driving": TruckIcon,
  "theory-and-classroom-training": ChalkboardTeacherIcon,
  "simulator-training": MonitorIcon,
  "surface-mobile-equipment-training": MountainsIcon,
  "agriculture-equipment-training": TractorIcon,
  "pre-employment-screening": ClipboardTextIcon,
};

export const programmeIcon = (slug: string): Icon =>
  programmeIcons[slug] ?? ClipboardTextIcon;

const valuePropIcons: Record<string, Icon> = {
  "certified-and-competent": SealCheckIcon,
  "trained-by-experts": GraduationCapIcon,
  "industry-proven": HardHatIcon,
};

export const valuePropIcon = (slug: string): Icon =>
  valuePropIcons[slug] ?? SealCheckIcon;

/** Renderer wrappers — keep the (stable) icon lookup out of capitalized
 *  render-time variables, which satisfies react-hooks/static-components. */
export function ProgrammeIcon({
  slug,
  ...props
}: { slug: string } & IconProps) {
  return createElement(programmeIcon(slug), props);
}

export function ValuePropIcon({
  slug,
  ...props
}: { slug: string } & IconProps) {
  return createElement(valuePropIcon(slug), props);
}
