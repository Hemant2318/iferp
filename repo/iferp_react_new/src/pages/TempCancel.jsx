import { useEffect } from "react";

const TempCancel = () => {
  useEffect(() => {
    // Retrieve the payment response from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const responseParams = {};
    for (const [key, value] of params.entries()) {
      responseParams[key] = value;
    }

    // Process the payment response
    // You can update the component state or perform any necessary actions based on the responseParams
    console.log(responseParams);
  }, []);

  return (
    <div className="text-center pt-5 pb-5">Processing payment response...</div>
  );
};

export default TempCancel;
