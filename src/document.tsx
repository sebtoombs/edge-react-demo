import { ReactNode } from "react";

interface DocumentProps {
  children: ReactNode;
}

const Document = ({ children }: DocumentProps) => {
  return (
    <html>
      <head>
        <title>Document</title>
      </head>
      <body>{children}</body>
      {/* This is where the page-specific client entrypoint would go */}
      {/* <script src="/public/hello.js"></script> */}
    </html>
  );
};

export default Document;
