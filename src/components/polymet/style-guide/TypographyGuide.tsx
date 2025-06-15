
import React from 'react';
import { typography } from '@/components/polymet/brand-typography';

export function TypographyGuide() {
    return (
        <section className="space-y-6">
            <div>
                <h2 className={typography.h2}>Typography</h2>
                <p className={typography.body}>
                    Our typography system is designed for clarity, readability, and hierarchy.
                </p>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <h1 className={typography.display}>Display</h1>
                    <div className="text-sm text-muted-foreground">
                        Used for hero sections and major headlines
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className={typography.h1}>Heading 1</h1>
                    <div className="text-sm text-muted-foreground">
                        Main page headings
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className={typography.h2}>Heading 2</h2>
                    <div className="text-sm text-muted-foreground">
                        Section headings
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className={typography.h3}>Heading 3</h3>
                    <div className="text-sm text-muted-foreground">
                        Subsection headings
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className={typography.h4}>Heading 4</h4>
                    <div className="text-sm text-muted-foreground">
                        Card titles and smaller sections
                    </div>
                </div>

                <div className="space-y-4">
                    <p className={typography.lead}>
                        Lead paragraph text is used to introduce sections with slightly larger, more prominent text.
                    </p>
                    <div className="text-sm text-muted-foreground">
                        Lead paragraph
                    </div>
                </div>

                <div className="space-y-4">
                    <p className={typography.body}>
                        Body text is used for the main content. It should be easy to read and have good contrast.
                        This is an example of body text that might span multiple lines in a paragraph.
                    </p>
                    <div className="text-sm text-muted-foreground">
                        Body text
                    </div>
                </div>

                <div className="space-y-4">
                    <p className={typography.small}>
                        Small text is used for captions, footnotes, and other secondary information.
                    </p>
                    <div className="text-sm text-muted-foreground">
                        Small text
                    </div>
                </div>

                <div className="space-y-4">
                    <blockquote className={typography.quote}>
                        "Design is not just what it looks like and feels like. Design is how it works."
                        <footer className="mt-2 text-sm">— Steve Jobs</footer>
                    </blockquote>
                    <div className="text-sm text-muted-foreground">
                        Blockquote
                    </div>
                </div>
            </div>
        </section>
    );
}
