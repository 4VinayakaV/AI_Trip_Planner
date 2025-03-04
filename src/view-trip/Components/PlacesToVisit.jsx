import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { PHOTO_REF_URL } from '@/service/GlobalApi';

function PlaceCardItem({ activity }) {
    const [photoURL, setPhotoURL] = useState('/placeholder.jpg'); // Default to placeholder

    useEffect(() => {
        activity && fetchPlacePhoto();
    }, [activity]);

    const fetchPlacePhoto = async () => {
        const data = {
            textQuery: activity?.placeName
        };
        try {
            const response = await GetPlaceDetails(data);
            const photoReference = response?.data?.places[0]?.photos?.[2]?.name;
            if (photoReference) {
                const generatedPhotoURL = PHOTO_REF_URL.replace('{NAME}', photoReference);
                setPhotoURL(generatedPhotoURL);
            }
        } catch (error) {
            console.error("Error fetching place photo:", error);
        }
    };

    return (
        <Link
            to={`https://www.google.com/maps/search/?api=1&query=${activity?.placeName},${activity?.geoCoordinates}`}
            target="_blank"
        >
            <div className="hover:scale-105 transition-all cursor-pointer">
                <img src={photoURL} alt={activity?.placeName} className="rounded-lg h-[200px] w-full object-cover" />
                <div className="my-2 flex flex-col gap-2">
                    <h3 className="font-medium">{activity?.placeName}</h3>
                    <p className="text-xs text-gray-500">🕒 {activity?.time}</p>
                    <p className="text-xs text-gray-500">💵 {activity?.ticketPricing}</p>
                    <p className="text-xs text-gray-500">{activity?.placeDetails}</p>
                </div>
            </div>
        </Link>
    );
}

function PlacesToVisit({ trip }) {
    return (
        <div>
            <h2 className="font-bold text-2xl">Places To Visit</h2>
            <div>
                {trip?.tripData?.itinerary ? (
                    Object.entries(trip.tripData.itinerary)
                        .sort(([dayA], [dayB]) => {
                            const dayNumberA = parseInt(dayA.replace('day', ''), 10);
                            const dayNumberB = parseInt(dayB.replace('day', ''), 10);
                            return dayNumberA - dayNumberB;
                        })
                        .map(([dayKey, dayActivities], dayIndex) => (
                            <div key={dayIndex}>
                                <h2 className="font-bold text-lg">{dayKey}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {Object.entries(dayActivities).map(([timeOfDay, activity], timeIndex) => (
                                        <PlaceCardItem key={timeIndex} activity={activity} />
                                    ))}
                                </div>
                            </div>
                        ))
                ) : (
                    <p>No itinerary available.</p>
                )}
            </div>
        </div>
    );
}

export default PlacesToVisit;
