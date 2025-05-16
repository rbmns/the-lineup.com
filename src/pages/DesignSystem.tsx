
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CategoryPillShowcase } from "@/components/ui/CategoryPillShowcase";

export default function DesignSystem() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Design System</h1>

      <section className="mb-8">
        <CategoryPillShowcase />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
        <div className="flex space-x-2">
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button 
            variant="default"
            onClick={() => toast({
              title: "Success",
              description: "Your action was successful!",
            })}
          >
            Success Toast
          </Button>

          <Button 
            variant="destructive"
            onClick={() => toast({
              title: "Error",
              description: "There was an error with your action!",
              variant: "destructive",
            })}
          >
            Error Toast
          </Button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Cards</h2>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            This is the content of the card.
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Forms</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="Enter your password" />
          </div>
          <Button>Submit</Button>
        </form>
      </section>
    </div>
  );
}
