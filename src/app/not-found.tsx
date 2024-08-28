const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
        Go Back to Home
      </a>
    </div>
  );
};

export default NotFound;
