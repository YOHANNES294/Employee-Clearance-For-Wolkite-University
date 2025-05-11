"use client"
import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';

export default function PrintClearance() {
  const [loader, setLoader] = useState(false);
  const [history, setHistory] = useState(null);
  const searchParams = useSearchParams();
  const clearanceId = searchParams.get('clearanceId');

  const verificationUrl = `${window.location.origin}/verify/${clearanceId}`;

  useEffect(() => {
    const getPromptDetails = async () => {
      try {
        const response = await fetch(`/api/approvalHistory/${clearanceId}`);
        const data = await response.json();
        setHistory(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getPromptDetails();
  }, [clearanceId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '/');
  };

  const downloadPDF = () => {
    const capture = document.querySelector('.certificate-container');
    setLoader(true);
    html2canvas(capture, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save(`WKUCMS_Clearance_${clearanceId}.pdf`);
    });
  };

  if (!history) {
    return <div className="loading">Loading certificate data...</div>;
  }

  return (
    <div className="certificate-wrapper">
      <div className="certificate-container">
        <div className="certificate-border">
          <div className="watermark"></div>

          {/* Header with Logo */}
          <div className="certificate-header">
            <div className="logo-container">
              <Image 
                src="/images/logo/logo.png" 
                alt="WKU Logo" 
                width={120} 
                height={80}
                priority
              />
            </div>
            <h1>WOLKITE UNIVERSITY</h1>
            <h1>EMPLOYEE CLEARANCE CERTIFICATE</h1>
            <div className="header-divider"></div>
          </div>

          {/* Main Content */}
          <div className="certificate-content">
            <p className="intro-text">This is to certify that</p>

            <h2 className="employee-name">
              {history.firstname} {history.middlename}
            </h2>

            <p className="main-text">
              has successfully completed all obligations with Wolkite University and has been cleared from all responsibilities as of {formatDate(history.dateApproved)}.
            </p>

            <div className="details-box">
              <div className="detail-row">
                <span>User ID:</span>
                <span>{history.userId || 'ABEL@wku.edu.et'}</span>
              </div>
              <div className="detail-row">
                <span>Date Requested:</span>
                <span>{formatDate(history.dateRequested)}</span>
              </div>
              <div className="detail-row">
                <span>Date Approved:</span>
                <span>{formatDate(history.dateApproved)}</span>
              </div>
              <div className="detail-row">
                <span>Reason:</span>
                <span>{history.reason || 'Campus Residency'}</span>
              </div>
              <div className="detail-row status-row">
                <span>Status:</span>
                <span className="status-approved">{history.status || 'APPROVED'}</span>
              </div>
            </div>

            <p className="secondary-text">
              All university property has been returned, and there are no outstanding obligations.
            </p>

            <div className="signature-section">
              <div style={{ position: 'relative', height: '100px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '150px', height: '2px', backgroundColor: '#000' }}></div>
                <Image 
                  src="/images/stamp/images.png" 
                  alt="Official Stamp" 
                  width={100} 
                  height={60} 
                  priority
                  style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)' }}
                />
              </div>

              <p className="issue-date">Issued on {formatDate(history.dateApproved) || formatDate(new Date())}</p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="certificate-footer">
            <div className="verification-info">
              <p className="verification-note">
                Verify at: <a href={verificationUrl}>{verificationUrl}</a>
              </p>
              <p>Clearance ID: {history._id || clearanceId}</p>
              <p>Wolkite University • PO Box 07, Wolkite, Ethiopia</p>
            </div>

            <div className="qr-code">
              <QRCode 
                value={verificationUrl}
                size={80}
                level="H"
                bgColor="transparent"
                fgColor="#1a3e6f"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="download-container">
        <button 
          onClick={downloadPDF} 
          disabled={loader}
          className="download-button"
        >
          {loader ? (
            <>
              <span className="spinner"></span>
              Generating Certificate...
            </>
          ) : (
            <>
              <svg className="download-icon" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download Official Certificate
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        /* Main Styles */
        .certificate-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          font-family: 'Georgia', serif;
          background-color: #f5f9fc;
          min-height: 100vh;
        }

        .certificate-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .certificate-border {
          border: 10px solid #1a3e6f;
          padding: 2rem;
          background-color: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        /* Header Styles */
        .certificate-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .logo-container {
          margin: 0 auto 1rem;
          width: 120px;
        }

        .certificate-header h1 {
          font-size: 20px;
          color: #1a3e6f;
          margin: 5px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .header-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #1a3e6f, transparent);
          margin: 0.5rem auto;
          width: 60%;
        }

        /* Content Styles */
        .certificate-content {
          text-align: center;
          line-height: 1.6;
        }

        .intro-text {
          font-size: 16px;
          margin-bottom: 1rem;
          color: #444;
        }

        .employee-name {
          font-size: 22px;
          color: #1a3e6f;
          margin: 1rem 0;
          font-weight: 700;
          text-transform: uppercase;
        }

        .main-text {
          font-size: 16px;
          margin: 1.5rem 0;
          line-height: 1.6;
          color: #333;
        }

        .details-box {
          background-color: #f8fafc;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem auto;
          max-width: 500px;
          text-align: left;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px dashed #e1e8ed;
        }

        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .detail-row span:first-child {
          font-weight: 600;
          color: #1a3e6f;
        }

        .detail-row span:last-child {
          color: #333;
        }

        .status-row {
          margin-top: 0.8rem;
          padding-top: 0.8rem;
          border-top: 2px solid #e1e8ed;
        }

        .status-approved {
          color: #28a745 !important;
          font-weight: 700;
          text-transform: uppercase;
        }

        .secondary-text {
          font-size: 14px;
          margin: 1.5rem 0;
          color: #555;
          font-style: italic;
        }

        /* Signature Section */
        .signature-section {
          margin-top: 2rem;
          position: relative;
        }

        .issue-date {
          font-size: 14px;
          color: #555;
          margin-bottom: 1.5rem;
        }

        /* Footer Styles */
        .certificate-footer {
          margin-top: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e1e8ed;
          padding-top: 1rem;
        }

        .verification-info {
          flex: 1;
        }

        .verification-note {
          font-size: 10px;
          margin-bottom: 0.5rem;
          word-break: break-all;
        }

        .qr-code {
          margin-left: 20px;
        }

        /* Download Button */
        .download-container {
          margin: 2.5rem 0;
          text-align: center;
        }

        .download-button {
          background-color: #1a3e6f;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .download-button:hover {
          background-color: #0d2b52;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .download-button:disabled {
          background-color: #7a8fb3;
          cursor: not-allowed;
          transform: none;
        }

        .download-icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        /* Loading State */
        .loading {
          text-align: center;
          padding: 2rem;
          font-size: 1rem;
          color: #555;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .certificate-wrapper {
            padding: 1rem;
          }
          
          .certificate-container {
            width: 95%;
          }
          
          .certificate-border {
            padding: 1rem;
          }
          
          .employee-name {
            font-size: 20px;
          }
          
          .details-box {
            padding: 0.8rem;
          }

          .certificate-footer {
            flex-direction: column;
            gap: 1rem;
          }

          .qr-code {
            margin-left: 0;
          }
        }

        @media print {
          .download-container {
            display: none;
          }
          
          .certificate-border {
            border: none;
            padding: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}