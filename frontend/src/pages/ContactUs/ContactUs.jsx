import React from 'react'

import Navbar from '../../components/header/Navbar'
import WelcomeNavbar from '../../components/header/WelcomeNavbar'
import FooterSection from '../../components/footer/FooterSection'
import ContactForm from '../../components/ContactForm/ContactForm'

function ContactUs({isSignedIn}) {
  return (
    <div className='bg-gray-100'>
        {isSignedIn ? (
          <Navbar />
        ) : (
          <WelcomeNavbar />
        )}
      
      {/* Contact Us Section */}
      <section className="bg-gray-200 py-9">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl py-12 sm:py-20 text-left">
            {" "}
            {/* Add text-left class */}
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Contact Us
            </h2>
            <div className="text-xl leading-7 text-gray-800">
              <p className="mb-8">
                Have questions or feedback? Reach out to us using the form
                below.
              </p>
              <ContactForm /> {/* Assuming you have a ContactForm component */}
            </div>
          </div>
        </div>
      </section>
      
      <FooterSection />
    </div>
  )
}

export default ContactUs