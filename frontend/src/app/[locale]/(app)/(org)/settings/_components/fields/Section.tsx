import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-vita-text-primary">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-vita-text-muted">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="divide-y"
          style={{
            borderColor: "color-mix(in srgb, currentColor 10%, transparent)",
          }}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
