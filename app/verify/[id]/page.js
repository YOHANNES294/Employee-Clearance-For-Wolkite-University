// app/verify/[id]/page.js
export default async function VerificationPage({ params }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/verify/${params.id}`);
  const data = await response.json();

  return (
    <div className="verification-container">
      <h1>Certificate Verification</h1>
      
      {data.valid ? (
        <div className="valid-certificate">
          <h2>✅ Valid Certificate</h2>
          <p>Issued to: <strong>{data.certificate.name}</strong></p>
          <p>Status: <span className="status-approved">{data.certificate.status}</span></p>
          <p>Approved on: {new Date(data.certificate.dateApproved).toLocaleDateString()}</p>
          <p>Certificate ID: {params.id}</p>
        </div>
      ) : (
        <div className="invalid-certificate">
          <h2>❌ Invalid Certificate</h2>
          <p>{data.error || "This certificate could not be verified"}</p>
        </div>
      )}

      <div className="verification-meta">
        <p>Verified on: {new Date().toLocaleDateString()}</p>
        <p>Wolkite University Clearance System</p>
      </div>
    </div>
  );
}