"use client";
import React from "react";

import { useTRPC } from "@/trpc/client";
// import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { TAgentGetOne } from "../types";
import { agentCreateSchema } from "../schemas";

import GeneratedAvatar from "@/components/generated-avatar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface AgentsFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  intialValues?: TAgentGetOne;
}

export default function AgentsForm({
  intialValues,
  onCancel,
  onSuccess,
}: AgentsFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

        if (intialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: intialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) =>
        toast.error(error.message || "Failed to create agent"),
    }),
  );
  const form = useForm({
    resolver: zodResolver(agentCreateSchema),
    defaultValues: {
      name: intialValues?.name ?? "",
      instructions: intialValues?.instructions ?? "",
    },
  });
  const isEdit = !!intialValues?.id;
  const isPending = createAgent.isPending;
  function onSubmit(values: z.infer<typeof agentCreateSchema>) {
    if (isEdit) {
      //TODO: update agent
      toast.error("Update agent is not implemented yet");
    } else {
      createAgent.mutate(values);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="size-16 border"
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Career Coach" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. You are an assistant that provide career advice with structured plans"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}

          <Button variant="default" disabled={isPending} type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
