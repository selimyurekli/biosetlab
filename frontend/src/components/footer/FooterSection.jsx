import React from 'react';

function FooterSection() {
  return (
    <div className='relative clear-both bottom-0 w-full text-black px-3 sm:px-6 md:px-7 lg:px-8 py-4 bg-gray-300'>
      <div className="container mx-auto max-w-7xl"> {/* Added container to center content */}
        <p className='text-lg'>
          © Yusuf Aslan & Selim Yürekli 
        </p>
        <p className='text-md'>
          Istanbul Technical University Computer Engineering Department
        </p>
        <p className='text-md'>
          May 2024  
        </p>
      </div>
    </div>
  );
}

export default FooterSection;
