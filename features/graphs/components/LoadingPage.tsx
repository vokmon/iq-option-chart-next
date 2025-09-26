"use client";

import React from "react";
import {
  Box,
  Container,
  Paper,
  Title,
  Text,
  Progress,
  Stack,
  Center,
  Loader,
  Divider,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";

const LoadingPage: React.FC = () => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.md,
      }}
    >
      <Container size={500} w="100%">
        <Paper
          radius="xl"
          p="xl"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            width: "100%",
          }}
        >
          <Stack gap="xl" align="center">
            {/* Spinner */}
            <Center>
              <Box
                style={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                }}
              >
                <Loader
                  size="xl"
                  color="orange"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
                <Loader
                  size="lg"
                  color="blue"
                  style={{
                    position: "absolute",
                    top: "15%",
                    left: "15%",
                    width: "70%",
                    height: "70%",
                    animationDelay: "0.5s",
                  }}
                />
                <Loader
                  size="md"
                  color="teal"
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "30%",
                    width: "40%",
                    height: "40%",
                    animationDelay: "1s",
                  }}
                />
              </Box>
            </Center>

            {/* Content */}
            <Stack gap="md" align="center">
              <Title
                order={1}
                size="2rem"
                fw={600}
                c="white"
                ta="center"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                Initializing Chart
              </Title>
              <Text size="lg" c="dimmed" ta="center" fw={400}>
                Connecting to trading platform...
              </Text>

              {/* Progress */}
              <Stack gap="sm" w="100%">
                <Progress
                  value={75}
                  size="sm"
                  radius="md"
                  color="orange"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                  }}
                  animated
                />
                <Text size="sm" c="dimmed" ta="center" fw={500}>
                  Establishing connection
                </Text>
              </Stack>
            </Stack>

            {/* Footer */}
            <Divider color="rgba(255, 255, 255, 0.1)" size="sm" />
            <Text size="sm" c="dimmed" ta="center" fs="italic">
              Please wait while we set up your trading environment
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoadingPage;
