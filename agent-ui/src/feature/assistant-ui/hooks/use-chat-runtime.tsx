import { useLocalRuntime, type ChatModelAdapter } from "@assistant-ui/react";
import type { Product } from "@/src/types/product";

export const useChatRuntime = () => {
  const adapter: ChatModelAdapter = {
    async *run({ messages, abortSignal }) {
      const lastUserMessage = messages
        .filter((message) => message.role === "user")
        .pop();

      if (!lastUserMessage) {
        throw new Error("No user message found");
      }

      const textContent =
        lastUserMessage.content?.find((item) => item.type === "text")?.text ||
        "";

      if (!textContent) {
        throw new Error("No text found");
      }

      const response = await fetch(
        "http://localhost:8009/products",
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

      // Check content type to determine if it's JSON or streaming
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        // Handle direct JSON response
        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          // Yield products directly with optional follow_up_question
          yield {
            content: [
              {
                type: "tool-call" as const,
                toolCallId: "product-showcase",
                toolName: "show_products",
                args: {
                  products: data.products,
                  follow_up_question: data.follow_up_question || null,
                },
                argsText: JSON.stringify({
                  products: data.products,
                  follow_up_question: data.follow_up_question || null,
                }),
              },
            ],
          };
        } else {
          // Handle as text response
          const text = typeof data === 'string' ? data : JSON.stringify(data);
          yield {
            content: [
              {
                type: "text" as const,
                text: text,
              },
            ],
          };
        }
      } else {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let fullText = "";
        let productData: Product[] | null = null;

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

                  // Check if this is product data
                  if (parsed.products && Array.isArray(parsed.products)) {
                    productData = parsed.products as Product[];
                    continue;
                  }

                  const content =
                    parsed.choices?.[0]?.delta?.content || parsed.content || "";

                  if (content) {
                    fullText += content;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const contentArray: any[] = [
                      {
                        type: "text" as const,
                        text: fullText,
                      },
                    ];

                    // Include product data if available
                    if (productData && productData.length > 0) {
                      contentArray.push({
                        type: "tool-call" as const,
                        toolCallId: "product-showcase",
                        toolName: "show_products",
                        args: { products: productData },
                        argsText: JSON.stringify({ products: productData }),
                      });
                    }

                    yield {
                      content: contentArray,
                    };
                  }
                } catch {
                  // Skip invalid JSON
                  continue;
                }
              }
            }
          }

          // If we have product data but no text, still yield the products
          if (productData && productData.length > 0 && !fullText) {
            yield {
              content: [
                {
                  type: "tool-call" as const,
                  toolCallId: "product-showcase",
                  toolName: "show_products",
                  args: { products: productData },
                  argsText: JSON.stringify({ products: productData }),
                },
              ],
            };
          }
        } finally {
          reader.releaseLock();
        }
      }
    },
  };

  return useLocalRuntime(adapter);
};
