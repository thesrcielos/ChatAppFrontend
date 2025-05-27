import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="animate-spin" />
    </Button>
  )
}

export default ButtonLoading;

