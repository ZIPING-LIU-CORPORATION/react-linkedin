import LinkedInBadge from "./index";

declare global {
   interface Window {
      LinkedInBadge: typeof LinkedInBadge;
   }
}

(
   function() {
      if(typeof window !== "undefined" && typeof (window as any).LinkedInBadge === "undefined") {
         window.LinkedInBadge = LinkedInBadge;
      }
   }
)();