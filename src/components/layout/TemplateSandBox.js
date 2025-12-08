"use client";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

const TemplateSandbox = ({ children }) => {
  const iframeRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Pastikan body kosong
    doc.open();
    doc.write(
      `<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>`
    );
    doc.close();

    // Render React ke dalam iframe
    const mountPoint = doc.getElementById("root");

    if (!rootRef.current) {
      rootRef.current = ReactDOM.createRoot(mountPoint);
    }

    rootRef.current.render(children);
  }, [children]);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: "100%",
        minHeight: "900px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default TemplateSandbox;
