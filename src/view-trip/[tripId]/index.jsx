import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../Components/InfoSection';
import Hotels from '../Components/Hotels';
import PlacesToVisit from '../Components/PlacesToVisit';
import Footer from '../Components/Footer';

function  Viewtrip() {

    const {tripId} = useParams();

    const [trip,setTrip] = useState([]);
    useEffect(() => {
        tripId && GetTripdata()
    },[tripId]);
    const GetTripdata=async()=>{
        const docRef= doc(db, "AItrips", tripId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document:", docSnap.data());
            setTrip(docSnap.data());

    }
    else{
        console.log("No such document");
        toast('NO trip found')
    }
    }
  return (
    <div className='p-10  md:p-20 lg:p-44 xl:p-56'>
        <InfoSection trip={trip} />
        <Hotels trip={trip}/>
        <PlacesToVisit trip={trip}/>
        <Footer trip={trip}/>
    </div>
  )
}

export default Viewtrip
