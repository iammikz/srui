"use client";
import { Button, ToastProvider, useToast } from "@srui/react";

function FireBasic() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Saved",
          description: "Your changes are live.",
          variant: "success",
        })
      }
    >
      Show toast
    </Button>
  );
}

function FireVariants() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast({ title: "Profile updated", variant: "success" })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast({
            title: "Upload failed",
            description: "The file was too large. Try again.",
            variant: "destructive",
          })
        }
      >
        Destructive
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast({
            title: "Draft shared",
            description: "Everyone in the workspace can view it.",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        With action
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return (
    <div className="my-6">
      <ToastProvider>
        <FireBasic />
      </ToastProvider>
    </div>
  );
}

export function ToastVariantsDemo() {
  return (
    <div className="my-6">
      <ToastProvider>
        <FireVariants />
      </ToastProvider>
    </div>
  );
}
