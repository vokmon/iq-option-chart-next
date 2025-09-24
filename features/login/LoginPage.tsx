"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation, LoginCredentials } from "../../lib/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setError(null);

    const credentials: LoginCredentials = {
      identifier: values.email,
      password: values.password,
    };

    loginMutation.mutate(credentials, {
      onSuccess: (response) => {
        console.log("Login successful:", response);
        // Redirect to dashboard or main page after successful login
        router.push("/");
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Login failed");
      },
    });
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome to IQ Option</Title>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="username@domain.com"
            required
            radius="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
            disabled={loginMutation.isPending}
          />
          <PasswordInput
            label="Password"
            placeholder="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
            required
            mt="md"
            radius="md"
            disabled={loginMutation.isPending}
          />
          <Button
            loading={loginMutation.isPending}
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
