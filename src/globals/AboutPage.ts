import type { GlobalConfig } from "payload";

import { heroImageField } from "../fields/shared";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero & story",
          fields: [
            { name: "metaDescription", type: "textarea", label: "Meta description" },
            { name: "heroEyebrow", type: "text" },
            { name: "heroTitleLine1", type: "text", label: "Hero title — line 1" },
            { name: "heroTitleLine2", type: "text", label: "Hero title — line 2" },
            { name: "heroIntro", type: "textarea" },
            heroImageField(),
            { name: "storyEyebrow", type: "text" },
            { name: "storyHeading", type: "text" },
            {
              name: "storyBlocks",
              type: "array",
              label: "Story paragraphs",
              fields: [{ name: "text", type: "textarea" }],
            },
            { name: "storyImage", type: "upload", relationTo: "media", label: "Story image" },
            { name: "storyImageCaption", type: "text" },
          ],
        },
        {
          label: "Leadership, locations & clients",
          fields: [
            { name: "leadershipEyebrow", type: "text" },
            { name: "leadershipHeading", type: "text" },
            { name: "locationsEyebrow", type: "text" },
            { name: "locationsHeading", type: "text" },
            {
              name: "locations",
              type: "array",
              fields: [
                { name: "place", type: "text" },
                { name: "note", type: "text" },
              ],
            },
            { name: "clientsHeading", type: "text" },
          ],
        },
      ],
    },
  ],
};
