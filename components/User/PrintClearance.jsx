// // import * as React from 'react';

// // export default function PrintClearance() {
// //     return (
// //         <div className="md:mt-7 mt-4 md:py-7 py-4 lg:h-[60vh] border shadow-default flex flex-col  rounded-lg bg-white  border-bodydark1  dark:border-strokedark dark:bg-boxdark">

// //             <h5 className="dark:text-white font-satoshi text-4xl font-bold mb-4 text-primary text-center">
// //                 You have not triggered a clearance process yet!!
// //             </h5>



// //         </div>
// //     );
// // }

// // /home/eyob/Documents/git/CMS/components/User/PrintClearance.jsx
// // import logo from './images/logo.png';
// import {useState} from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// export default function PrintClearance(){

//   const [loader, setLoader] = useState(false);

//   const downloadPDF = () =>{
//     const capture = document.querySelector('.actual-receipt');
//     setLoader(true);
//     html2canvas(capture).then((canvas)=>{
//       const imgData = canvas.toDataURL('img/png');
//       const doc = new jsPDF('p', 'mm', 'a4');
//       const componentWidth = doc.internal.pageSize.getWidth();
//       const componentHeight = doc.internal.pageSize.getHeight();
//       doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
//       setLoader(false);
//       doc.save('receipt.pdf');
//     })
//   }

//   return (
//     <div className="wrapper">

//       <div className="receipt-box">

//           {/* actual receipt */}
//           <div className="actual-receipt">

//             {/* organization logo */}
//             {/* <div className="receipt-organization-logo">
//               <img alt="logo" src={logo} />
//             </div> */}

//             {/* organization name */}
//             <h5>JS SOLUTIONS</h5>

//             {/* street address and unit number */}
//             <h6>
//               ABC Street
//               {' '}
//               123
//             </h6>

//             {/* city province postal code */}
//             <h6>
//               Karachi
//               {' '}
//               Sindh
//               {' '}
//               75050
//             </h6>

//             {/* email-phone-and-website */}
//             <div className="phone-and-website">
//               <p>
//                 <a href={`mailto:anwarhamza919@gmail.com`}>
//                   anwarhamza919@gmail.com
//                 </a>
//               </p>
//               <p>01234567890</p>
                  
//               <p>
//                 <a
//                   href="https://www.youtube.com/@jsSolutions"
//                   target="blank"
//                 >
//                   https://www.youtube.com/@jsSolutions
//                 </a>
//               </p>
                  
//             </div>

//             <div className="colored-row first">
//               <span>Payment Method</span>
//               <span>Card Number</span>
//             </div>

//             <div className="data-row">
//               <span className="font-weight">CREDIT</span>
//               <span>************4444</span>
//             </div>

//             <div className="colored-row">
//               <span>Campaign</span>
//               <span>Amount</span>
//             </div>

//             <div className="data-row">
//               <span className="font-weight">Dollar a Day for Sadaqa</span>
//               <span>
//                 $
//                 {' '}
//                 50
//               </span>
//             </div>

//             <div className="colored-row">
//               <span>Transaction Details - Donations</span>
//               <span />
//             </div>

//             <div className="data-row border-bottom">
//               <span>
//                 <span className="font-weight">
//                   MID
//                   :
//                 </span>
//                 {' '}
//                 1234567
//               </span>
//               <span>
//                 <span className="font-weight">
//                   Sequence
//                   {' '}
//                   #:
//                 </span>
//                 {' '}
//                 SSSSSSSS
//               </span>
//             </div>

//             <div className="data-row border-bottom">
//               <span>
//                 <span className="font-weight">
//                   Invoice
//                   {' '}
//                   #:
//                 </span>
//                 {' '}
//                 AX1234ZVB5671234
//               </span>
//               <span>
//                 <span className="font-weight">
//                   Created
//                   :
//                 </span>
//                 {' '}
//                 2023-02-14 02:21:37
//               </span>
//             </div>
//             <div className="data-row border-bottom">
//               <span>
//                 <span className="font-weight">
//                   Authentication
//                   {' '}
//                   #:
//                 </span>
//                 {' '}
//                 TEST
//               </span>
//               <span>
//                 <span className="font-weight">
//                   Batch
//                   {' '}
//                   #:
//                 </span>
//                 {' '}
//                 1234
//               </span>
//             </div>
//             <div className="data-row border-bottom">
//               <span className="font-weight">
//                 Transaction:
//                 {' '}
//                 APPROVED - 00
//               </span>
//               <span />
//             </div>
//             <div className="colored-row">
//               <span>Thank You For Your Generous Donation</span>
//               <span />
//             </div>

//           </div>
//           {/* end of actual receipt */}

//           {/* receipt action */}
//           <div className="receipt-actions-div">
//             <div className="actions-right">
//               <button
//                 className="receipt-modal-download-button"
//                 onClick={downloadPDF}
//                 disabled={!(loader===false)}
//               >
//                 {loader?(
//                   <span>Downloading</span>
//                 ):(
//                   <span>Download</span>
//                 )}

//               </button> 
//             </div>
//           </div>

//       </div>
      
//     </div>
//   );
// }
