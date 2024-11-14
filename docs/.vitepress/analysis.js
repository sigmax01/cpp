export default ({ router }) => {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    const script = document.createElement("script");
    script.src = "https://umami.ricolxwz.io/script.js";
    script.defer = true;
    script.setAttribute("data-website-id", "428fe69a-245a-4a8c-937b-97369fc9a31b");
    document.head.appendChild(script);
  }
};