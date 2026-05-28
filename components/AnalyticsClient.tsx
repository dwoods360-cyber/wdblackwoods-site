"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { capture, getAnalyticsMode, initAnalytics } from "@/lib/analytics";

const archiveSlugNames: Record<string, string> = {
  "vine-crown": "Vine Crown",
  "the-arithmetic-on-the-wall": "The Arithmetic on the Wall",
  "caravanserai-incident-massawa": "Caravanserai Incident — Massawa",
  "founding-entry-what-coffee-demands": "Founding Entry: What Coffee Demands",
};

const pageViewMap: Record<string, { event: string; pageName: string }> = {
  "/": { event: "page_view_home", pageName: "Home" },
  "/begin": { event: "page_view_begin", pageName: "Begin" },
  "/archive": { event: "page_view_archive_index", pageName: "Archive" },
};

const enterMap: Record<string, string> = {
  "/begin": "enter_begin",
  "/archive/vine-crown": "enter_vine_crown",
  "/archive/the-arithmetic-on-the-wall": "enter_arithmetic",
  "/archive/caravanserai-incident-massawa": "enter_caravanserai",
};

function getArchiveSlug(pathname: string) {
  const prefix = "/archive/";
  if (!pathname.startsWith(prefix)) {
    return undefined;
  }

  return pathname.slice(prefix.length) || undefined;
}

function getPageData(pathname: string) {
  const pageView = pageViewMap[pathname];
  const slug = getArchiveSlug(pathname);
  const pageName = slug ? archiveSlugNames[slug] ?? "Archive Entry" : pageView?.pageName ?? "Unknown";

  return {
    pageName,
    pageSlug: slug,
    pageViewEvent: slug ? "page_view_archive_slug" : pageView?.event,
    enterEvent: enterMap[pathname],
  };
}

function getScrollDepth(scrollTop: number, totalHeight: number) {
  if (totalHeight <= 0) {
    return 100;
  }

  return Math.min(100, Math.round((scrollTop / totalHeight) * 100));
}

export default function AnalyticsClient() {
  const pathname = usePathname();
  const analyticsMode = getAnalyticsMode();
  const startTimeRef = useRef(0);
  const lastScrollRef = useRef(0);
  const thresholdSentRef = useRef(new Set<number>());
  const timerIdsRef = useRef<number[]>([]);
  const exitSentRef = useRef(false);

  const { pageName, pageSlug, pageViewEvent, enterEvent } = useMemo(
    () => getPageData(pathname || "/"),
    [pathname]
  );

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    exitSentRef.current = false;
    thresholdSentRef.current.clear();
    startTimeRef.current = Date.now();
    lastScrollRef.current = 0;

    const props = {
      pageName,
      ...(pageSlug ? { slug: pageSlug } : {}),
    };

    if (pageViewEvent) {
      capture(pageViewEvent, props);
    }

    if (enterEvent) {
      capture(enterEvent, props);
    }
  }, [pathname, pageName, pageSlug, pageViewEvent, enterEvent]);

  useEffect(() => {
    if (analyticsMode !== "full") {
      return;
    }

    const sendScrollEvent = (depth: number) => {
      capture(`scroll_${depth}`, {
        pageName,
        ...(pageSlug ? { slug: pageSlug } : {}),
        scrollDepth: depth,
        timeOnPage: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      lastScrollRef.current = scrollTop;
      const totalHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      );
      const depth = getScrollDepth(scrollTop, totalHeight);
      const thresholds = [25, 50, 75, 100];

      for (const threshold of thresholds) {
        if (depth >= threshold && !thresholdSentRef.current.has(threshold)) {
          thresholdSentRef.current.add(threshold);
          sendScrollEvent(threshold);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [analyticsMode, pageName, pageSlug]);

  useEffect(() => {
    if (analyticsMode !== "full") {
      return;
    }

    const timers = [30, 60, 120].map((seconds) =>
      window.setTimeout(() => {
        capture(`time_on_page_${seconds}s`, {
          pageName,
          ...(pageSlug ? { slug: pageSlug } : {}),
          timeOnPage: seconds,
        });
      }, seconds * 1000)
    );

    timerIdsRef.current = timers;

    return () => {
      timerIdsRef.current.forEach(window.clearTimeout);
      timerIdsRef.current = [];
    };
  }, [analyticsMode, pageName, pageSlug]);

  useEffect(() => {
    const sendExit = () => {
      if (exitSentRef.current) {
        return;
      }

      exitSentRef.current = true;
      capture("exit", {
        pageName,
        ...(pageSlug ? { slug: pageSlug } : {}),
        lastScrollPosition: lastScrollRef.current,
        timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    };

    const handlePageHide = () => sendExit();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendExit();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendExit();
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [analyticsMode, pageName, pageSlug]);

  return null;
}
