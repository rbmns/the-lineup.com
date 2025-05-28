import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const explorerTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The Lineup helped me discover amazing local events during my stay in Zandvoort. I met great people and experienced the town like a local!",
    author: {
      name: "Sarah K.",
      role: "Digital Nomad",
      avatar: "https://github.com/yusufhilmi.png",
    },
  },
  {
    id: 2,
    quote:
      "I found a casual beach volleyball meetup through The Lineup and ended up making friends I still keep in touch with. Perfect for solo travelers!",
    author: {
      name: "Michael T.",
      role: "Traveler from Canada",
      avatar: "https://github.com/furkanksl.png",
    },
  },
  {
    id: 3,
    quote:
      "As someone who travels for work, The Lineup helps me feel connected to each place I visit. The casual plans feature is brilliant!",
    author: {
      name: "Ava L.",
      role: "Business Traveler",
      avatar: "https://github.com/yahyabedirhan.png",
    },
  },
];

const localTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "I love sharing my favorite local spots with visitors. The Lineup makes it easy to organize casual meetups and show people the real Zandvoort.",
    author: {
      name: "Thomas B.",
      role: "Zandvoort Resident",
      avatar: "https://github.com/kdrnp.png",
    },
  },
  {
    id: 2,
    quote:
      "As a small business owner, The Lineup has helped me connect with both locals and tourists. It's become an essential community tool.",
    author: {
      name: "Emma V.",
      role: "Café Owner",
      avatar: "https://github.com/denizbuyuktas.png",
    },
  },
  {
    id: 3,
    quote:
      "I've organized several beach cleanups through The Lineup. It's amazing to see both locals and visitors come together for our community.",
    author: {
      name: "Jan D.",
      role: "Community Organizer",
      avatar: "https://github.com/polymet-ai.png",
    },
  },
];

interface TestimonialSectionProps {
  persona: "explorer" | "local";
  className?: string;
}

export default function TestimonialSection({
  persona,
  className,
}: TestimonialSectionProps) {
  const testimonials =
    persona === "explorer" ? explorerTestimonials : localTestimonials;

  return (
    <section className={cn("bg-white px-4 py-16", className)}>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
          {persona === "explorer"
            ? "What Travelers Are Saying"
            : "From Our Local Community"}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg border border-secondary-50 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-vibrant-teal">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              <p className="mb-6 text-primary-75">{testimonial.quote}</p>

              <div className="flex items-center">
                {testimonial.author.avatar ? (
                  <img
                    src={testimonial.author.avatar}
                    alt={testimonial.author.name}
                    className="mr-4 h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <UserIcon size={20} className="text-primary-75" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{testimonial.author.name}</h4>
                  <p className="text-sm text-primary-75">
                    {testimonial.author.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
