import React, { useEffect, useState } from 'react'
import { Button } from '../button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Header() {

  const user=JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    console.log(user)
  }, [])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
})

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
      window.location.reload();
  })
}

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src="/logo.svg"  />
      <div >
        {user?
        <div className='flex items-center gap-3'>
          <a href='my-trips'>
           <Button variant='outline' 
           className='rounnded-full'>My Trips</Button>
           </a>
           <Popover>
            <PopoverTrigger>
            <img src={user?.picture} className='h-[35px] w-[35px] rounded-full'/>
            </PopoverTrigger>
            <PopoverContent>
              <h2 className='cursor-pointer' onClick={()=>{
                googleLogout();
                localStorage.clear();
                window.location.reload();
              }} >Logout</h2>
            </PopoverContent>
          </Popover>

          </div>:
        <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
}
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

export default Header
