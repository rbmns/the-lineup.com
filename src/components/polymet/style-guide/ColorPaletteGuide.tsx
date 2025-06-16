
import React from 'react';
import { typography } from '@/components/polymet/brand-typography';
import { ColorSwatch } from './ColorSwatch';

export function ColorPaletteGuide() {
    return (
        <section className="space-y-6">
            <div>
                <h2 className={typography.h2}>Color Palette</h2>
                <p className={typography.body}>
                    Our color palette is designed to be vibrant, accessible, and versatile.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className={typography.h3}>Primary Colors</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                        <ColorSwatch color="#0891b2" name="Primary 500" />
                        <ColorSwatch color="#0e7490" name="Primary 600" />
                        <ColorSwatch color="#164e63" name="Primary 900" />
                        <ColorSwatch color="#e0f2fe" name="Primary 100" />
                        <ColorSwatch color="#f0f9ff" name="Primary 50" />
                    </div>
                </div>

                <div>
                    <h3 className={typography.h3}>Secondary Colors</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        <ColorSwatch color="#f59e0b" name="Secondary 500" />
                        <ColorSwatch color="#d97706" name="Secondary 600" />
                        <ColorSwatch color="#fde68a" name="Secondary 100" />
                        <ColorSwatch color="#fef3c7" name="Secondary 50" />
                    </div>
                </div>

                <div>
                    <h3 className={typography.h3}>Accent Colors</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        <ColorSwatch color="#06b6d4" name="Teal" />
                        <ColorSwatch color="#f43f5e" name="Coral" />
                        <ColorSwatch color="#84cc16" name="Lime" />
                    </div>
                </div>
            </div>
        </section>
    )
}
