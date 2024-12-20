import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import SocialMediaIcons from "./ProfileComponents/SocialMediaIcons";
import AddPreviousWork from "./ProfileComponents/AddPreviousWork";
import PreviousWorksList from "./ProfileComponents/PreviousWorksList";
import {
  getMyCurrency,
  getProfile,
  updateProfilee,
} from "../../api/profile.ts";
import ImageProfile from "./ImageProfile/ImageProfile.js";
import DeleteAccountButton from "./ProfileComponents/DeleteAccountButton.js";
import CurrencyDropdown from "./Currency/CurrencyDropdown.js";

async function updateProfile(
  user,
  setUsername,
  setEmailInput,
  setEmail,
  setUserRole,
  setDob,
  setLinkInput,
  setHotlineInput,
  setCompanyProfileInput,
  setYearsOfExperienceInput,
  setDescriptionInput,
  setMessage,
  setNationalityInput,
  setWallet,
  setPreviousWorks,
  setNameInput,

  setJobTitleInput,
  setJobTitle,
  setMobileNumberInput,
  previousWorks,
  setFacebook,
  setInstagram,
  setTwitter,
  setLinkedin,
  setLocationAddressInput,
  setCity,
  setCountry,
  setCompanyName,
  setCompanySize
) {
  try {
    const ded = localStorage.getItem("user");
    if (!ded) {
      throw new Error("User not found in local storage");
    }
    const user = JSON.parse(ded);
    // console.log("user id is: " + user._id);
    const response = await getProfile(user._id);
    const { data } = response;
    // console.log("Profile Data:", data);
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // console.log(`${key}: ${data[key]}`);
      }
    }

    const tmpDate = new Date(data.dateOfBirth).toLocaleDateString("en-CA");

    switch (data.userRole) {
      case "Tourist":
        setUserRole("Tourist");
        setUsername(data.username);
        setMobileNumberInput(data.mobileNumber);

        setEmail(data.email);
        setEmailInput(data.email);

        setDob(tmpDate);
        setJobTitleInput(data.occupation);
        setJobTitle(data.occupation);
        setNameInput(data.name);

        setNationalityInput(data.nationality);
        setWallet(data.wallet);
        break;
      case "Advertiser":
        setUserRole("Advertiser");
        setUsername(data.username);
        setCompanySize(data.companySize);
        setMobileNumberInput(data.hotline);
        setFacebook(data.socialMediaLinks.facebook);
        setInstagram(data.socialMediaLinks.instagram);
        setTwitter(data.socialMediaLinks.twitter);
        setLinkedin(data.socialMediaLinks.linkedin);
        setCity(data.location.city);
        setCountry(data.location.country);
        setCompanyName(data.companyName);
        setLocationAddressInput(data.location.address);
        setEmail(data.email);
        setEmailInput(data.email);
        setNameInput(data.name);
        setLinkInput(data.website);
        setHotlineInput(data.hotline);
        setCompanyProfileInput(data.companyProfile);
        break;
      case "TourGuide":
        setUserRole("TourGuide");
        setMobileNumberInput(data.mobileNumber);

        setUsername(data.username);
        setEmail(data.email);
        setEmailInput(data.email);
        setNameInput(data.name);

        setYearsOfExperienceInput(data.yearsOfExperience);
        setPreviousWorks(data.previousWorks);

        break;
      case "Seller":
        setUserRole("Seller");
        setUsername(data.username);

        setNameInput(data.name);
        setEmail(data.email);
        setEmailInput(data.email);
        setMobileNumberInput(data.mobileNumber);

        setDescriptionInput(data.description);
        break;
      default:
        return false;
    }

    setMessage(response.data.message);
  } catch (error) {
    setMessage(error.response.data.message || "Updating Profile failed");
  }
}

const LoadingCircle = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-32 h-32 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
    </div>
  );
};

function Profile({ setFlag }) {
  // const location = useLocation();
  // const { user, accessToken } = location.state || {}; // Destructure the user object passed
  setFlag(false);
  const storedUser = localStorage.getItem("user");
  const storedAccessToken = localStorage.getItem("accessToken");

  // Parse the user object
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [isLoading, setIsLoading] = useState(false);

  const [currency, setCurrency] = useState(null);

  const [addWork, setAddWork] = useState(false);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [mobileNumberInput, setMobileNumberInput] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState(jobTitle);
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState("");
  const [wallet, setWallet] = useState(0);
  const [complaints, setComplaints] = useState("");
  const [ageInput, setAgeInput] = useState(age);
  const [nationalityInput, setNationalityInput] = useState(nationality);
  const [emailInput, setEmailInput] = useState(email);
  const [linkInput, setLinkInput] = useState("");
  const [hotlineInput, setHotlineInput] = useState("");
  const [companyProfileInput, setCompanyProfileInput] =
    useState("Company Profile");
  const [yearsOfExperienceInput, setYearsOfExperienceInput] = useState("");
  const [previousWorkInput, setPreviousWorkInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [previousWorks, setPreviousWorks] = useState([]);
  const [locationAddressInput, setLocationAddressInput] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [companySize, setCompanySize] = useState("");

  if (username === "") {
    updateProfile(
      user,
      setUsername,
      setEmailInput,
      setEmail,
      setUserRole,
      setDob,
      setLinkInput,
      setHotlineInput,
      setCompanyProfileInput,
      setYearsOfExperienceInput,
      setDescriptionInput,
      setMessage,
      setNationalityInput,
      setWallet,
      setPreviousWorks,
      setNameInput,

      setJobTitleInput,
      setJobTitle,
      setMobileNumberInput,
      previousWorks,
      setFacebook,
      setInstagram,
      setTwitter,
      setLinkedin,
      setLocationAddressInput,
      setCity,
      setCountry,
      setCompanyName,
      setCompanySize
    );
  }

  const [isReadOnly, setIsReadOnly] = useState(true);
  const handleEdit = () => {
    setIsReadOnly(!isReadOnly);
  };
  const getMyCurrencyFunction = async () => {
    const response = await getMyCurrency();
    setCurrency(response.data);
    // console.log(response.data);
  };
  useEffect(() => {
    getMyCurrencyFunction();
    
  }, []);


  const handleMobileNumberChange = (event) => {
    const value = event.target.value;
    const numericRegex = /^[0-9]*$/; // Regular expression to match only numeric characters

    if (numericRegex.test(value)) {
      setMobileNumberInput(value);
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmailInput(inputEmail);

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmail));
    if (isValidEmail) {
      setEmail(inputEmail);
    }
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setNameInput(e.target.value);
  };

  const handleUpdate = async (updatedWorks) => {
    if (!isValid()) return false;
    setIsReadOnly(true);

    var data;

    const formData = new FormData();

    switch (userRole) {
      case "Tourist":
        data = {
          mobileNumber: mobileNumberInput,
          nationality: nationalityInput,
          userRole: userRole,
          email: emailInput,
          wallet: wallet,
          occupation: jobTitle,
        };

        break;
      case "Advertiser":
        data = {
          website: linkInput,
          hotline: mobileNumberInput,
          companyProfile: companyProfileInput,
          email: emailInput,
          socialMediaLinks: {
            facebook: facebook,
            instagram: instagram,
            twitter: twitter,
            linkedin: linkedin,
          },
          location: {
            city: city,
            country: country,
            address: locationAddressInput,
          },
          companyName: companyName,
          companySize: companySize,
          // logoUrl: profileImage,
        };
        // formData.append("website", linkInput);
        // formData.append("hotline", mobileNumberInput);
        // formData.append("companyProfile", companyProfileInput);
        // formData.append("email", emailInput);
        // formData.append("facebook", facebook);
        // formData.append("instagram", instagram);
        // formData.append("twitter", twitter);
        // formData.append("linkedin", linkedin);
        // formData.append("city", city);
        // formData.append("country", country);
        // formData.append("address", locationAddressInput);
        // formData.append("companyName", companyName);
        // formData.append("companySize", companySize);
        // formData.append("logoUrl", profileImage);
        break;
      case "TourGuide":
        data = {
          mobileNumber: mobileNumberInput,
          yearsOfExperience: yearsOfExperienceInput,
          previousWorks: updatedWorks, // This will have the updated value
          email: emailInput,
          // photoUrl: profileImage,
        };
        // formData.append("mobileNumber", mobileNumberInput);
        // formData.append("yearsOfExperience", yearsOfExperienceInput);
        // formData.append("previousWorks", updatedWorks);
        // formData.append("email", emailInput);
        // formData.append("photoUrl", profileImage);
        break;
      case "Seller":
        data = {
          mobileNumber: mobileNumberInput,
          email: emailInput,
          description: descriptionInput,
          name: nameInput,
          // logoUrl: profileImage,
        };
        // formData.append("mobileNumber", mobileNumberInput);
        // formData.append("email", emailInput);
        // formData.append("description", descriptionInput);
        // formData.append("name", nameInput);
        // formData.append("logoUrl", profileImage);
        break;
      default:
        return false;
    }
    if (userRole === "Tourist") {
      setIsLoading(true);
      try {
        const response = await updateProfilee(data, user._id);

        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response.data.message || "Updating Profile failed");
      }
      setIsLoading(false);
    } else {
      setIsLoading(true);
      try {
        const response = await updateProfilee(data, user._id);

        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response.data.message || "Updating Profile failed");
      }
      setIsLoading(false);
    }

    // Update the user in local storage
    const updatedUser = { ...user, ...data };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setAge(ageInput);
    setNationality(nationalityInput);
    setEmail(emailInput);
  };

  function isValid() {
    return isValidEmail;
  }

  const handleAddWork = () => {
    setAddWork(true);
  };

  const cancelWork = () => {
    setAddWork(false);
  };

  const onAddWork = (work) => {
    setPreviousWorks((prevWorks) => {
      const updatedWorks = [...prevWorks, work];

      handleUpdate(updatedWorks);

      return updatedWorks;
    });
    setAddWork(false);
  };

  const handleJobTitleChange = (e) => {
    setJobTitleInput(e.target.value);
    setJobTitle(e.target.value);
  };
  const handleNationalityChange = (e) => {
    setNationalityInput(e.target.value);
  };

  const onDelete = (index) => {
    // console.log("index is: " + index);
    setPreviousWorks((prevWorks) => {
      const updatedWorks = prevWorks.filter((work, i) => i !== index);

      handleUpdate(updatedWorks);

      return updatedWorks;
    });
  };

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulating a data fetch
    setTimeout(() => {
      setData("Fetched data from the database!");
      setLoading(false);
    }, 3000); // Simulate 3 seconds of loading
  }, []);

  return (
    <div className="flex justify-center">
      {isLoading && <LoadingCircle />}
      <div className="flex mx-16 gap-16">
        {!userRole && (
          <div className="container mx-auto">
            {loading ? (
              <LoadingCircle />
            ) : (
              <div className="p-4 text-xl text-center">{data}</div>
            )}
          </div>
        )}
        {userRole && (
          <div className="flex flex-col">
            {userRole !== "Tourist" && <ImageProfile />}

            <div className="flex flex-col space-y-4">
              <button
                className="flex gap-2 items-center justify-center px-4 py-2 bg-first text-white rounded-lg shadow-md hover:bg-black transition duration-300"
                onClick={handleEdit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Edit Profile
              </button>
              <Link
                className="flex gap-2 items-center justify-center px-4 py-2 bg-first text-white rounded-lg shadow-md hover:bg-black transition duration-300"
                to="/changePassword"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Change password
              </Link>

              <DeleteAccountButton />

              {userRole === "Tourist" && (
                <div className="max-w-sm mx-auto mt-10">
                  <CurrencyDropdown setCurrency={setCurrency} />
                  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <div className="text-gray-600 text-lg">
                      Available Credit
                    </div>
                    <div className="text-4xl font-bold text-first mt-2">
                      {wallet}
                      <span> </span>
                      {currency.code}
                    </div>
                  </div>
                  <div className="bg-white shadow-lg rounded-lg p-6 border my-4 border-gray-200">
                    <div className="text-gray-600 text-lg">Total points</div>
                    <div className="text-4xl font-bold text-first mt-2">
                      {user.loyalityPoints}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex-col flex gap-32">
          <div className="flex justify-between">
            <div>
              <h6 className="text-5xl font-medium text-first">
                {username}
              </h6>
              <p className="text-lg font-semibold text-first">
                {userRole === "TourGuide" ? "Tour Guide" : userRole}
              </p>
              
            </div>
            {userRole === "Advertiser" && (
              <div className="">
                <SocialMediaIcons
                  facebook={facebook}
                  instagram={instagram}
                  twitter={twitter}
                  linkedin={linkedin}
                  setFacebook={setFacebook}
                  setInstagram={setInstagram}
                  setLinkedin={setLinkedin}
                  setTwitter={setTwitter}
                  isReadOnly={isReadOnly}
                />
              </div>
            )}
          </div>
          <div>
            {userRole === "Tourist" && (
              <div className="flex gap-8">
                <div className="flex flex-col gap-8">
                  {/* <div>
                    <span className="text-2xl text-first">Name</span>
                    <input
                      type="text"
                      value={username}
                      readOnly
                      placeholder={!isReadOnly ? "Enter your name" : ""}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div> */}
                  <div>
                    <span className="text-2xl text-first">Phone</span>
                    <input
                      type="text"
                      value={mobileNumberInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      onChange={handleMobileNumberChange}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-first">Job Title</span>
                    <input
                      type="text"
                      value={jobTitleInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      onChange={handleJobTitleChange}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-first">Nationality</span>
                    <input
                      type="text"
                      value={nationalityInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      onChange={handleNationalityChange}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="relative">
                    <span className="text-2xl text-first">Email</span>
                    <input
                      className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                      type="email"
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      required
                      value={emailInput}
                      readOnly={isReadOnly}
                      onChange={handleEmailChange}
                    />
                    {!isValidEmail && (
                      <FaExclamationCircle
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(40%)",
                          color: "red",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {userRole === "Advertiser" && (
              <div>
                <div className="flex gap-8">
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-first">Hotline</span>
                      <input
                        type="text"
                        value={mobileNumberInput}
                        placeholder={!isReadOnly ? "Enter your hotline" : ""}
                        readOnly={isReadOnly}
                        onChange={handleMobileNumberChange}
                        className="border-2 block border-first bg-gray-300 p-3"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-first">
                        Website Link
                      </span>
                      <input
                        type="text"
                        value={linkInput}
                        placeholder={
                          !isReadOnly ? "Enter your website link" : ""
                        }
                        readOnly={isReadOnly}
                        onChange={(e) => setLinkInput(e.target.value)}
                        className="border-2 block border-first bg-gray-300 p-3"
                      />
                    </div>
                    <div className="relative">
                      <span className="text-2xl text-first">Email</span>
                      <input
                        className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                        type="email"
                        placeholder={!isReadOnly ? "Enter your email" : ""}
                        required
                        value={emailInput}
                        readOnly={isReadOnly}
                        onChange={handleEmailChange}
                      />
                      {!isValidEmail && (
                        <FaExclamationCircle
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(40%)",
                            color: "red",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-first">
                        Company Profile
                      </span>
                      <input
                        type="text"
                        value={companyProfileInput}
                        placeholder={
                          !isReadOnly ? "Enter your company Profile" : ""
                        }
                        readOnly={isReadOnly}
                        onChange={(e) => setCompanyProfileInput(e.target.value)}
                        className="border-2 block border-first bg-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <span className="text-2xl text-first">
                        Location address
                      </span>
                      <input
                        type="text"
                        value={locationAddressInput}
                        placeholder={
                          !isReadOnly ? "Enter your location address" : ""
                        }
                        readOnly={isReadOnly}
                        onChange={(e) =>
                          setLocationAddressInput(e.target.value)
                        }
                        className="border-2 block border-first bg-gray-300 p-3"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex mt-6 gap-8">
                  <div>
                    <span className="text-2xl text-first">City</span>
                    <input
                      type="text"
                      value={city}
                      placeholder={!isReadOnly ? "Enter your city name" : ""}
                      readOnly={isReadOnly}
                      onChange={(e) => setCity(e.target.value)}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-first">Country</span>
                    <input
                      type="text"
                      value={country}
                      placeholder={!isReadOnly ? "Enter your country name" : ""}
                      readOnly={isReadOnly}
                      onChange={(e) => setCountry(e.target.value)}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-first">
                      Company Name
                    </span>
                    <input
                      type="text"
                      value={companyName}
                      placeholder={!isReadOnly ? "Enter your company name" : ""}
                      readOnly={isReadOnly}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl text-first">Company Size</span>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    disabled={isReadOnly}
                    className="border-2 block border-first bg-gray-300 p-3 w-fit" // Add w-full or a fixed width
                    style={{ minWidth: "200px" }} // Optionally, set a minimum width with inline style
                  >
                    <option value="" disabled>
                      {!isReadOnly ? "Select company size" : ""}
                    </option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1001+">1001+</option>
                  </select>
                </div>
              </div>
            )}
            {userRole === "TourGuide" && (
              <div>
                <div className="flex gap-8">
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-first">Name</span>
                      <input
                        type="text"
                        value={username}
                        readOnly
                        className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <span className="text-2xl text-first">Phone</span>
                      <input
                        type="text"
                        value={mobileNumberInput}
                        readOnly={isReadOnly}
                        placeholder={
                          !isReadOnly ? "Enter your phone number" : ""
                        }
                        onChange={handleMobileNumberChange}
                        className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-first">
                        Years of Experience
                      </span>
                      <input
                        type="text"
                        value={yearsOfExperienceInput}
                        readOnly={isReadOnly}
                        placeholder={
                          !isReadOnly ? "Enter your years of experience" : ""
                        }
                        onChange={(e) =>
                          setYearsOfExperienceInput(e.target.value)
                        }
                        className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                      />
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="relative">
                        <span className="text-2xl text-first">Email</span>
                        <input
                          className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                          type="email"
                          placeholder={!isReadOnly ? "Enter your email" : ""}
                          required
                          value={emailInput}
                          readOnly={isReadOnly}
                          onChange={handleEmailChange}
                        />
                        {!isValidEmail && (
                          <FaExclamationCircle
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(40%)",
                              color: "red",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <PreviousWorksList
                    previousWorks={previousWorks}
                    onDelete={onDelete}
                  />
                </div>
                {addWork === true && (
                  <AddPreviousWork
                    onAddWork={onAddWork}
                    cancelWork={cancelWork}
                  />
                )}
                <div className="mt-8">
                  <button
                    className="flex gap-2 items-center justify-center px-4 py-2 text-first rounded-lg shadow-md hover:bg-gray-100 focus:ring-0 transition duration-300"
                    onClick={handleAddWork}
                  >
                    <span className="font-bold">+</span> Add Work
                  </button>
                </div>
              </div>
            )}
            {userRole === "Seller" && (
              <div className="flex gap-8">
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-first">Name</span>
                    <input
                      type="text"
                      value={nameInput}
                      readOnly={isReadOnly}
                      onChange={handleNameChange}
                      placeholder={!isReadOnly ? "Enter your name" : ""}
                      className="border-2 block border-first bg-gray-300 p-3"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="relative">
                    <span className="text-2xl text-first">Email</span>
                    <input
                      className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                      type="email"
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      required
                      value={emailInput}
                      readOnly={isReadOnly}
                      onChange={handleEmailChange}
                    />
                    {!isValidEmail && (
                      <FaExclamationCircle
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(40%)",
                          color: "red",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl text-first">Description</span>
                    <input
                      type="text"
                      value={descriptionInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your description" : ""}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      className="border-2 focus:ring-0 block border-first bg-gray-300 p-3"
                    />
                  </div>
                </div>
              </div>
            )}
            {!isReadOnly && (
              <div className="mt-8">
                <button
                  className="flex gap-2 items-center justify-center px-4 py-2 text-first rounded-lg shadow-md hover:bg-first focus:ring-0 hover:text-white transition duration-300"
                  onClick={() => handleUpdate(previousWorks)}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
          {/* <SocialMediaIcons facbook={facebook} instagram={instagram} twitter={twitter} linkedin={linkedin}/> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
