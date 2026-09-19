type Props = {
  id: string;
  children: string;
  /** Light text for dark sections. */
  dark?: boolean;
  center?: boolean;
  size?: "md" | "lg";
};

// Green brush-script heading with an orange rule, as on the reference site.
export function SectionHeading({ id, children, dark = false, center = false, size = "md" }: Props) {
  return (
    <div className={center ? "text-center" : undefined}>
      <h2
        id={id}
        className={`font-script leading-[1.05] ${
          size === "lg"
            ? "text-[clamp(3rem,9vw,4.75rem)]"
            : "text-[clamp(2.5rem,7vw,3.75rem)]"
        } ${dark ? "text-cream-50" : "text-forest-700"}`}
      >
        {children}
      </h2>
      <span
        aria-hidden="true"
        className={`mt-3 block h-1 w-20 rounded-full bg-orange-500 ${center ? "mx-auto" : ""}`}
      />
    </div>
  );
}
