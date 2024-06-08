import React from "react";
import ContactForm from "../../components/ContactForm/ContactForm"; // Assuming you have a ContactForm component
import { FaArrowRight } from "react-icons/fa6";
import FooterSection from "../../components/footer/FooterSection";

function HomeContent({ signedIn }) {
  function getImgUrl(name) {
    return new URL("".concat(name), process.env.PUBLIC_URL).href;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate px-6  lg:px-8 text-left">
        {" "}
        {/* Add text-left class */}
        {/* Background shape */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        {/* Content */}
        <div className="mx-auto max-w-7xl py-4 sm:py-8 lg:py-16">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Empowering Healthcare Data Collaboration: Find, Share, Securely.
          </h1>
          <p className="mt-12 text-md leading-8 text-gray-600">
            Join the movement towards revolutionizing healthcare collaboration!
            Our web-based platform offers a secure space for medical
            professionals to connect, share anonymized patient data, and
            innovate together. With cutting-edge technology and a user-friendly
            interface, we're empowering practitioners worldwide to advance
            the healthcare and improve patient outcomes. Connect with
            us and be part of the future of healthcare innovation!
          </p>
          {/* <div className="mt-3 flex items-center justify-center gap-x-6"> */}
            {/* {!signedIn && (
              <a
                href="/sign-in"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </a>
            )}
            {signedIn && (
              <a
                href="/explore"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Explore Projects & Datasets
              </a>
            )} */}
            {/* <a
              href="/about"
              className="text-md font-semibold text-white rounded-md bg-gray-600 px-3.5 py-2.5 flex"
            >
              Learn more <FaArrowRight className="text-lg mt-1 ml-2"/>
            </a> */}
          {/* </div> */}
        </div>
      </section>
      
      {/* <FooterSection /> */}
        
      {/* <img src={getImgUrl("../../assets/vesikalik.jpg")} alt="image" /> */}
    </>
  );
}

export default HomeContent;
