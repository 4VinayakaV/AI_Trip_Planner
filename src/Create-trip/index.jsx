import { Button } from '@/components/ui/button';
import { AI_PROMT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModel';
import { Input } from 'postcss';
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import { setDoc, doc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { s } from 'vite/dist/node/types.d-aGj9QkWt';

function CreateTrip() {
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate=useNavigate();
    const handlInputChange = (name, value) => {

        setFormData({ ...formData, [name]: value })
    }

    useEffect(() => {
        console.log(formData)
    }, [formData])

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    })

    const OnGenerateTrip = async () => {


        const user = localStorage.getItem('user');

        if (!user) {
            setOpenDialog(true);
            return;
        }


        if (formData?.days > 10 && !formData?.location || !formData?.budget || !formData?.traveller) {
            toast("Please fill all the details.")
            return;
        }
        setLoading(true);
        const FINAL_PROMPT = AI_PROMT
            .replace('{location}', formData?.location?.label)
            .replace('{days}', formData?.days)
            .replace('{traveller}', formData?.traveller)
            .replace('{budget}', formData?.budget)
            .replace('{days}', formData?.days)

        const result = await chatSession.sendMessage(FINAL_PROMPT);

        console.log(result?.response?.text());

        setLoading(false);
        SaveAiTrip(result?.response?.text());
    }



    const SaveAiTrip = async (TripData) => {

        setLoading(true);

        const docID = Date.now().toString();
        const user = JSON.parse(localStorage.getItem('user'));

        await setDoc(doc(db, "AItrips", docID), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docID
        });

        setLoading(false);

        navigate('/view-trip/' + docID);    

    }

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            console.log(resp);
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialog(false);
            OnGenerateTrip();
        })
    }



    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏖️ 🏙️</h2>
            <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itneary based on your preferences</p>
            <div className='mt-20 flex flex-col gap-10'>
                <div>
                    <h2 className='text-xl my-3 font-medium'>
                        What is your destination of choice?
                    </h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); handlInputChange('location', v) }
                        }}
                    />
                </div>
                <div>
                    <h2 className='text-xl my-3 font-medium'>
                        How many days are you planning your trip?
                    </h2>
                    <input placeholder={'Ex.4'} type='number' onChange={(e) => handlInputChange('days', e.target.value)} />
                </div>
            </div>
            <div>
                <h2 className='text-xl my-3 font-medium'>
                    What is your budget?
                </h2>
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    {SelectBudgetOptions.map((item, index) => (
                        <div key={index}
                            onClick={() => handlInputChange('budget', item.title)}
                            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                    ${formData?.budget === item.title && 'shadow-lg border-black'}`}>
                            <h2 className='text-4xl'>{item.icon}</h2>
                            <h2 className='font-bold text-lg'>{item.title}</h2>
                            <h2 className='text-sm text-gray-500'>{item.desc}</h2>

                        </div>

                    ))}
                </div>
            </div>

            <div>
                <h2 className='text-xl my-3 font-medium'>
                    Who are you traveling with?
                </h2>
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    {SelectTravelesList.map((item, index) => (
                        <div key={index}
                            onClick={() => handlInputChange('traveller', item.people)}
                            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                    ${formData?.traveller === item.people && 'shadow-lg border-black'}
                    `}>
                            <h2 className='text-4xl'>{item.icon}</h2>
                            <h2 className='font-bold text-lg'>{item.title}</h2>
                            <h2 className='text-sm text-gray-500'>{item.desc}</h2>

                        </div>

                    ))}
                </div>
            </div>

            <div className='my-20 justify-end flex'>
                <Button
                    disabled={loading}
                    onClick={OnGenerateTrip} >
                    {loading?
                        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
                    }
                </Button>
            </div>
            <Dialog open={openDialog}>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign In</DialogTitle>
                        <DialogDescription>
                            <img src="./logo.svg" />
                            <h2 className='font-bold text-2xl mt-7'>Sign In with Google</h2>
                            <p>Sign in to the app with google authentication</p>
                            <Button
                                onClick={login}
                                className="w-full mt-5 flex gap-4 items-center">
                                <FcGoogle className='h-7 w-7' />
                                Sign in with Google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreateTrip
