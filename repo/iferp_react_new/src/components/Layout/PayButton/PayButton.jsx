import useRazorpay from "react-razorpay";
import { icons } from "utils/constants";
import { getDataFromLocalStorage, getOrderID } from "utils/helpers";

const PayButton = ({
  amount,
  children,
  handelSuccess,
  onClick,
  isPayment,
  currency = "INR",
}) => {
  const Razorpay = useRazorpay();
  let userData = getDataFromLocalStorage();
  let { first_name, last_name, personal_details = {} } = userData;
  let { address } = personal_details;
  let newAmount = currency === "INR" ? amount * 100 : amount;
  const handlePayment = async () => {
    const newOrderID = getOrderID();

    const options = {
      key: process.env.REACT_APP_RZP_ID,
      amount: newAmount,
      currency: currency,
      name: "IFERP",
      description: "IFERP Payment",
      image: icons.roundLogo,
      prefill: {
        name: `${first_name} ${last_name}`,
      },
      notes: {
        address: address,
      },
      theme: {
        color: "#2148c0",
      },
      handler: (response) => {
        const responseData = {
          order_id: newOrderID,
          payment_id: response?.razorpay_payment_id,
          payment_method: currency,
          amount: amount,
        };
        handelSuccess(responseData);
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", (response) => {
      console.log("PAYMENT ERROR", response);
    });
    rzp1.open();
  };
  return (
    <div
      onClick={(e) => {
        if (isPayment) {
          handlePayment();
        } else {
          onClick(e);
        }
      }}
    >
      {children}
    </div>
  );
};
export default PayButton;
