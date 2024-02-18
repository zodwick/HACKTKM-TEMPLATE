"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/client";
import Image from "next/image";

import axios from "axios";
type Product = {
  [key: string]: string;
};

type Seller = {
  id: number;
  created_at: string;
  farmer_id: number;
  farmer_name: string | null;
  image_url: string;
  products: Product | null;
};
export default function Products() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  const parseProducts = (products: any) => {
    try {
      const parsedData = JSON.parse(products);
      console.log("parsedData", parsedData);
      // If parsedData is not an array, wrap it into an array
      if (!Array.isArray(parsedData)) {
        console.log("parsedData", parsedData);
        return [parsedData];
      } else {
        return parsedData;
      }
    } catch (error) {
      console.error("Error parsing products:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("sellers").select();
        if (error) {
          throw error;
        }
        setSellers(data as Seller[]);
      } catch (error) {
        console.error("Error fetching data:");
      }
    };

    fetchData();
  }, []);

  console.log(sellers);

  function handleSendMessage(
    prodcuts: Product | null,
    name: string | null,
    farmer_id: number
  ) {
    console.log("prodcuts", prodcuts);
    console.log("name", name);
    if (!prodcuts) {
      return;
    }
    const message = `Hello ${name}, 
I am interested in purchasing ${prodcuts.quantity} of ${prodcuts.product_name} from you. 
I see that you are selling them for ${prodcuts.price}. 
Could you please confirm if the product is still available? 
I am located near ${prodcuts.location}. 
Looking forward to hearing from you. 
Thank you.`;

    console.log(message);

    const requestData = {
      farmer_id: farmer_id,
      message: message,
    };

    // Make the Axios POST request
    axios
      .post("https://6fdf-210-212-227-194.ngrok-free.app/send", requestData)
      .then((response: { data: any; }) => {
        console.log("Response:", response.data);
      })
      .catch((error: any) => {
        console.error("Error:", error);
      });
    //JEfffunction(farmer_id, message);
  }

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
                <Image
                  width={200}
                  height={50}
                  className="hidden w-auto h-12 lg:block"
                  src="/logo.png"
                  alt=""
                />
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
                Chat with our Kisaan-Mitr
              </h2>
              <button className="bg-green-600 mt-4 py-2 rounded-3xl px-6">
                Chat Now
              </button>
            </div>

            <div className="mt-6 md:mt-0">
              <Image
                alt="Chat with our Agri-Geni"
                width={300}
                height={300}
                src="/bot.png"
                className="h-64 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 mt-12 sm:mt-16 sm:px-0 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="overflow-hidden transition-all duration-200 transform bg-white border border-gray-100 rounded-lg hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        width={40}
                        height={40}
                        className="object-cover w-5 h-5 rounded-full shrink-0"
                        src="https://cdn-icons-png.freepik.com/512/10100/10100101.png"
                        alt=""
                      />
                      <p className="ml-2 text-sm font-medium text-gray-900">
                        {seller.farmer_name}
                      </p>
                    </div>
                  </div>

                  <a
                    href="#"
                    title=""
                    className="block mt-4 overflow-hidden rounded-lg aspect-w-3 aspect-h-2"
                  >
                    <img
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      src={seller.image_url}
                      alt=""
                    />
                  </a>

                  <div className="mt-4  text-black">
                    {seller.products &&
                    Object.entries(seller.products).length > 0 ? (
                      <ul>
                        {Object.entries(seller.products).map(([key, value]) => (
                          <li key={key} className="py-1">
                            <strong>{key}: </strong> {value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No products available</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 space-x-4">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-bold tracking-widest text-white uppercase transition-all duration-200 bg-green-900 border border-transparent rounded md:px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
                      onClick={() =>
                        handleSendMessage(
                          seller.products,
                          seller.farmer_name,
                          seller.farmer_id
                        )
                      }
                    >
                      Contact Now{" "}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
