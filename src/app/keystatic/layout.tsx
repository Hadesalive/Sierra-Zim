import KeystaticApp from "./keystatic";

/**
 * The Keystatic admin renders in a full-screen overlay so it sits cleanly above
 * the marketing site's header/footer (it shares the root layout for now; a route
 * group can fully separate it during the production migration).
 */
export default function KeystaticLayout() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        overflow: "auto",
        background: "#fff",
      }}
    >
      <KeystaticApp />
    </div>
  );
}
