import { siteConfig, siteRoutes } from "@/config/site";
import { absoluteUrl, normalizePath } from "@/utils/url";

const titleTemplate = `%s | ${siteConfig.name}`;

export function getPageSeo(path = "/") {
  const normalizedPath = normalizePath(path);
  return (
    siteRoutes.find((route) => route.path === normalizedPath) || {
      path: normalizedPath,
      title: { absolute: siteConfig.name },
      description: siteConfig.description,
      priority: 0.5,
    }
  );
}

// The title as it ends up in <title>: plain titles go through the root
// layout's "%s | Mukta Arts" template, `{ absolute }` titles are used as is.
export function getFullTitle(title) {
  if (!title) return siteConfig.name;
  if (typeof title === "string") return titleTemplate.replace("%s", title);
  return title.absolute || title.default || siteConfig.name;
}

// The share image comes from app/opengraph-image.jsx and app/twitter-image.jsx.
// `images` / `twitterImages` are only set when passed in: an `images` key,
// even an empty one, stops Next from adding the file-based image.
export function createMetadata({
  title,
  description = siteConfig.description,
  path,
  keywords = siteConfig.keywords,
  type = "website",
  noIndex = false,
  images,
  twitterImages,
} = {}) {
  const url = path ? absoluteUrl(path) : undefined;
  const fullTitle = getFullTitle(title);

  return {
    metadataBase: new URL(siteConfig.url),
    title: title || siteConfig.name,
    description,
    keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
      },
    },
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      type,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      ...(url && { url }),
      ...(images?.length > 0 && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(twitterImages?.length > 0 && { images: twitterImages }),
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
  };
}

// Root layout defaults. No canonical or og:url here: every page sets its own,
// and a layout-level one would point unrelated pages at the home page.
export function createRootMetadata() {
  return {
    ...createMetadata(),
    title: {
      default: siteConfig.name,
      template: titleTemplate,
    },
  };
}

// Call from a page's `generateMetadata(props, parent)` with `await parent`.
// A page that sets its own `openGraph` / `twitter` replaces the layout's, and
// Next only adds the root opengraph-image / twitter-image to the root segment,
// so nested pages would lose the share image unless it is carried over here.
export function createPageMetadata(path, parentMetadata) {
  const page = getPageSeo(path);

  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noIndex: page.noIndex,
    images: parentMetadata?.openGraph?.images,
    twitterImages: parentMetadata?.twitter?.images,
  });
}
