
import React from 'react';
import { typography } from '@/components/polymet/brand-typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, Download, Share2 } from 'lucide-react';
import { WaveIcon } from '@/components/polymet/wave-icon';

export function ComponentsGuide() {
    return (
        <section className="space-y-6">
            <div>
                <h2 className={typography.h2}>Components</h2>
                <p className={typography.body}>
                    Our core UI components follow consistent patterns and styling.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className={typography.h3}>Buttons</h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Button>Default Button</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Button size="lg">Large</Button>
                        <Button>Default</Button>
                        <Button size="sm">Small</Button>
                        <Button size="icon"><Heart size={16} /></Button>
                    </div>
                </div>

                <div>
                    <h3 className={typography.h3}>Badges</h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                    </div>
                </div>

                <div>
                    <h3 className={typography.h3}>Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Card Title</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>This is a basic card with header and content.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Interactive Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Cards can contain various elements.</p>
                                <Button>Action</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h3 className={typography.h3}>Icons</h3>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex flex-col items-center gap-2">
                            <Heart className="h-6 w-6 text-primary" />
                            <span className="text-xs">Heart</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Star className="h-6 w-6 text-primary" />
                            <span className="text-xs">Star</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Download className="h-6 w-6 text-primary" />
                            <span className="text-xs">Download</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Share2 className="h-6 w-6 text-primary" />
                            <span className="text-xs">Share</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <WaveIcon className="h-6 w-6 text-primary" />
                            <span className="text-xs">Wave</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
