'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Activity } from './ChatBox';
import { Clock, ExternalLinkIcon, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';

type Props = {
  activity: Activity;
};

function PlaceCardItem({ activity }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => {
    activity && GetGooglePlaceDetail();
  }, [activity]);

  const GetGooglePlaceDetail = async () => {
    const result = await axios.post('/api/google-place-detail', {
      placeName: activity?.place_name + ':' + activity.place_address,
    });
    if (result?.data?.e) {
      return;
    }
    setPhotoUrl(result?.data);
  };
  return (
    <div>
      <Image
        src={photoUrl ? photoUrl : '/placeholder.jpg'}
        alt={activity?.place_name}
        width={400}
        height={200}
        className="rounded-xl object-cover"
      />
      <h2 className="font-semibold text-lg">{activity?.place_name}</h2>
      <p className="text-gray-500 line-clamp-2">{activity?.place_details}</p>
      <h2 className="flex gap-2 text-blue-500 line-clamp-1">
        <Ticket />
        {activity.ticket_pricing}
      </h2>
      <p className="flex text-orange-400 gap-2">
        <Clock />
        {activity.best_time_to_visit}
      </p>
      <Link
        href={
          'https://www.google.com/maps/search/?api=1&query=' +
          activity?.place_name
        }
        target="_blank"
      >
        <Button className="w-full mt-2" size={'sm'} variant={'outline'}>
          View <ExternalLinkIcon />
        </Button>
      </Link>
    </div>
  );
}

export default PlaceCardItem;
