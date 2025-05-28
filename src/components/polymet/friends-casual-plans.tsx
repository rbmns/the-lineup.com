import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/polymet/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon } from "lucide-react";
import CategoryBadge from "@/polymet/components/category-badge";
import { CasualPlanData } from "@/polymet/data/casual-plans-data";

interface FriendsCasualPlansProps {
  casualPlans: CasualPlanData[];
  className?: string;
}

export default function FriendsCasualPlans({
  casualPlans,
  className = "",
}: FriendsCasualPlansProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Determine if a plan is in the past or upcoming
  const today = new Date();
  const upcomingPlans = casualPlans.filter((plan) => {
    // Simple date comparison (in a real app, would need more precise date parsing)
    return new Date(plan.date) >= today;
  });

  const pastPlans = casualPlans.filter((plan) => {
    return new Date(plan.date) < today;
  });

  // Sort plans by date
  const sortedUpcomingPlans = [...upcomingPlans].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sortedPastPlans = [...pastPlans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div
      className={`rounded-lg border border-secondary-50 bg-white ${className}`}
    >
      <div className="border-b border-secondary-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Friends' Casual Plans</h2>
          <Badge variant="secondary">{upcomingPlans.length} upcoming</Badge>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "upcoming" | "past")}
        className="w-full"
      >
        <div className="border-b border-secondary-50">
          <TabsList className="w-full rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="upcoming"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-vibrant-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CalendarIcon size={16} className="mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-vibrant-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CalendarIcon size={16} className="mr-2" />
              Past
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="p-0">
          {sortedUpcomingPlans.length > 0 ? (
            <div className="divide-y divide-secondary-50">
              {sortedUpcomingPlans.map((plan) => (
                <CasualPlanItem key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />

              <h3 className="mt-2 font-medium">No upcoming casual plans</h3>
              <p className="text-sm text-muted-foreground">
                Your friends haven't created any upcoming casual plans yet
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/plans">Discover Plans</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="p-0">
          {sortedPastPlans.length > 0 ? (
            <div className="divide-y divide-secondary-50">
              {sortedPastPlans.map((plan) => (
                <CasualPlanItem key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />

              <h3 className="mt-2 font-medium">No past casual plans</h3>
              <p className="text-sm text-muted-foreground">
                Your friends haven't created any past casual plans
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/plans">Discover Plans</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CasualPlanItemProps {
  plan: CasualPlanData;
}

function CasualPlanItem({ plan }: CasualPlanItemProps) {
  // Determine if the plan is hosted by a friend or just attended by friends
  const isFriendHosted = plan.host.id !== "currentUser"; // Assuming currentUser is the logged-in user's ID

  return (
    <div className="p-4">
      <div className="flex">
        <div className="mr-4 flex-shrink-0">
          {/* Use host avatar or a fallback image */}
          <img
            src={
              plan.host.avatar ||
              `https://picsum.photos/seed/${plan.id}/100/100`
            }
            alt={plan.title}
            className="h-16 w-16 rounded-md object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <CategoryBadge category={plan.category} size="sm" />

            <div className="ml-2 flex items-center text-xs text-muted-foreground">
              <UsersIcon size={12} className="mr-1" />

              {isFriendHosted ? "Hosted by friend" : "Friend attending"}
            </div>
          </div>
          <h3 className="mt-1 font-medium">
            <Link
              to={`/plans/${plan.id}`}
              className="hover:text-vibrant-teal hover:underline"
            >
              {plan.title}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center text-sm text-muted-foreground">
            <span className="mr-3">{plan.date}</span>
            <span className="mr-3">{plan.time}</span>
            <span>{plan.location}</span>
          </div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <span>Hosted by: {plan.host.name}</span>
          </div>
          {plan.attendees && (
            <div className="mt-2 flex items-center">
              <div className="flex -space-x-2">
                {plan.attendees.avatars?.slice(0, 3).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt="Attendee"
                    className="h-6 w-6 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="ml-2 text-xs text-muted-foreground">
                {plan.attendees.count} attendee
                {plan.attendees.count !== 1 ? "s" : ""}
                {plan.attendees.max && <> (max: {plan.attendees.max})</>}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/plans/${plan.id}`}>View</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
