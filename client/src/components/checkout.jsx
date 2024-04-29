import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// export default function CheckoutForm() {
//   const initialOptions = {
//     clientId:
//       "AXwvs4RubpBz0rDlez0ZNpr6pkf-bD6gGUYukU_Tzmik_FkCHubbRHT87TYJvRxOxANta2mFm6-L20wj",
//     currency: "USD",
//     intent: "capture",
//   };

//   const serverUrl = "http://localhost:8888";
//   const createOrder = async (data) => {
//     // Order is created on the server and the order id is returned
//     return fetch(`${serverUrl}/api/orders`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       // use the "body" param to optionally pass additional order information
//       // like product skus and quantities
//       body: JSON.stringify({
//         cart: [
//           {
//             sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
//             quantity: "YOUR_PRODUCT_QUANTITY",
//           },
//         ],
//       }),
//     })
//       .then((response) => response.json())
//       .then((order) => order.id);
//   };
//   const onApprove = async (data) => {
//     // Order is captured on the server and the response is returned to the browser
//     return fetch(`${serverUrl}/api/orders/${data.orderID}/capture`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         orderID: data.orderID,
//       }),
//     }).then((response) => response.json());
//   };

//   return (
//     <>
//       <div className="border-b border-gray-900/10 py-8">
//         <h2 className="text-4xl text-center text-purple-900">Checkout Form</h2>
//       </div>
//       <div className="w-10/12 mx-auto my-10 grid  grid-cols-1 md:grid-cols-5 bg-gray-100 p-6 rounded-lg shadow-xl border border-gray-100">
//         <div className="space-y-12 col-span-3">
//           <div className="md:border-r border-gray-900/10 pb-12 pr-12">
//             <h2 className="text-xl font-semibold">Billing Details</h2>

//             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6  p-4">
//               <div className="sm:col-span-3">
//                 <label
//                   htmlFor="first-name"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   First name
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     name="first-name"
//                     id="first-name"
//                     autoComplete="given-name"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-3">
//                 <label
//                   htmlFor="last-name"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Last name
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     name="last-name"
//                     id="last-name"
//                     autoComplete="family-name"
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-4">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Email address
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-3">
//                 <label
//                   htmlFor="country"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Country
//                 </label>
//                 <div className="mt-2">
//                   <select
//                     id="country"
//                     name="country"
//                     autoComplete="country-name"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
//                   >
//                     <option>United States</option>
//                     <option>Canada</option>
//                     <option>Mexico</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="col-span-full">
//                 <label
//                   htmlFor="street-address"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Address
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     name="street-address"
//                     id="street-address"
//                     autoComplete="street-address"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-2 sm:col-start-1">
//                 <label
//                   htmlFor="city"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   City
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     name="city"
//                     id="city"
//                     autoComplete="address-level2"
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-2">
//                 <label
//                   htmlFor="region"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   State / Province
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     name="region"
//                     id="region"
//                     autoComplete="address-level1"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-2">
//                 <label
//                   htmlFor="postal-code"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   ZIP / Postal code
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     name="postal-code"
//                     id="postal-code"
//                     autoComplete="postal-code"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-span-2 ">
//           <div className=" border-4 border-dotted border-red-500 p-4 rounded-lg mx-auto text-sm w-11/12 my-3">
//             <input type="checkbox" />
//             <p className="my-2 bg-yellow-100 italic ">
//               Yes! Also Add The Ultimate Dating Guide to my Order
//             </p>
//             <p className="text-red-500 underline font-medium">
//               Special One Time Offer, Only ₹ 399!
//             </p>

//             <div className=" pl-4 my-2">
//               <ul className="list-disc">
//                 <li>xyz</li>
//                 <li>xyz</li>
//                 <li>xyz</li>
//                 <li>xyz</li>
//                 <li> xyz</li>
//                 <li>xyz </li>
//               </ul>
//             </div>

//             <p className="text-xs">
//               <span className="font-semibold text-sm">LIMITED OFFER:</span> You
//               can have access to this exclusive one-time offer by ticking the
//               box above.
//             </p>
//           </div>

//           <div className=" border-4 border-dotted border-red-500 p-4 rounded-lg mx-auto text-sm w-11/12 my-3">
//             <input type="checkbox" />
//             <p className="my-2 bg-yellow-100 italic ">
//               Yes! Also Add The Ultimate Dating Guide to my Order
//             </p>
//             <p className="text-red-500 underline font-medium">
//               Special One Time Offer, Only ₹ 399!
//             </p>

//             <div className=" pl-4 my-2">
//               <ul className="list-disc">
//                 <li>xyz</li>
//                 <li>xyz</li>
//                 <li>xyz</li>
//                 <li>xyz</li>
//                 <li> xyz</li>
//                 <li>xyz </li>
//               </ul>
//             </div>

//             <p className="text-xs">
//               <span className="font-semibold text-sm">LIMITED OFFER:</span> You
//               can have access to this exclusive one-time offer by ticking the
//               box above.
//             </p>
//           </div>

//           <div className="px-8 flex flex-col flex-wrap justify-center mt-10 ">
//             <h2 className="text-xl font-semibold mb-6">Your Order</h2>
//             <div className="bg-gray-200 rounded-lg pt-8">
//               <div className="flex justify-between w-7/12 mx-auto">
//                 <p className="text-md font-medium leading-6 text-gray-900">
//                   Total :
//                 </p>
//                 <p className="text-md font-medium leading-6 text-gray-900">
//                   $499
//                 </p>
//               </div>

//               <div className=" w-7/12 mx-auto flex justify-between my-2">
//                 <legend className="text-sm font-semibold leading-6 text-gray-900">
//                   Pay Via :
//                 </legend>
//                 <div className=" space-y-6">
//                   <div className="flex items-center gap-x-3">
//                     <input
//                       id="push-everything"
//                       name="push-notifications"
//                       type="radio"
//                       checked
//                       className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
//                     />
//                     <label
//                       htmlFor="push-everything"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Paypal
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="w-7/12 mx-auto flex justify-center mt-6 ">
//                 <button type="submit">
//                   <PayPalScriptProvider options={initialOptions}>
//                     <PayPalButtons
//                       createOrder={(data) => createOrder(data)}
//                       onApprove={(data) => onApprove(data)}
//                     />
//                   </PayPalScriptProvider>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
