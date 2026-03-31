import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ShelbyLessonProps = {
  lesson: string;
};

export function ShelbyLesson({ lesson }: ShelbyLessonProps) {
  return (
    <Card className="border-gold/15 bg-gold/[0.03]">
      <CardHeader>
        <CardTitle className="text-base text-gold">The Shelby Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-text-secondary">{lesson}</p>
      </CardContent>
    </Card>
  );
}
