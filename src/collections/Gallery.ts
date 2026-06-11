import type { CollectionConfig } from "payload";

import { orderField } from "../fields/shared";

const isVideo = (data: Record<string, unknown> | undefined) =>
  data?.mediaType === "video";
const isImage = (data: Record<string, unknown> | undefined) =>
  data?.mediaType === "image";

export const Gallery: CollectionConfig = {
  slug: "gallery",
  labels: { singular: "Gallery item", plural: "Gallery" },
  access: { read: () => true },
  admin: {
    useAsTitle: "caption",
    defaultColumns: ["caption", "mediaType", "order"],
    group: "Content",
  },
  defaultSort: "order",
  fields: [
    { name: "caption", type: "text", required: true },
    { name: "alt", type: "textarea", label: "Alt text" },
    {
      name: "mediaType",
      type: "select",
      required: true,
      defaultValue: "image",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { condition: (data) => isImage(data) },
    },
    {
      name: "provider",
      type: "select",
      defaultValue: "youtube",
      options: [
        { label: "YouTube", value: "youtube" },
        { label: "Vimeo", value: "vimeo" },
        { label: "File (MP4)", value: "file" },
      ],
      admin: { condition: (data) => isVideo(data) },
    },
    {
      name: "videoSrc",
      type: "text",
      label: "Video ID or /path.mp4",
      admin: { condition: (data) => isVideo(data) },
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      admin: { condition: (data) => isVideo(data) },
    },
    {
      name: "width",
      type: "number",
      defaultValue: 1280,
      admin: { condition: (data) => isVideo(data), description: "Video frame width" },
    },
    {
      name: "height",
      type: "number",
      defaultValue: 720,
      admin: { condition: (data) => isVideo(data), description: "Video frame height" },
    },
    orderField,
  ],
};
