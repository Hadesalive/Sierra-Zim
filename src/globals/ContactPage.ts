import type { GlobalConfig } from "payload";

import { heroImageField } from "../fields/shared";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: [
    { name: "metaDescription", type: "textarea", label: "Meta description" },
    { name: "heroEyebrow", type: "text" },
    { name: "heroTitle", type: "text" },
    { name: "heroIntro", type: "textarea" },
    heroImageField(),
    { name: "detailsEyebrow", type: "text" },
    { name: "detailsHeading", type: "text" },
  ],
};
