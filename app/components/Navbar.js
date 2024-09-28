"use client"
import React from 'react'
import Link from 'next/link'
import { useState, useEffect, useRef,useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { BydefaultAddressContext } from '@/context/BydefaultAddress';
import { AddressesContext } from '@/context/Addresses';

  const Navbar = () => {
  const [Value, setValue] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [loading, setLoading] = useState(false);
  const {addresses, setAddresses} = useContext(AddressesContext);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [showaddress, setShowaddress] = useState(false);
  const [listenedText, setListenedText] = useState('');
  const [addressSelected, setAddressSelected] = useState(0);
  const {bydefaultAddress, setBydefaultAddress} = useContext(BydefaultAddressContext);

  const notify = (message, type) => {
    setIsToastVisible(true);
    if (type == 'success') {
      toast.success(message, {
        onClose: () => {
          setIsToastVisible(false);
        },
      });
    } else {
      toast.error(message, {
        onClose: () => {
          setIsToastVisible(false);
        },
      });
    }
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/saveAddress');
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      const data = await response.json();
      setAddresses(data);
      console.log(data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
    setAddressSelected(bydefaultAddress)
  }, []);
  useEffect(() => {
    setAddressSelected(bydefaultAddress)
  }, [bydefaultAddress]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const newRecognition = new SpeechRecognition();
        // newRecognition.continuous = true;
        newRecognition.interimResults = true;
        setRecognition(newRecognition);
        return () => {
          if (newRecognition) {
            newRecognition.stop(); // Stop recognition instead of destroy
          }
        };
      } else {
        alert('Your browser does not support speech recognition.');
      }
    }
  }, []);

  const handleInput = (event) => {
    setValue(event.target.value);
  }
  const handleVoiceSearch = () => {
    if (recognition && !listening) {
      console.log("Recognition initialized:", recognition);
      setListening(true);
      recognition.start();
      let finalTranscript = '';
      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setListenedText(finalTranscript + (interimTranscript ? ' ' + interimTranscript : ''));
        console.log("Listened Text Set:", finalTranscript + ' ' + interimTranscript);
      };
      recognition.onspeechend = () => {
        console.log("Speech ended");
        recognition.stop();
      };
      recognition.onend = () => {
        console.log("Recognition ended");
        setValue(finalTranscript);
        setListening(false);
        setListenedText('');
      };


      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
    } else {
      alert('Recognition already started or not supported.');
    }
  };
  const handleCheckboxChange = (e,index) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setBydefaultAddress(index); 
    }
  };
  const handlelocationclick=()=>{
    fetchData()
    setShowaddress(true)
  }
  return (
    <>
      <nav className={`w-[100%] h-16 bg-customDarkPurple top-0 sticky flex items-center justify-between ${loading ? 'disabled' : ''} ${isToastVisible ? 'disabled' : ''} `}>
        <div className=' mx-20 flex text-customPink '>
          <div className='my-auto mr-8 text-center'>
            {addresses.length > 0 ? (
              <ul onClick={handlelocationclick} >
                <li className='flex cursor-default' >Deliver to
                  <span className='font-semibold ml-1'>{addresses[addressSelected].fullName.split(' ')[0]}</span></li>
                <li className='flex cursor-default' ><Image width={20} height={20} src='./location.svg' alt='location' className='mr-1'></Image> {addresses[addressSelected].state} {addresses[addressSelected].pincode}</li>
              </ul>
            ) : (
              <ul>
                <li className='flex cursor-default' onClick={handlelocationclick} ><Image width={20} height={20} src='./location.svg' alt='location' className='mr-1'></Image>Location</li>
              </ul>
            )}
          </div>
          <div >
            <div className='font-extrabold text-3xl my-auto' style={{ fontFamily: "Poppins" }} >TODAY'S</div>
            <div className='font-serif font-extrabold ' style={{ fontFamily: "BioRhyme Expanded" }}>FASHION</div>
          </div>
        </div>
        <div>
          <div className='absolute h-16 w-[40%] top-0 right-96'>
            <div className='border border-customPink rounded-md my-2 mx-2 h-12 flex items-center'>
              <Image width={30} height={30} src='./search.svg' alt='search' className='h-8 mx-2'></Image>
              <input placeholder='Search your Product' className='mx-2  text-customPink px-2  w-[95%] placeholder-customPink bg-customDarkPurple' onChange={handleInput} value={Value}></input>
              <div className='h-8 w-0.5 bg-customPink'></div>
              <button onClick={handleVoiceSearch} disabled={listening}>
                <Image width={30} height={30} src='./speaker.svg' alt='speaker' className='h-8 ml-2 mr-3' />
              </button>
            </div>
          </div>
          <ul className='flex gap-6 mx-20 text-customPink '>
            <Link href={"/Cart"}>
              <li><Image width={30} height={30} src='./cart.svg' alt='cart' className='mx-auto'></Image>Cart</li></Link>
            <Link href={"/Signin"}>
              <li><Image width={30} height={30} src='./login.svg' alt='dropdown' className='mx-auto'></Image>Sign In</li>
            </Link>
          </ul>
        </div>
      </nav>
      {showaddress && (
        addresses.length > 0 ? (
          <div className="flex items-center justify-center fixed z-50 inset-0">
            <div className='w-[25%] rounded-lg overflow-hidden  '>
              <div className='bg-[#F5F5F5] font-bold flex justify-between px-5 text-xl py-3 '>Choose your location<Image width={30} height={30} src='cancel.svg' alt='cancel' className='hover:border-2 hover:border-cyan-500 hover:rounded-md' onClick={() => setShowaddress(false)}></Image>
              </div>
              <hr></hr>
              <div className='bg-white px-5 py-3'>
                <span className='text-sm block'>Select a delivery location to see product availability and delivery options.</span>
                <div className='my-2 max-h-96 overflow-y-scroll scrollbar-hide' on>
                  {addresses.map((address, index) => (
                    <div key={index} className={`py-1 border border-gray-500 my-1 px-2 rounded-md text-sm hover:bg-[#F5F5F5] ${addressSelected == index ? 'border-2 border-blue-700' : ''}`} onClick={() => setAddressSelected(index)}>
                      <span className="font-semibold">{address.fullName}</span><br />
                      {address.mobileNumber}<br />
                      {address.flatNo}, {address.area}, {address.city}<br />
                      {address.state} {address.pincode}<br/>
                     
                        {
                          index==bydefaultAddress ?(
                            <span className='flex items-center mt-1 font-medium'>
                            Default Address
                            </span>
                          ):(
                            <span className='flex items-center mt-1'>
                            <input type='checkbox' className=' mr-2' onChange={(e) => handleCheckboxChange(e, index)}></input>Set this as default address
                            </span>
                          )
                        }
                    </div>
                  ))}
                </div>
                <Link href='./Location'>
                  <button className='bg-yellow-400 rounded-full mb-4 mt-2 text-center py-1 w-[100%] ' onClick={() => setShowaddress(false)}>Add a new address</button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen ">
            <div className='w-[25%] absolute top-60 rounded-lg overflow-hidden '>
              <div className='bg-[#F5F5F5] font-bold flex justify-between px-5 text-xl py-3 '>Choose your location<Image width={50} height={50} src='cancel.svg' alt='cancel' className='hover:border-2 hover:border-cyan-500 hover:rounded-md' onClick={() => setShowaddress(false)}></Image>
              </div>
              <hr></hr>
              <div className='bg-white px-5 py-3'>
                <span className='block text-center font-semibold mb-2'>No address saved</span>
                <span className='text-sm block'>Select a delivery location to see product availability and delivery options.</span>
                <Link href='./Location'>
                  <button className='bg-yellow-400 rounded-full my-4 text-center py-1 w-[100%] border-' onClick={() => setShowaddress(false)}>Add a new address</button>
                </Link>
              </div>
            </div>
          </div>
        ))
      }
      {
        listening && (
          <div className="flex items-center justify-center fixed z-50 inset-0 ">
            <div className='w-[20%] bg-white text-center p-2 pb-8 rounded-lg'>
              <Image width={90} height={90} src='recorder.svg' alt='speaker' className='mx-auto h-20 my-2'></Image>
              <div className='text-xl'>Started Listening ...</div>
              <div className='mt-2 mb-4'>{listenedText}</div>
            </div>
          </div>
        )
      }
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </>
  )
}

export default Navbar
