import type { GlobalConfig } from "payload";

import { indexHeroGroup } from "../fields/shared";

export const Pages: GlobalConfig = {
  slug: "pages",
  label: "Other pages",
  access: { read: () => true },
  admin: { group: "Settings" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "About",
          fields: [
            {
              name: "about",
              type: "group",
              fields: [
                { name: "metaDescription", type: "textarea", label: "Meta description" },
                { name: "heroEyebrow", type: "text" },
                { name: "heroTitleLine1", type: "text", label: "Hero title — line 1" },
                { name: "heroTitleLine2", type: "text", label: "Hero title — line 2" },
                { name: "heroIntro", type: "textarea" },
                { name: "storyEyebrow", type: "text" },
                { name: "storyHeading", type: "text" },
                {
                  name: "storyBlocks",
                  type: "array",
                  label: "Story paragraphs",
                  fields: [{ name: "text", type: "textarea" }],
                },
                { name: "storyImageCaption", type: "text" },
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
        {
          label: "Contact",
          fields: [
            {
              name: "contact",
              type: "group",
              fields: [
                { name: "heroEyebrow", type: "text" },
                { name: "heroTitle", type: "text" },
                { name: "heroIntro", type: "textarea" },
                { name: "detailsEyebrow", type: "text" },
                { name: "detailsHeading", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Index heroes",
          fields: [
            indexHeroGroup("servicesHero", "Services page hero"),
            indexHeroGroup("portfolioHero", "Portfolio page hero"),
            indexHeroGroup("galleryHero", "Gallery page hero"),
            indexHeroGroup("sectorsHero", "Sectors page hero"),
          ],
        },
      ],
    },
  ],
};
