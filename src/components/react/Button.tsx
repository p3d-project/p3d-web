import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/utils";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonCustomProps {
  size?: ButtonSize;
}

export type ButtonProps<T extends React.ElementType> = ButtonCustomProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | keyof ButtonCustomProps>;

const buttonBaseStyle = cn(
  "inline-flex font-bmspace items-center transition-[color,background-color,box-shadow] duration-200 cursor-pointer bg-secondary text-white",
);
const buttonSizeMap: Record<ButtonSize, string> = {
  sm: cn("text-lg px-4 py-1.5"),
  md: cn("text-xl px-4 py-2"),
  lg: cn("text-2xl px-6 py-3"),
};

function getButtonStyle({ size = "md", className }: ButtonProps<"button">) {
  return cn(buttonBaseStyle, buttonSizeMap[size], className);
}

function ButtonInner(
  props: ButtonProps<"button">,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { as, size = "md", children, className, ...rest } = props;

  const Tag = as || "button";

  return (
    <Tag ref={ref} className={getButtonStyle({ size, className })} {...rest}>
      {children}
    </Tag>
  );
}

export const Button = forwardRef(ButtonInner) as <
  T extends React.ElementType = "button",
>(
  props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] },
) => React.ReactElement | null;

export default Button;
