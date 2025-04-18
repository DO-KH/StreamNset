import SearchContent from "@/components/SearchContent";
import { Suspense } from "react";

export default function Page() {

  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
