"use client";
import React, { useState } from "react";

import { useTRPC } from "@/trpc/client";
// import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { TMeetingsGetOne } from "../types";
import { meetingCreateSchema } from "../schemas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import CommandSelect from "@/components/command-select";
import GeneratedAvatar from "@/components/generated-avatar";
import CreateAgentsDialog from "@/features/agents/components/CreateAgentsDialog";

interface MeetingsFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: TMeetingsGetOne;
}

export default function MeetingsForm({
  initialValues,
  onCancel,
  onSuccess,
}: MeetingsFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [agentSearch, setAgentSearch] = useState("");
  const [openAgentsCreateDialog, setOpenAgentsCreateDialog] = useState(false);
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch }),
  );
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        onSuccess?.(data.id);
      },
      onError: (error) =>
        toast.error(error.message || "Failed to create meeting"),
    }),
  );
  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        if (initialValues?.id)
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id! }),
          );

        onSuccess?.();
      },
      onError: (error) =>
        toast.error(error.message || "Failed to update meeting"),
    }),
  );

  const form = useForm({
    resolver: zodResolver(meetingCreateSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });
  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;
  function onSubmit(values: z.infer<typeof meetingCreateSchema>) {
    if (isEdit) {
      updateMeeting.mutate({
        id: initialValues.id,
        ...values,
      });
    } else {
      createMeeting.mutate(values);
    }
  }
  return (
    <>
      <CreateAgentsDialog
        open={openAgentsCreateDialog}
        onOpenChange={setOpenAgentsCreateDialog}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Career guidance for computer science"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-6 border"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormDescription>
            Not found the agent you want?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0"
              onClick={() => setOpenAgentsCreateDialog(true)}
            >
              Create a new agent
            </Button>
          </FormDescription>
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
    </>
  );
}
