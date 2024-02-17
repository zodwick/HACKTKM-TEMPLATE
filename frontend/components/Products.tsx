import React from "react";

export default function Products() {
  return (
    <>
      <header className="bg-green-400 border-b  border-gray-200">
        <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center -m-2 xl:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex ml-6 mr-auto xl:ml-0">
              <div className="flex items-center flex-shrink-0">
               
              </div>
            </div>

            <div className="flex items-center justify-end">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </header>
      <section className="py-12 bg-gray-50 sm:py-16 lg:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center bg-green-200 rounded-3xl py-7 px-16 md:flex md:items-center md:space-x-6 md:justify-between items-center md:text-left">
            <div className="flex-1 flex justify-center h-full items-start flex-col md:mx-0">
              <h2 className="text-3xl font-bold text-green-900">
               Chat with our Agri-Geni
              </h2>
             <button className="bg-green-500 mt-4 py-2 rounded-3xl px-6">Chat Now</button>
            </div>

            <div className="mt-6 md:mt-0">
              <img src="/bot.png" className="h-64 w-full"/>
            </div>
          </div>

         
        </div>
      </section>
    </>
  );
}
