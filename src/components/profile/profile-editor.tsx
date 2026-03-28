"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/actions/profile";
import { Pencil, Check, X } from "lucide-react";

type ProfileEditorProps = {
  currentUsername: string;
};

export function ProfileEditor({ currentUsername }: ProfileEditorProps) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await updateProfile(formData);
    if (!result.ok) {
      setError(result.error);
    } else {
      setEditing(false);
    }
    setPending(false);
  }

  if (!editing) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
        <Pencil className="mr-2 h-3 w-3" />
        Edit Username
      </Button>
    );
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <Input
        name="username"
        defaultValue={currentUsername}
        className="h-8 max-w-[200px]"
        minLength={3}
        maxLength={20}
      />
      <Button type="submit" size="icon" className="h-8 w-8" disabled={pending}>
        <Check className="h-3 w-3" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(false)}>
        <X className="h-3 w-3" />
      </Button>
      {error && <p className="text-xs text-error">{error}</p>}
    </form>
  );
}
