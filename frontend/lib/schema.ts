import { z } from "zod";

export const VideoFormatSchema = z.object({
  format_note: z.string(),
  ext: z.string(),
  url: z.string().url().optional(),
});

export const VideoInfoSchema = z.object({
  title: z.string(),
  platform: z.string(),
  thumbnail: z.string().url(),
  duration: z.number(),
  formats: z.array(VideoFormatSchema),
});

export type VideoInfo = z.infer<typeof VideoInfoSchema>;
export type VideoFormat = z.infer<typeof VideoFormatSchema>;
