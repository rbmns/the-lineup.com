
interface EventDescriptionSectionProps {
  description: string;
}

export const EventDescriptionSection = ({ description }: EventDescriptionSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About this event</h2>
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};
