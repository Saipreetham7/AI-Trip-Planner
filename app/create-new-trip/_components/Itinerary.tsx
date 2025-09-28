'use client';
import { Button } from '@/components/ui/button';
import { Timeline } from '@/components/ui/timeline';
import {
  ArrowLeft,
  Clock,
  ExternalLinkIcon,
  Star,
  Ticket,
  Wallet2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { useTripDetail } from '@/app/provider';
import { TripInfo } from './ChatBox';

// const TRIP_DATA = {
//   destination: 'Copenhagen, Denmark',
//   duration: '2 days',
//   origin: 'Sweden',
//   budget: 'Low (Cheap, cost-conscious)',
//   group_size: '1 (Solo)',
//   hotels: [
//     {
//       hotel_name: 'Steel House Copenhagen',
//       hotel_address: 'Sankt Peders Stræde 34, 1453 København, Denmark',
//       price_per_night: '300 SEK (dorm bed)',
//       hotel_image_url:
//         'https://cf.bstatic.com/images/hotel/max1024x768/123/456789.jpg',
//       geo_coordinates: {
//         latitude: 55.6761,
//         longitude: 12.5703,
//       },
//       rating: 8,
//       description:
//         'A modern hostel in the heart of Copenhagen with clean dorms, shared kitchen, and easy access to public transport. Ideal for budget solo travelers seeking a social vibe.',
//     },
//     {
//       hotel_name: 'Urban House Copenhagen',
//       hotel_address: 'Nørre Søgade 11, 1370 København K, Denmark',
//       price_per_night: '250 SEK (dorm bed)',
//       hotel_image_url:
//         'https://cf.bstatic.com/images/hotel/max1024x768/234/567890.jpg',
//       geo_coordinates: {
//         latitude: 55.6864,
//         longitude: 12.5658,
//       },
//       rating: 7.8,
//       description:
//         'Budget-friendly hostel near the city center with free Wi-Fi, bike rentals, and a vibrant common area. Perfect for solo explorers on a tight budget.',
//     },
//     {
//       hotel_name: 'Generator Copenhagen',
//       hotel_address: 'Adelgade 5, 1300 København K, Denmark',
//       price_per_night: '280 SEK (dorm bed)',
//       hotel_image_url:
//         'https://cf.bstatic.com/images/hotel/max1024x768/345/678901.jpg',
//       geo_coordinates: {
//         latitude: 55.6803,
//         longitude: 12.5842,
//       },
//       rating: 8.2,
//       description:
//         'Stylish hostel with colorful rooms, a rooftop bar (free entry), and central location close to major sights. Great for affordable stays with some fun amenities.',
//     },
//   ],
//   itinerary: [
//     {
//       day: 1,
//       day_plan:
//         'Arrival from Sweden via train, explore central Copenhagen highlights with walking tours and free sights.',
//       best_time_to_visit_day:
//         'Morning to evening (arrive early to maximize daylight)',
//       activities: [
//         {
//           place_name: 'Nyhavn',
//           place_details:
//             'Iconic waterfront with colorful 17th-century buildings, boats, and a lively atmosphere. Perfect for photos and people-watching.',
//           place_image_url:
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Nyhavn_2023.jpg/800px-Nyhavn_2023.jpg',
//           geo_coordinates: {
//             latitude: 55.6817,
//             longitude: 12.5934,
//           },
//           place_address: 'Nyhavn, 1051 København, Denmark',
//           ticket_pricing: 'Free',
//           time_travel_each_location:
//             '1-2 hours (walking distance from station)',
//           best_time_to_visit: 'Morning (9 AM - 11 AM) to avoid crowds',
//         },
//         {
//           place_name: 'Strøget',
//           place_details:
//             "Europe's longest pedestrian shopping street, lined with shops, street performers, and cafes. Great for window shopping on a budget.",
//           place_image_url:
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Str%C3%B8get_Copenhagen.jpg/800px-Str%C3%B8get_Copenhagen.jpg',
//           geo_coordinates: {
//             latitude: 55.6764,
//             longitude: 12.5718,
//           },
//           place_address: 'Strøget, 1115 København K, Denmark',
//           ticket_pricing: 'Free',
//           time_travel_each_location: '1-2 hours (adjacent to Nyhavn)',
//           best_time_to_visit:
//             'Afternoon (12 PM - 2 PM) for lively street energy',
//         },
//         {
//           place_name: 'Tivoli Gardens',
//           place_details:
//             'Historic amusement park with gardens, rides, and evening lights. Skip rides for free exterior viewing to stay budget-friendly.',
//           place_image_url:
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tivoli_Gardens_entrance_2016.jpg/800px-Tivoli_Gardens_entrance_2016.jpg',
//           geo_coordinates: {
//             latitude: 55.6744,
//             longitude: 12.5653,
//           },
//           place_address: 'Vesterbrogade 3, 1630 København V, Denmark',
//           ticket_pricing: 'Entry ~150 SEK (or free exterior)',
//           time_travel_each_location: '2-3 hours (10-min walk from Strøget)',
//           best_time_to_visit:
//             'Evening (7 PM onwards) for lights and atmosphere',
//         },
//       ],
//     },
//     {
//       day: 2,
//       day_plan:
//         'Cultural and alternative explorations, followed by return to Sweden.',
//       best_time_to_visit_day:
//         'Morning to early afternoon (to catch return transport)',
//       activities: [
//         {
//           place_name: 'Amalienborg Palace',
//           place_details:
//             'Royal residence with daily Changing of the Guard ceremony. Free to watch from the square.',
//           place_image_url:
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Amalienborg_Slot.jpg/800px-Amalienborg_Slot.jpg',
//           geo_coordinates: {
//             latitude: 55.6843,
//             longitude: 12.5891,
//           },
//           place_address: 'Amalienborg Slotsplads, 1257 København K, Denmark',
//           ticket_pricing: 'Free (ceremony)',
//           time_travel_each_location:
//             '30-60 minutes (20-min walk from hotel area)',
//           best_time_to_visit: 'Morning (10 AM) for the guard change',
//         },
//         {
//           place_name: 'Rosenborg Castle Gardens',
//           place_details:
//             'Beautiful free public gardens surrounding the castle, with flowers, statues, and peacocks. Relaxing spot for a picnic.',
//           place_image_url:
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/K%C3%B8benhavn_Rosenborg_slot_have.jpg/800px-K%C3%B8benhavn_Rosenborg_slot_have.jpg',
//           geo_coordinates: {
//             latitude: 55.6829,
//             longitude: 12.5796,
//           },
//           place_address: 'Øster Voldgade 4A, 1350 København K, Denmark',
//           ticket_pricing: 'Free (gardens; castle entry extra ~130 SEK)',
//           time_travel_each_location: '1-2 hours (10-min walk from Amalienborg)',
//           best_time_to_visit:
//             'Late morning (11 AM - 1 PM) for pleasant weather',
//         },
//         {
//           place_name: 'Freetown Christiania',
//           place_details:
//             'Autonomous neighborhood with street art, music, and alternative culture. Explore on foot, but follow no-photo zones.',
//           place_image_url:
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Christiania_Copenhagen_2014.jpg/800px-Christiania_Copenhagen_2014.jpg',
//           geo_coordinates: {
//             latitude: 55.6758,
//             longitude: 12.5975,
//           },
//           place_address: 'Christiania, 1407 København K, Denmark',
//           ticket_pricing: 'Free',
//           time_travel_each_location:
//             '1-2 hours (30-min walk or short bus from gardens)',
//           best_time_to_visit:
//             'Early afternoon (1 PM - 3 PM) to avoid peak crowds',
//         },
//       ],
//     },
//   ],
// };

function Itinerary() {
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);

  useEffect(() => {
    tripDetailInfo && setTripData(tripDetailInfo);
  }, [tripDetailInfo]);

  const data = tripData
    ? [
        {
          title: 'Recommended Hotels',
          content: (
            <div className="grid grid-col-1 md:grid-cols-2 gap-4">
              {tripData?.hotels.map((hotel, index) => (
                <HotelCardItem hotel={hotel} key={index} />
              ))}
            </div>
          ),
        },
        ...tripData?.itinerary.map((dayData) => ({
          title: `Day ${dayData?.day}`,
          content: (
            <div>
              <p>Best Time: {dayData?.best_time_to_visit_day}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dayData.activities.map((activity, index) => (
                  <PlaceCardItem activity={activity} key={index} />
                ))}
              </div>
            </div>
          ),
        })),
      ]
    : [];
  return (
    <div className="relative w-full overflow-auto h-[85vh]">
      {/* @ts-ignore */}
      {tripData ? (
        <Timeline data={data} tripData={tripData} />
      ) : (
        <div>
          <h2 className="flex gap-2 text-3xl text-white left-20 absolute items-center bottom-30">
            <ArrowLeft />
            Getting to know you to build perfect trip here...
          </h2>
          <Image
            src={'/travel.jpg'}
            alt="travel"
            width={800}
            height={800}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      )}
    </div>
  );
}

export default Itinerary;
