"use client";

import { useState } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { Thread } from "@/src/feature/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { ThreadListSidebar } from "@/src/feature/assistant-ui/threadlist-sidebar";
import { Separator } from "@/src/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { useChatRuntime } from "@/src/feature/assistant-ui/hooks/use-chat-runtime";
import { CartButton } from "@/src/components/cart/cart-button";
import { CartSidebar } from "@/src/components/cart/cart-sidebar";

export const Assistant = () => {
  const runtime = useChatRuntime();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden lg:block">
                    <BreadcrumbLink
                      href="https://www.assistant-ui.com/docs/getting-started"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Build Your Own ChatGPT UX
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden lg:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm sm:text-base">Starter Template</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto">
                <CartButton onClick={() => setIsCartOpen(true)} />
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>

          {/* Cart Sidebar */}
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
