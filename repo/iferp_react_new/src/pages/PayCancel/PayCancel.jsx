import { useEffect } from "react";

const PayCancel = () => {
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

  return <div>Processing payment response...</div>;
};

export default PayCancel;
