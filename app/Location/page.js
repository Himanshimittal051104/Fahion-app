"use client"
import { useState, useEffect,useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BydefaultAddressContext } from '@/context/BydefaultAddress';
import { AddressesContext } from '@/context/Addresses';

function LocationForm() {
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("Delhi");
  const [pincode, setPincode] = useState("")
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {bydefaultAddress, setBydefaultAddress}= useContext(BydefaultAddressContext);
  const {addresses, setAddresses} = useContext(AddressesContext);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    flatNo: "",
    area: "",
    landmark: "",
    city: "",
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobileNumber: '',
    pincode: '',
    flatNo: '',
    area: '',
    city: '',
  });

  const countries = ["India", "United States", "Canada"];
  const states = {
    India: ["Delhi", "Punjab", "Maharashtra", "Haryana"],
    "United States": ["California", "Texas", "New York"],
    Canada: ["Ontario", "Quebec", "British Columbia"],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' })
  };

  const validateForm = () => {
    let isValid = true;
    setErrors({});

    if (!formData.fullName) {
      setErrors((prevErrors) => ({ ...prevErrors, fullName: 'Full name is required!' }));
      isValid = false;
    }

    if (!formData.mobileNumber) {
      setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: 'Mobile number is required!' }));
      isValid = false;
    }

    if (!pincode) {
      setErrors((prevErrors) => ({ ...prevErrors, pincode: 'Pin code is required!' }));
      isValid = false;
    }
    if (!formData.flatNo) {
      setErrors((prevErrors) => ({ ...prevErrors, flatNo: 'Flat no. is required!' }));
      isValid = false;
    }
    if (!formData.area) {
      setErrors((prevErrors) => ({ ...prevErrors, area: 'area is required!' }));
      isValid = false;
    }
    if (!formData.city) {
      setErrors((prevErrors) => ({ ...prevErrors, city: 'city name is required!' }));
      isValid = false;
    }
    return isValid;
  };
  const notify = (message,type) => {
      setIsToastVisible(true);
      if(type=='success'){
      toast.success(message, {
        onClose: () => {
          setIsToastVisible(false);
        },
      });
    }else{
      toast.error(message, {
        onClose: () => {
          setIsToastVisible(false);
        },
      });
    }
  }
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedState(states[event.target.value][0]);
  };
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      notify('Location fetched successfully!','success');
      setSelectedCountry(data.address.country)
      setSelectedState(data.address.state)
      setPincode(data.address.postcode)
      console.log(data.address)
    } catch (error) {
      console.error("Error fetching reverse geocode data:", error);
      notify('Failed to fetch reverse geocode data.','error');
    }
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCoordinates({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
        },
        () => {
          notify('Unable to retrieve location.','error');
        }
      );
    } else {
      notify('Geolocation is not supported by your browser.','error');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const form = {
        ...formData,
        country: selectedCountry,
        state: selectedState,
        pincode: pincode,
      };
      try {
        const response = await fetch('/api/saveAddress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        if (response.ok) {
          notify("Address saved successfully!",'success');
          console.log("Form submitted:", formData);
          setFormData({
            fullName: "",
            mobileNumber: "",
            flatNo: "",
            area: "",
            landmark: "",
            city: "",
          });
          setPincode("");
        } else {
          const errorData = await response.json();
          notify(errorData.message|| "Error saving address",'error');
        }
      } catch (error) {
        notify(error.message,'error');
      }finally{
        setIsSubmitting(false);
      }
    } else {
      notify("Please fill in all required fields.",'error');
    }
  };
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setBydefaultAddress(addresses.length); 
    }
  };
  return (
    <>
    <div className={`w-[30%] mx-auto mt-14 font-semibold ${isToastVisible ? 'disabled' : ''}` }>
      <div className='text-center font-bold text-2xl mb-7'>Add a new address</div>
      <div className='mb-7 text-center  bg-cyan-300 w-full p-1 rounded-md border border-customDarkPurple'>Use my current location
        <button className='bg-white mx-3 p-1 rounded-full px-2' onClick={getLocation}>Autofill</button>
      </div>
      <div className='mb-3'>
        <label htmlFor='Country'>Country/Region</label>
        <select className='block border border-black rounded-md w-full px-2 py-1' value={selectedCountry} onChange={handleCountryChange}>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-3' >
        <label htmlFor='Name'>Full name (First and Last name)</label>
        <input className={`block  rounded-md w-full px-2 py-1 ${errors.fullName ? 'border-2 border-red-700' : 'border border-black'}`} name="fullName" value={formData.fullName} onChange={handleInputChange} type='text'></input>
        {
          errors.fullName && <p className='text-red-700'>{errors.fullName}</p>
        }
      </div>
      <div className='mb-3'>
        <label htmlFor='Mobile Number'>Mobile number</label>
        <input className={`block  rounded-md w-full px-2 py-1 ${errors.mobileNumber ? 'border-2 border-red-700' : 'border border-black'}`} name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} type='text' placeholder='Must be 10 digits'></input>
        {
          errors.mobileNumber && <p className='text-red-700'>{errors.mobileNumber}</p>
        }
      </div>
      <div className='mb-3'>
        <label htmlFor='pincode'>PINcode</label>
        <input placeholder="6 digits [0-9] PIN code" className={`block  rounded-md w-full px-2 py-1 ${errors.pincode ? 'border-2 border-red-700' : 'border border-black'}`} onChange={(e) => setPincode(e.target.value)} value={pincode} type='number'></input>
        {
          errors.pincode && <p className='text-red-700'>{errors.pincode}</p>
        }
      </div>
      <div className='mb-3'>
        <label htmlFor='flatNo.'>Flat, House no., Building, Company, Apartment
        </label>
        <input className={`block  rounded-md w-full px-2 py-1 ${errors.flatNo ? 'border-2 border-red-700' : 'border border-black'}`} name="flatNo" value={formData.flatNo} onChange={handleInputChange} type='text'></input>
        {
          errors.flatNo && <p className='text-red-700'>{errors.flatNo}</p>
        }
      </div>
      <div className='mb-3'>
        <label htmlFor='area'>Area, Street, Sector, Village</label>
        <input className={`block  rounded-md w-full px-2 py-1 ${errors.area ? 'border-2 border-red-700' : 'border border-black'}`} name="area" value={formData.area} onChange={handleInputChange} type='text'></input>
        {
          errors.area && <p className='text-red-700'>{errors.area}</p>
        }
      </div>
      <div className='mb-3'>
        <label htmlFor='landmark'>Landmark (optional)</label>
        <input placeholder='E.g. near appolo hospital' className='block border border-black rounded-md w-full px-2 py-1' name="landmark" value={formData.landmark} onChange={handleInputChange} type='text'></input>
      </div>
      <div className='flex mb-4 w-full gap-4 '>
        <div className='w-[50%]'>
          <label htmlFor='city'>Town/City</label>
          <input className={`block  rounded-md px-2 py-1 w-full ${errors.city ? 'border-2 border-red-700' : 'border border-black'}`} name="city" value={formData.city} onChange={handleInputChange} type='text'></input>
          {
            errors.city && <p className='text-red-700'>{errors.city}</p>
          }
        </div>
        <div className='w-[50%] '>
          <label htmlFor='State'>State</label>
          <select
            className="block border border-black rounded-md w-full px-2 py-1"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {states[selectedCountry].map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button className='text-center bg-customDarkPurple text-customPink w-full p-1 rounded-md mb-4' onClick={handleSubmit} disabled={isSubmitting}>Save address</button>
      <div className='flex mb-20 items-center'><input type='checkbox' className=' mr-2' checked={bydefaultAddress === addresses.length} onChange={handleCheckboxChange}></input>Make this my default address</div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </>
  );
}

export default LocationForm;

