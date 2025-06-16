
import React from 'react';

export function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="h-16 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <div className="mt-2 text-sm font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{color}</div>
    </div>
  );
}
