import type { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Home Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "heroEyebrowAccent", type: "text", label: "Hero eyebrow — accent word" },
            { name: "heroEyebrowRest", type: "text", label: "Hero eyebrow — rest" },
            { name: "heroTitleLine1", type: "text", label: "Hero title — line 1" },
            { name: "heroTitleAccent", type: "text", label: "Hero title — green word" },
            { name: "heroTitleLine2", type: "text", label: "Hero title — line 2" },
            { name: "heroSubhead", type: "textarea", label: "Hero subhead" },
            { name: "heroPillTitle", type: "text", label: "Hero badge — title" },
            { name: "heroPillSubtitle", type: "text", label: "Hero badge — subtitle" },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              label: "Hero image",
              admin: { description: "The main photo on the home hero. Leave empty to use the default." },
            },
            {
              name: "socialImage",
              type: "upload",
              relationTo: "media",
              label: "Default social / OG image",
            },
          ],
        },
        {
          label: "Sections",
          fields: [
            { name: "clientsLabel", type: "text", label: "Clients band label" },
            { name: "programmesEyebrow", type: "text", label: "Programmes — eyebrow" },
            { name: "programmesHeading", type: "text", label: "Programmes — heading" },
            { name: "programmesIntro", type: "textarea", label: "Programmes — intro" },
            { name: "certPathEyebrow", type: "text", label: "Certification path — eyebrow" },
            { name: "certPathHeading", type: "text", label: "Certification path — heading" },
            { name: "certPathIntro", type: "textarea", label: "Certification path — intro" },
            {
              name: "certPathSteps",
              type: "array",
              label: "Certification steps",
              fields: [
                { name: "title", type: "text" },
                { name: "body", type: "textarea" },
              ],
            },
            { name: "whyUsEyebrow", type: "text", label: "Why us — eyebrow" },
            { name: "whyUsHeading", type: "text", label: "Why us — heading" },
            { name: "whyUsIntro", type: "textarea", label: "Why us — intro" },
            {
              name: "whyUsImage",
              type: "upload",
              relationTo: "media",
              label: "Why us — image",
              admin: { description: "Leave empty to use the default." },
            },
            { name: "whyUsImageCaption", type: "text", label: "Why us — image caption" },
            { name: "workEyebrow", type: "text", label: "Work — eyebrow" },
            { name: "workHeading", type: "text", label: "Work — heading" },
            { name: "galleryEyebrow", type: "text", label: "Gallery preview — eyebrow" },
            { name: "galleryHeading", type: "text", label: "Gallery preview — heading" },
            { name: "faqEyebrow", type: "text", label: "FAQ — eyebrow" },
            { name: "faqHeading", type: "text", label: "FAQ — heading" },
          ],
        },
        {
          label: "Statement & stats",
          fields: [
            { name: "statementQuote", type: "textarea", label: "Statement quote" },
            { name: "statementPartnersLabel", type: "text", label: "Partners label" },
            {
              name: "statementPartners",
              type: "array",
              label: "Partners",
              fields: [{ name: "partner", type: "text" }],
            },
            {
              name: "stats",
              type: "array",
              label: "Stats",
              fields: [
                { name: "value", type: "text" },
                { name: "label", type: "text" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
