'use client';

import NoSSR from '@/components/ui/no-ssr';
import { CreateGiveawayForm } from '@/components/giveaways/create-giveaway-form';

export default function CreateGiveawayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Giveaway</h1>
        <p className="text-muted-foreground">
          Set up a new giveaway for your Instagram followers
        </p>
      </div>
      
      <NoSSR>
        <CreateGiveawayForm />
      </NoSSR>
    </div>
  );
} 