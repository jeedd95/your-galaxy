import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div
      style={{
        background: "rgb(31,31,36)",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner color="primary" size="lg" />
    </div>
  );
}
