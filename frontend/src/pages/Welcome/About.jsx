import React from 'react'

import Navbar from '../../components/header/Navbar'
import WelcomeNavbar from '../../components/header/WelcomeNavbar'
import FooterSection from '../../components/footer/FooterSection'

function About({isSignedIn}) {
  return (
    <div className='bg-gray-100'>
        {isSignedIn ? (
          <Navbar />
        ) : (
          <WelcomeNavbar />
        )}
      {/* About Section */}
      <section id="about" className="bg-gray-200 pb-32 pt-9">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl py-12 sm:py-20 text-left">
            {" "}
            {/* Add text-left class */}
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              About Our Project
            </h2>
            <div className="text-xl leading-7 text-gray-800">
              <p className="mb-8">
                The innovative healthcare project endeavors to revolutionize the
                landscape of medical collaboration by developing a comprehensive
                web-based platform. At its core, the initiative aims to
                facilitate the secure and anonymized exchange of patient data
                among clinicians, researchers, and hospitals. Recognizing the
                transformative power of collective insights in driving
                advancements in healthcare, the project prioritizes cultivating
                a culture of collaboration. Leveraging cutting-edge web
                technologies and robust security protocols, the platform not
                only ensures the confidentiality and integrity of shared health
                data but also fosters an environment where practitioners
                collectively contribute to the evolution of medical knowledge.
              </p>
              <p>
                Central to the project's philosophy is an unwavering commitment
                to a user-friendly web interface. By bridging technological gaps
                and ensuring accessibility and intuitiveness for medical
                professionals, the platform aims to democratize healthcare
                collaboration. Through the integration of advanced encryption
                techniques and anonymization algorithms, it meets the highest
                standards of data protection and privacy, instilling confidence
                among users. In summary, the project represents a dynamic
                ecosystem where diverse datasets and projects are shared
                transparently, transforming healthcare collaboration into a
                visually and mathematically comprehensible format for broader
                understanding. With the potential to empower medical
                professionals with secure spaces for sharing patient data,
                facilitating collaboration, and propelling advancements in
                healthcare practices, this project heralds a new era of
                innovation in global healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  )
}

export default About