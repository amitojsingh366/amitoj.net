"use client";

import { useEffect } from "react";

export function HeroProjectsSnap() {
  useEffect(() => {
    let isAnimating = false;
    let gestureComplete = true;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let touchStartY = 0;

    const getProjectsTop = () =>
      document.getElementById("projects")?.offsetTop ?? 0;

    const markIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        gestureComplete = true;
      }, 400);
    };

    const snapTo = (target: number) => {
      isAnimating = true;
      gestureComplete = false;
      window.scrollTo({ top: target, behavior: "smooth" });
      setTimeout(() => {
        isAnimating = false;
      }, 900);
    };

    // --- Desktop: wheel events ---
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      const scrollY = window.scrollY;
      const projectsTop = getProjectsTop();
      const goingDown = e.deltaY > 0;

      // Block all scrolling in the forbidden zone (between hero and projects)
      if (scrollY > 0 && scrollY < projectsTop) {
        e.preventDefault();
        if (gestureComplete) {
          snapTo(goingDown ? projectsTop : 0);
        }
        return;
      }

      if (!gestureComplete) return;

      // At hero top, scrolling down → projects
      if (scrollY <= 0 && goingDown) {
        e.preventDefault();
        snapTo(projectsTop);
        return;
      }

      // Near projects top, scrolling up → hero
      if (scrollY >= projectsTop && scrollY <= projectsTop + 15 && !goingDown) {
        e.preventDefault();
        snapTo(0);
        return;
      }
    };

    // --- Mobile: touch events ---
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      const scrollY = window.scrollY;
      const projectsTop = getProjectsTop();
      const currentTouchY = e.touches[0].clientY;
      const swipingUp = touchStartY - currentTouchY > 0;

      // In hero section → prevent native scroll entirely
      if (scrollY < projectsTop - 5) {
        e.preventDefault();
        return;
      }

      // At projects top, swiping down → prevent native scroll
      if (
        scrollY >= projectsTop - 5 &&
        scrollY <= projectsTop + 5 &&
        !swipingUp
      ) {
        e.preventDefault();
        return;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating || !gestureComplete) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 20) return;

      const scrollY = window.scrollY;
      const projectsTop = getProjectsTop();
      const goingDown = deltaY > 0;

      // In hero zone, swiped up → projects
      if (scrollY < projectsTop - 5 && goingDown) {
        snapTo(projectsTop);
        return;
      }

      // In hero zone, swiped down → back to hero top
      if (scrollY < projectsTop - 5 && !goingDown) {
        snapTo(0);
        return;
      }

      // At projects top, swiped down → hero
      if (
        scrollY >= projectsTop - 5 &&
        scrollY <= projectsTop + 5 &&
        !goingDown
      ) {
        snapTo(0);
        return;
      }
    };

    // --- Scroll handler: detect boundary crossings + fallback snap ---
    let lastScrollY = window.scrollY;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      markIdle();
      const scrollY = window.scrollY;
      const projectsTop = getProjectsTop();

      if (!isAnimating) {
        // Crossed projectsTop going up → snap to projectsTop
        if (lastScrollY >= projectsTop && scrollY < projectsTop && scrollY > 5) {
          lastScrollY = scrollY;
          snapTo(projectsTop);
          return;
        }

        // Fallback: ended up in forbidden zone → snap to nearest
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        if (scrollY > 5 && scrollY < projectsTop - 5) {
          scrollEndTimer = setTimeout(() => {
            if (isAnimating) return;
            const currentY = window.scrollY;
            const pt = getProjectsTop();
            if (currentY > 5 && currentY < pt - 5) {
              snapTo(currentY < pt / 2 ? 0 : pt);
            }
          }, 100);
        }
      }

      lastScrollY = scrollY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer) clearTimeout(idleTimer);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);

  return null;
}
