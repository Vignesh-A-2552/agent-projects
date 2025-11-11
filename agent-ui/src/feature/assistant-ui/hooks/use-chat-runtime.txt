import {
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";

export const useChatRuntime = () => {
  const adapter: ChatModelAdapter = {
    async *run({ messages, abortSignal }) {

      const lastUserMessage = messages.filter((message) => message.role === "user").pop();
      
      if (!lastUserMessage) {
        throw new Error("No user message found");
      }

      const textContent =lastUserMessage.content?.find((item) => item.type === "text")?.text || "";

      if (!textContent) {
        throw new Error("No text found");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/chat/research/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: textContent,
          }),
          signal: abortSignal,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullText = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || parsed.content || "";

                if (content) {
                  fullText += content;
                  yield {
                    content: [
                      {
                        type: "text" as const,
                        text: fullText,
                      },
                    ],
                  };
                }
              } catch (e) {
                // Skip invalid JSON
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
  };

  return useLocalRuntime(adapter);
};
