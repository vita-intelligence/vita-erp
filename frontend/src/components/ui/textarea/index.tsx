"use client";

import { TextArea as HeroTextArea, type TextAreaProps } from "@heroui/react";

export * from "@heroui/react";

function ThemedTextArea({ style, ...props }: TextAreaProps) {
  return (
    <HeroTextArea
      {...props}
      style={{
        width: "100%",
        borderRadius: "var(--vita-input-radius, 0px)",
        borderWidth: "1px",
        borderStyle: "var(--vita-input-border-style, solid)",
        borderColor: "var(--vita-input-border-color)",
        boxShadow: "var(--vita-input-shadow, none)",
        paddingLeft: "var(--vita-input-padding-x, 12px)",
        paddingRight: "var(--vita-input-padding-x, 12px)",
        paddingTop: "var(--vita-input-padding-y, 8px)",
        paddingBottom: "var(--vita-input-padding-y, 8px)",
        fontSize: "var(--vita-input-font-size, 14px)",
        transitionProperty:
          "border-color, box-shadow, outline, background-color",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-input-transition-duration, 150ms)",
        ...style,
      }}
    />
  );
}

export const TextArea = ThemedTextArea;
