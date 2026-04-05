"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const AddMonitorForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/monitors/add", {
        method: "POST",
        body: JSON.stringify({ name, url }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-card rounded-xl border shadow-sm max-w-3xl mx-auto mt-16"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Nom du service</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mon API"
            required
          />
        </Field>
        <Field>
          <FieldLabel>URL</FieldLabel>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://mon-site.com"
            type="url"
            required
          />
        </Field>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="hover:cursor-pointer"
          >
            {isSubmitting ? "Ajout..." : "Ajouter le site"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="hover:cursor-pointer"
          >
            Annuler
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default AddMonitorForm;
