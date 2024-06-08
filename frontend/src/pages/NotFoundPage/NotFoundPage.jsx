// NotFoundPage.jsx
import React from 'react';

const NotFoundPage = () => {
  return (
    <>
      {/*
        

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-indigo-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h2>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/welcome"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
