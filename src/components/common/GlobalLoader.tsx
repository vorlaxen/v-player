import { RootState } from "@/store";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { memo, useEffect } from "react";
import { setLoading } from "@/store/slices/mainSlice";
import { useTheme } from "@/context/ThemeContext";

const GlobalLoader = memo(() => {
  const loader = useSelector((state: RootState) => state.main.loader);
  const { theme } = useTheme();

  if (!loader.isLoading) return null;


  const isDark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);


  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-busy={true}
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-8",
        "backdrop-blur-md transition-all duration-500 ease-out select-none",
        isDark
          ? "bg-black/70 via-black/60 to-black/50"
          : "bg-white/70 via-white/60 to-white/50"
      )}
    >
      <div className="relative flex items-center justify-center">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="80px"
          height="80px"
          viewBox="0 0 50 50"
          xmlSpace="preserve"
        >
          <path
            fill="none"
            stroke="url(#loader-gradient)"
            strokeWidth="4"
            d="M25 6.461
               a18.539 18.539 0 1 1 0 37.078
               a18.539 18.539 0 1 1 0 -37.078"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {isDark ? (
                <>
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#888" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#000" />
                  <stop offset="100%" stopColor="#ccc" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>
      </div>

      {loader.message && (
        <div className="relative max-w-md px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />
          <p
            className={cn(
              "relative text-center font-semibold select-text break-words drop-shadow-lg animate-pulse-soft",
              isDark ? "text-white" : "text-gray-800",
              "text-base sm:text-lg md:text-xl"
            )}
          >
            {loader.message}
          </p>
        </div>
      )}
    </div>,
    document.body
  );
});

GlobalLoader.displayName = "GlobalLoader";

export const LoaderFallback = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading({ isLoading: true }));
    return () => {
      dispatch(setLoading({ isLoading: false }));
    };
  }, [dispatch]);

  return <GlobalLoader />;
};

export default GlobalLoader;